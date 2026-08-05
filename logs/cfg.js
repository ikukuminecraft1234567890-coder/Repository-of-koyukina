// true: オブジェクトプール方式（プリアロケート＋使い回し）
// false: 通常方式（new Bullet を都度生成、削除はsplice/filter）
export const cfg = true
//false:これまで通り
// true:    アニメーション速度が半分になるが、処理がめちゃくちゃ軽量化される。仕組みはめちゃくちゃゴリ押しで、Updateを2フレームごとに呼ぶwwwwww一応しっかり2倍動かしてるので位置にズレはない
export const superOptimal = false