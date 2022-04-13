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
        // document.addEventListener('keydown', (e) => {
        //     if(!/Arrow/gi.test(e.key)) {
        //         return;
        //     }
        //     e.preventDefault();
        //     const direction = getDirection(e.key);
        //     // 잘못된 방향키면 종료
        //     if(!isDirectionCorrect(direction)) {
        //         return;
        //     }
        // });

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
                //randomFood();
                // requestAnimationFrame을 이용하여 play 함수 반복실행
                window.requestAnimationFrame(play);
            }
        }
    }

    const buildBoard = () => {
        ctx.fillStyle = colorSet.board;
        ctx.fillRect(0, 0, 300, 300);
    }

    const buildSnack = (ctx, x, y, head = false) => {
        ctx.fillStyle = head ? colorSet.snakeHead : colorSet.snakeBody;
        ctx.fillRect(x, y, 10, 10);
    }

    const buildFood = (ctx, x, y) => {
        ctx.beginPath();    // arc 사용하기 위해 beginPath 실행
        ctx.fillStyle = colorSet.food;
        // x, y, raius, stargAngle, endAngle
        ctx.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
        ctx.fill(); // or stroke
    }

    const setSnake = () => {
        for(let i = option.snake.length -1; i >= 0; i--) {
            buildSnack(ctx, option.snake[i].x, option.snake[i].y, i === 0);
        }
    }

    // timestamp: 대기된 콜백을 실행하는 시점을 나타내는 단일 인자
    const play = (timestamp) => {
        
        start++;
        console.log(start)
        console.log(timestamp)
        // 반복실행하다가 option의 gameEnd가 true로 변하면 종료
        if(option.gameEnd) {
            return;
        }
        
        // 반복되는 요소 넣어주기
        if(timestamp - start > 1000 / 10) {
            buildBoard();
            setSnake();
            buildFood(ctx, option.food.x, option.food.y);
            // frame을 사용하기 위해 start를 사용?!?!
            start = timestamp;
        }
        // 반복되지 않는 요소를 재귀적으로 삽입
        //window.requestAnimationFrame(play);

        // if(isGemeOver()) {
        //     option.gameEnd = true;
        //     setHighScore();
        //     alert('게임오버');
        //     return;
        // }`
    }

    init();
})();