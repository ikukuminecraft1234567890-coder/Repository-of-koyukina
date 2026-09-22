// rush.js — 弾幕ラッシュ（複数スペルカードを連続で遊ぶモード）の管理
// ・ラッシュの保存/読込（localStorage）
// ・.txtへのインポート/エクスポート
// ・ラッシュの実行（既存のチャレンジ機構 stat.isChallenge を流用しつつ、
//   スペルごとの制限時間オーバーライドとラッシュ専用のクリア/ノーミス文言に対応）

import { functions } from "./boss.js";
import { start } from "./sys.js";
import { stat, clearAllUI } from "./engine.js";

const RUSH_STORAGE_KEY = "rushList";
const RUSH_CLEAR_KEY = "rushClear";

// --- 保存済みラッシュ一覧の読み書き ---

export function loadRushes() {
    try {
        const raw = localStorage.getItem(RUSH_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error("ラッシュ読込エラー:", e);
        return [];
    }
}

export function saveRushes(list) {
    localStorage.setItem(RUSH_STORAGE_KEY, JSON.stringify(list));
}

export function addRush(rush) {
    const list = loadRushes();
    // 同じidがあれば上書き、なければ追加
    const idx = list.findIndex(r => r.id === rush.id);
    if (idx >= 0) list[idx] = rush;
    else list.push(rush);
    saveRushes(list);
    return list;
}

export function deleteRush(id) {
    const list = loadRushes().filter(r => r.id !== id);
    saveRushes(list);
    return list;
}

// --- クリア状況（チェックマーク用）の読み書き ---

export function getRushClearInfo(id) {
    try {
        const raw = localStorage.getItem(RUSH_CLEAR_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        const c = parsed[id];
        if (!c) return { clear: false, noMiss: false };
        return { clear: !!c.clear, noMiss: !!c.noMiss };
    } catch (e) {
        console.error("ラッシュクリア状況読込エラー:", e);
        return { clear: false, noMiss: false };
    }
}

export function setRushClearInfo(id, clear, noMiss) {
    let parsed = {};
    try {
        const raw = localStorage.getItem(RUSH_CLEAR_KEY);
        parsed = raw ? JSON.parse(raw) : {};
    } catch (e) {
        parsed = {};
    }
    const prev = parsed[id] || { clear: false, noMiss: false };
    parsed[id] = {
        clear: prev.clear || clear,
        noMiss: prev.noMiss || noMiss
    };
    localStorage.setItem(RUSH_CLEAR_KEY, JSON.stringify(parsed));
}

// --- .txt インポート/エクスポート ---

// ラッシュ定義オブジェクトの形:
// {
//   id: string,
//   name: string,
//   desc: string,
//   dif: "e"|"n"|"h"|"l"|"p",
//   misses: number,          // 許容ミス数（合計）
//   ct: string,               // クリアテキスト
//   nm: string,               // ノーミスクリアテキスト
//   entries: [ { spell: number(1始まり), time: number|null } ]
// }

export function exportRushToText(rush) {
    return JSON.stringify(rush, null, 2);
}

export function downloadRushAsTxt(rush) {
    const text = exportRushToText(rush);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const safeName = (rush.name || "rush").replace(/[\\/:*?"<>|]/g, "_");
    a.download = `${safeName}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export function parseRushFromText(text) {
    let obj;
    try {
        obj = JSON.parse(text);
    } catch (e) {
        throw new Error("ファイルの中身がJSONとして読み取れませんでした。");
    }
    if (!obj || typeof obj !== "object") throw new Error("不正なラッシュデータです。");
    if (!Array.isArray(obj.entries) || obj.entries.length === 0) {
        throw new Error("弾幕が1つも含まれていません。");
    }
    // 最低限の補完
    obj.id = obj.id || ("rush_" + Date.now() + "_" + Math.floor(Math.random() * 10000));
    obj.name = obj.name || "無名のラッシュ";
    obj.desc = obj.desc || "";
    obj.dif = obj.dif || "n";
    obj.misses = Number.isFinite(obj.misses) ? obj.misses : 5;
    obj.ct = obj.ct || "";
    obj.nm = obj.nm || "";
    obj.entries = obj.entries.map(e => ({
        spell: Number(e.spell),
        time: (e.time === null || e.time === undefined || e.time === "") ? null : Number(e.time)
    })).filter(e => Number.isFinite(e.spell) && e.spell >= 1);
    if (obj.entries.length === 0) throw new Error("有効な弾幕が1つも含まれていません。");
    return obj;
}

export function importRushFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const rush = parseRushFromText(String(reader.result));
                resolve(rush);
            } catch (e) {
                reject(e);
            }
        };
        reader.onerror = () => reject(new Error("ファイルの読み込みに失敗しました。"));
        reader.readAsText(file, "utf-8");
    });
}

// --- ラッシュの実行 ---

/**
 * ラッシュを開始する。既存のチャレンジ機構(stat.isChallenge / stat.numbers)を
 * そのまま利用しつつ、スペルごとの制限時間オーバーライド(stat.timeQueue)と
 * ラッシュ専用の文言(stat.ctxt / stat.ntxt)、クリア状況保存用のstat.rushIdを設定する。
 * 実際の「次のスペルへ進む」処理・クリア判定・保存は engine.js 側（nbpush等）が担当する。
 */
export function startRush(rush) {
    clearAllUI();

    const entries = rush.entries.filter(e => {
        const idx0 = e.spell - 1;
        return idx0 >= 0 && idx0 < functions.length && functions[idx0];
    });

    if (entries.length === 0) {
        alert("このラッシュには有効なスペルカードがありません。");
        return;
    }

    stat.isChallenge = true;
    stat.maxz = rush.misses;
    stat.nowzanki = rush.misses;
    stat.ctxt = rush.ct;
    stat.ntxt = rush.nm;
    stat.numbers = entries.map(e => e.spell);       // 1始まりのスペル番号配列（既存機構互換）
    stat.timeQueue = entries.map(e => e.time);       // numbersと対になる時間オーバーライド配列
    stat.nownumber = 0;
    stat.timeOverride = entries[0].time;
    stat.rushId = rush.id;

    start(entries[0].spell - 1);
}
