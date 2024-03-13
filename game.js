const cells = document.querySelectorAll(".cell")
const statusText = document.querySelector("#statusText")
const restartBtn = document.querySelector("#restartBtn")
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];


let scorePlayerX = 0;
let scorePlayerO = 0;
let options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "x"
let running = false;
let previousWinner = null;

initializeGame();

function initializeGame(){
    if (previousWinner !== null) {
        currentPlayer = previousWinner;
    }

    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("data-cell-index");

    if(options[cellIndex] != "" || !running){
        return;
    }

    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index){
    options[index] = currentPlayer;
    
    // Maak een nieuw element aan voor de tekstinhoud
    const cellContent = document.createElement('div');
    cellContent.className = 'cell-content';
    cellContent.textContent = currentPlayer;
    
    // Voeg de tekstinhoud toe aan de cel
    cell.appendChild(cellContent);
}



function changePlayer(){
    currentPlayer = (currentPlayer == "x") ? "o" : "x";
    statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinner(){
    let roundWon = false;

    for(let i = 0; i < winConditions.length; i++){
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA == cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }

    if(roundWon){ 
        statusText.textContent = `${currentPlayer} wins!`;
        updateScore();
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }
    else{
        changePlayer();
    }
}

function restartGame(){
    previousWinner = currentPlayer;
    options = ["", "", "", "", "", "", "", "", ""];
    statusText.textContent = `${currentPlayer}'s turn`;

    document.querySelectorAll('.cell-content').forEach(content => {
        content.classList.add('fade-out');
    });
    
    cells.forEach(cell => {
        // Wacht tot de animatie is voltooid en verwijder vervolgens de inhoud
        setTimeout(() => {
            cell.textContent = "";
        }, 650); // De tijd moet overeenkomen met de duur van de fade-out-animatie
    });
    
    
    running = true;
}

function updateScore() {
    if (currentPlayer === 'x') {
        scorePlayerX = scorePlayerX + 1;
        document.querySelector(".scorePlayerX").textContent = scorePlayerX;
    } else {
        scorePlayerO++;
        document.querySelector('.scorePlayerO').textContent = scorePlayerO;
    }
}


