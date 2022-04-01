(function () {
    'use strict';

    // Util Method
    const get = (target) => {
        return document.querySelector(target);
    }

    const init = () => {
        get('form').addEventListner('submit', (event) => {
            playGame(event);
        });

        setHomeRun();
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

    // 구조분해 할당을 통해 baseball의 값을 선언
    const { limit, digit, $question, $answer, $input } = baseball;

    const setHomeRun = () => {
        //  4자리 숫자를 모두 맞추었을 때
    }

    const onPlayed = (number, hit) => {
        // 시도를 했을 때 - number: 내가 입력한 숫자, hit: 현재 어떤 상황?
        return `<em>${trial}차 시도</em>: ${number}, ${hit}`
    }

    const isCorrect = () => {
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

    const getResult = () => {
        // 시도에 따른 결과는?
    }

    const playGame = () => {
        // 게임 플레이
    }

    init();
})();