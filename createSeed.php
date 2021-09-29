<?php
// define variables and set to empty values
$nseed = $ncols = $nrows = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
  $nseed = validate_input($_POST["nseed"]);
  $ncols = validate_input($_POST["ncols"]);
  $nrows = validate_input($_POST["nrows"]);
}

function validate_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}

$value = "1&{$nrows}&{$ncols}";

setcookie("&" . $nseed, $value);

header('Location: /JocDeLaVida/game.html?' . $nseed);
exit();

?>