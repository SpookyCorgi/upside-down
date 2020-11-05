<?php
$servername = "localhost";
$username = "sheepy";
$password = "ilovesheepy";
$dbname = "upside_down";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT player_name, score FROM highscores ORDER BY score DESC";
$result = $conn->query($sql);
$data = array();
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
        $data[] = array("Name"=>$row["player_name"],"Score"=>$row["score"]);
  }
} else {
  echo "0 results";
}
echo json_encode($data);
$conn->close();
?>