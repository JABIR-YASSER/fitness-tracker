<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization, Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';
require_once 'auth_middleware.php';

$userId = get_user_from_token();
$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid payload"]);
    exit;
}

$weight = isset($data->weight) && $data->weight !== '' ? (float)$data->weight : null;
$height = isset($data->height) && $data->height !== '' ? (float)$data->height : null;
$dailyCalorieGoal = isset($data->daily_calorie_goal) && $data->daily_calorie_goal !== '' ? (int)$data->daily_calorie_goal : 2000;

$stmt = $conn->prepare("UPDATE users SET weight = ?, height = ?, daily_calorie_goal = ? WHERE id = ?");
$stmt->bind_param("ddii", $weight, $height, $dailyCalorieGoal, $userId);

if ($stmt->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
?>
