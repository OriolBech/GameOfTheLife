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
    <div class="header">
        <h1 class="title"><a href="./index.html">GameOfLife</a></h1>
    </div>

    <div id="gridContainer">
        <form class="grid-form" action="./game.html" method="post">
            <h2>Selecciona una partida</h2>
            <select class="list" id="list" name="seed" multiple>
                <?php
                    foreach ($_COOKIE as $key=>$value) {
                        if(substr($key,0,1) == '&') {
                            $key = substr($key,1, strlen($key));
                            echo "<option>{$key}</option>";
                        }   
                   }
                ?>
            </select> 
            <input type="submit" value="Load Seed">        
        </form>
    </div>

    <div class="footer">
        <p>Projecte 1 DAW by Oriol Bech</p>
    </div>

    <script>
        let keys = Object.keys(sessionStorage);
        let list = document.getElementById("list");

        keys.forEach(function (item) {
            let option = document.createElement("option");
            list.appendChild(option);

            option.setAttribute("value", "item")
            option.innerHTML += item;
        });

    </script>
</body>
</html>