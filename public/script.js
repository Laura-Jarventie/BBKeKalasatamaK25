let BOARD_SIZE = 15
let board; //kenttä tallentaan tähän
const cellSize = calculateCellSize();



document.getElementById("new-game-btn").addEventListener('click', startGame);

function calculateCellSize(){
const sreenSize = Math.min(window.innerWidth, window.innerHeight);
const gameBoardSize = 0.95 * sreenSize;
return gameBoardSize / BOARD_SIZE;

}

function startGame(){
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';

    board = generateRandomBoard();

    drawBoard(board);
}

function getCell(board, x, y) {
    return board [y][x];
}


function generateRandomBoard(){

    const newBoard = Array.from({ length: BOARD_SIZE}, () =>
     Array(BOARD_SIZE).fill(' '));

    console.log(newBoard);

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            if (y===0 || y === BOARD_SIZE-1 || x === 0 || x === BOARD_SIZE-1)
            {
                newBoard[y][x] = 'W' //W on wall
            }
        }
    }

    return  newBoard;
}

 function drawBoard(board){
    const gameBoard = document.getElementById('game-board');

    //Asetetaan grid-sarakkeet ja rivit dynaamisesti BOARD_SIZEN mukaan
    gameBoard.style.gridTemplateColumns = `repeat(${BOARD_SIZE}, 1fr)`;

    for(let y=0; y < BOARD_SIZE; y++){
        for(let x=0; x < BOARD_SIZE; x++){
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.style.width = cellSize + "px";
            cell.style.height = cellSize + "px";

            if (getCell(board, x, y) === 'W'){
                cell.classList.add('wall'); 
            }

            gameBoard.appendChild(cell);

        }
    }
} 


//saatiin tehtyä responsivisuus. kirj doc 11.