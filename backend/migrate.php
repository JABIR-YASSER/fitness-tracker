<?php
$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$result = $conn->query("SHOW COLUMNS FROM `users` LIKE 'weight'");
if ($result->num_rows == 0) {
    $conn->query("ALTER TABLE users ADD weight FLOAT NULL, ADD height FLOAT NULL, ADD daily_calorie_goal INT DEFAULT 2000;");
    echo "Migration completed.\n";
} else {
    echo "Columns already exist.\n";
}
?>
