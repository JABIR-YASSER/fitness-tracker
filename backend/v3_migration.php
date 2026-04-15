<?php
$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");

// 1. Alter exercises_catalog
$checkType = $conn->query("SHOW COLUMNS FROM exercises_catalog LIKE 'type'");
if ($checkType->num_rows == 0) {
    if ($conn->query("ALTER TABLE exercises_catalog ADD COLUMN type ENUM('Cardio', 'Strength') DEFAULT 'Cardio'")) {
        echo "Added 'type' to exercises_catalog.\n";
    }
}

// Update specific exercises to Strength
$conn->query("UPDATE exercises_catalog SET type = 'Strength' WHERE name LIKE '%Weight%' OR name LIKE '%Bench%' OR name LIKE '%Squat%' OR name LIKE '%Rowing%' OR name LIKE '%Calisthenics%'");

// 2. Alter workouts
$checkSets = $conn->query("SHOW COLUMNS FROM workouts LIKE 'sets'");
if ($checkSets->num_rows == 0) {
    if ($conn->query("ALTER TABLE workouts ADD COLUMN sets INT NULL, ADD COLUMN reps INT NULL, ADD COLUMN weight_lifted FLOAT NULL")) {
        echo "Added 'sets', 'reps', 'weight_lifted' to workouts.\n";
    }
}

// 3. Create routines tables
$conn->query("CREATE TABLE IF NOT EXISTS routines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    name VARCHAR(255) NOT NULL
)");

$conn->query("CREATE TABLE IF NOT EXISTS routine_exercises (
    routine_id INT NOT NULL,
    exercise_id INT NOT NULL,
    default_sets INT NOT NULL,
    default_reps INT NOT NULL,
    FOREIGN KEY (routine_id) REFERENCES routines(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises_catalog(id) ON DELETE CASCADE
)");

// 4. Seed Routines
$conn->query("INSERT IGNORE INTO routines (id, user_id, name) VALUES (1, NULL, 'Push Day'), (2, NULL, 'Pull Day')");
// Push exercises
// Find Bench Press
$res = $conn->query("SELECT id FROM exercises_catalog WHERE name LIKE '%Bench Press%' LIMIT 1");
if ($row = $res->fetch_assoc()) {
    $e_id = $row['id'];
    $conn->query("INSERT IGNORE INTO routine_exercises (routine_id, exercise_id, default_sets, default_reps) VALUES (1, $e_id, 4, 10)");
}
// Find Calisthenics
$res = $conn->query("SELECT id FROM exercises_catalog WHERE name LIKE '%Calisthenics%' LIMIT 1");
if ($row = $res->fetch_assoc()) {
    $e_id = $row['id'];
    $conn->query("INSERT IGNORE INTO routine_exercises (routine_id, exercise_id, default_sets, default_reps) VALUES (1, $e_id, 3, 15)");
}

// Pull exercises
// Find Rowing
$res = $conn->query("SELECT id FROM exercises_catalog WHERE name LIKE '%Rowing%' LIMIT 1");
if ($row = $res->fetch_assoc()) {
    $e_id = $row['id'];
    $conn->query("INSERT IGNORE INTO routine_exercises (routine_id, exercise_id, default_sets, default_reps) VALUES (2, $e_id, 4, 12)");
}

echo "Migration V3 performed successfully.\n";
?>
