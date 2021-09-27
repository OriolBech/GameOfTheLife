var rows = 38;
var cols = 100;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var comGen = 0;
var speed = 100;
var timer;
var reproductionTime = 100;

// funcio per inicialitzar els taulells
function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
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
    //windowPicker();
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
}

// funcio per desplegar una finestra per configurar la seed
function windowPicker() {
    var gridContainer = document.getElementById('gridContainer');
    var windowPicker = document.createElement("div");
    var formSize = document.createElement("form");
    var inputX = document.createElement("input");
    var inputY = document.createElement("input");
    var submit = document.createElement("input");
    
    windowPicker.setAttribute("id", "windowPicker");
    formSize.setAttribute("id", "formSize");
    formSize.setAttribute("method", "post");
    formSize.setAttribute("action", "");
    inputX.setAttribute("id", "inputx");
    inputY.setAttribute("id", "inputy");
    inputX.setAttribute("class", "input");
    inputY.setAttribute("class", "input");
    submit.setAttribute("type", "submit");
    submit.setAttribute("value", "Submit");       

    gridContainer.appendChild(windowPicker);
    windowPicker.appendChild(formSize);
    formSize.appendChild(inputX);
    formSize.appendChild(inputY);
    formSize.appendChild(submit);

    var x = document.getElementById('inputx').value;
    var y = document.getElementById('inputy').value;

    form.addEventListener('submit', (event) => {
        console.log(x + '' + y);
    });

}

// Lay out the board
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Error: No div per la taula!");
    }
    var generation = document.createElement("input");
    generation.setAttribute("id", "comGen");
    generation.value = comGen;
    gridContainer.appendChild(generation);
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

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

    function updateView() {
        comGen += 1;
        var generation = document.getElementById("comGen");
        generation.value = comGen;
        console.log(comGen);
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
        sleep(speed);
    }

function setupControlButtons() {

    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;

    var saveButton = document.getElementById("save");
    saveButton.onclick = saveButtonHandler;
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

function saveButtonHandler() {
    var sinput = document.getElementById("sname");
    var sname = sinput.value
    if (sname != "") {
        setCookie(sname, [grid, rows , cols]);
    }
   
}

// start/pause/continue el joc
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
}

// run el joc de la vida
function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

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

// NORMAS
// Qualsevol cel·la amb menys de dos veins mort, per infrapoblacio
// Qualsevol cel·la amb dos o tres veins viu a la seguent generacio.
// Qualsevol cel·la amb mes de tres veins mort, per sobrepoblacio
// Qualsevol cel·la amb exactament tres veins torna a viure, per reproduccio.

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

//funcio per establir la cookie
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}



// Inicialitzar tot el programa
window.onload = initialize;