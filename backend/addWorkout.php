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

if (!$data || empty($data->exercise) || empty($data->date)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required workout fields."]);
    exit;
}

$exercise = trim($data->exercise);
$duration = (int)$data->duration;
$calories = (int)$data->calories;
$date = $data->date;
$userId = isset($data->user_id) ? (int)$data->user_id : 1;

$stmt = $conn->prepare("INSERT INTO workouts (exercise, duration, calories, date, user_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("siisi", $exercise, $duration, $calories, $date, $userId);

if ($stmt->execute()) {
    $workout = [
        "id" => $stmt->insert_id,
        "exercise" => $exercise,
        "duration" => $duration,
        "calories" => $calories,
        "date" => $date,
        "user_id" => $userId,
    ];

    echo json_encode(["status" => "success", "id" => $stmt->insert_id, "workout" => $workout]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
?>
