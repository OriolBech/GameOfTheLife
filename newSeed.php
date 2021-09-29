<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="style.css">
    <title>GameOfLife</title>
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

            $value = "1&{$nrows}&{$ncols}";
        
            setcookie("&" . $nseed, $value);

            header('Location: /JocDeLaVida/game.html?' . $nseed);
            exit();
        }
        
        function validate_input($data) {
        $data = str_replace(' ', '', $data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
        }
        
    
    ?>
    <div class="header">
        <h1 class="title"><a href="./index.html">GameOfLife</a></h1>
    </div>

    <div id="gridContainer">
        <form class="grid-form" action="" method="post">
            <h2>Configura la teva partida</h2>
            <p>Nom partida</p>
            <input type="text" name="nseed" id="nseed" required></input>
            <p>Numero columnes</p>
            <input type="text" name="ncols" id="ncols" required></input>
            <p>Numero files</p>
            <input type="text" name="nrows" id="nrows" required></input>
            <input type="submit">
        </form>
    </div>

    <div class="footer">
        <p>Projecte 1 DAW by Oriol Bech</p>
    </div>

</body>
</html>