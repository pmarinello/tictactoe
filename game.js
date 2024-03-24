// Met dank aan (bronnen):
//
// Tic Tac Toe Tutorial van Bro Code: https://www.youtube.com/watch?v=AnmwHjpEhtA&t=15s
// 
// Ook heb ik veel gebruik gemaakt van chatGPT, echter weet ik niet meer welke code precies uit welke prompt is gekomen en zijn het meerdere verschillende gesprekken geweest
// https://chat.openai.com/
//
// Uiteraard zijn deze gesprekken in te zien bij het mondeling mocht daar de behoefte voor zijn


document.addEventListener("DOMContentLoaded", function () { // zorgt ervoor dat de javascript code pas wordt uitgevoerd zodra de html helemaal is geladen, zodat er geen errors kunnen ontstaan wanner elementen nog niet zijn ingeladen.
    
    const cells = document.querySelectorAll(".cell");
    const statusText = document.querySelector("#statusText");
    const restartBtn = document.querySelector("#restartBtn");
    const winConditions = [
        // Horizontaal
        [0, 6, 12, 18], [1, 7, 13, 19], [2, 8, 14, 20], [3, 9, 15, 21], [4, 10, 16, 22], [5, 11, 17, 23],
        [6, 12, 18, 24], [7, 13, 19, 25], [8, 14, 20, 26], [9, 15, 21, 27], [10, 16, 22, 28], [11, 17, 23, 29],
        [12, 18, 24, 30], [13, 19, 25, 31], [14, 20, 26, 32], [15, 21, 27, 33], [16, 22, 28, 34], [17, 23, 29, 35],
        [18, 24, 30, 36], [19, 25, 31, 37], [20, 26, 32, 38], [21, 27, 33, 39], [22, 28, 34, 40], [23, 29, 35, 41],
        
        // Verticaal
        [0, 1, 2, 3], [1, 2, 3, 4], [2, 3, 4, 5], [6, 7, 8, 9], [7, 8, 9, 10], [8, 9, 10, 11], [12, 13, 14, 15],
        [13, 14, 15, 16], [14, 15, 16, 17], [18, 19, 20, 21], [19, 20, 21, 22], [20, 21, 22, 23], [24, 25, 26, 27],
        [25, 26, 27, 28], [26, 27, 28, 29], [30, 31, 32, 33], [31, 32, 33, 34], [32, 33, 34, 35], [36, 37, 38, 39],
        [37, 38, 39, 40], [38, 39, 40, 41],

        // diagonaal (linksboven - rechtsonder)
        [0, 7, 14, 21], [1, 8, 15, 22], [2, 9, 16, 23], [6, 13, 20, 27], [7, 14, 21, 28], [8, 15, 22, 29],
        [12, 19, 26, 33], [13, 20, 27, 34], [14, 21, 28, 35], [18, 25, 32, 39], [19, 26, 33, 40], [20, 27, 34, 41],

        // Diagonaal (van rechtsboven naar linksonder)
        [3, 8, 13, 18], [4, 9, 14, 19], [5, 10, 15, 20], [10, 15, 20, 25], [11, 16, 21, 26], [16, 21, 26, 31], [21, 26, 31, 36],
        [17, 22, 27, 32], [22, 27, 32, 37], [23, 28, 33, 38], [24, 19, 14, 9], [15, 20, 25, 30]

    ];
        

    let scorePlayerX = 0;
    let scorePlayerO = 0;
    let options = Array.from({ length: 42 }, () => ""); // let options = Array.from({ length: 42 }, function() {return "";}); Dit maakt een array van 42 lege strings. Deze wodr later gevuld.
    let currentPlayer = "x";
    let running = false;
    let previousWinner = null;

    

    initializeGame();

    function initializeGame() {

        // Als er een winnaar is, dan word dat de huidige speler
        if (previousWinner !== null) {
            currentPlayer = previousWinner;
        } 

        // Alle elementen met de "row" class worden hier opgeroepen en voorzien van een click event, die wanneer je klikt de index van het row nummer opvraagt en vervolgens de 
        // fillNextCell functie uitvoert en de parameters meegeeft van het rownummer en wie de huidige speler is, zodat het juiste symbol kan worden ingevuld.
        document.querySelectorAll('.row').forEach(row => {
            row.addEventListener('click', function () {
                
                const rowNum = Array.from(this.parentElement.children).indexOf(this);

                fillNextCell(rowNum + 1, currentPlayer); 
            });
        });
            
        statusText.textContent = `${currentPlayer}'s turn`;
        running = true;
    }

    function fillNextCell(rowNum, currentPlayer) {

        //if not running, dan stopt de functie met uitvoering, om te voorkomen dat je nog cellen kunt plaatsen zodra het spel voorbij is
        if (!running) {
        return;
        }

        const row = document.querySelector('.row' + rowNum);
        const cells = row.querySelectorAll('.cell');

        for (let i = cells.length - 1; i >= 0; i--) { // vult de cellen van onder naar boven op
            if (cells[i].textContent === '') {
                
                const symbolElement = document.createElement('p'); //creeert een p element genaamd symbolElement
                symbolElement.textContent = currentPlayer; //voegt de huidige speler als textcontent toe aan symbolElement

                
                if (currentPlayer === 'x') {
                    symbolElement.classList.add('blue-cell'); // voegt de .blue-cell class toe aan het element
                } 
                else if (currentPlayer === 'o') {
                    symbolElement.classList.add('orange-cell'); // voegt de .orange-cell class toe aan het element
                }

                
                cells[i].appendChild(symbolElement); // voegt het gemaakte element toe aan de lege cell

                const cellIndex = (rowNum - 1) * 6 + i; // berekening van de cell index 
                options[cellIndex] = currentPlayer; // Plaats een x of o in de options array
                checkWinner(); // iedere keer als een lege cell gevuld is, wordt er opnieuw gekeken of er een winnaar is

                break; // stopt het vullen van de cellen, anders worden direct alle cellen van de rij gevuld
            }
        }
    };


    function changePlayer() { 
        currentPlayer = currentPlayer === "x" ? "o" : "x"; // ternaire operator (? :) is een verkorte versie van een if else statement
        statusText.textContent = `${currentPlayer}'s turn`; // vernadert de tekst naar de nieuwe huidige speler
    };

    function checkWinner() {
        let roundWon = false;
        let winningPlayer = null;
        let winningCombination = null; 

        for (let i = 0; i < winConditions.length; i++) {
            const [a, b, c, d] = winConditions[i];
            const cellA = options[a];
            const cellB = options[b];
            const cellC = options[c];
            const cellD = options[d];

            if (cellA !== "" && cellA === cellB && cellB === cellC && cellC === cellD) {
                roundWon = true;
                winningCombination = [a, b, c, d]; 
                break;
            }
        }

        if (roundWon) { // if (roundWon === true)
            statusText.textContent = `${currentPlayer} wins!`;
            updateScore(); // roept de update score functie op
            highlightWinningCells(winningCombination); // roept de highlightWinningCells functie op
            running = false;
        } 
        else if (!options.some(cell => cell === "")) { // checkt of er nog minimaal 1 lege cell is, zo niet, dan draw
            statusText.textContent = `Draw!`;
            running = false;
        } 
        else { // anders is er geen winnaar en geen draw, dus gaat het spel gewoon door en is de volgende speler aan de beurt
            changePlayer();
        }
    }


    function highlightWinningCells(winningCombination) {
        winningCombination.forEach(cellIndex => { // voor elke winnende cell
            const cell = document.querySelector(`.cell[data-cell-index="${cellIndex}"]`); // template literal is hetzelfde als: '.cell[data-cell-index="' + cellIndex + '"]'
            const symbolElement = cell.querySelector('p'); // het gecreerde p-element binnen de winndende cell 
            symbolElement.classList.add('winning-cell'); // voegt de class toe het p-element van de winndende cell
        });
    };



    function removeWinningCells() {
        const cell = document.querySelectorAll('.cell'); // selecteerd alle elementen met de cell class en verwijdert voor elke de volgende classes. Dit kan wellicht netter, maar weet even niet hoe.
        cell.forEach(cell => {
            cell.classList.remove('winning-cell')
            cell.classList.remove('blue-cell')
            cell.classList.remove('orange-cell')
    })};

    restartBtn.addEventListener("click", restartGame); // voegt een click toe aan de restart button en activeert vervolgens de restartGame functie

    function restartGame() {
        previousWinner = currentPlayer; // zorgt ervoor dat wanneer je ook op restart klikt de vorige winaar altijd degene is die ag beginnen
        removeWinningCells(); // roept de removeWinningCells functie op
        options = Array.from({ length: 42 }, () => ""); // reset de options array naar de default settings, namelijk helemaal leeg
        statusText.textContent = `${currentPlayer}'s turn`; // haalt de winnaar's tekst weg en zet het om naar de current's player turn
        document.querySelectorAll('.cell p').forEach(symbolElement => { // aan alle p-elementen wordt de fade-out class toegevoegd en vervolgens worden na 500 milliseconden de p-elementen verwijderd
            
            symbolElement.classList.add('fade-out');
            
            setTimeout(() => {
                symbolElement.remove();
            }, 500); 
        });
        
        running = true; // reset naar running true, zodat er weer cellen gevuld kunnen worden
    }


    function updateScore() { // wanneer er is gewonnen word deze functie opgeroepen
        
        // als bij winst X de huidige speler is, dan wordt er 1 opgeteld bij de score van player X
        if (currentPlayer === 'x') { 
            scorePlayerX++;                                                         // is hetzelfde als scorePlayerX = scorePlayerX + 1;
            document.querySelector(".scorePlayerX").textContent = scorePlayerX;
        } 
        else {
            scorePlayerO++;
            document.querySelector('.scorePlayerO').textContent = scorePlayerO;
        }
    }
    
});