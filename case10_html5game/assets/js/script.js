(function() {
    'use strict';

    // 개인적으로 해볼만한 것.
    // 1. 벽에 부딫히면 죽게하기
    // 2. play -> pause ==> pause 시에 해당 데이터 저장하기?
    const get = (target) => {
        return document.querySelector(target);
    }

    const $canvas = get('.canvas');
    // ctx를 통해서 $canvas 조작
    const ctx = $canvas.getContext('2d');

    const $score = get('.score');
    const $highScore = get('.high-score');
    const $play = get('.js-play');

    const colorSet = {
        board: 'rgb(20, 105, 38)',
        snakeHead: 'rgba(229, 65, 120, 0.929)',
        snakeBody: 'rgba(153, 206, 244, 0.798)',
        food: 'rgb(66, 187, 103)'
    }

    let start = 0;
    let option = {
        highScore: localStorage.getItem('score') || 0,
        gameEnd: true,
        direction: 2,
        snake : [
           {x: 10, y: 10, direction: 2}, 
           {x: 10, y: 20, direction: 2}, 
           {x: 10, y: 30, direction: 2}, 
        ],
        food: {x: 0, y: 0},
        score: 0,
    };

    const init = () => {
        document.addEventListener('keydown', (e) => {
            // e.key의 앞에 Arrow가 들어있지 않으면 메서드 종료
            if(!/Arrow/gi.test(e.key)) {
                return;
            }
            e.preventDefault();
            // key값을 숫자로 변환시키는 getDirection 메서드
            const direction = getDirection(e.key);
            // 잘못된 방향키면 종료
            if(!isDirectionCorrect(direction)) {
                return;
            }
            // option.direction에 숫자로 변환한 e.key 값을 저장
            option.direction = direction;
        });

        $play.onclick = () => {
            // gameEnd가 true인 상태라면, 
            if(option.gameEnd) {
                // option 값 다시 설정
                option = {
                    highScore: localStorage.getItem('score') || 0,
                    gameEnd: false, // gameEnd = false로 변경
                    direction: 2,
                    snake : [
                        {x: 10, y: 10, direction: 2}, 
                        {x: 10, y: 20, direction: 2}, 
                        {x: 10, y: 30, direction: 2}, 
                     ],
                     food: {x: 0, y: 0},
                     score: 0,
                }
                $score.innerHTML = '점수: 0점';
                $highScore.innerHTML = `최고점수: ${option.highScore}`;
                randomFood();
                // requestAnimationFrame을 이용하여 play 함수 반복실행
                window.requestAnimationFrame(play);
            }
        }
    }

    // 게시판을 만드는 메서드
    const buildBoard = () => {
        ctx.fillStyle = colorSet.board;
        ctx.fillRect(0, 0, 300, 300);
    }

    // 뱀을 만드는 메서드 
    // 몸통의 크기는 10px씩
    const buildSnack = (ctx, x, y, head = false) => {
        // head와 body의 색깔 다르게 지정
        ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody;
        ctx.fillRect(x, y, 10, 10);
    }

    // 먹이를 만드는 메서드
    const buildFood = (ctx, x, y) => {
        ctx.beginPath();    // arc 사용하기 위해 beginPath 실행
        ctx.fillStyle = colorSet.food;
        // x, y, raius, startAngle, endAngle
        ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
        // ctx.arc(x , y , 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    // 뱀을 set하기
    const setSnake = () => {
        for(let i = option.snake.length -1; i >= 0; i--) {
            // i===0: 첫번째로 온 snake의 요소만 head로 지정
            buildSnack(ctx, option.snake[i].x, option.snake[i].y, i === 0);
        }
    }

    // 방향을 정하는 메서드
    // value는 10씩 증가 ==> snake의 구성요소 한 칸이 10px
    const setDirection = (number, value) => {
        while(value < 0) {
            value += number;
        }
        
        return value % number;
    }

    // e.key값에 따른 숫자 지정
    const getDirection = (key) => {
        let direction = 0;
        switch (key) {
            case 'ArrowDown':
                direction = 1;
                break;
            case 'ArrowUp':
                direction = -1;
                break;
            case 'ArrowLeft':
                direction = -2;
                break;
            case 'ArrowRight':
                direction = 2;
                break;
        }
        return direction;
    }

    const isDirectionCorrect = (direction) => {
        return (
            option.direction === option.snake[0].direction && 
            option.direction !== -direction
        )
    }

    // snake의 body 늘리기
    const setBody = () => {
        // snake의 마지막 부분 가져오기
        const tail = option.snake[option.snake.length -1];
        const direction = tail.direction;
        let x = tail.x;
        let y = tail.y;
        switch (direction) {
            // down
            case 1:
                // y값 변경
                y = setDirection(300, y - 10);
                break;
            // up
            case -1:
                y = setDirection(300, y + 10);
                break;
            // left
            case -2:
                x = setDirection(300, x + 10);
                break;
            // right 
            case 2:
                x = setDirection(300, x - 10)
                break;
        }
        option.snake.push(x, y, direction);
    }

    const getFood = () => {
        const snakeX = option.snake[0].x;
        const snakeY = option.snake[0].y;
        const foodX = option.food.x;
        const foodY = option.food.y;

        // snake head가 먹이를 먹는 경우
        if(snakeX === foodX && snakeY === foodY) {
            option.score++;
            $score.innerHTML = `점수: ${option.score}점`;
            // snake의 body 늘리기
            setBody();
            // food 재배치
            randomFood();
        }
    }

    const randomFood = () => {
        let x = Math.floor(Math.random() * 25) * 10;
        let y = Math.floor(Math.random() * 25) * 10;
        // 배열 중에 일치하는 요소를 만나게 되면 return(cf. every)
        // snake와 겹치지 않도록, option의 snake 배열의 구성요소(part)를 각각 돌면서, 
        // 먹이의 x, y === snake의 x,y가 같으면 먹이를 다시 놓는다
        while(option.snake.some((part) => part.x === x && part.y === y)) {
            x = Math.floor(Math.random() * 25) * 10;
            y = Math.floor(Math.random() * 25) * 10;
        }
        option.food = { x, y };
    }

    const playSnake = () => {
        let x = option.snake[0].x;
        let y = option.snake[0].y;

        switch (option.direction) {
            case 1:
                y = setDirection(300, y + 10);
                break;
            case -1:
                y = setDirection(300, y - 10);
                break;
            case 2:
                x = setDirection(300, x + 10);
                break;
            case -2:
                x = setDirection(300, x - 10);
                break;
        }
        const snake = [{ x, y, direction: option.direction }];
        const snakeLength = option.snake.length;
        for(let i = 1; i < snakeLength; i++) {
            snake.push({ ...option.snake[i - 1] });
        }
        option.snake = snake;
    }

    
    // timestamp: 대기된 콜백을 실행하는 시점을 나타내는 단일 인자
    const play = (timestamp) => {
        
        // 반복실행하다가 option의 gameEnd가 true로 변하면 종료
        if(option.gameEnd) {
            return;
        }
        
        // timestamp ==> JS가 최초로 로드된 후 해당 메서드를 불러오는데 걸린 시간
        // 1000 / 10 ==> duration
        // 6번의 주기로 한 번씩 반복
        // 반복되는 요소 넣어주기
        if(timestamp - start > 1000 / 10) {
            playSnake();
            buildBoard();
            setSnake();
            buildFood(ctx, option.food.x, option.food.y);
            getFood();
            start = timestamp;
        }
        // if문을 충족시키지 못해도 requestAnimationFrame을 통해 play가 실행될 수 있도록 함.
        window.requestAnimationFrame(play);

        // if(isGemeOver()) {
        //     option.gameEnd = true;
        //     setHighScore();
        //     alert('게임오버');
        //     return;
        // }`
    }

    init();
})();