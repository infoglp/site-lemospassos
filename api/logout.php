<?php
require __DIR__ . '/bootstrap.php';
request_method('POST');
require_admin();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', ['expires' => time() - 42000, 'path' => $params['path'], 'secure' => $params['secure'], 'httponly' => true, 'samesite' => 'Strict']);
}
session_destroy();
send_json(['ok' => true]);
