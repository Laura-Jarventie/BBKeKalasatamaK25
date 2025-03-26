let BOARD_SIZE = 20
let board; //kenttä tallentaan tähän
const cellSize = calculateCellSize();
let player;
let ghosts = [];



document.getElementById("new-game-btn").addEventListener('click', startGame);

function calculateCellSize(){
const sreenSize = Math.min(window.innerWidth, window.innerHeight);
const gameBoardSize = 0.95 * sreenSize;
return gameBoardSize / BOARD_SIZE;

}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        player.move(0, -1)  //liikuta ylöspäin
        break;
        case 'ArrowDown':
        player.move(0, 1)   //liiku alas
        break;
        case 'ArrowLeft':
        player.move(-1, 0)  // liikuta vasemmalle
        break;
        case 'ArrowRight':
        player.move(1,0)   // liiku oikealle
        break;
        case 'w':
        shootAt(player.x, player.y - 1) // ampuu ylös
        break;
        case 's':
        shootAt(player.x, player.y + 1) // ampuu alas
        break;
        case 'a':
        shootAt(player.x - 1, player.y) // ampuu vasemmalle
        break;
        case 'd':
        shootAt(player.x + 1, player.y) // ampuu oikealle
        break;
    }
    event.preventDefault();
});

function startGame(){
    document.getElementById('intro-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    player = new Player(0,0)
    board = generateRandomBoard();
    
   
    drawBoard(board);


}

function getCell(board, x, y) {
    return board [y][x];
}

function setCell(board, x, y, value){
    board[y][x] = value;
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

    generateObstacles(newBoard);

    const [playerX, playerY] = randomEmptyPosition(newBoard);
    setCell(newBoard, playerX, playerY, 'P');
    player.x = playerX;
    player.y = playerY;
 

    ghosts = [];
    for(let i= 0; i < 5; i++) {
    const [ghostX, ghostY] = randomEmptyPosition(newBoard);
    setCell(newBoard, ghostX, ghostY, 'H');
    ghosts.push(new Ghost(ghostX,ghostY)); // työnnetään haamut listalle
    console.log(ghosts);
    }


    return  newBoard;
}

 function drawBoard(board){
    const gameBoard = document.getElementById('game-board');

    gameBoard.innerHTML = ' ';

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

            else if (getCell(board, x, y) === 'P'){
                cell.classList.add('player'); 
            }

            else if (getCell(board, x, y) === 'H'){
                cell.classList.add('hornmonster'); 
            }
            

            gameBoard.appendChild(cell);

        }
    }
} 

function generateObstacles(board){

    //lista esteistä koordinaattiparien listoina
    const obstacles = [
        [[0,0],[0,1],[1,0],[1,1]], // Square
        [[0,0],[0,1],[0,2],[0,3]],  // I
        [[0,0],[1,0],[2,0],[1,1]], // T
        [[1,0],[2,0],[1,1],[0,2],[1,2]], // Z
        [[1,0],[2,0],[0,1],[1,1]], // S
        [[0,0],[1,0],[1,1],[1,2]], // L
        [[0,2],[0,1],[1,1],[2,1]]  // J
    ];

    //valitaan muutama paikka esteille pelikentältä
    //huom kovakoodatut x ja y, eli katso että palikat mahtuu kentälle
    const positions = [
            { startX: 2, startY: 2 },
            { startX: 8, startY: 2 },
            { startX: 4, startY: 8 },
            { startX: 3, startY: 16 },
            { startX: 10, startY: 10 },
            { startX: 12, startY: 5 },
            { startX: 12, startY: 10 },
            { startX: 16, startY: 10 },
            { startX: 13, startY: 14 }
       
    ]

    //käydään läpi valitut paikat ja arvotaan niihin esteet
    positions.forEach(pos => {
        const randomObstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
        placeObstacle(board, randomObstacle, pos.startY, pos.startX);
    });
    
}

function placeObstacle(board, obstacle, startX, startY){
    for (coordinatePair of obstacle){
        [x,y] = coordinatePair;
        board[startX + y][startY + x] = 'W'
    }
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1 )) + min
}

function randomEmptyPosition(board){

    x = randomInt(1, BOARD_SIZE -2);
    y = randomInt(1, BOARD_SIZE - 2);
    
    if (getCell(board, x, y) === ' '){
        return [x, y];
    } else {
        return randomEmptyPosition(board);
    }
}

class Player {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

move(deltaX, deltaY){

    //otetaan talteen pelaajan nykyiset koordinaatit
    const currentX = player.x
    const currentY = player.y

    //console.log("nykyinen sijainti:")
    //console.log(currentX,currentY);

    //lasketaan uusi sijainti
    const newX = currentX + deltaX;
    const newY = currentY + deltaY;

    if (getCell(board, newX, newY) === ' '){

    //päivitä pelaajan sijainti
    player.x = newX;
    player.y = newY;

    // päivitetään pelikenttä
    board[currentY][currentX] = ' '; //tyhjätään vanhapaikka
    board[newY][newX] = 'P'; // asetetaan pelaaja uuteen paikkaan
    }

    drawBoard(board);
}
  }

  class Ghost {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

function shootAt(x,y){

    setCell(board, x, y, 'B');
    drawBoard(board);
}
