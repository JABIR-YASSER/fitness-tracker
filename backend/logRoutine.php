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
$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->routine_id) || !isset($data->date)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "routine_id and date required"]);
    exit;
}

$routineId = (int)$data->routine_id;
$date = $data->date;

// Fetch exercises from routine
$stmtEx = $conn->prepare("
    SELECT re.exercise_id, re.default_sets as sets, re.default_reps as reps, e.met_value, e.type
    FROM routine_exercises re
    JOIN exercises_catalog e ON re.exercise_id = e.id
    WHERE re.routine_id = ?
");
$stmtEx->bind_param("i", $routineId);
$stmtEx->execute();
$exResult = $stmtEx->get_result();

$exercisesToLog = [];
while ($row = $exResult->fetch_assoc()) {
    $exercisesToLog[] = $row;
}
$stmtEx->close();

if (empty($exercisesToLog)) {
    echo json_encode(["status" => "error", "message" => "Routine empty or not found"]);
    exit;
}

// Prepare inserts
$stmtIns = $conn->prepare("INSERT INTO workouts (user_id, exercise_id, duration, calories, date, sets, reps, weight_lifted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

$totalXpEarned = 0;

$conn->begin_transaction();
try {
    foreach ($exercisesToLog as $ex) {
        $eId = $ex['exercise_id'];
        $dur = 0;
        $cal = 0; // Strength routines usually
        $sets = $ex['sets'];
        $reps = $ex['reps'];
        $weight = 0; // Baseline to fill out later
        
        $stmtIns->bind_param("iiiisidd", $userId, $eId, $dur, $cal, $date, $sets, $reps, $weight);
        $stmtIns->execute();
        
        $totalXpEarned += ($ex['type'] === 'Strength' ? 15 : 10);
    }
    
    // Add XP
    $conn->query("UPDATE users SET xp_points = COALESCE(xp_points, 0) + $totalXpEarned WHERE id = $userId");
    
    $conn->commit();
    echo json_encode(["status" => "success", "xp_earned" => $totalXpEarned]);
} catch (Exception $e) {
    $conn->rollback();
    echo json_encode(["status" => "error", "message" => "Insert failed"]);
}
$stmtIns->close();
?>
