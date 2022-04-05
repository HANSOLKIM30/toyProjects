(function () {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    // debounce, throttle 개념
    // debunce -> 특정 시간이 지나면 함수 실행
    // throttle -> 일정 주기마다 이벤트 발생(주기가 맞지않으면 실행 X)
    let timerId; 

    const throttle = (callback, time) => {
        // timerId에 할당된 함수가 있으면 이벤트에 따른 함수 실행이 들어와도 종료
        if(timerId) {
            return;
        }
        // timerId에 할당된 함수가 없으면 일정 시간 지난 후 callback 함수가 실행되는 함수를 등록
        timerId = setTimeout(() => {
            // time만큼의 시간이 지난 후에 callback 함수 실행.
           callback();
           // callback 함수 실행 후 timerId에 할당된 함수를 없앰.
           timerId = undefined;
        }, time);
    }

    const $progressBar = get('.progress-bar');

    const onScroll = () => {
        // https://media.vlpt.us/images/wiostz98kr/post/dec62e7b-1432-4db2-8154-8539fb0b3689/image.png
        const height = 
        document.documentElement.scrollHeight - 
        document.documentElement.clientHeight;
     
        const scrollTop = document.documentElement.scrollTop;
        
        const width = (scrollTop / height) * 100;

        $progressBar.style.width = width + '%';
    }

    window.addEventListener('scroll', () => throttle(onScroll, 100));

})();