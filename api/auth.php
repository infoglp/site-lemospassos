<?php
require __DIR__ . '/bootstrap.php';
request_method('POST');
$input = read_json_body(10_000);
$config = app_config();
$username = is_string($input['username'] ?? null) ? $input['username'] : '';
$password = is_string($input['password'] ?? null) ? $input['password'] : '';
start_admin_session();
$now = time();
$_SESSION['login_attempts'] = array_values(array_filter($_SESSION['login_attempts'] ?? [], static fn($attempt) => is_int($attempt) && $attempt > $now - 900));
if (count($_SESSION['login_attempts']) >= 10) send_json(['error' => 'Muitas tentativas. Aguarde 15 minutos e tente novamente.'], 429);
if (!hash_equals((string)$config['admin_user'], $username) || !password_verify($password, (string)$config['admin_password_hash'])) {
    $_SESSION['login_attempts'][] = $now;
    usleep(350000);
    send_json(['error' => 'Usuário ou senha inválidos.'], 401);
}
unset($_SESSION['login_attempts']);
session_regenerate_id(true);
$_SESSION['admin_authenticated'] = true;
$_SESSION['csrf_token'] = bin2hex(random_bytes(32));
send_json(['ok' => true, 'csrfToken' => $_SESSION['csrf_token']]);
