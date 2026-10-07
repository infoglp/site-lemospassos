<?php
require __DIR__ . '/bootstrap.php';
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    try {
        $row = db()->query('SELECT content_json FROM site_content WHERE id = 1')->fetch();
    } catch (Throwable $error) {
        error_log('CMS content read failed: ' . $error->getMessage());
        send_json(['error' => 'Não foi possível ler o conteúdo do CMS. Confira a conexão e a tabela site_content existente.'], 503);
    }
    if (!$row) send_json(['content' => null]);
    $content = json_decode($row['content_json'], true);
    if (!is_array($content)) send_json(['error' => 'Conteúdo salvo inválido.'], 500);
    send_json(['content' => $content]);
}
request_method('PUT');
require_admin();
$data = valid_content(read_json_body());
$json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
try {
    $statement = db()->prepare('INSERT INTO site_content (id, content_json) VALUES (1, ?) ON DUPLICATE KEY UPDATE content_json = VALUES(content_json)');
    $statement->execute([$json]);
} catch (Throwable $error) {
    error_log('CMS content save failed: ' . $error->getMessage());
    send_json(['error' => 'Não foi possível gravar o conteúdo. Confira a configuração e a tabela site_content.'], 503);
}
send_json(['ok' => true]);
