(function () {
    'use strict';

    // Util Method
    const get = (target) => document.querySelector(target);

    // init method
    const init = () => {
        get('form').addEventListener('submit', (event) => {
           playGame(event); 
        });

        // 함수 실행 전이라면 호이스팅 때문에 하단에 선언해도 상관없다.
        setPassword();
    }

    const baseball = {
        limit: 10,
        digit: 4,
        trial: 0,
        end: false,
        $question: get('.baseball-question'),
        $answer: get('.baseball-answer'),
        $input: get('.baseball-input'),
    }

    // 구조분해 할당을 통해 baseball의 각 속성의 값을 선언
    const { limit, digit, $question, $answer, $input } = baseball;
    let { trial, end } = baseball;

    // 0~9 중 중복 된 숫자 없이 random한 4자리의 숫자 만들기
    const setPassword = () => {
        // 10자리의 배열. 각 자리 수는 0~9까지 각 숫자의 사용 여부. 모두 false로 초기화
        const gameLimit = Array(limit).fill(false);
        //  생성할 패스워드
        let password = '';

        while(password.length < limit) {
            // parseInt의 두번째 인자인 radix를 통해 10진수로 만들어주기
            const random = parseInt(Math.random() * 10, 10);
            if(gameLimit[random]===true) {
                // gameLimit의 특정 숫자가 true라면, 이미 사용되었으므로 건너뜀.
                continue;
            }

            password += random;
            gameLimit[random] = true;

        }

        
    }

    const onPlayed = (number, hit) => {
        // 시도를 했을 때 - number: 내가 입력한 숫자, hit: 현재 어떤 상황?
        return `<em>${trial}차 시도</em>: ${number}, ${hit}`
    }

    const isCorrect = (inputNumber, password) => {
        // 번호가 같은가?
    }

    const isDuplicate = () => {
        // 중복번호가 있는가?
    }

    const getStrikes = () => {
        // 스트라이크 카운트는 몇 개?
    }

    const getBalls = () => {
        // 볼 카운트는 몇 개?
    }

    const getResult = (inputNumber, password) => {
        // 시도에 따른 결과는?
    }

    const playGame = (event) => {
        // 게임 플레이
        event.preventDefault();

        if(end) {
            return;
        }

        const inputNumber = $input.value;
        const { password } = baseball;

        if(inputNumber.length !== digit) {
        
            alert(`${digit}자리 숫자를 입력해주세요.`);
        
        } else if(isDuplicate(inputNumber)) {
        
            alert('중복 숫자가 있습니다.')
        
        } else {

            // 시도 횟수 증가
            trial++;
        
            const result = onPlayed(inputNumber, getResult(inputNumber, password));
            $question.innerHtml += `<span>${ result }</span>`

            // 시도횟수를 넘어서고, 답이 틀렸을 경우
            if(limit <= trial && !isCorrect(inputNumber, password)) {
                alert('쓰리아웃!');
                end = true;
                $answer.innerHtml = password;
            }
        }

        // 각각으 시도가 끝날 때마다 $input 값을 비워주고 포커싱 처리
        $input.value = '';
        $input.focus();
    }

    // implement init method
    init();
})();