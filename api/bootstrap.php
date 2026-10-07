<?php
declare(strict_types=1);

function send_json(array $body, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function request_method(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== $method) {
        header('Allow: ' . $method);
        send_json(['error' => 'Método não permitido.'], 405);
    }
}

function app_config(): array
{
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        send_json(['error' => 'Backend ainda não configurado.'], 503);
    }
    $config = require $path;
    foreach (['db_host', 'db_name', 'db_user', 'db_password', 'admin_user', 'admin_password_hash'] as $key) {
        if (!is_array($config) || !isset($config[$key]) || $config[$key] === '' || preg_match('/YOUR_HOSTINGER|SET_THIS_IN_HOSTINGER|REPLACE_WITH/i', (string)$config[$key])) {
            send_json(['error' => 'Configuração incompleta no servidor.'], 503);
        }
    }
    return $config;
}

function db(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) return $pdo;
    $config = app_config();
    try {
        $pdo = new PDO(
            'mysql:host=' . $config['db_host'] . ';dbname=' . $config['db_name'] . ';charset=utf8mb4',
            $config['db_user'],
            $config['db_password'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false]
        );
    } catch (Throwable $error) {
        error_log('CMS database connection failed: ' . $error->getMessage());
        send_json(['error' => 'Não foi possível conectar ao banco de dados.'], 503);
    }
    return $pdo;
}

function start_admin_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off', 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
}

function require_admin(): void
{
    start_admin_session();
    if (empty($_SESSION['admin_authenticated'])) send_json(['error' => 'Sessão encerrada. Entre novamente.'], 401);
    $origin = parse_url($_SERVER['HTTP_ORIGIN'] ?? '', PHP_URL_HOST);
    $host = strtolower(preg_replace('/:\\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
    if ($origin !== null && strtolower((string)$origin) !== $host) send_json(['error' => 'Origem da solicitação não autorizada.'], 403);
    $token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
    if (!is_string($token) || empty($_SESSION['csrf_token']) || !hash_equals($_SESSION['csrf_token'], $token)) {
        send_json(['error' => 'Validação de segurança falhou. Atualize a página e tente novamente.'], 403);
    }
}

function read_json_body(int $limit = 2_000_000): array
{
    $raw = file_get_contents('php://input', false, null, 0, $limit + 1);
    if ($raw === false || strlen($raw) > $limit) send_json(['error' => 'Conteúdo excede o limite permitido.'], 413);
    $data = json_decode($raw, true);
    if (!is_array($data)) send_json(['error' => 'Requisição inválida.'], 400);
    return $data;
}

function valid_content(array $data): array
{
    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false || strlen($json) > 1_500_000) send_json(['error' => 'O conteúdo está muito grande. Reduza os anexos e tente novamente.'], 413);
    if (!isset($data['metrics'], $data['partners'], $data['news']) || !is_array($data['metrics']) || !is_array($data['partners']) || !is_array($data['news'])) {
        send_json(['error' => 'Formato de conteúdo inválido.'], 422);
    }
    foreach (['meals', 'employees', 'restaurants'] as $metric) {
        if (!isset($data['metrics'][$metric]) || !is_numeric($data['metrics'][$metric]) || (float)$data['metrics'][$metric] < 0 || (float)$data['metrics'][$metric] > 1_000_000_000) {
            send_json(['error' => 'Indicadores inválidos.'], 422);
        }
    }
    return $data;
}
