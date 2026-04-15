<?php
$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");
$result = $conn->query("SHOW COLUMNS FROM `users` LIKE 'xp_points'");
if ($result->num_rows == 0) {
    $conn->query("ALTER TABLE users ADD xp_points INT DEFAULT 0;");
    echo "Added xp_points.\n";
} else {
    echo "xp_points exists.\n";
}
?>
