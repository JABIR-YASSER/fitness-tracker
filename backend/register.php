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
$password = password_hash($data->password, PASSWORD_DEFAULT);

$checkStmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$checkStmt->bind_param("s", $email);
$checkStmt->execute();
$existingUser = $checkStmt->get_result()->fetch_assoc();
$checkStmt->close();

if ($existingUser) {
    echo json_encode(["status" => "exists"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO users (email, password) VALUES (?, ?)");
$stmt->bind_param("ss", $email, $password);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;
    $payload = [
        'iss' => 'fitness_tracker',
        'aud' => 'fitness_tracker_client',
        'iat' => time(),
        'exp' => time() + (86400 * 7),
        'user_id' => $userId
    ];
    $jwt = Firebase\JWT\JWT::encode($payload, get_jwt_secret(), 'HS256');
    echo json_encode(["status" => "registered", "token" => $jwt, "userId" => $userId]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
?>
