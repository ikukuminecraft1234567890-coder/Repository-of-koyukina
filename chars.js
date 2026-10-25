import { 
    canvas, ctx, players, bullets,
    updateFrame, frame, Half, isTouching, entitys
,internal,gps,pbs} from './sys.js';
import {Bullet} from "./bc.js"
import {PlayerBullet} from "./pb.js"
import {pf}from"./bullet.js"
import {stat}from"./engine.js"
import { cfg } from "./logs/cfg.js"

// ===== グレイズ設定 =====
// グレイズ範囲 = 当たり判定半径 × multi
const multi = 21.5;

// ===== グレイズ音 =====
let audioCtx = null;
let grazeBuf = null;

// 起動時に一度だけ読み込む
async function loadGrazeSound() {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    try {
        const res = await fetch("assets/graze.wav");
        grazeBuf = await audioCtx.decodeAudioData(await res.arrayBuffer());
    } catch (e) {
        console.warn("graze.wav の読み込みに失敗", e);
    }
}
loadGrazeSound();

function playGrazeSound() {
    if (!grazeBuf) return;
    if (audioCtx.state === "suspended") audioCtx.resume();

    const src = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    src.buffer = grazeBuf;
    src.playbackRate.value = 0.95 + Math.random() * 0.1; // 連打の単調さを軽減
    gain.gain.value = 0.5;
    src.connect(gain).connect(audioCtx.destination);
    src.start();
}

export class Entity {
    constructor(name, x, y, radius, color, speed, ap = true, rd, hp = 100) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.ny = y;
        this.nx = x;
        this.hp = hp;
        this.maxhp = hp;
        this.radius = radius;
        this.color = color;
        this.currentBaseColor = color;
        this.speed = speed;
        this.MySpeed = speed*2;
        this.hitboxRadius = rd;
this.br=radius;
this.bh = rd;
        // 出現してからのフレーム数（Entity.update() が進める。Playerはプロパティだけ持つ）
        this.timer = 1;
        // mov用の慣性管理
        this.movInertia = true;
        this.movCurrentSpeed = 0; // 現在の実移動速度（加速していく値）
        if (name !== "Player" && ap) entitys.push(this);
    }
update() {
    this.timer++;
    this.radius = this.br*((canvas.w / 384)+(canvas.h / 448))*0.5
    this.hitboxRadius = this.bh*((canvas.w / 384)+(canvas.h / 448))*0.5
    if (this.y < this.targetY) this.y += this.speed;
    this.moveToTarget();

    // 場外に出たら自分を消す
    if (this.x < 0 || this.x > canvas.w || this.y < 0 || this.y > canvas.h) {
        this.remove();
    }
}

remove() {
    const i = entitys.indexOf(this);
    if (i !== -1) entitys.splice(i, 1);
}

    Move(Direction = { x: 0, y: 0 }) {
        const Nx = this.x + (Direction.x * this.speed);
        const Ny = this.y + (Direction.y * this.speed);
        if (Nx < 0 || Nx > (canvas.w || 280) || Ny < 0 || Ny > (canvas.h || 480)) return;
        this.x = Nx;
        this.y = Ny;
    }

mov(x, y, inertia = true, speed = this.speed) {
    this.nx = x;
    this.ny = y;
    this.movInertia = inertia;
    this.movSpeed = speed;
}

moveToTarget(speed = this.movSpeed ?? this.speed) {
    // 目標に到達していたら何もしない
    if (this.x === this.nx && this.y === this.ny) {
        this.movCurrentSpeed = 0;
        return;
    }

    const dx = this.nx - this.x;
    const dy = this.ny - this.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const accel = 0.15;

    if (this.movInertia) {
        this.movCurrentSpeed = Math.min(speed, this.movCurrentSpeed + accel);
    } else {
        this.movCurrentSpeed = speed;
    }

    const moveSpeed = Math.min(this.movCurrentSpeed, dist);

    const nx = this.x + Math.cos(angle) * moveSpeed;
    const ny = this.y + Math.sin(angle) * moveSpeed;

    this.x = nx;
    this.y = ny;

    if (Math.hypot(this.nx - this.x, this.ny - this.y) < 0.5) {
        this.x = this.nx;
        this.y = this.ny;
        this.movCurrentSpeed = 0;
    }
}

    draw(ctx, debug = false) {
        ctx.fillStyle = this.color;
        this.color = this.currentBaseColor
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        if (debug && this.hitboxRadius) {
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.hitboxRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    }

    hitTests() {
        const OnHit = pbs.find((bullet) => {
            if (bullet.radius <= 0) return false; // ← 追加：判定無効化
            if (bullet.type === "laser" || bullet.type === "laser2") {
                if (bullet.timer < bullet.speed) return;
                // まだ発射準備中(timer < speed)は当たらない、が必要なら調整
                return bullet.hitTestLaser(this.x, this.y, this.hitboxRadius);
            }
            const dx = bullet.x - this.x;
            const dy = bullet.y - this.y;
const multip = bullet.def ? 1.0 : 0.6
            return (dx * dx + dy * dy) < Math.pow(this.hitboxRadius + (bullet.radius * multip), 2);
        });
        if (OnHit) {
            this.color = "white"
            this.hp -= OnHit.damage
        }
        return OnHit;
    }
}


export class Player extends Entity {
    constructor(x, y, radius, color,rd,it,zanki,name="yuugi") {
        super("Player", x, y, radius, color, 2, false, rd);
        this.maxzanki = zanki ?? 3
        this.zanki = zanki ?? 3;
        this.it = it ?? 120
        this.invincible = 0;
        this.death = false;
        this.deathF=0
this.name=name
        // 💡 時間切れ後の停止中フラグ（engine.js の gameLoop が毎フレーム設定する）
        this.frozen = false;
        // グレイズ
        this.graze = 0;
        this.grazeMap = new WeakMap(); // グレイズ済みの弾を登録（弾が消えれば自動解放）
this.gs = rd * multi
        players.push(this);
    }

    update() {
this.radius = this.br*((canvas.w / 384)+(canvas.h / 448))*0.5
this.hitboxRadius = this.bh*((canvas.w / 384)+(canvas.h / 448))*0.5
        if (this.zanki <= 0 && this.deathF < stat.pfr) {
            this.deathF = stat.pfr
            this.death = true;
        }
        this.color = this.invincible > 0 ? "White" : this.currentBaseColor;
        this.invincible -= 1;
        this.IsSlow();

        // 60フレームごとにプレイヤーの入力状態をコンソールに出力する

        if (window.Allkeys.ArrowUp)    this.Move({ x: 0, y: -1 });
        if (window.Allkeys.ArrowDown)  this.Move({ x: 0, y: 1 });
        if (window.Allkeys.ArrowRight) this.Move({ x: 1, y: 0 });
        if (window.Allkeys.ArrowLeft)  this.Move({ x: -1, y: 0 });
    }

    OnShot(a = false) {
if (this.name==="hakurei") {
new PlayerBullet({ x:-5, y: 10, angle: -Math.PI / 2, speed: 30, color: "red",size:16, type: "amulet",damage:2.1 });
new PlayerBullet({ x:5, y: 10, angle: -Math.PI / 2, speed: 30, color: "red",size:16, type: "amulet",damage:2.1});
        let near = null, minDist = Infinity;
        for (const e of entitys) {
            if (e === this) continue;
            const d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < minDist) [minDist, near] = [d, e];
        }
        if (near) {
new PlayerBullet({ x: -15, y: 0, angle: pf(this.x, this.y, 0, near), speed: 15, color: "green",size:16, type: "amulet", damage:2.4});
new PlayerBullet({ x: 15, y: 0, angle: pf(this.x, this.y, 0, near), speed: 15, color: "green", size:16, type: "amulet", damage:2.4});
    }
}
if (this.name==="kirisame") {
new PlayerBullet({ x:-5, y: 10, angle: -Math.PI / 2, speed: 6.5, color: "green",size:32, type: "star2",damage:1.8 });
new PlayerBullet({ x:5, y: 10, angle: -Math.PI / 2, speed: 6.5, color: "green",size:32, type: "star2",damage:1.8 });
}
if (this.name==="kagiyama") {
new PlayerBullet({ x:-5, y: 10, angle: -Math.PI / 2, speed: 40.5, color: "blue",size:32, type: "kunai",damage:1.5 })
new PlayerBullet({ x:5, y: 10, angle: -Math.PI / 2, speed: 40.5, color: "blue",size:32, type: "kunai",damage:1.5 })
new PlayerBullet({ x:-25, y: 10, angle: -Math.PI / 2, speed: 50.5, color: "purple",size:24, type: "amulet",damage:7 })
new PlayerBullet({ x:25, y: 10, angle: -Math.PI / 2, speed: 50.5, color: "purple",size:24, type: "amulet",damage:7 })
}
if (this.name==="yuugi") {
if (stat.pfr % 240 === 0)new PlayerBullet({ x:0, y: 10, angle: -Math.PI / 2, speed: 4, color: "red",size:96, type: "big",damage:20 })
}
if (this.name==="kurapi") {
new PlayerBullet({ x:-5, y: 10, angle: -Math.PI / 2, speed: 0.5, color: "green",size:32, type: "polygon",damage:2.5 });
new PlayerBullet({ x:5, y: 10, angle: -Math.PI / 2, speed: 0.5, color: "green",size:32, type: "polygon",damage:2.5 });
}
}


hitTest(invincible = false, grid) {
    const data = gps(this.x, this.y)
    const cell = grid[data.w][data.h];

    // --- グレイズ判定（無敵中も有効） ---
    // 💡 停止中は、プレイヤーのいるマスだけでなく「全弾」を走査する（マス境界の取りこぼし対策）
    //    走査中に弾を消すので、コピーした配列を回す
    const src = this.frozen ? [...bullets] : cell;
    const grazeR = this.gs
    for (const b of src) {
        if (!b) continue;
        if (cfg && b.active === false) continue; // プール内の非アクティブ弾は無視
        // プールで再利用された弾は uid が変わるので、別の弾として扱われる
        if (b.radius <= 0 || this.grazeMap.get(b) === b.uid) continue;
        let grazed;
        if (b.type === "laser" || b.type === "laser2") {
            if (b.timer < b.speed) continue;
            grazed = b.hitTestLaser(this.x, this.y, grazeR);
        } else {
            const dx = b.x - this.x;
            const dy = b.y - this.y;
            grazed = (dx * dx + dy * dy) < Math.pow(grazeR + (b.radius), 2);
        }
        if (grazed) {
            this.grazeMap.set(b, b.uid);
            this.graze += 1;
            playGrazeSound();

            // 💡 停止中はグレイズした弾を消す
            if (this.frozen) {
                if (cfg) {
                    b.releaseToPool();
                } else {
                    const i = bullets.indexOf(b);
                    if (i >= 0) bullets.splice(i, 1);
                }
            }
        }
    }

    // --- 被弾判定 ---
    // 💡 停止中は当たり判定なし
    if (this.invincible > 0 || this.frozen) return false;
    const OnHit = cell.some(bullet => {
   if (bullet.radius <= 0) return false; // ← 追加：判定無効化
        if (bullet.type === "laser"||bullet.type==="laser2") {
if(bullet.timer < bullet.speed) return;
            // まだ発射準備中(timer < speed)は当たらない、が必要なら調整
            return bullet.hitTestLaser(this.x, this.y, this.hitboxRadius);
        }
        const dx = bullet.x - this.x;
        const dy = bullet.y - this.y;
const multip = bullet.def ? 1.0 : 0.6
        return (dx * dx + dy * dy) < Math.pow(this.hitboxRadius + (bullet.radius * multip), 2);
    });

    if (OnHit) {
        this.invincible = this.it;
        this.zanki -= 1;
    }
    return OnHit;
}
    IsSlow() {
        if (window.Allkeys.Shift) {
            this.speed = 1.6*0.75;
            this.currentBaseColor = "green";
        } else {
            this.speed = this.MySpeed;
            this.currentBaseColor = "magenta";
        }
    }

    Bomb() {
        if (window.Allkeys.x && this.ba > 0) {
            if (this.ob) return;
            this.ba -= 1;
            for (let i = 0; i < 120; i++) {
                setTimeout(() => {
                    this.ob = true;
                    bullets.length = 0;
                }, i * 1000 / 60);
            }
        }
    }

    draw(ctx, debug = false) {
        super.draw(ctx, debug);

        // グレイズ範囲（白い縁の円）
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.hitboxRadius * multi, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.hitboxRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        if (debug) {
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.hitboxRadius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
        }
    }

    remove() {
        const index = players.indexOf(this);
        if (index !== -1) {
            players.splice(index, 1);
        }
    }
}
