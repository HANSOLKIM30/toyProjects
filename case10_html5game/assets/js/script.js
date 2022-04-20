(function() {

    'use strict';

    // 개인적으로 해볼만한 것.
    // 1. 벽에 부딫히면 죽게하기
    // 2. pause 기능 추가
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
        snakeSensor: 'rgba(0, 0, 0, 0)', // sensor ==> 투명하게 처리
        snakeHead: 'rgba(229, 65, 120, 0.929)',
        snakeBody: 'rgba(153, 206, 244, 0.798)',
        food: 'rgb(66, 187, 103)'
    }

    let start = 0;  // 게임에서 얻은 점수
    let option = {
        highScore: localStorage.getItem('score') || 0,
        gamePaused: false,
        gameEnd: true,
        direction: 2,
        snake : [
            {x: 10, y: 10, direction: 2},
            {x: 10, y: 20, direction: 2}, 
            {x: 10, y: 30, direction: 2}, 
            {x: 10, y: 40, direction: 2}, 
        ],
        food: {x: 0, y: 0},
        score: 0,
    };

    const init = () => {
        document.addEventListener('keydown', (e) => {
            // 정규식의 g, i
            // g: 발생할 모든 pattern에 대한 전역 검색
            // i: 대 / 소문자 구분 없음
            // ==> e.key의 앞 부분에 Arrow가 들어있지 않으면 addEventListener 종료
            if(!/Arrow/gi.test(e.key)) {
                return;
            }
            e.preventDefault();
            // getDirection: e.key값을 숫자로 변환 
            // up: 1, down: -1, right: 2, left: -2
            const direction = getDirection(e.key);
            
            // 잘못된 방향키면 종료
            if(!isDirectionCorrect(direction)) {
                return;
            }
            // option.direction에 숫자로 변환한 e.key 값을 저장
            option.direction = direction;
        });

        $play.onclick = () => {
            if(!option.gamePaused) {
                // 게임 실행
                $play.innerHTML = 'paused'.toUpperCase();
                // gameEnd가 true인 상태라면, 
                if(option.gameEnd) {
                    // option 값 초기화
                    option = {
                        highScore: localStorage.getItem('score') || 0,
                        gameEnd: false, // gameEnd = false로 변경
                        direction: 2,
                        snake : [
                            {x: 10, y: 10, direction: 2},
                            {x: 10, y: 20, direction: 2}, 
                            {x: 10, y: 30, direction: 2}, 
                            {x: 10, y: 40, direction: 2}, 
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
            } else {
                // 게임 멈춤
                $play.innerHTML = 'play'.toUpperCase();
            }
            option.gamePaused = !option.gamePaused;
        }
    }

    // buildBoard: 게시판 만듦
    const buildBoard = () => {
        ctx.fillStyle = colorSet.board;
        ctx.fillRect(0, 0, 300, 300);
    }

    // buildSnack: 하나의 크기가 10px인 snake의 구성요소를 만듦 
    const buildSnack = (ctx, x, y, index) => {
        // sensor, head, body의 색깔 다르게 지정
        if(index === 0) {   // sensor
            ctx.fillStyle = colorSet.snakeSensor;
        } else 
        if(index === 1) {   // head
            ctx.fillStyle = colorSet.snakeHead;
        } else {    // body
            ctx.fillStyle = colorSet.snakeBody;
        }
        ctx.fillRect(x, y, 10, 10);
    }

    // buildFood: 지름이 10px인 원인 food를 만듦
    const buildFood = (ctx, x, y) => {
        ctx.beginPath();    // arc 사용하기 위해 beginPath 실행
        ctx.fillStyle = colorSet.food;
        // x, y, raius, startAngle, endAngle
        // x, y의 기준은 arc의 center ==> food가 snake의 가운데 위치하게 하기 위해서는 snake 10px의 반만큼 x, y 이동 
        ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    // setSnake: snake를 만듦
    const setSnake = () => {
        for(let i = option.snake.length -1; i >= 0; i--) {
            // i===0: 첫번째로 온 snake의 요소만 head로 지정
            buildSnack(ctx, option.snake[i].x, option.snake[i].y, i);
        }
    }

    const setHighScore = () => {
        // * 1 ==> 숫자로 형변환
        const localScore = option.highScore * 1 || 0;
        
        // match: 정규식과 일치하는 전체 문자열을 첫번째 요소로 포함하는 Array 반환
        const finalScore = $score.textContent.match(/(\d+)/)[0] * 1;
        if(localScore < finalScore) {
            alert(`최고기록: ${finalScore}점`)
            localStorage.setItem('score', finalScore);
        }
        $highScore.innerHTML = `최고점수: ${localStorage.getItem('score')}`;
    }

    // getDirection: e.key값에 따른 숫자 지정
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

    // isDirectionCorrect: 방향이 올바른지 확인하여 return boolean
    const isDirectionCorrect = (direction) => {
        return (
            // 전체의 방향과, snake head의 방향이 같아야 하고,
            // 현재의 방향과 완전히 반대되는 방향이 아니어야 함.
            option.direction === option.snake[0].direction && 
            option.direction !== -direction
        )
    }

    // setBody: snake가 food를 먹을 경우, 그 body를 늘림
    const setBody = () => {
        // snake의 body의 마지막 부분 가져오기
        const tail = option.snake[option.snake.length -1];
        const direction = tail.direction;
        let x = tail.x;
        let y = tail.y;
        switch (direction) {
            case 1:
                // up
                y = y + 10;
                break;
            case -1:
                // down
                y = y - 10;
                break;
            case -2:
                // left
                x = x - 10;
                break;
            case 2:
                // right 
                x = x + 10
                break;
        }
        option.snake.push({x, y, direction});
    }

    const getFood = () => {
        const snakeX = option.snake[1].x;
        const snakeY = option.snake[1].y;
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
                // up
                y = y + 10;
                break;
            case -1:
                // down
                y = y - 10;
                break;
            case -2:
                // left
                x = x - 10;
                break;
            case 2:
                // right 
                x = x + 10
                break;
        }

        // snake의 head 값은 항상 새롭게 지정 ==> 움직인 좌표의 x, y, direction
        const snake = [{ x, y, direction: option.direction }];
        const snakeLength = option.snake.length;
        // snake body는 이전 snake의 head가 된다. 
        // requestAnimationFrame이 실행되면서 snake body 중 마지막이 없어지고 이전 head값이 1번 body가 되어 하나씩 당겨오는 형태로 실행됨.
        for(let i = 1; i < snakeLength; i++) {
            snake.push({ ...option.snake[i-1] });
        }
        option.snake = snake;
    }

    const isSmashedBody = () => {
        const sensor = option.snake[0];
        return option.snake.some((body, index) => {
            return index !== 0 && sensor.x === body.x && sensor.y === body.y;
        });
    }

    const isSmashedWall = () => {
        const sensor = option.snake[0];
        return sensor.x === -10 || sensor.x === 300 || sensor.y === -10 || sensor.y === 300; 
    }

    // timestamp: 대기된 콜백을 실행하는 시점을 나타내는 단일 인자
    // 일정시간(모니터 주파수)마다 play를 반복 실행
    const play = (timestamp) => {
        
        
        // 반복실행하다가 option의 gameEnd가 true로 변하면 종료
        if(option.gameEnd) {
            return;
        }
        
        // timestamp ==> JS가 최초로 로드된 후 해당 메서드를 불러오는데 걸린 시간
        // 1000 / 10 ==> 움직이는 시간 조절 가능 ==> 커질 수록 더 많은 시간이 지나야 하므로 느려짐.
        if(timestamp - start > 1000 / 10 && !!option.gamePaused) {
            if(isSmashedBody() ||  isSmashedWall()) {
                $play.innerHTML = 'REPLAY';
                option.gamePaused = false;
                option.gameEnd = true;
                setHighScore();
                alert('게임오버');
                return;
            }
            playSnake();    
            buildBoard();
            buildFood(ctx, option.food.x, option.food.y);
            setSnake();
            getFood();
            start = timestamp;            
        }
        // if문을 충족시키지 못해도 requestAnimationFrame을 통해 play가 실행될 수 있도록 함.
        window.requestAnimationFrame(play);
    }
    init();
})();