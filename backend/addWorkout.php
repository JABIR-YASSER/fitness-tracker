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

if (!$data || !isset($data->exercise_id) || !isset($data->date)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid payload"]);
    exit;
}

$exerciseId = (int)$data->exercise_id;
$duration = isset($data->duration) ? (int)$data->duration : 0;
$date = $data->date;
$sets = isset($data->sets) && $data->sets !== "" ? (int)$data->sets : null;
$reps = isset($data->reps) && $data->reps !== "" ? (int)$data->reps : null;
$weightLifted = isset($data->weight_lifted) && $data->weight_lifted !== "" ? (float)$data->weight_lifted : null;

// Retrieve MET value
$stmtMet = $conn->prepare("SELECT met_value, name, type FROM exercises_catalog WHERE id = ?");
$stmtMet->bind_param("i", $exerciseId);
$stmtMet->execute();
$resultMet = $stmtMet->get_result();
$exData = $resultMet->fetch_assoc();
$stmtMet->close();

if (!$exData) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid exercise_id"]);
    exit;
}
$met = $exData['met_value'];
$exerciseName = $exData['name'];
$exerciseType = $exData['type'];

// Retrieve User Weight
$stmtW = $conn->prepare("SELECT weight, xp_points FROM users WHERE id = ?");
$stmtW->bind_param("i", $userId);
$stmtW->execute();
$resW = $stmtW->get_result();
$userProfile = $resW->fetch_assoc();
$stmtW->close();

$weight = isset($userProfile['weight']) && $userProfile['weight'] > 0 ? $userProfile['weight'] : 70; // fallback 70kg
$calories = $duration > 0 ? round($met * $weight * ($duration / 60)) : 0;

$stmt = $conn->prepare("INSERT INTO workouts (user_id, exercise_id, duration, calories, date, sets, reps, weight_lifted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("iiiisidd", $userId, $exerciseId, $duration, $calories, $date, $sets, $reps, $weightLifted);

if ($stmt->execute()) {
    $insertedId = $stmt->insert_id;
    
    // Gamification XP
    $xpEarned = $exerciseType === 'Strength' ? 15 : 10; 
    $newXp = ($userProfile['xp_points'] ?? 0) + $xpEarned;
    $stmtXp = $conn->prepare("UPDATE users SET xp_points = ? WHERE id = ?");
    $stmtXp->bind_param("ii", $newXp, $userId);
    $stmtXp->execute();
    $stmtXp->close();

    $workout = [
        "id" => $insertedId,
        "exercise_id" => $exerciseId,
        "exercise" => $exerciseName,
        "type" => $exerciseType,
        "duration" => $duration,
        "calories" => $calories,
        "date" => $date,
        "sets" => $sets,
        "reps" => $reps,
        "weight_lifted" => $weightLifted
    ];

    echo json_encode(["status" => "success", "workout" => $workout, "xp_earned" => $xpEarned]);
} else {
    echo json_encode(["status" => "error", "message" => "Could not add workout"]);
}
$stmt->close();
?>
