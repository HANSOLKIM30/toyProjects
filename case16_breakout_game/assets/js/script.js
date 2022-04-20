(function() {
    'use strict';
    const get = (target) => {
        return document.querySelector(target);
    }

    class BrickBreak {
        
        constructor(parent = 'body', data = {}) { // initiate args

            this.parent = get(parent);

            // set attributes of elements drawn on canvas
            // canvas
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('width', 480);
            this.canvas.setAttribute('height', 340);
            this.ctx = this.canvas.getContext('2d');
            
            // font 
            this.fontFamily = "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
            
            // numbers
            this.socre = 0;
            this.lives = data.lives;
            this.speed = data.speed;

            // background
            this.image = document.createElement('img');
            this.background = data.background;
            this.image.setAttribute('src', this.background);

            // ball
            this.radius = 10;
            this.ballX = this.canvas.width / 2;
            this.ballY = this.canvas.height - 30;
            this.directionX = data.speed;
            this.directionY = data.speed;

            // paddle
            this.paddleWidth = data.paddleWidth;
            this.paddleHeight = data.paddleHeight;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2

            // paddle - keyboard
            this.leftPressed = false;
            this.rightPressed = false;

            // bricks
            this.brickRow = data.brickRow;
            this.brickCol = data.brickCol;
            this.brickWidth = data.brickWidth;
            this.brickHeight = data.brickHeight;
            this.brickPad = data.brickPad;
            this.brickPosX = data.brickPosX;
            this.brickPosY = data.brickPosY;
            
            // color
            this.ballColor = data.ballColor;
            this.paddleColor = data.paddleColor;
            this.fontColor = data.fontColor;
            this.brickStartColor = data.brickStartColor;
            this.brickEndColor = data.brickEndColor;

            // draw canvas
            this.parent.appendChild(this.canvas);

            // set bricks
            this.bricks = [];
        };

        init = () => {
            // initiate brickes array - 2 Dimensional Array
            for(let colIndex = 0; colIndex < this.brickCol; colIndex++) {
                // this.bricks[colIndex] = [];
                for(let rowIndex = 0; rowIndex < this.brickRow; rowIndex++) {
                    this.brickes[colIndex][rowIndex] = { x: 0, y: 0, status: 1 }
                }
            }
            
            // this.keyEvent
            this.draw();
        }

        // draw elements on canvas
        draw = () => {
            // clear canvas content
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // draw background
            // drawImage(image, dx, dy)
            // set dx, dy to draw the image on center of the canvas
            this.ctx.drawImage (
              this.image, 
              (this.canvas.width / 2) - (this.image.width / 2),
              (this.canvas.height / 2) - (this.image.height / 2)
            );

            // darw the ball
            this.drawBall();

            // draw the paddle
            this.drawPaddle();

            // draw bricks
            this.drawBricks();

            // draw the score
            this.drawScore();
            
            // draw the lives - chances to play
            this.drawLives();
            
            // collision detection between bricks and the ball
            this.detectCollision();
        }
    }

    const data = {
        lives: 5,
        speed: 2,
        paddleHeight: 10,
        paddleWidth: 75,
        background: './assets/images/bg.jpeg',
        ballColor: '#04BF55',
        paddleColor: '#05AFF2',
        fontColr: '#F2BB16',
        brickStartColor: '#F29F05',
        brickEndColor: '#F21905',
        brickRow: 3,
        brickCol: 5,
        brickWidth: 75,
        brickHeight: 20,
        brickPad: 10,
        brickPosX: 30,
        brickPosY: 30,
    }
    
    // 객체를 사용한 구현
    const brickBreak = new BrickBreak('.canvas', data);
    
    //brickBreak.init();
    
})();