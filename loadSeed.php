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
        $selected = '';

        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            if(!empty($_POST['seed'])) {
                $selected = $_POST['seed'];
                if($_POST['send']=='Carregar') {
                    header('Location: /JocDeLaVida/game.html?' . $selected);
                    exit();
                } else if($_POST['send']=='Esborrar') {
                    setcookie("&" . $selected, "", time()-3600);
                    header('Location: /JocDeLaVida/loadSeed.php');
                    exit();
                }
                
            }
        }
    ?>

    <div class="header">
        <h1 class="title"><a href="./index.html">GameOfLife</a></h1>
    </div>

    <div id="gridContainer">
        <form class="grid-form" action="" method="post">
            <h2>Selecciona una partida</h2>
            <select class="list" id="list" name="seed" multiple>
                <?php foreach ($_COOKIE as $key=>$value) {
                        if(substr($key,0,1) == '&') {
                            $key = substr($key,1, strlen($key));
                            echo "<option value=" . $key . ">{$key}</option>";
                        }   
                   }
                ?>
            </select>
            <div>
                <input class="sbutton" name="send" value="Carregar" type="submit">
                <input class="sbutton" name="send" value="Esborrar" type="submit">
            </div> 
        </form>
    </div>

    <div class="footer">
        <p>Projecte 1 DAW by Oriol Bech</p>
    </div>

</body>
</html>