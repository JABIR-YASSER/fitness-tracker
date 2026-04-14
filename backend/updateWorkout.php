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

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->id) || empty($data->exercise) || empty($data->date)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required workout fields."]);
    exit;
}

$id = (int)$data->id;
$exercise = trim($data->exercise);
$duration = (int)$data->duration;
$calories = (int)$data->calories;
$date = $data->date;
$userId = isset($data->user_id) ? (int)$data->user_id : 1;

$stmt = $conn->prepare("UPDATE workouts SET exercise = ?, duration = ?, calories = ?, date = ? WHERE id = ? AND user_id = ?");
$stmt->bind_param("siisii", $exercise, $duration, $calories, $date, $id, $userId);

if ($stmt->execute()) {
    echo json_encode(["status" => "updated"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
?>
