import Game from './game.js';

const gameStart = document.querySelector('#game-start');
const gameContent = document.querySelector('#game-content');
let game;

// start game
document.querySelector('#play-button').addEventListener('click', () => {
    gameStart.style.display = 'none';
    gameContent.style.display = 'flex';
    game = new Game();
});


// quit game
document.querySelector('#quit-button').addEventListener('click', () => {
    document.querySelector('#game-over').style.display = 'none';
    gameStart.style.display = 'flex';
    gameContent.style.display = 'none';
    game.checkGameOver(true);
    game = null;
    resetGameStats();
});

// play again
document.querySelector('#restart-button').addEventListener('click', () => {
    gameStart.style.display = 'flex';
    gameContent.style.display = 'none';
    document.querySelector('#game-over').style.display = 'none';
    game = null;
    resetGameStats();
});

// reset game info stats
const resetGameStats = () => {
    document.querySelector('#score').innerText = '0';
    document.querySelector('#length').innerText = '4';
    document.querySelector('#speed').innerText = '300';
    document.querySelector('#time').innerText = "0:00";
    document.querySelector('#board').style.opacity = 1;
};

// grid for play page
const drawGrid = () => {
    const board = document.querySelector('#fake-board');
    new Array(15).fill(null).forEach(row => new Array(15).fill(null).forEach(cell => {
        const div = document.createElement('div');
        div.classList.add('cell');
        board.append(div);
    }));
};
drawGrid();