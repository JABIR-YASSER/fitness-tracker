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

$stmt = $conn->prepare("
    SELECT w.id, w.duration, w.calories, w.date, w.exercise_id, w.sets, w.reps, w.weight_lifted, e.name as exercise, e.type
    FROM workouts w
    JOIN exercises_catalog e ON w.exercise_id = e.id
    WHERE w.user_id = ?
    ORDER BY w.date DESC
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$workouts = [];
while ($row = $result->fetch_assoc()) {
    $workouts[] = $row;
}
$stmt->close();

echo json_encode($workouts);
?>
