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

$stmt = $conn->prepare("SELECT exercise, duration, calories, date FROM workouts WHERE user_id = ? ORDER BY date DESC LIMIT 5");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$workouts = [];
while ($row = $result->fetch_assoc()) {
    $workouts[] = $row;
}
$stmt->close();

if (count($workouts) === 0) {
    echo json_encode(["status" => "success", "suggestion" => "Commencez par ajouter votre premier entraînement pour que l'IA puisse vous conseiller !"]);
    exit;
}

// Mocked realistic response:
$lastExercise = strtolower($workouts[0]['exercise']);
$suggestion = "Excellent travail sur '$lastExercise' ! Pour votre prochaine séance, essayez de diversifier : pourquoi pas un peu de cardio ou cibler un autre groupe musculaire pour optimiser la récupération ?";

echo json_encode(["status" => "success", "suggestion" => $suggestion]);
?>
