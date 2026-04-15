<?php
$conn = new mysqli("localhost", "root", "0000", "fitness_tracker");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// 1. Create exercises_catalog table
$sqlDropCatalog = "DROP TABLE IF EXISTS exercises_catalog;";
$conn->query($sqlDropCatalog);

$sqlCreateCatalog = "
CREATE TABLE exercises_catalog (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    target_muscle VARCHAR(255),
    difficulty ENUM('Beginner', 'Intermediate', 'Advanced'),
    met_value FLOAT NOT NULL
);";

if ($conn->query($sqlCreateCatalog) === TRUE) {
    echo "Table exercises_catalog created successfully.\n";
} else {
    echo "Error creating table: " . $conn->error . "\n";
}

// 2. Insert 20 realistic exercises with MET values
$exercises = [
    ["Running (Vigorous)", "Legs/Cardio", "Advanced", 11.5],
    ["Jogging (General)", "Legs/Cardio", "Intermediate", 7.0],
    ["Walking (Brisk)", "Legs/Cardio", "Beginner", 4.3],
    ["Cycling (Light)", "Legs/Cardio", "Beginner", 8.0],
    ["Cycling (Vigorous)", "Legs/Cardio", "Advanced", 10.0],
    ["Swimming (Freestyle)", "Full Body", "Intermediate", 8.3],
    ["Weight Lifting (Light)", "Full Body", "Beginner", 3.0],
    ["Bench Press (Heavy)", "Chest", "Advanced", 6.0],
    ["Squat (Heavy)", "Legs", "Advanced", 6.0],
    ["Jump Rope (Fast)", "Cardio", "Advanced", 12.0],
    ["Yoga (Hatha)", "Flexibility", "Beginner", 2.5],
    ["Pilates", "Core", "Beginner", 3.0],
    ["HIIT", "Full Body", "Advanced", 8.0],
    ["Boxing (Sparring)", "Full Body", "Advanced", 9.0],
    ["Boxing (Heavy Bag)", "Arms/Core", "Intermediate", 5.5],
    ["Rowing (Vigorous)", "Back/Arms", "Advanced", 8.5],
    ["Stair Climbing", "Legs", "Intermediate", 9.0],
    ["Calisthenics (Pushups)", "Chest/Arms", "Intermediate", 8.0],
    ["Basketball (Game)", "Cardio", "Intermediate", 8.0],
    ["Soccer (Competitive)", "Cardio/Legs", "Advanced", 10.0]
];

$stmt = $conn->prepare("INSERT INTO exercises_catalog (name, target_muscle, difficulty, met_value) VALUES (?, ?, ?, ?)");
foreach ($exercises as $ex) {
    $stmt->bind_param("sssd", $ex[0], $ex[1], $ex[2], $ex[3]);
    $stmt->execute();
}
$stmt->close();
echo "Inserted 20 exercises into catalog.\n";

// 3. Purge existing workouts to avoid mapping issues during constraint addition
$conn->query("TRUNCATE TABLE workouts;");

// 4. Modify workouts table
// Drop old 'exercise' column if it exists
$checkCol = $conn->query("SHOW COLUMNS FROM workouts LIKE 'exercise'");
if ($checkCol->num_rows > 0) {
    $conn->query("ALTER TABLE workouts DROP COLUMN exercise;");
    echo "Dropped 'exercise' column from workouts.\n";
}

// Add 'exercise_id' and constraint
$checkColId = $conn->query("SHOW COLUMNS FROM workouts LIKE 'exercise_id'");
if ($checkColId->num_rows == 0) {
    $conn->query("ALTER TABLE workouts ADD COLUMN exercise_id INT NOT NULL;");
    $conn->query("ALTER TABLE workouts ADD CONSTRAINT fk_workout_exercise FOREIGN KEY (exercise_id) REFERENCES exercises_catalog(id) ON DELETE CASCADE;");
    echo "Added 'exercise_id' column and Foreign Key to workouts.\n";
} else {
    echo "'exercise_id' already exists.\n";
}

$conn->close();
?>
