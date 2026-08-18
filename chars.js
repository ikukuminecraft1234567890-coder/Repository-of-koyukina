import { 
    canvas, ctx, players, bullets,
    updateFrame, frame, Half, isTouching, entitys
,internal,gps,pbs} from './sys.js';
import {Bullet} from "./bc.js"
import {PlayerBullet} from "./pb.js"
import {pf}from"./bullet.js"
export class Entity {
    constructor(name, x, y, radius, color, speed, ap = true, rd,hp=100) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.ny = y;
        this.nx = x;
        this.hp = hp;
        this.radius = radius;
        this.color = color;
        this.currentBaseColor = color;
        this.speed = speed;
        this.MySpeed = speed;
        this.hitboxRadius = rd;
        if (name !== "Player" && ap) entitys.push(this);
    }
    update() {
        if (this.y < this.targetY) this.y += this.speed;
        this.ny = this.y;
        this.nx = this.x;
    }

    Move(Direction = { x: 0, y: 0 }) {
        const Nx = this.x + (Direction.x * this.speed);
        const Ny = this.y + (Direction.y * this.speed);
        if (Nx < 0 || Nx > (canvas.w || 280) || Ny < 0 || Ny > (canvas.h || 480)) return;
        this.x = Nx;
        this.y = Ny;
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

    mov(x, y) {
        this.nx = x;
        this.ny = y;
    }
hitTests() {
    const OnHit = pbs.find((bullet) => {
   if (bullet.radius <= 0) return false; // ← 追加：判定無効化
        if (bullet.type === "laser") {
if(bullet.timer < bullet.speed) return;
            // まだ発射準備中(timer < speed)は当たらない、が必要なら調整
            return bullet.hitTestLaser(this.x, this.y, this.hitboxRadius);
        }
        const dx = bullet.x - this.x;
        const dy = bullet.y - this.y;
        return (dx * dx + dy * dy) < Math.pow(this.hitboxRadius + (bullet.radius * 0.6), 2);
    });
    if (OnHit) {
this.color = "white"
this.hp -= OnHit.damage
    }
    return OnHit;
}
}


export class Player extends Entity {
    constructor(x, y, radius, color,rd,it,zanki) {
        super("Player", x, y, radius, color, 2, false, rd);
this.maxzanki = zanki ?? 3
        this.zanki = zanki ?? 3;
this.it = it ?? 120
        this.invincible = 0;
        this.death = false;

        players.push(this);
    }

    update() {
        if (this.zanki <= 0) this.death = true;
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
        if (!window.Allkeys.z && !isTouching) return;
        if (!a) {
new PlayerBullet({ x:-5, y: 10, angle: -Math.PI / 2, speed: 30, color: "red",size:16, type: "amulet",damage:12 });
new PlayerBullet({ x:5, y: 10, angle: -Math.PI / 2, speed: 30, color: "red",size:16, type: "amulet",damage:12 });
}
        let near = null, minDist = Infinity;
        for (const e of entitys) {
            if (e === this) continue;
            const d = Math.hypot(e.x - this.x, e.y - this.y);
            if (d < minDist) [minDist, near] = [d, e];
        }
        if (near) {
new PlayerBullet({ x: -15, y: 0, angle: pf(this.x, this.y, 0, near), speed: 15, color: "green",size:16, type: "amulet", damage:3.5});
new PlayerBullet({ x: 15, y: 0, angle: pf(this.x, this.y, 0, near), speed: 15, color: "green", size:16, type: "amulet", damage:3.5});
    }
}


hitTest(invincible = false, grid) {
    if (this.invincible > 0) return false;
    const data = gps(this.x, this.y)
    const OnHit = grid[data.w][data.h].some(bullet => {
   if (bullet.radius <= 0) return false; // ← 追加：判定無効化
        if (bullet.type === "laser") {
if(bullet.timer < bullet.speed) return;
            // まだ発射準備中(timer < speed)は当たらない、が必要なら調整
            return bullet.hitTestLaser(this.x, this.y, this.hitboxRadius);
        }
        const dx = bullet.x - this.x;
        const dy = bullet.y - this.y;
        return (dx * dx + dy * dy) < Math.pow(this.hitboxRadius + (bullet.radius * 0.6), 2);
    });

    if (OnHit) {
        this.invincible = this.it;
        this.zanki -= 1;
    }
    return OnHit;
}
    IsSlow() {
        if (window.Allkeys.Shift) {
            this.speed = 0.8;
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