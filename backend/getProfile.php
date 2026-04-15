<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';
require_once 'auth_middleware.php';

$userId = get_user_from_token();

$stmt = $conn->prepare("SELECT email, weight, height, daily_calorie_goal, xp_points FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();
$profile = $result->fetch_assoc();

if ($profile) {
    echo json_encode(["status" => "success", "profile" => $profile]);
} else {
    http_response_code(404);
    echo json_encode(["status" => "error", "message" => "User not found"]);
}
$stmt->close();
?>
