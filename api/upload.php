<?php
require __DIR__ . '/bootstrap.php';
request_method('POST');
require_admin();
if (!isset($_FILES['image']) || !is_uploaded_file($_FILES['image']['tmp_name'])) send_json(['error' => 'Selecione uma imagem válida.'], 400);
$file = $_FILES['image'];
if ($file['error'] !== UPLOAD_ERR_OK) send_json(['error' => 'Falha no recebimento do arquivo.'], 400);
if ($file['size'] < 1 || $file['size'] > 8 * 1024 * 1024) send_json(['error' => 'Cada imagem deve ter até 8 MB.'], 413);
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
$extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
if (!isset($extensions[$mime]) || @getimagesize($file['tmp_name']) === false) send_json(['error' => 'Formato não permitido. Use JPG, PNG, WebP ou GIF.'], 415);
$directory = __DIR__ . '/uploads';
if (!is_dir($directory) || !is_writable($directory)) send_json(['error' => 'Pasta api/uploads sem permissão de gravação.'], 503);
$name = bin2hex(random_bytes(20)) . '.' . $extensions[$mime];
if (!move_uploaded_file($file['tmp_name'], $directory . '/' . $name)) send_json(['error' => 'Não foi possível salvar a imagem.'], 500);
send_json(['url' => './api/uploads/' . $name]);
