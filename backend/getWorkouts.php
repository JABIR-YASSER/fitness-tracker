<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
include 'db.php';

$userId = getUserIdFromRequest();
$stmt = $conn->prepare("SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC, id DESC");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

$stmt->close();

echo json_encode($data);
?>
