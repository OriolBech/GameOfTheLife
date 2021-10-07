<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>GameOfTheLife</title>
</head>
<body>
    <?php 
        $nseed = $ncols = $nrows = "";

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(!empty($_POST['nseed']) && !empty($_POST['ncols']) && !empty($_POST['nrows'])) {
                $nseed = validate_input($_POST["nseed"]);
                $ncols = validate_input($_POST["ncols"]);
                $nrows = validate_input($_POST["nrows"]);
            }
            
            $date = date("Y-m-d H:i:s");
            $value = ["cells" => "empty", "rows" => $nrows, "cols" => $ncols, "com" => 0,"dateCreation" => $date];
        
            setcookie("&" . $nseed, json_encode($value), ime() + (86400 * 30), "path=/");

            echo "<script> location.replace('game.html?" . $nseed . "'); </script>";
        }
        
        function validate_input($data) {
            $data = str_replace(' ', '', $data);
            $data = stripslashes($data);
            $data = htmlspecialchars($data);
            return $data;
        }
    ?>
    <div class="header">
        <h1 class="title"><a href="./index.html">GameOfTheLife</a></h1>
    </div>

    <div id="gridContainer">
        <form class="grid-form" action="" method="post">
            <h2>Configura la teva partida</h2>
            <p>Nom partida</p>
            <input class="ninput" type="text" name="nseed" id="nseed" required></input>
            <p>Numero columnes</p>
            <input class="ninput" type="number" name="ncols" id="ncols" min="4" max="20" required></input>
            <p>Numero files</p>
            <input class="ninput" type="number" name="nrows" id="nrows" min="4" max="20" required></input>
            <input class="sbutton" value="Crear" type="submit">
        </form>
    </div>

    <div class="footer">
        <p>Projecte 1 DAW by Oriol Bech</p>
    </div>

</body>
</html>