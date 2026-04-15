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

// Verify token to protect the endpoint
get_user_from_token();

$stmt = $conn->prepare("SELECT id, name, target_muscle, difficulty, met_value, type FROM exercises_catalog ORDER BY name ASC");
$stmt->execute();
$result = $stmt->get_result();

$exercises = [];
while ($row = $result->fetch_assoc()) {
    $exercises[] = $row;
}
$stmt->close();

echo json_encode(["status" => "success", "exercises" => $exercises]);
?>
