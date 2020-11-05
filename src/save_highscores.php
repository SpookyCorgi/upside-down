<?php
$str_json = file_get_contents('php://input');
$data = explode(" ", $str_json);
$data[1] = intval($data[1]);

/*$myfile = fopen("log.txt", "w") or die("Unable to open file!");
fwrite($myfile, gettype($data[0]));
fclose($myfile);*/

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

$sql = "SELECT * from highscores ORDER BY score DESC";
$result = $conn->query($sql);
$a = array();
if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
        $a[] = array("Name"=>$row["player_name"],"Score"=>$row["score"]);
  }
} else {
  echo "0 results";
}
if(count($a)<10){
    $sql = "INSERT INTO highscores (player_name, score) VALUES ('$data[0]',$data[1])";
    $conn->query($sql);
}else if($data[1]>$a[9]["Score"]){
    $sql = "INSERT INTO highscores (player_name, score) VALUES ('$data[0]',$data[1])";
    $conn->query($sql);
    $sql = "DELETE FROM highscores ORDER BY score ASC LIMIT 1";
    $conn->query($sql);
}

/*$myfile = fopen("log.txt", "w") or die("Unable to open file!");
fwrite($myfile, $a[0]["Score"]);
fclose($myfile);*/



$conn->close();
?>