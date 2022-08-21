import Grid from "./grid.js";
import Snake from "./snake.js";
import { sendScores } from './api.js';

export default class Game {
    constructor() {
        this.bite = new Audio('public/audio/bite.mp3');
        this.bite.volume = 0.05;
        this.snake = new Snake();
        this.grid = new Grid(15, 15);
        this.score = 0;
        this.finalScore = 0;
        this.time = '0:00';
        this.seconds = 0;
        this.lastKey = 39;
        this.intervalTime = 300;
        this.init();
    };

    init() {
        this.snake.createSnake();
        this.grid.addSnake(this.snake.getSnake());
        this.grid.addApple(true);
        this.grid.drawGrid();
        this.gameinterval();
        this.timerInterval();
        this.keyListeners();
    };

    gameinterval() {
        this.interval = setInterval(() => {
            this.snake.moveSnake();
            this.grid.addGrid();
            this.grid.addSnake(this.snake.getSnake());
            this.grid.addApple(this.checkAppleCollision());
            this.checkGameOver();
            this.grid.drawGrid();
        }, this.intervalTime);
    };

    keyListeners() {
        const keyCodes = {
            37: key => [38, 40].includes(key) ? { x: 0, y: -1 } : null,   // left
            38: key => [37, 39].includes(key) ? { x: -1, y: 0 } : null,   // up
            39: key => [38, 40].includes(key) ? { x: 0, y: 1 } : null,    // right
            40: key => [37, 39].includes(key) ? { x: 1, y: 0 } : null,    // down
        };
        this.keyboard = window.addEventListener('keydown', event => {
            event.preventDefault();
            if ([37, 38, 39, 40].includes(event.keyCode)) {
                const direction = keyCodes[event.keyCode](this.lastKey);
                if (direction) {
                    this.snake.x = direction.x;
                    this.snake.y = direction.y;
                    this.lastKey = event.keyCode;
                };
            };
        });
    };

    checkAppleCollision() {
        if (this.snake.head.x === this.grid.apple.x &&
            this.snake.head.y === this.grid.apple.y) {
            this.score++;
            this.calculateScore();
            this.snake.addSnake();
            this.increaseInterval();
            this.bite.play();
            return true;
        };
        return false;
    };

    checkGameOver(userStopped = false) {
        if (!document.querySelector('.head') || userStopped) {
            clearInterval(this.timer);
            clearInterval(this.interval);
            if (!userStopped) {
                this.showResults();
                sendScores({
                    finalScore: this.finalScore,
                    snakeLength: this.snake.length,
                    totalTime: this.time,
                    maxSpeed: this.intervalTime,
                })
            };
        };
    };

    increaseInterval() {
        document.querySelector('#score').innerText = this.finalScore;
        document.querySelector('#length').innerText = this.snake.length;
        
        if (this.score % 3 === 0 && this.intervalTime > 50) {
            clearInterval(this.interval);

            if (this.score <= 6) this.intervalTime -= 50;
            else if (this.score <= 12) this.intervalTime -= 25;
            else if (this.score <= 18) this.intervalTime -= 15;
            else if (this.score <= 24) this.intervalTime -= 10;
            else this.intervalTime -= 5;

            document.querySelector('#speed').innerText = this.intervalTime;
            this.gameinterval();
        };
    };

    timerInterval() {
        this.timer = setInterval(() => {
            ++this.seconds;
            const mins = Math.floor(this.seconds / 60);
            const seconds = this.seconds % 60;
            this.time = `${mins}:${seconds < 10 ? '0' + seconds : seconds}`;
            document.querySelector('#time').innerText = this.time;
        }, 1000);
    };

    showResults() {
        document.querySelector('#board').style.opacity = .3;
        document.querySelector('#game-over').style.display = 'block';
        document.querySelector('#gr-score').innerText = this.finalScore;
        document.querySelector('#gr-length').innerText = this.snake.length;
        document.querySelector('#gr-time').innerText = this.time;
        document.querySelector('#gr-speed').innerText = this.intervalTime;
    };

    calculateScore() {
        this.finalScore =  (this.score * this.snake.length) - this.seconds;
    };
};



