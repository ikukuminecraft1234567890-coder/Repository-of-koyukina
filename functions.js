// functions.js — シーズン共通のスペル配列とシーズン設定
// bossOld.js(シーズン-1) / boss0.js(シーズン0) / boss.js(シーズン1) / boss2.js(シーズン2) のいずれか一つが、ここの functions に push する。
// どのモジュールからも functions はここから import する。

export const functions = [];

export const SEASON_KEY = "season";

/** 保存されているシーズン番号(-1 / 0 / 1 / 2)。未設定なら1 */
export function getSeason() {
    try {
        const v = localStorage.getItem(SEASON_KEY);
        return v === "-1" ? -1 : v === "0" ? 0 : v === "2" ? 2 : 1;
    } catch (e) {
        return 1;
    }
}

export function setSeason(n) {
    localStorage.setItem(SEASON_KEY, n === -1 ? "-1" : n === 0 ? "0" : n === 2 ? "2" : "1");
}

/** クリアデータ(localStorage)のキー。シーズンごとに分ける */
export function sdKey() {
    const n = getSeason();
    return n === -1 ? "sd-1" : n === 0 ? "sd0" : n === 2 ? "sd2" : "sd";
}

/** 現在のシーズンの bossファイルのパス候補(先頭から順に試す) */
export function bossModulePaths() {
    const n = getSeason();
    if (n === -1) return ["./bossOld.js"];
    if (n === 0) return ["./boss0.js", "./bossO.js"]; // 数字の0 / 英字のO どちらの表記でも可
    return [n === 2 ? "./boss2.js" : "./boss.js"];
}

/** 互換用: 先頭候補のパス */
export function bossModulePath() {
    return bossModulePaths()[0];
}


/** 機体(キャラ)選択。ローカルストレージに保存して次回以降も読み出す */
export const CHARA_KEY = "chara";

/** key は chars.js の Player が name で判定する値 */
export const CHARAS = [
        { key: "aya",   label: "射命丸文",       type: "戦場カメラマン型" },
    { key: "yuugi",   label: "星熊勇儀",       type: "怪力型" },
    { key: "kagiyama", label: "鍵山雛",         type: "特殊型" },
    { key: "kurapi",  label: "クラウンピース", type: "スロースタート型" },
    { key: "kirisame", label: "霧雨魔理沙",     type: "パワー型" },
    { key: "hakurei", label: "博麗霊夢",       type: "通常型" },
].reverse();

/** 保存されている機体。未設定・不正値なら勇儀(従来の既定) */
export function getChara() {
    try {
        const v = localStorage.getItem(CHARA_KEY);
        return CHARAS.some((c) => c.key === v) ? v : "hakurei";
    } catch (e) {
        return "hakurei";
    }
}

export function setChara(key) {
    if (!CHARAS.some((c) => c.key === key)) return;
    try { localStorage.setItem(CHARA_KEY, key); } catch (e) {}
}
