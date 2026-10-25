/*
bossOld.js — シーズン-1のスペル定義（旧環境のスペルを現代版の弾クラス(bc.js)へ移植）
・functions は functions.js の共有配列に push する
・旧 sys.js の Bullet / CC / pf は bc.js の bullet() / CC / pf に置き換え
・旧Bulletの slowF/slowE/slowEx/fastF/fastE と setlist の loop は、下の ob() が現代版の fnlist に変換して再現する
・シーズン-1はシーズン1と同様、ボスは無敵・ショットなし
-------=\現代版移植&コンパイル : Claude Sonnet5.5 /=------
*/
import { stat } from "./engine.js"
import { functions } from "./functions.js"
import { bullet, CC, pf } from "./bc.js"
import { gi, wait, fs, it, dtr } from "./bullet.js"
import { canvas, players, bullets, Half } from "./sys.js"

// boss.js と同じグローバル(pfr / entity / gameId)。スペル内で pfr や entity を直接使えるようにする
if (!Object.getOwnPropertyDescriptor(globalThis, "pfr")) {
    Object.defineProperties(globalThis, {
        pfr: { get() { return stat.pfr; }, set(v) { stat.pfr = v; } },
        entity: { get() { return stat.entity; }, set(v) { stat.entity = v; } },
        gameId: { get() { return stat.gameId; }, set(v) { stat.gameId = v; } }
    });
}

export { functions }

/**
 * 旧Bulletのオプションを現代版 bullet() に変換して生成する。
 *  - slowF/slowE : slowF フレーム目に speed *= slowE。slowEx:true なら slowF 以降 毎フレーム掛ける
 *  - fastF/fastE : fastF フレーム目に speed *= fastE。highEx:true なら fastF 以降 毎フレーム掛ける
 *  - setlist の loop:true : そのフレームから次の setlist 項目の直前まで、毎フレーム speed = e()
 * 該当が無い弾は、そのまま bullet() に渡す(現代版の挙動そのまま)。
 */
function ob(o = {}) {
    const { slowF, slowE = 1, slowEx = false, fastF, fastE = 1, highEx = false, ...p } = o;
    const sl = p.setlist ?? [];
    const hasSetLoop = sl.some(e => e.loop);
    const hasSpeedMod = slowF !== undefined || fastF !== undefined;
    if (!hasSetLoop && !hasSpeedMod) return bullet(p);

    // 現代版の fnlist は同時に1つしかループできないので、全部を1本のループにまとめて振り分ける
    const acts = [];
    for (const e of p.fnlist ?? []) {
        acts.push({ f: e.f | 0, loop: !!e.loop, time: (e.time | 0) || 1, to: Infinity, run: e.fn });
    }
    sl.forEach((e, i) => {
        const f = e.f | 0;
        const set = function () { this.speed = typeof e.e === "function" ? e.e.call(this) : e.e; };
        if (e.loop) {
            const next = sl[i + 1];
            acts.push({ f, loop: true, time: 1, to: next ? (next.f | 0) : Infinity, run: set });
        } else {
            acts.push({ f, loop: false, time: 1, to: Infinity, run: set });
        }
    });
    if (fastF !== undefined) {
        acts.push({ f: Math.floor(fastF), loop: highEx, time: 1, to: Infinity, run() { this.speed *= fastE; } });
    }
    if (slowF !== undefined) {
        acts.push({ f: Math.floor(slowF), loop: slowEx, time: 1, to: Infinity, run() { this.speed *= slowE; } });
    }

    const dispatch = function () {
        const t = this.timer;
        for (const a of acts) {
            if (a.loop) {
                if (t >= a.f && t < a.to && (t - a.f) % a.time === 0) a.run.call(this);
            } else if (t === a.f) {
                a.run.call(this);
            }
        }
    };
    return bullet({ ...p, fnlist: [{ f: 0, loop: true, fn: dispatch }], setlist: [] });
}

//バラマキ高速
const first = [
{
name:"バラマキ高速弾",
x:240,
y:480,
desc:"こうひんどでたまをばらまく",
hint:"赤色の弾は実は早めに消えるので意識しなくていいかも？",
ct:"個人的にこれは結構簡単め。\nしっかり低速を挟めば特に苦戦することはない...はず",
time:10,
init() {
gi(4)
CC("big",["#0041FF","#FF4300"])
},
run() {
    const player = players[0];
            if (pfr % 2 === 0) { // 密度調整のため1Fおき
const co = (fs(pfr) - 30) % 10
        if (fs(pfr) > 30) for (let k = 0; k < co; k++) {
                    const lifespan = Math.random() * 240;
                    const color = lifespan > 60 ? "B400FF" : "FF00F0";
                    ob({
                        x: entity.x, y: entity.y,
                        angle: Math.random() * Math.PI * 2,
                        speed: Math.random() * 3.5, color: color, w: 32, h: 32,
                        type: "big", deleteFrame: lifespan,
                        slowF: Math.random() * 15,
                        slowE: 0.5 + Math.random() * 0.1 // 50%~60%に減速
                    });
                }

                for (let k = 0; k < 2; k++) {
                    const lifespan = Math.random() * 240;
                    const color = lifespan > 60 ? "#0041FF" : "#FF4300";
                    ob({
                        x: entity.x, y: entity.y,
                        angle: Math.random() * Math.PI * 2,
                        speed: 7, color: color, w: 64, h: 64,
                        type: "big", deleteFrame: lifespan,
                        slowF: Math.random() * 15,
                        slowE: 0.5 + Math.random() * 0.1 // 50%~60%に減速
                    });
                }
            }

}}
,
{
//ルナティックアイズ
name:"狂気の瞳(ルナティックアイズ)",
x:240,
y:480,
desc:"自機を基準として全方位に横長のバラマキ。下に来ると減速して避けやすくなります。",
hint:"5s事に空白が空いてくるので、上手くそこで切り替えをしましょう",
ct:"スマホで開発してるので多分キーボードだと簡単なんだろうなぁとか思いつつ(＾＾；結構時間かかりました",
time:30,
init() {
gi(3)
CC("normal",["FF144A"])
},
run() {
const fl = [5,10,15,20,25,30]
    const player = players[0];
       if (pfr % 15 === 0 && !fl.some(e=> e === fs(pfr))) {
for (let i = -90;i<90;i++) {
const a =pf(entity.x,entity.y,i)
ob({
              x: entity.x, y: entity.y,
                      angle: a,
                       speed: 6, color: "#FF144A", w: 8, h: 8,
                      type: "normal", deleteFrame: 180,
                        slowF: 40,
                        slowE: 0.2
                    });
}
}
}
},
{
//神徳
name:"憑依｢風神様の神徳｣",
x:240,
y:480,
desc:"周囲にばら撒き、中央にランダムなバラマキ弾を発動。最終的に隙間が空きます。",
hint:"上側で避けると楽かも？",
    time: 30,
    isLogging: false,
    isLoggingO: false, // 💡 【追加】クナイ（魚群）側の非同期多重起動を防ぐロックフラグ！

    init() {
    gi(1.5)
        this.isLogging = false;
        this.isLoggingO = false; // 初期化
        CC("四角",["#FF144A"])
      CC("御札",["#FF144A"])
      CC("normal",["#FF144A"])
        // 💡 画面下の安地潰しの壁。左右の幅を少し間引き、寿命を画面外に出る程度(300Fなど)に設定してメモリリークを防ぐ
        for (let i = -150; i < 150; i += 4) { // 密度を4pxおきにして数を1/4に軽量化
            ob({
                x: entity.x + i,
                y: entity.y + 160,
                angle: 0,
                speed: 0,
                color:"#FF144A",
                w: 16,
                h: 8,
                type: "四角",
                deleteFrame:9999,
            });
        }
    },

    run() {
        const self = this;

        function random(min, max) {
            return Math.random() * (max - min) + min;
        }

        const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        // 【非同期関数】
        async function launchBarrage() {
            // 💡 どちらのタイプを出すかによって、それぞれのロックをかける！
        self.isLogging = true;
        const startPfr = pfr; // スペルをやり直した(pfrが巻き戻った)ら、残りの弾は出さない

            for (let count = 0; count < 5; count++) {
                if (pfr < startPfr) return;
                const va = random(-0.35, 0.35);

                for (let i = -2; i < 2; i++) {
                    let a = null;

                        a = (Math.PI / 2) + va;

                    ob({
                        x: entity.x + i * 3,
                        y: entity.y,
                        angle: a,
                        speed: 2,
                        color: "#FF144A",
                        w: 16,
                        h: 16,
                        type: "御札",
                        deleteFrame: 180,
                        fastF: 40,
                        fastE: 1.05,
                        slowF: 80,
                        slowE: 0.993,
                        slowEx: true,
                        rotate: [{ f: 40, a: a + (i * 0.13) }],
                    });

                };
                if (count < 4) {
                    await sleep(200);
                }
}
            }

            // 💡 出し切ったらそれぞれのロックを解除！
        self.isLogging = false;

        // 御札弾幕（正面方向）：55フレームごと、かつ前回のセットが終わっていれば起動
        if (pfr % 55 === 0) {
            launchBarrage(false);
        }

        // クナイ弾幕（全方位）：💡 前回のクナイセット(5発分)が完全に終わった時だけ、新しく次のセットを起動する！
let ia = null
         while (true) {
                            const na = random(-Math.PI, Math.PI);
                            if (na >= (Math.PI / 2) - 0.45 && na <= (Math.PI / 2) + 0.45) {
                                continue;
                            }
                            ia = na;
                            break;
                        }
for (let i = -2;i<2;i++)ob({
                        x: entity.x + i * 3,
                        y: entity.y,
                        angle: ia,
                        speed: 15,
                        color: "#FF144A",
                        w: 64,
                        h: 64,
                        type: "normal",
                        deleteFrame: 180,
                        fastF: 40,
                        fastE: 1.05,
                        slowF: 80,
                        slowE: 0.993,
                        slowEx: true,
                        rotate: [{ f: 40, a: ia + (i * 0.1) }],
                    });
}
    },

{
//発狂回転
ka: 0,
time:30,
name:"呪詛「ブラド・ツェペシュの呪い」",
x:240,
y:480,
    init() {
        this.ka = 0;
gi(0.25)
CC("normal","FF144A")
   },
run() {
    this.ka += 0.08 // 💡 毎フレーム「1」足すと回転が超爆速になるので、0.05〜0.1 くらいにすると綺麗な渦巻きになります

    const currentSec = fs(pfr); // 現在の秒数
let pace = 4
    // 💡 密度調整：4フレームに1回だけ発射する（お好みで 2 や 1 に変更してください）
    if (pfr % 4 === 0) {

        // 【段階1】 0秒 〜 5秒未満：1way
        if (currentSec < 5) {
            ob({
                x: entity.x, y: entity.y, angle: this.ka,
                speed: 2, color: "#FF144A", w: 8, h: 8, type: "normal"
            });
        }
        // 【段階2】 5秒 〜 10秒未満：3way
        else if (currentSec < 10) {
pace = 2
            ob({ x: entity.x, y: entity.y, angle: this.ka, speed: 2, color: "#FF144A", w: 8, h: 8, type: "normal" });
            ob({ x: entity.x, y: entity.y, angle: this.ka + 0.5, speed: 2, color: "#FF144A", w: 8, h: 8, type: "normal" }); // 💡 角度差を 1 から 0.5 にすると締まって見えます
            ob({ x: entity.x, y: entity.y, angle: this.ka - 0.5, speed: 2, color: "#FF144A", w: 8, h: 8, type: "normal" });
        }
        // 【段階3】 10秒 〜 30秒（最後まで）：5way
        else {
pace = 1
const progress = (currentSec - 10) / (30 - 10); // 0 から 1 に変化する割合
            const sp = 2 + progress * 2; // 2 から 6 まで徐々に上がる
for (let i = 0;i<2 + progress * 4;i++) {
this.ka += 0.08
ob({ x: entity.x, y: entity.y, angle: this.ka, speed: sp, color: "#FF144A", w: 8, h: 8, type: "normal" });
            ob({ x: entity.x, y: entity.y, angle: this.ka - 0.5, speed: sp, color: "#FF144A", w: 8, h: 8, type: "normal" });
            ob({ x: entity.x, y: entity.y, angle: this.ka - 1.0, speed: sp, color: "#FF144A", w: 8, h: 8, type: "normal" });
            ob({ x: entity.x, y: entity.y, angle: this.ka + 0.5, speed: sp, color: "#FF144A", w: 8, h: 8, type: "normal" });
            ob({ x: entity.x, y: entity.y, angle: this.ka + 1.0, speed: sp, color: "#FF144A", w: 8, h: 8, type: "normal" });
}
        }
    }
}},
]
functions.push(...first)



const spell5 = {
//自機狙い弾
focusF: 360,
x:240,
y:480,
init() {
CC("クナイ",["#FF144A"])
CC("四角","#FF144A")
this.focusF = 360
let a = true
gi(1)
},
time:30,
run() {
if (pfr % 360 === 0) {this.focusF += 5}
if (pfr % 6 === 0) {
if (!this.a) {this.a = true} else { this.a = false}
const angle = this.a ? 0 : Math.PI
   const ONE_DEGREE = Math.PI / 180;
ob({
                        x: entity.x,
                        y: entity.y,
                        angle: angle,
                        speed: 1.5,
                        color: "#FF144A",
                        w: 8,
                        h: 8,
                        type: "クナイ",
                        deleteFrame: Infinity,
rotate: [
    {
        f: 60,       // 60フレーム目からスタート！
        loop: true,  // 毎フレーム実行する！
        a: function() {
            const ONE_DEGREE = Math.PI / 180;
            // 弾自身の位置(this.x, this.y)から画面中央(Half.x, Half.y)への角度
            const targetAngle = pf(this.x, this.y, 0, null, Half.y, Half.x);

            let diff = targetAngle - this.angle;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));

            if (diff > 0) return this.angle + ONE_DEGREE;
            if (diff < 0) return this.angle - ONE_DEGREE;
            return this.angle;
        },lf:this.focusF
    },
{f:this.focusF + 1,
a:function() {
return pf(this.x,this.y)
},now:true}
],
setlist:[{f:361,e:3}]
                    });
}
if (pfr % 60 === 0) for (let i = -150;i<150;i++) {
ob({
                        x: entity.x + i,
                        y: canvas.h,
                        angle: -Math.PI / 2,
                        speed: 1,
                        color: "#FF144A",
                        w: 16,
                        h: 8,
                        type: "四角",
                        deleteFrame: 140,
})
ob({
                        x: entity.x + i,
                        y: 0,
                        angle: Math.PI / 2,
                        speed: 1,
                        color: "#FF144A",
                        w: 16,
                        h: 8,
                        type: "四角",
                        deleteFrame: 140,
})
}

}}
functions.push(spell5)
const spell6 = {
name:"怪力「大江山竜巻」",
x:240,
y:480,
desc:"どんどん高速化+CTが短縮されるバラマキ大弾。ラストには回避不可能(！？)な発狂弾幕が飛んでくる。",
hint:"スピードに比例して確率で玉がスポーンしなくなります。諦めないこと",
ct:"ラストで確実に1ミス持ってくんで、実際に許される被弾数は1くらい-_-\"\n24〜27秒まで弾が出ないのは実はバグです()\nただなんかいい感じになったのでほっときました",
speed:1,
ti:30,

//自機狙い弾
init() {
CC("big","#FF144A")
this.ti = 30
this.speed = 1
gi(1)
},
time:30,
run() {
const add = (pfr / 120) / 1.5
if (pfr % 240 === 0) this.ti -= 5
this.speed = 1 + add
if (pfr % this.ti === 0 && pfr > 1500) {for (let i = -18;i<18;i++) { ob({
                        x: entity.x,
                        y: 0,
                        angle: 0 + i * Math.random() * (i * 10),
                        speed: this.speed,
                        color: "#FF144A",
                        w: 64,
                        h: 64,
                        type: "big",
                        deleteFrame: 990,
})
}

}
if (pfr % this.ti === 0 && pfr > 640) {for (let i = -18 + this.speed;i<18 - this.speed;i++) {
if ((Math.random() * 40 - this.speed) > 10)ob({
                        x: entity.x,
                        y: 0,
                        angle: 0 + i * Math.random() * (i * 10),
                        speed: this.speed,
                        color: "#FF144A",
                        w: 64,
                        h: 64,
                        type: "big",
                        deleteFrame: 990,
})
}

}
    if (pfr % 80 === 0 && pfr < 640) {for (let i = -18;i<18;i++) { ob({
                        x: entity.x,
                        y: 0,
                        angle: 0 + i * Math.random() * (i * 10),
                        speed: this.speed,
                        color: "#FF144A",
                        w: 64,
                        h: 64,
                        type: "big",
                        deleteFrame: 990,
})
}

}
}}
functions.push(spell6)
const spell7 = {
name:"水符｢天変地異の魚群｣",
x:240,
y:480,
desc:"右から左、左から右へと魚がどんどん飛んで来ることを表現したスペル。",
hint:"落ちてきたあとはランダムな速度なのでしっかり見極めると楽かも？",
ct:"結構な自信作です＾＾何気に難易度と見た目を両立出来たのは初めてかも",

direction:false,
ti:120,
delay:3,
stop:false,
all:[],
//自機狙い弾
init() {
CC("big","#008CDC")
CC("クナイ","#008CDC")
this.all = []
for (let i = 0;i<30000;i++) this.all.push({
                        angle: dtr(-90),
                        speed: 5,
                        color: "#008CDC",
                        w: 32,
                        h: 32,
                        type: "big",
                        deleteFrame: 990,
y:240,
setlist:[{f:0,e:function () {return this.speed -= 0.08},loop:true},{f:120,e:Math.random() * 3}],
rotate: [
    {
        f: 0,             // 発射から40フレーム目に実行
        a: dtr(-90)        //あ 角度を120度（右下方向）に変更する
    },
{f:120,a:dtr(90)}
],push:false

})

this.stop = false
this.direction = false
this.ti = 30
this.speed = 1
gi(1)
},
time:30,
run() {
if (pfr % 480 === 0) {this.stop = true
    wait(() => {this.stop = false},120)
}
this.speed = 1
const wid = canvas.w
const pos = this.direction ? {s:0,e:wid} : {s:wid,e:0}
if (pfr % this.ti === 0 && !this.stop) {
const psi = this.direction ? {x:wid,a:dtr(-179)} : {x:0,a:dtr(0)}
ob({
    speed: 8, // スピード5
    color: "#008CDC",
    w: 168,
    h: 168,
    type: "クナイ",
    deleteFrame: 32,
    y: 30,
    x: psi.x,
    angle: psi.a, // 最初は右（0度）

});
this.direction = !this.direction;
if (this.direction) for (let i = 0;i<wid;i+=32) {
const tm = this.all[Math.floor(Math.random() * this.all.length)];

// 1. 多次元部分をディープコピー
const cleanRotate = tm.rotate.map(r => ({ ...r }));
const cleanSetlist = tm.setlist.map(s => ({ ...s }));

// 2. 💡 先にプールデータを展開し、後ろから「今」のデータで上書きする！
const bu = {
    ...tm,                 // まずベースのレシピを全部展開
    x: i,                  // 今回のループのX座標で上書き
    rotate: cleanRotate,   // 新品のrotateで上書き
    setlist: cleanSetlist, // 新品のsetlistで上書き
    push: true             // falseをtrueに上書き！
};

wait(() => {
    ob(bu)
},(i / 32) * this.delay)
}
if (!this.direction) for (let i = wid;i>=0;i-=32) {
const tm = this.all[Math.floor(Math.random() * this.all.length)];

// 1. 多次元部分をディープコピー
const cleanRotate = tm.rotate.map(r => ({ ...r }));
const cleanSetlist = tm.setlist.map(s => ({ ...s }));

// 2. 💡 先にプールデータを展開し、後ろから「今」のデータで上書きする！
const bu = {
    ...tm,                 // まずベースのレシピを全部展開
    x: i,                  // 今回のループのX座標で上書き
    rotate: cleanRotate,   // 新品のrotateで上書き
    setlist: cleanSetlist, // 新品のsetlistで上書き
    push: true             // falseをtrueに上書き！
};

const delayF = Math.floor(((wid - i) / 32) * 2)
wait(() => {ob(bu)},(delayF + 1) * this.delay)
}
}}}
functions.push(spell7)

const spell8 = {
name:"刻符｢永遠の丑三つ時｣",
x:240,
y:480,
desc:"72Way全方位弾がどんどん飛んできます。定期的に停止し、減速してまた動き出します。更に、定期的に全てのたまが消えます。",
hint:"1波目は真下から見て比較的上側、2はめは真下で避けるみたいなある程度の避け方を覚えると楽かも",
ct:"難易度で言ったら最難関かも？妹紅通8再現のつもりでしたが、再現だと行けないということで停止を付けたり！妹紅要素として永遠、刻符、丑三つ時等要素を一応盛り付けておきました^^;難易度的に仕方なく当たり判定を極小にしたり、タイミング合わせで42sにしたりと結構テストがキツかったです()",

direction:0,
ti:120,
delay:3,
stop:false,
list:[],
//自機狙い弾
init() {
this.list = [{t:0,v:"#FF0000"},{t:3,v:"00BFFF"},{t:6,v:"00C20E"},{t:9,v:"FFFB32"},{t:12,v:"FF7125"},{t:15,v:"1894FF"},{t:18,v:"A8FF48"},{t:21,v:"FFDC2C"},{t:25,v:"F800FF"},{t:30,v:"AA00FF"},{t:99999,v:""}]
CC("amulet",this.list.map(e => e.v).filter(Boolean)) // 現代版CCは色の配列を受け取る
this.stop = false
this.direction = 0
this.ti = 30
this.speed = 1
gi(0.5)
},
time:42,
run() {
if (pfr % 15 !== 0) return;
this.direction += 1
let x = entity.x
const vaa = 80
if (this.direction === 0) x += vaa
if (this.direction === 1) x
if (this.direction === 2) x -= vaa

this.speed = 1
const check = it(fs(pfr))
const color = this.list.find((e,i,o) => {
const next = o[i+1]
if (!next) return true;
return (check(e.t,next.t))
})
const count = 72
const step = 360 / count;
const startDeg = (Math.random() - 0.5) * 32
    for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
ob({
    speed: 3, // スピード5
    color: color.v,
    w: 16,
    h: 16,
    type: "amulet",
    y: entity.y,
    x: x,
    angle: angle,
custom:3,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
if (pfr % 840 === 0) this.deleteFrame = 0
        const cycle = pfr % 120;
if (cycle === 0) this.custom = this.custom / 2
        // 最初の60フレーム（1秒）は速度0で停止、後半60フレームは速度3で動く
        if (cycle < 60) {
            return 0;
        } else {
            return this.custom
        }
    },loop:true}]
// 最初は右（0度）

});
}
if (this.direction === 3) this.direction = -1
}
}
functions.push(spell8)

const spell9 = {
name:"None",
x:240,
y:480,
desc:"まだ書かれてないよ",
hint:"あったらいいね",
ct:"クリアテキスト目的ならすまん(笑)",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
CC("gummy","#00FF00")
CC("knife","#80FF80")
CC("gummy","#0000FF")
gi(0.5)
},
time:25,
run() {
const count = 72
const step = 360 / count;
if (this.pe > 4) this.pe = -4
if (pfr % 120 == 0) this.pe += 1
const startDeg = this.pe * 30
if (pfr % 30 === 0) {
for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
wait(() => {ob({
    speed: 1, // スピード5
    color: "#00FF00",
    w: 16,
    h: 16,
    type: "gummy",
    y: entity.y,
    x: entity.x,
    angle: angle,
custom:1,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
        const cycle = pfr % 60;
if (cycle === 0) this.custom = this.custom * 3
            return this.custom
        },loop:true}]
// 最初は右（0度）
})
},i)
}
if (fs(pfr) > 10) {
for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step * 0.75;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + -startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
wait(() => {ob({
    speed: 1, // スピード5
    color: "#0000FF",
    w: 16,
    h: 16,
    type: "gummy",
    y: entity.y,
    x: entity.x,
    angle: angle,
custom:1,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
        const cycle = pfr % 60;
if (cycle === 0) this.custom = this.custom * 1.5
            return this.custom
        },loop:true}]
// 最初は右（0度）
})
},i)
}
}
}
if (pfr % 3 === 0)ob({
    speed: 3, // スピード5
    color: "#80FF80",
    w: 16,
    h: 16,
    type: "knife",
    y: entity.y,
    x: entity.x,
    angle: pf(entity.x,entity.y),
// 最初は右（0度）
})
}}
functions.push(spell9)
const spell10 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"暴風｢天狗の団扇｣",
x:240,
y:480,
desc:"扇状に展開、画面外に行くと左からランダムな配置で出てきます。",
hint:"扇を避けるフェーズ、ランダム配置を避けるフェーズで分けるといいかも",
ct:"名前決めるの結構難しいけど少しづつ慣れてきたかも、難易度で言うとこれは結構高め？",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
CC("gummy","#00FF00")
CC("knife","#80FF80")
CC("gummy","#0000FF")
gi(0.5)
},
time:30,
run() {
const count = 144
const step = 360 / count;
if (this.pe > 4) this.pe = -4
if (pfr % 120 == 0) this.pe += 1
const startDeg = this.pe * 120
if (pfr % 30 === 0) {
for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
wait(() => {ob({
    speed: 1, // スピード5
    color: "#00FF00",
    w: 16,
    h: 16,
    type: "gummy",
    y: entity.y,
    x: entity.x,
    angle: angle,
custom:0.5,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
        const cycle = pfr % 60;
if ((this.x < 5 || this.x > canvas.w - 5 || this.y < 5 || this.y > canvas.h - 5) && Math.random() < 0.05 && this.timer > 10) {
   ob({
    speed: 1, // スピード5
    color: "#00FF00",
    w: 4,
    h: 4,
    type: "diamond",
    y: this.y,
    x: this.x,
    angle: dtr(Math.PI - angle),
})
// 修正箇所（下部）：if文の閉じ括弧「}」が不足していたため追加
}
if (cycle === 0) this.custom = this.custom * 1.5
                return this.custom
        },loop:true}
// 最初は右（0度）
] // 修正箇所：オブジェクト末尾の不要な「}]」を、配列の閉じ括弧「]」のみに修正
})
},i*2)
}
}
}}
functions.push(spell10)
const spell11 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"境界｢スキマ弾幕地獄｣",
x:240,
y:480,
desc:"スキマを召喚し、スキマから拡散して弾が出てきます。",
hint:"目玉の大きい赤弾ははっしゃじのじきねらいです。",
ct:"名前を二回くらい実は変えてたり。初期は植物イメージだったけどこっちのがぽいかなーと。結構気に入ってます(あと10,9辺りが似たような動きだったので心機一転の気持ちで！)",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
this.list = ["#4F007B","#4F007B","#4F007B","#7D1DB2","#7D1DB2","#FF0058","#FF0100","#FFFFFF"]
gi(1)
},
time:45,
run() {
if (this.pe > 4) this.pe = -4
if (pfr % 120 == 0) this.pe += 1
const startDeg = this.pe * 120
const Step = 6
if (pfr % 60 === 0) {
for (let i = 0;i<canvas.h;i++) {
if (i % Step === 0) wait(() => {
if (i === canvas.h / 2 ) {
  ob({
    speed: 0, // スピード5
    color: "#FF0058",
    w: 64,
    h: 64,
    type: "big",
    y: i,
    x: entity.x + (Math.sin(i) * 5) + startDeg,
    angle: pf(entity.x + (Math.sin(i) * 5) + startDeg,i),
setlist:[{f:240,e:1.5}]
})
}
ob({
    speed: 0, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 16,
    h: 16,
    type: "gummy",
    y: i,
    x: entity.x + (Math.sin(i) * 5) + startDeg,
    angle: dtr(Math.random() * 360),
setlist:[{f:240,e:1}]
})
ob({
    speed: 0, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 16,
    h: 16,
    type: "gummy",
    y: i,
    x: (entity.x + (Math.sin(i) * 5) + startDeg) + 15,
    angle: dtr(Math.random() * 360),
setlist:[{f:240,e:1}]
})
},i / 4)
}
}
}}
functions.push(spell11)
const spell12 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"満開｢西行妖 -終焉-｣",
x:240,
y:480,
desc:"3パートに別れた大型弾幕。バラマキ > ランダム弾 > 自機狙い連打",
hint:"パート2は実は安置あります",
ct:"パート2の安置に気づかないとおそらくクリア不可能(笑)ノーヒット難易度で言うと1番高いけど、被弾ありなら安置さえ気づけばあんまりむずくない。",
list:[],
//自機狙い弾
pe:0,
time:45,
angle:90,
sw:false,
init() {
this.sw = false
this.angle = 90
const waitime = 240
const waitspeed = 1
this.pe = 0
this.list = ["E100FF","E100FF","E100FF","AA00C1","AA00C1","71297B"]
gi(1,[])
for (let i = 0;i<150;i++){
if (i % 2 === 0) {
wait(() => {ob({
    speed: 0, // スピード5
    color: "#8E6A00",
    w: 16,
    h: 16,
    type: "diamond",
    y: canvas.h - i,
    x: canvas.w / 2 - 30,
    angle: dtr(Math.random() * 360),
setlist:[{f:waitime * 2,e:waitspeed}]
})
ob({
    speed: 0, // スピード5
    color: "#8E6A00",
    w: 16,
    h: 16,
    type: "diamond",
    y: canvas.h - i,
    x: canvas.w / 2 + 30,
    angle: dtr(Math.random() * 360),
setlist:[{f:waitime * 2,e:waitspeed}]
})
},i)
}}
const goldenAngle = 137.5 * (Math.PI / 180); // 黄金角をラジアンに
const c = 7.5; // 全体の広がりのサイズ調整

for (let n = 0; n < 800; n++) {
    // フェルマーの螺旋の数式
    const r = c * Math.sqrt(n);
    const theta = n * goldenAngle;
const centerX = canvas.w / 2
const centerY = canvas.h * 0.5
const offsetX = r * Math.cos(theta) * 0.75; // 横幅の倍率
        const offsetY = r * Math.sin(theta) * 0.675; // 縦幅の倍率
    // 画面の座標(X, Y)に変換します
const rightX = centerX + offsetX; // 右側に広がる座標
        const leftX  =  centerX - offsetX; // 左側に広がる座標（マイナスにするだけで綺麗に反転します）
        const y = centerY + offsetY;
let l = {sx:0,sy:0,ex:0,ey:0,sd:0,ed:0}
const spawnN = 150
if (n < spawnN) continue;
if (n >= spawnN) l = {sx:rightX,sy:y,ex:leftX,ey:y}
wait(() => {ob({
    speed: 0, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 16,
    h: 16,
    type: "diamond",
    y: l.sy,
    x: l.sx,
    angle: dtr(Math.random() * 360),
setlist:[{f:waitime,e:waitspeed + (n * 0.0008)}]
})
    ob({
    speed: 0, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 16,
    h: 16,
    type: "diamond",
    y: l.ey,
    x: l.ex,
    angle: dtr(Math.random() * 360),
setlist:[{f:waitime,e:waitspeed + (n * 0.0008)}]
})
},(n / 3) + 120)
}}
,
run() {
    if(fs(pfr)>15 && fs(pfr) < 35) {
    if (this.angle > 150) this.sw = true
if (this.angle < 0) this.sw = false
if (pfr % 3 === 0) {
        for (let i = -2;i<2;i++) {
const aia = 5
this.angle = this.sw ? this.angle - aia : this.angle + aia
     ob({
    speed: 12, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 32,
    h: 32,
    type: "big",
    y: 0,
    x: entity.x,
    angle: dtr(this.angle + Math.random()  * i * 5),
setlist:[{f:30,e:3}]
})
     ob({
    speed: 1, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: 16,
    h: 16,
    type: "scale",
    y: canvas.h,
    x: Math.random() * canvas.w,
    angle: Math.random() * 5 + -90,
})
}}}
if (fs(pfr) === 35) {bullets.forEach(e=>e.deleteFrame = 0)}
if (fs(pfr) > 35) {
const x = Math.random() * canvas.w
const y = Math.random() * canvas.h
    if (pfr % 4 === 0) ob({
    speed: 1, // スピード5
    color: this.list[Math.floor(Math.random() * this.list.length)],
    w: Math.random() * 50,
    h: Math.random() * 50,
    type: "knife",
    y: y,
    x: x,
    angle: pf(x,y),
})
}
}}
functions.push(spell12)
const spell13 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"夜光｢ノクティルーセントクラウズ｣",
x:240,
y:480,
desc:"回転しながら足跡に弾幕を残すスペル。",
hint:"大弾に注意。隙間を抜けることさえ覚えたら楽。",
ct:"綺麗さで言うとどうなんだろう？結構いい感じの弾幕にできたはず",
list:[],
//自機狙い弾
pe:0,
time:30,
angle:90,
limit:"",
init() {
this.pe = 0
gi(1,[])
}
,
run() {
if (pfr % 60 === 0) {
for (let x = 0;x<20;x++) {
for (let i = 0;i<3;i++) {
wait(() => {
ob({
    speed: 0, // スピード5
    color: "FF00DC",
    w: 32,
    h: 32,
    type: "big",
    y: i * 30,
    x: x * 20,
    angle: 90,
deleteFrame:30,
})
     ob({
    speed: 0, // スピード5
    color: "FF00DC",
    w: 32,
    h: 32,
    type: "big",
    y: canvas.h - i * 30,
    x: x * 20,
    angle: -90,
deleteFrame:30,
})
},i * 10)
}}}
if (pfr % 120 === 0) {
ob({
    speed: 1, // スピード5
    color: "#FF0058",
    w: 64,
    h: 64,
    type: "big",
    y: Half.y - 50,
    x: Half.x ,
    angle: dtr((Math.random() * Math.PI) - Math.PI / 2),
custom:2,
setlist:[{f:0,e:function(){this.angle += dtr(2.5)
return this.speed + 0.03
},loop:true}],
fnlist:[{f:0,fn:function () {
if (pfr % 3 === 0) {
const a = this.angle
const s = this.speed
    for (let i = 0;i<4;i++) {
        wait(() => {
 ob({
    speed: 1, // スピード5
    color: "FFFFFF",
    w: 8,
    h: 8,
    type: "diamond",
    y: this.y,
    x: this.x,
    angle: a,
})
 ob({
    speed: 0.5, // スピード5
    color: "0020FF",
    w: 8,
    h: 8,
    type: "gummy",
    y: this.y,
    x: this.x,
    angle: dtr(s*36) - a,
})
    },i*4)
}
}},loop:true}]
})
}
}



}
functions.push(spell13)
const spell14 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"神の粥",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
this.list = ["#4F007B","#4F007B","#4F007B","#7D1DB2","#7D1DB2","#FF0058","#FF0100","#FFFFFF"]
gi(1)
},
time:45,
run() {
if (pfr % 30 === 0) {
for (let i = 0;i<36;i++) {
  ob({
    speed: 2, // スピード5
    color: "#FF00DE",
    w: 16,
    h: 16,
    type: "gummy",
    y: entity.y,
    x: entity.x + 30,
    angle: dtr(i*10),
setlist:[{f:10,e:8},{f:40,e:0.7},{f:55,e:0.4}],
fnlist:[{f:30,fn:function() {
if (this.timer === 40) {
    this.angle = this.angle + dtr((Math.random() * 45) - 22.5)
}
// 現代版は type を変えたら scolor で画像キーを更新する必要がある
if (this.timer > 60 && this.type !== "diamond") { this.type = "diamond"; this.scolor(this.color) }
},loop:true}]
})
  ob({
    speed: 2, // スピード5
    color: "#FF0058",
    w: 16,
    h: 16,
    type: "gummy",
    y: entity.y,
    x: entity.x - 30,
    angle: dtr(i*10),
setlist:[{f:10,e:8},{f:40,e:0.7},{f:55,e:0.4}],
fnlist:[{f:30,fn:function() {
if (this.timer === 40) {
     this.angle = this.angle + dtr((Math.random() * 45) - 22.5)
}
if (this.timer > 60 && this.type !== "diamond") { this.type = "diamond"; this.scolor(this.color) }
},loop:true}]
})
}
}
}}
functions.push(spell14)
const spell15 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=6[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:false,
stop:0,
init() {
this.stop = 0;
this.pe = false
this.list = ["#4F007B","#4F007B","#4F007B","#7D1DB2","#7D1DB2","#FF0058","#FF0100","#FFFFFF"]
gi(1)
},
time:30,
run() {
if (pfr % 120 === 0) {
for (let i = 0;i<canvas.w;i++) {
this.pe = !this.pe
const color = this.pe ? "#00FF4A" : "#FF00DE"
const x = this.pe ? Half.x - i : Half.x + i
//const y = this.pe ? Half.y - i : Half.y + i
 wait(() => {ob({
    speed: 2, // スピード5
    color: color,
    w: 32,
    h: 32,
    type: "scale",
    y: Half.y,
    x: x + Math.random() * 12,
    angle: dtr(i*10),
fnlist:[{f:60,fn:function(){
if (Math.random() > 0.05) {this.angle += Math.random()*7} else {
this.scolor("#1FE6F#")
this.angle = pf(this.x,this.y)}
}}]
})
},i)
}
}
}}
functions.push(spell15)
const spell16 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=7[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:false,
init() {
this.pe = false
gi(0.25)
},
time:20,
run() {
const count = 18
const step = 360 / count;
const startDeg = 120
if (pfr % 6 === 0) {
ob({
    speed: 0.5, // スピード5
    color:"FF1800",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(entity.x,entity.y),
custom:30,
})

for (let i = 0;i<count;i++) {
        let baseDeg = i * step;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
this.pe = !this.pe
const color = "FF004B"
const x = this.pe ? Half.x - i : Half.x + i
//const y = this.pe ? Half.y - i : Half.y + i
 wait(() => {ob({
    speed: 5, // スピード5
    color: color,
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
fnlist:[{f:0,fn:function(){
const now = pfr % 90
if(now>45){this.angle += 0.0125}else{this.angle -= 0.0125}

},loop:true}]
})
},i / 10)
}
}
}}
functions.push(spell16)
const spell17 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=8[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:false,
init() {
this.pe = 120
gi(0.25)
},
time:40,
run() {
const count = 18
const step = 360 / count;
const startDeg = this.pe
if(pfr%120===0) {
this.pe = (this.pe + 4) % 360;
for (let i = 0;i<count;i++) {
        let baseDeg = i * step;

        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;

        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }

        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
const color = "FF004B"
const x = this.pe ? Half.x - i : Half.x + i
//const y = this.pe ? Half.y - i : Half.y + i
 wait(() => {ob({
    speed: 2, // スピード5
    color: "FF1800",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
})
ob({
    speed: 1, // スピード5
    color: "FFEF00",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
})
ob({
    speed: 0.5, // スピード5
    color: "1900FF",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
})
ob({
    speed: 0.25, // スピード5
    color: "32",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
})
ob({
    speed: 0.125, // スピード5
    color: "BC00FF",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: angle,
custom:30,
})
},i*2)}}
if (pfr % 12 === 0) {
ob({
    speed: 2, // スピード5
    color:"FF1800",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:30,
})
ob({
    speed: 1, // スピード5
    color:"FFEF00",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:30,
})
ob({
    speed: 0.5, // スピード5
    color:"1900FF",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:30,
})
ob({
    speed: 0.25, // スピード5
    color:"3FFF00",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:30,
})
ob({
    speed: 0.125, // スピード5
    color:"BC00FF",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:30,
})

}
}}
functions.push(spell17)
const spell18 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=9[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
gi(1.5)
},
time:40,
run() {
if (pfr % 240 === 0)this.pe += 4
if (pfr % 240 ===0 || pfr === 10) ob({
    speed: 0.125, // スピード5
    color:"BC00FF",
    w: 24,
    h: 24,
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: pf(Half.x,Half.y),
custom:this.pe,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer % (30 - this.custom) === 0) {
this.angle = pf(this.x,this.y)
}

const distance = Math.sqrt((players[0].x - this.x) ** 2 + (players[0].y - this.y) ** 2)
this.speed = Math.min(6,distance * 0.07)
const raw = 1
const speed = Math.random() < 0.1 ? raw : -raw
ob({
    speed: speed, // スピード5
    color:"0829FF",
    w: 24,
    h: 24,
    type: "knife",
    y: this.y,
    x: this.x,
    angle: this.angle + Math.random() * 15,
deleteFrame:30+(this.custom * 4),
fnlist:[{f:0,loop:true,fn:function(){if(this.deleteFrame - 15 < this.timer && this.color !== "FF0941") this.scolor("FF0941")}}]
})
}}],
})

}
}
functions.push(spell18)
const spell19 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=10[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:0,
stop:0,
pattern:0,
ll:{x:0,y:0},
init() {
this.stop = 0
this.pattern = 0
this.pe = 0
this.ll.x = 0
this.ll.y = 0
gi(1)
},
time:40,
run() {
const st = {s:3.5,x:0,y:0,t:"scale",w:16,h:16,int:6 - (Math.floor(pfr / 128) % 7)}
    function random(min, max) {
            return Math.random() * (max - min) + min;
        }
if (pfr !== 0 && pfr % st.int === 0) {
st.y = this.pe % canvas.h
st.x = this.pe % canvas.w
if (this.pattern > 3) this.pattern = 0
 this.pe += 1
this.pattern += 1
if (this.pattern === 0) ob({
    speed: st.s, // スピード5
    color:"FFEB00",
    w: st.w,
    h: st.h,
    type: st.t,
    y: st.y,
    x: canvas.w,
    angle: dtr(135+random(-45,45)),
custom:{s:st.s,c:"FFEB00"},
})
const length = this.int === 6 ? 2 : 1
for (let i = 0;i<length;i++) { if (this.pattern === 1)ob({
    speed: st.s, // スピード5
    color:"00FF32",
    w: st.w,
    h: st.h,
    type: st.t,
    y: st.y,
    x: 0,
    angle: dtr(random(-45,45)),
    custom:{s:st.s,c:"00FF32"},
})
if (this.pattern === 2)ob({
    speed: st.s, // スピード5
    color:"0829FF",
    w: st.w,
    h: st.h,
    type: st.t,
    x: st.x,
    y: canvas.h,
    angle: dtr(-90+random(-45,45)),
custom:{s:st.s,c:"0829FF"},
})
if (this.pattern === 3)ob({
    speed: st.s, // スピード5
    color:"FF004A",
    w: st.w,
    h: st.h,
    type: st.t,
    x: st.x,
    y: 0,
    angle: dtr(random(-45,45)+90),
custom:{s:st.s,c:"FF004A"},
})
}}
if (st.int === 0) {
this.stop +=1
const a = this.stop
const p = players[0]
if (a === 1) {
this.ll.x=p.x
this.ll.y=p.y
}
if (a > 1)p.x= this.ll.x
if (a > 1)p.y= this.ll.y
if (a === 10) {
                bullets.forEach(e => {
                    // すでに停止させてある場合は上書きしない（記憶を維持）
                    e.speed = 0;
e.scolor("#FFFFFF")
e.angle = pf(e.x,e.y)
                });
            }
            // 【再始動タイミング】aが0になった「その1フレームだけ」で退避した速度に戻す
if (a === 128) {
                bullets.forEach(e => {
                        e.speed = e.custom.s * 0.7;
e.scolor(e.custom.c)
 // 用が済んだら消す
                });
this.stop = 0
            }
}

}}
functions.push(spell19)
const spell20 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"=11[]",
x:240,
y:480,
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:0,
stop:0,
pattern:0,
ll:{x:0,y:0},
init() {
this.stop = 0
this.pattern = 0
this.pe = 0
this.ll.x = 0
this.ll.y = 0
gi(1)
},
time:40,
run() {
const st = {s:3.5,x:0,y:0,t:"scale",w:16,h:16,int:6 - (Math.floor(pfr / 128) % 7)}
    function random(min, max) {
            return Math.random() * (max - min) + min;
        }
if (pfr !== 0 && pfr % st.int === 0) {
st.y = this.pe % canvas.h
st.x = this.pe % canvas.w
if (this.pattern > 3) this.pattern = 0
 this.pe += 1
this.pattern += 1
if (this.pattern === 0) ob({
    speed: st.s, // スピード5
    color:"FFEB00",
    w: st.w,
    h: st.h,
    type: st.t,
    y: st.y,
    x: canvas.w,
    angle: dtr(135+random(-45,45)),
custom:{s:st.s,c:"FFEB00"},
})
const length = this.int === 6 ? 2 : 1
for (let i = 0;i<length;i++) { if (this.pattern === 1)ob({
    speed: st.s, // スピード5
    color:"00FF32",
    w: st.w,
    h: st.h,
    type: st.t,
    y: st.y,
    x: 0,
    angle: dtr(random(-45,45)),
    custom:{s:st.s,c:"00FF32"},
})
if (this.pattern === 2)ob({
    speed: st.s, // スピード5
    color:"0829FF",
    w: st.w,
    h: st.h,
    type: st.t,
    x: st.x,
    y: canvas.h,
    angle: dtr(-90+random(-45,45)),
custom:{s:st.s,c:"0829FF"},
})
if (this.pattern === 3)ob({
    speed: st.s, // スピード5
    color:"FF004A",
    w: st.w,
    h: st.h,
    type: st.t,
    x: st.x,
    y: 0,
    angle: dtr(random(-45,45)+90),
custom:{s:st.s,c:"FF004A"},
})
}}
if (st.int === 0) {
this.stop +=1
const a = this.stop
const p = players[0]
if (a === 1) {
this.ll.x=p.x
this.ll.y=p.y
}
if (a > 1)p.x= this.ll.x
if (a > 1)p.y= this.ll.y
if (a === 10) {
                bullets.forEach(e => {
                    // すでに停止させてある場合は上書きしない（記憶を維持）
                    e.speed = 0;
e.scolor("#FFFFFF")
e.angle = pf(e.x,e.y)
                });
            }
            // 【再始動タイミング】aが0になった「その1フレームだけ」で退避した速度に戻す
if (a === 128) {
                bullets.forEach(e => {
                        e.speed = e.custom.s * 0.7;
e.scolor(e.custom.c)
 // 用が済んだら消す
                });
this.stop = 0
            }
}

}}
functions.push(spell20)
