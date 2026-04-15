<?php
$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$newExercises = [
    // Chest
    ['Incline Dumbbell Press', 'Chest', 'Intermediate', 6.0, 'Strength'],
    ['Cable Crossovers', 'Chest', 'Beginner', 4.0, 'Strength'],
    ['Pec Deck Machine', 'Chest', 'Beginner', 3.0, 'Strength'],
    ['Bench Press', 'Chest', 'Intermediate', 6.0, 'Strength'],
    // Back
    ['Lat Pulldown', 'Back', 'Beginner', 4.5, 'Strength'],
    ['Barbell Deadlift', 'Back', 'Advanced', 7.5, 'Strength'],
    ['Seated Cable Row', 'Back', 'Intermediate', 5.0, 'Strength'],
    ['Pull-Ups', 'Back', 'Advanced', 6.5, 'Strength'],
    // Legs
    ['Barbell Squat', 'Legs', 'Intermediate', 6.5, 'Strength'],
    ['Hack Squat', 'Legs', 'Intermediate', 6.5, 'Strength'],
    ['Leg Press', 'Legs', 'Beginner', 6.0, 'Strength'],
    ['Romanian Deadlift', 'Legs', 'Intermediate', 6.0, 'Strength'],
    ['Calf Raises', 'Legs', 'Beginner', 3.0, 'Strength'],
    // Arms
    ['Barbell Bicep Curl', 'Arms', 'Beginner', 3.5, 'Strength'],
    ['Tricep Rope Pushdown', 'Arms', 'Beginner', 3.5, 'Strength'],
    ['Hammer Curls', 'Arms', 'Beginner', 3.5, 'Strength'],
    ['Skull Crushers', 'Arms', 'Intermediate', 4.0, 'Strength'],
    ['Preacher Curls', 'Arms', 'Beginner', 3.0, 'Strength'],
    // Core
    ['Cable Crunches', 'Core', 'Intermediate', 4.0, 'Strength'],
    ['Hanging Leg Raises', 'Core', 'Advanced', 5.0, 'Strength'],
    ['Russian Twists', 'Core', 'Beginner', 4.5, 'Strength'],
    // Shoulders
    ['Overhead Press', 'Shoulders', 'Intermediate', 6.0, 'Strength'],
    ['Lateral Raises', 'Shoulders', 'Beginner', 3.5, 'Strength'],
    ['Front Raises', 'Shoulders', 'Beginner', 3.5, 'Strength'],
    ['Face Pulls', 'Shoulders', 'Intermediate', 4.0, 'Strength']
];

$stmt = $conn->prepare("INSERT IGNORE INTO exercises_catalog (name, target_muscle, difficulty, met_value, type) VALUES (?, ?, ?, ?, ?)");

$inserted = 0;
foreach ($newExercises as $ex) {
    // Check if exists
    $check = $conn->query("SELECT id FROM exercises_catalog WHERE name = '" . $conn->real_escape_string($ex[0]) . "'");
    if ($check->num_rows == 0) {
        $stmt->bind_param("sssds", $ex[0], $ex[1], $ex[2], $ex[3], $ex[4]);
        $stmt->execute();
        $inserted++;
    } else {
        // Just update target_muscle and type if they already exist so heatmap maps correctly
        $conn->query("UPDATE exercises_catalog SET target_muscle = '".$conn->real_escape_string($ex[1])."', type = '".$conn->real_escape_string($ex[4])."' WHERE name = '".$conn->real_escape_string($ex[0])."'");
    }
}
$stmt->close();
$conn->close();

echo "Catalogue Expansé: $inserted nouveaux exercices de force injectés. Muscles cibles mis à jour.";
?>
