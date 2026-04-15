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

$routines = [];

$stmt = $conn->prepare("
    SELECT r.id as routine_id, r.name as routine_name, re.exercise_id, re.default_sets, re.default_reps, e.name as exercise_name, e.type
    FROM routines r
    JOIN routine_exercises re ON r.id = re.routine_id
    JOIN exercises_catalog e ON re.exercise_id = e.id
    WHERE r.user_id IS NULL OR r.user_id = ?
    ORDER BY r.id ASC
");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$structured = [];
while ($row = $result->fetch_assoc()) {
    $rId = $row['routine_id'];
    if (!isset($structured[$rId])) {
        $structured[$rId] = [
            "id" => $rId,
            "name" => $row['routine_name'],
            "exercises" => []
        ];
    }
    $structured[$rId]['exercises'][] = [
        "exercise_id" => $row['exercise_id'],
        "exercise_name" => $row['exercise_name'],
        "type" => $row['type'],
        "default_sets" => $row['default_sets'],
        "default_reps" => $row['default_reps']
    ];
}

$stmt->close();

echo json_encode(["status" => "success", "routines" => array_values($structured)]);
?>
