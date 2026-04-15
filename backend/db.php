<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Authorization, Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

function getUserIdFromRequest($default = 1) {
    if (isset($_GET['user_id'])) {
        return (int)$_GET['user_id'];
    }

    $input = json_decode(file_get_contents("php://input"));
    if ($input && isset($input->user_id)) {
        return (int)$input->user_id;
    }

    return $default;
}
?>
