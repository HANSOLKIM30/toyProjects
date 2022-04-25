// 실제 시간 계산에는 절대 단독으로 사용하지 않는 setTimeout과 setInterval
// ==> JS는 싱글 스레드이기 때문에 타이머 이벤트가 정확한 간격으로 발생하지 않기 때문이다.
// ==> [해결방법]: Date.now()를 사용해 정확한 시간을 가져오고, 이 현재 시간을 경과된 시간과 비교하여 계산.
(function() {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    };

    // use Class
    class Stopwatch {
        constructor(element) {
            this.timer = element;
            this.interval = null;
            this.defaultTime = '00:00.00';
            this.startTime = 0;
            this.elapsedTime = 0;
    
        };

        addZero(number) {
            if(number < 10) {
                return '0' + number;
            }
            // 100의 자리로 표시되는 milliSeconds ==> 마지막 자리수를 잘라 10의 단위로 만들기.
            if(number > 99) {
                return number.toString().slice(0, -1);
            }
            return number;
         }

        timeToString(time) {
            // getUTC: UTC를 기준으로 값을 리턴
            const date = new Date(time);
            const minutes = date.getUTCMinutes();
            const seconds = date.getUTCSeconds();
            const milliseconds = date.getUTCMilliseconds();
            return `${this.addZero(minutes)}:${this.addZero(seconds)}.${this.addZero(milliseconds)}`;
        }

        print(time) {
            this.timer.innerHTML = time;
        }

        startTimer() {
            // setInterval에서 설정한 시간만큼의 간격(10ms)으로 update
            // 경과된 시간(elapsedTime) update ==> 현재시간 - 시작시간
            this.elapsedTime = Date.now() - this.startTime;
            const time = this.timeToString(this.elapsedTime);
            this.print(time);
        };

        start() {
            // start를 중복해서 누르면, setInterval이 다중 설정됨.
            // ==> 방지하기 위해 시작 전에 한 번 더 clearInterval 처리 
            clearInterval(this.interval);
            // 시작시간 update ==> 현재시간 - 경과된 시간
            // 최초 시작 시 startTime ==> 현재 시간
            // stop 후 시작 ==> 기존의 경과된 시간(this.elapsedTime)에서 현재시간을 뺀 시간을 startTime으로 업데이트
            this.startTime = Date.now() - this.elapsedTime;
            // bind startTimer
            // setInterval을 불러오는 주체는 window가 되기 때문에 this 바인딩
            this.interval = setInterval(this.startTimer.bind(this), 10);
        };

        stop () {
            clearInterval(this.interval);
        };

        reset () {
            this.print(this.defaultTime);
            clearInterval(this.interval);
            this.startTime = 0;
            this.elapsedTime = 0;
            this.interval = null;
        };
    }

    const $startButton = get('.timer-button.start');
    const $stopButton = get('.timer-button.stop');
    const $resetButton = get('.timer-button.reset');
    const $timer = get('.timer');
    const stopwatch = new Stopwatch($timer);

    $startButton.addEventListener('click', () => {
        stopwatch.start();
    });

    $stopButton.addEventListener('click', () => {
        stopwatch.stop();
    });

    $resetButton.addEventListener('click', () => {
        stopwatch.reset();
    });

})();