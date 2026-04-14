<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

include 'db.php';

$id = (int)($_GET['id'] ?? 0);
$userId = getUserIdFromRequest();
$stmt = $conn->prepare("DELETE FROM workouts WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $id, $userId);

if ($stmt->execute()) {
    echo json_encode(["status" => "deleted"]);
} else {
    echo json_encode(["status" => "error"]);
}

$stmt->close();
?>
