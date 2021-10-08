// obtenim el nom de la partida per recuperar la cookie
var route = window.location.href;
var nseed = route.split('?');
nseed = nseed[1];

// Variables per inicialitzar columnes, files i taulells
var rows = getData("rows");
var cols = getData("cols");
var grid = new Array(rows);
var nextGrid = new Array(rows); 

// Variables per saber si el joc esta en funcionament
var playing = false;
var timer;

// Variable de velocitat
var reproductionTime = 450;

// Comptadors
var comGen = getData("com");
var comViues = 0;
var comMortes = 0;
var generacio = document.getElementById("comGen");
generacio.innerHTML = comGen;

// Comprovem si es la primera partida o ja esta començada, si no esta començada carreguem la configuracio.
function checkStartingCells() {
    if(getData("cells") != "empty") {
        grid = getData("cells");
        nextGrid = getData("cells");
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
        var startButton = document.getElementById('start');
        startButton.innerHTML = "Continuar";
    }
}

// Funcio per inicialitzar els taulells
function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

// funcio per resetejar el taulell
function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

// funcio per passar de taulell, per la seguent generacio
function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    createTable();
    checkStartingCells();
    if(getData("cells") == "empty") {
        initializeGrids();
        resetGrids();
    }
    setupControlButtons();
    countAliveDeadCells();
    sliderVelocitat();
}

// Creem la taula del joc
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Error: No div per la taula!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    
    gridContainer.appendChild(table);
    table.after(document.getElementById("control-menu"))
}


// control del clicks a les cel·les
function cellClickHandler() {
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];
    
    var classes = this.getAttribute("class");
    if(classes.indexOf("live") > -1) {
        this.setAttribute("class", "dead");
        grid[row][col] = 0;
    } else {
        this.setAttribute("class", "live");
        grid[row][col] = 1;
    }
    
}

// Actualizar el grid
function updateView() {
    comGen += 1;
    generacio.innerHTML = comGen;
    console.log(comGen);
    countAliveDeadCells();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            comMortes = 0;
            comViues = 0;
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
}

//Inicialitzar tots els botons
function setupControlButtons() {

    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;

    var saveButton = document.getElementById("save");
    saveButton.onclick = saveData;
}

//funcio per controlar el slider de la velocitat
function sliderVelocitat() {
    var velocitat = document.getElementById("speed");

    velocitat.oninput = function () {
        reproductionTime = this.value * 90;
    };
}

//realitzem un math.random per cada cel·la
function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

//funcio per netejar el taulell, matem totes les cel·les
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    comGen = 0;
    comMortes = 0;
    comViues = 0;

    var cellsList = document.getElementsByClassName("live");
    // convertir array primer, sino, estarem treballant amb la llista de nodes vius
    // i l'actualitzacio no funcionaras
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
        }
    }

}



// start/pause/continue el joc
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continuar";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pausar";
        play();
    }
}

// Comptem el numero de cel·les viues i mortes per despres mostrar les estadistiques
function countAliveDeadCells() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j] == 0) {
                comMortes += 1;
                document.getElementById("comDead").innerHTML = comMortes;
            } else {
                comViues += 1;
                document.getElementById("comAlive").innerHTML = comViues;
            }
        }
    }
}

// run el joc de la vida
function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

// guardar les dades a la cookie
function saveData() {
    var value = JSON.stringify({'cells': grid, 'rows': rows, 'cols': cols, 'com': comGen, 'dateCreation': getData("dateCreation")});
    document.cookie = "&" + nseed + "=" + value;
    console.log(nseed + " Saved Data" + getCookie(nseed));
}

//Obtenim la cookie i utlitzem el decode per despres obtenir la informacio
function getCookie(cname) {
    cname = "&" + cname; 
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

// funcio per convertir el json que retorna la cookie i filtra les dades
function getData (type) {
    var cookie = getCookie(nseed);
    var object = JSON.parse(cookie);
    return object[type];
}

// NORMAS
// Qualsevol cel·la amb menys de dos veins mort, per infrapoblacio
// Qualsevol cel·la amb dos o tres veins viu a la seguent generacio.
// Qualsevol cel·la amb mes de tres veins mort, per sobrepoblacio
// Qualsevol cel·la amb exactament tres veins torna a viure, per reproduccio.

//Apliquem les normas i pasem de generacio
function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    //resetejem el grid per poder actualizarla
    copyAndResetGrid();
    // copia tots els valos vius a la taula
    updateView();
}

// funcio per aplicar les normes del joc
function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
        if (numNeighbors == 3) {
            nextGrid[row][col] = 1;
        }
    }
}

// Comptem el veins
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

// Inicialitzar tot el programa
window.onload = initialize;
