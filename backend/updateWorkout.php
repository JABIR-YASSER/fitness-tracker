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
$rawData = file_get_contents("php://input");
$data = json_decode($rawData);

if (json_last_error() !== JSON_ERROR_NONE || !$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Format JSON invalide. Envoyé: " . $rawData]);
    exit;
}

if (!isset($data->id) || !isset($data->exercise_id) || !isset($data->date)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Clés incomplètes : id, exercise_id, et date sont obligatoires."]);
    exit;
}

$id = (int)$data->id;
$exerciseId = (int)$data->exercise_id;
$duration = isset($data->duration) ? (int)$data->duration : 0;
$date = $data->date;
$sets = isset($data->sets) && $data->sets !== "" ? (int)$data->sets : null;
$reps = isset($data->reps) && $data->reps !== "" ? (int)$data->reps : null;
$weightLifted = isset($data->weight_lifted) && $data->weight_lifted !== "" ? (float)$data->weight_lifted : null;

// Verify ownership
$stmtC = $conn->prepare("SELECT id FROM workouts WHERE id = ? AND user_id = ?");
$stmtC->bind_param("ii", $id, $userId);
$stmtC->execute();
$resC = $stmtC->get_result();
if ($resC->num_rows == 0) {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized or not found"]);
    exit;
}
$stmtC->close();

// Compute Calories
$stmtMet = $conn->prepare("SELECT met_value FROM exercises_catalog WHERE id = ?");
$stmtMet->bind_param("i", $exerciseId);
$stmtMet->execute();
$resultMet = $stmtMet->get_result();
$exData = $resultMet->fetch_assoc();
$stmtMet->close();
$met = $exData ? $exData['met_value'] : 5.0;

$stmtW = $conn->prepare("SELECT weight FROM users WHERE id = ?");
$stmtW->bind_param("i", $userId);
$stmtW->execute();
$resW = $stmtW->get_result();
$userProfile = $resW->fetch_assoc();
$stmtW->close();
$weight = isset($userProfile['weight']) && $userProfile['weight'] > 0 ? $userProfile['weight'] : 70;
$calories = $duration > 0 ? round($met * $weight * ($duration / 60)) : 0;

$stmt = $conn->prepare("UPDATE workouts SET exercise_id = ?, duration = ?, calories = ?, date = ?, sets = ?, reps = ?, weight_lifted = ? WHERE id = ?");
$stmt->bind_param("iiisiddi", $exerciseId, $duration, $calories, $date, $sets, $reps, $weightLifted, $id);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "calories" => $calories]);
} else {
    echo json_encode(["status" => "error"]);
}
$stmt->close();
?>
