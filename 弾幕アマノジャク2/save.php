<?php
// save.php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['filename']) || !isset($data['content'])) {
        http_response_code(400);
        echo "Error: Missing data";
        exit;
    }

    $filename = $data['filename'];
    $content = $data['content'];

    // 1. 保存先フォルダの定義
    $targetDir = 'logs/';
    $safeFilename = basename($filename);
    $filePath = $targetDir . $safeFilename;

    // 2. ★変更点：ファイルが存在するか確認
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo "Error: File not found - " . $safeFilename;
        exit;
    }

    // 3. 書き込み実行
    if (file_put_contents($filePath, $content) !== false) {
        echo "OK: Updated " . $filePath;
    } else {
        http_response_code(500);
        echo "Error: Failed to write file";
    }
} else {
    http_response_code(405);
    echo "Error: Only POST allowed";
}
?>

