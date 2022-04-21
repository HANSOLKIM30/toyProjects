(function() {
    'use strict';
    const get = (target) => {
        return document.querySelector(target);
    }

    const keyEventListener = (control, func) => {
        // addEventListener(eventType, listener, useCapture)
        // useCapture ==> 이벤트 대상의 DOM 트리 하위에 위치한 자손 EventTarget으로 이벤트가 전달되기 전에, 이 수신기가 먼저 발동되어야 함을 나타냄.
        document.addEventListener(control, func, false);
    }

    class BrickBreak {
        
        constructor(parent = 'body', data = {}) { // initiate args

            this.parent = get(parent);

            // set attributes of elements drawn on canvas
            // canvas
            this.canvas = document.createElement('canvas');
            this.canvas.setAttribute('width', 480);
            this.canvas.setAttribute('height', 320);
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
            // ballX, ballY: center of the circle
            this.ballX = this.canvas.width / 2;
            this.ballY = this.canvas.height - 45;
            this.directionX = data.speed;
            this.directionY = -data.speed;

            // paddle
            this.paddelImageElement = document.createElement('img');
            this.paddleImage = data.paddleImage;
            this.paddelImageElement.setAttribute('src', this.paddleImage);
            this.paddleWidth = data.paddleWidth;
            this.paddleHeight = data.paddleHeight;
            this.paddleX = (this.canvas.width - this.paddleWidth) / 2;
            
            // keyboard event
            this.leftPressed = false;
            this.rightPressed = false;

            // bricks
            this.bricksRow = data.bricksRow;
            this.bricksCol = data.bricksCol;
            this.brickWidth = data.brickWidth;
            this.brickHeight = data.brickHeight;
            this.brickPad = data.brickPad;
            this.brickPosX = data.brickPosX;
            this.brickPosY = data.brickPosY;
            
            // color
            this.fontColor = data.fontColor;
            this.brickStartColor = data.brickStartColor;
            this.brickEndColor = data.brickEndColor;

            // draw canvas
            this.parent.appendChild(this.canvas);

            // set bricks
            this.bricks = [];
        };

        init = () => {
            // 시작될때마다 블록 초기화
            for(let colIndex = 0; colIndex < this.bricksCol; colIndex++) {
                /***** technically impossible to create a 2d array in javascript ==> use the format below. *****/
                this.bricks[colIndex] = [];
                for(let rowIndex = 0; rowIndex < this.bricksRow; rowIndex++) {
                    this.bricks[colIndex][rowIndex] = { x: 0, y: 0, status: 1 }
                }
            }
            
            // 이벤트 감지 시작
            this.keyEvent();
            
            // 화면에 그리기
            this.draw();
        }

        // release the key
        keyupEvent = (event) => {
            if('Right' === event.key || 'ArrowRight' === event.key) {
                this.rightPressed = false;
            } else if('Left' === event.key || 'ArrowLeft' === event.key) {
                this.leftPressed = false;
            }
        }

        // press the key
        keydownEvent = (event) => {
            if('Right' === event.key || 'ArrowRight' === event.key) {
                this.rightPressed = true;
            } else if('Left' === event.key || 'ArrowLeft' === event.key) {
                this.leftPressed = true;
            }
        }

        // mouse controll
        moveMouseEvent = (event) => {
            // MouseEvent.clientX: 마우스의 좌표를 받아온다
            // element.offsetLeft: the number of pixels that the upper left corner of the current element
            // https://media.vlpt.us/images/wiostz98kr/post/dec62e7b-1432-4db2-8154-8539fb0b3689/image.png
            const positionX = event.clientX - this.parent.offsetLeft;

            const positionY = event.clientY - this.parent.offsetTop;

            // 마우스가 canvas(=parent) 밖으로 넘어가면 paddle의 움직임 X
            if(0 < positionX && positionX < this.canvas.width && 0 < positionY && positionY < this.canvas.height) {
                this.paddleX = positionX - this.paddleWidth / 2;
                
                if(this.paddleX + this.paddleWidth > this.canvas.width) {
                    this.paddleX = this.canvas.width - this.paddleWidth;
                } else if(this.paddleX < 0) {
                    this.paddleX = 0;
                }
            }            
        }

        // detect events and execute its callback function
        keyEvent = () => {
            keyEventListener('keyup', this.keyupEvent);
            keyEventListener('keydown', this.keydownEvent);
            keyEventListener('mousemove', this.moveMouseEvent);
        }

        drawBall = () => {
            // Create a radial gradient
            // The inner circle is at x=110, y=90, with radius=30
            // The outer circle is at x=100, y=100, with radius=70
            let gradient = this.ctx.createRadialGradient(
                this.ballX + (this.radius * 0.3), this.ballY - (this.radius * 0.3), (this.radius * 0.3), 
                this.ballX, this.ballY, this.radius
            );
            gradient.addColorStop(0, 'yellow');
            gradient.addColorStop(1, 'red');
            // draw circle
            this.ctx.beginPath();
            // arc(x, y, raius, startAngle, endAngle)
            this.ctx.arc(this.ballX, this.ballY, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
            this.ctx.closePath();
        }

        // draw paddle on the floor of the canvas
        drawPaddle = () => {
            this.ctx.drawImage(
                this.paddelImageElement, 
                this.paddleX, 
                this.canvas.height - this.paddleHeight, 
                this.paddleWidth, 
                this.paddleHeight);
        }

        drawBricks = () => {
            // initiate coordinate of a brick
            let brickX = 0;
            let brickY = 0;
            // crateLinearGradient(x0, y0, x1, y1): 뒤에 gradient를 깔아주고 그 후에 선언한 도형의 크기만큼만 보임.
            let gradient = this.ctx.createLinearGradient(0, 0, 200, 0);
            // Add two color stops
            gradient.addColorStop(0, this.brickStartColor);
            gradient.addColorStop(1, this.brickEndColor);

            for(let colIndex = 0; colIndex < this.bricksCol; colIndex++) {
                for(let rowIndex = 0; rowIndex < this.bricksRow; rowIndex++ ) {
                    // if a value of status equals 1, do not draw
                    if(1 !== this.bricks[colIndex][rowIndex].status) {
                        continue;
                    }
                    
                    brickX = colIndex * (this.brickWidth + this.brickPad) + this.brickPosX;
                    brickY = rowIndex * (this.brickHeight + this.brickPad) + this.brickPosY;
                    
                    this.bricks[colIndex][rowIndex].x = brickX;
                    this.bricks[colIndex][rowIndex].y = brickY;
                    
                    this.ctx.beginPath();
                    this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
                    this.ctx.fillStyle = gradient;
                    this.ctx.fill();
                    this.ctx.closePath();
                }
            }
        }

        drawScore = () => {
            this.ctx.font = this.fontFamily;
            this.ctx.fillStyle = '#fff';
            // fillText(text, x, y, [maxWidth])
            this.ctx.fillText(`Score: ${this.socre}`, 10, 22);
        }

        drawLives = () => {
            // this.ctx.font = this.fontFamily;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText( `Lives: ${this.lives} `, this.canvas.width - 73, 22)
        }

        detectCollision = () => {

        }

        // draw elements on canvas
        draw = () => {
            // clear canvas content
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // draw background
            // drawImage(image, dx, dy, width, height)
            this.ctx.drawImage(this.image, 0, 0, 480, 320);
            
            this.drawBall();

            this.drawPaddle();

            this.drawBricks();

            this.drawScore();
            
            this.drawLives();
            
            // collision detection between bricks and the ball
            this.detectCollision();

            // Bounce off the walls
            // ballX(Y) + directX(Y) ==> 앞으로 이동할 곳의 위치
            if(
                this.ballX + this.directionX > this.canvas.width - this.radius || 
                this.ballX + this.directionX < this.radius 
            ) {
                this.directionX = -this.directionX;
            }

            if(
                this.ballY + this.directionY < 0 ) {
                this.directionY = -this.directionY;
            } else if (this.ballY + this.directionY > this.canvas.height - this.paddleHeight) {
                if(this.ballX > this.paddleX - 10 && this.ballX < this.paddleX + this.paddleWidth + 10) {
                    this.directionY = - this.directionY;
                } else {
                    // end
                    this.lives--;
                    if(this.lives === 0) {
                        alert('');
                        this.reset();
                    } else {
                        // 초기 설정으로 되돌리기
                        this.ballX = this.canvas.width / 2;
                        this.ballY = this.canvas.height - 45;
                        this.directionX = this.speed;
                        this.directionY = -this.speed;
                        this.paddleX = (this.canvas.width - this.paddleWidth) / 2
                    }
                }
            }

            // move the paddle
            if(this.rightPressed) {
                this.paddleX += 7;
                // paddle이 canvas 밖으로 벗어날 경우, 벽에 딱 붙이게 표시되도록 구현
                if(this.paddleX + this.paddleWidth > this.canvas.width) {
                    this.paddleX = this.canvas.width - this.paddleWidth;
                }   
            } else if(this.leftPressed && 0 < this.paddleX) {
                this.paddleX -=7;
                if(this.paddleX < 0) {
                    this.paddleX = 0;
                }
            }

            // move the ball: move to (x+2, y+2) ==> draw diagonal line
            this.ballX += this.directionX;  
            this.ballY += this.directionY;

            // gameover 될 때까지 재귀적으로 계속 호출되어야 한다.
            requestAnimationFrame(this.draw);
        }

        reset = () => {
            // reloads the current URL
            document.location.reload();
        }
    }

    const data = {
        lives: 5,
        speed: 2,
        paddleHeight: 45,
        paddleWidth: 55,
        background: './assets/images/backgroundImage.jpg',
        ballColor: '#89C7DE',
        paddleImage: './assets/images/alien.png',
        paddleColor: '#6D85CF',
        fontColr: '#F2BB16',
        brickStartColor: '#380762',
        brickEndColor: '#EF3A65',
        ballStartColor: '#fff',
        ballEndColor: '#000',
        bricksRow: 3,
        bricksCol: 5,
        brickWidth: 75,
        brickHeight: 20,
        brickPad: 10,
        brickPosX: 30,  // coordinate of the first brick
        brickPosY: 40,
    }
    
    // 객체를 사용한 구현
    const brickBreak = new BrickBreak('.canvas', data);

    brickBreak.init();   
})();