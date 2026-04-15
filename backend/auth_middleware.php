<?php
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

function get_jwt_secret() {
    return $_ENV['JWT_SECRET_KEY'];
}

function get_user_from_token() {
    $authHeader = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $authHeader = trim($_SERVER['REDIRECT_HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $authHeader = trim($requestHeaders['Authorization']);
        }
    }

    if ($authHeader && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $jwt = $matches[1];
        try {
            $decoded = JWT::decode($jwt, new Key(get_jwt_secret(), 'HS256'));
            return (int) $decoded->user_id;
        } catch (Exception $e) {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid or expired token"]);
            exit;
        }
    }
    
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Authorization header missing"]);
    exit;
}
?>
