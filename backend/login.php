<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';
require_once 'auth_middleware.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->email) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email and password are required."]);
    exit;
}

$email = trim($data->email);
$password = $data->password;

$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if ($user && password_verify($password, $user['password'])) {
    $payload = [
        'iss' => 'fitness_tracker',
        'aud' => 'fitness_tracker_client',
        'iat' => time(),
        'exp' => time() + (86400 * 7), // 7 days
        'user_id' => $user['id']
    ];
    $jwt = Firebase\JWT\JWT::encode($payload, get_jwt_secret(), 'HS256');
    echo json_encode(["status" => "success", "userId" => $user['id'], "token" => $jwt]);
} else {
    http_response_code(401);
    echo json_encode(["status" => "error"]);
}
?>
