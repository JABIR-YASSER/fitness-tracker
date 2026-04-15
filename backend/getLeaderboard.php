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

// Secure endpoint
get_user_from_token();

$stmt = $conn->prepare("SELECT id, email, xp_points FROM users ORDER BY xp_points DESC LIMIT 10");
$stmt->execute();
$result = $stmt->get_result();

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
    $parts = explode('@', $row['email']);
    if (count($parts) === 2) {
        $userPart = $parts[0];
        if (strlen($userPart) > 3) {
            $userPart = substr($userPart, 0, 3) . '***';
        } else {
            $userPart = substr($userPart, 0, 1) . '***';
        }
        $row['email'] = $userPart . '@' . $parts[1];
    }
    
    // ensure xp_points is not null
    $row['xp_points'] = $row['xp_points'] ?? 0;
    
    $leaderboard[] = $row;
}
$stmt->close();

echo json_encode(["status" => "success", "leaderboard" => $leaderboard]);
?>
