import { 
    canvas, ctx, players, bullets,
    updateFrame, frame, Half, isTouching, entitys
,internal,gps,pbpush} from './sys.js';
import {Bullet} from "./bc.js"
import {Entity} from "./chars.js"
const asset = "./assets/pallets/";
const Maps = new Map()
export class PlayerBullet extends Bullet {
    constructor({
color="red",angle=dtr(90),damage=10,speed=7.5,x=0,y=0,rd=1.0,type="amulet",size=8
}) {
const p = players[0]
const X = p.x+x;
const Y = p.y+y;

super({
            x: X, y: Y, angle: angle, speed: speed, color: color,size:size,
            type: type, deleteFrame: Infinity, rotateE: 0, rotateF: Infinity,
            rotate: [], slowF: 0, slowE: 1, fastF: Infinity, fastE: 1,
            highEx: false, slowEx: false, AcF: Infinity, AcA: 0,
        push: false, custom: [], seta: [],
            rd: 1,active:true
})
this.damage = damage;
pbpush(this)
    }
drawI(ctx) {
    const key = this.color + this.type;
    let cached = Maps.get(key);
    if (!cached || cached === "loading") {
        if (!cached) {
            Maps.set(key, "loading");
            const baseImg = new Image();
            baseImg.src = asset + this.color + this.type + ".png";
            baseImg.onload = () => {
                const c = document.createElement("canvas");
                c.width = baseImg.width;
                c.height = baseImg.height;
                c.getContext("2d").drawImage(baseImg, 0, 0);
                Maps.set(key, c); // ← ちゃんとMapsに保存
            };
        }
        return; // ロード中は今フレームは描画スキップ
    }

    // ここでようやく実際に描画する
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    ctx.drawImage(cached, -this.w / 2, -this.h / 2, this.w, this.h);
    ctx.restore();
}
}