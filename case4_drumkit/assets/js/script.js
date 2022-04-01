// 즉시실행 함수
(function () {
    'use strict'
    
    const get = function(target) {
        return document.querySelector(target);    
    }

    const getAll = function(target) {
        return document.querySelectorAll(target);
    }

    const keys = Array.from(getAll('.key'));

    

    const soundsRoot = 'assets/sounds/';

    const drumSounds = [
        { key: 81, sound: 'clap.wav' },
        { key: 87, sound: 'crash.wav' },
        { key: 69, sound: 'hihat.wav' },
        { key: 65, sound: 'kick.wav' },
        { key: 83, sound: 'openhat.wav' },
        { key: 68, sound: 'ride.wav' },
        { key: 90, sound: 'shaker.wav' },
        { key: 88, sound: 'snare.wav' },
        { key: 67, sound: 'tom.wav' },
    ]

    const getAudioElement = (index) => {
        // <audio> 요소는 문서에 소리 콘텐츠를 포함할 때 사용한다.
        const audio = document.createElement('audio');
        audio.dataset.key = drumSounds[index].key;
        audio.src = soundsRoot + drumSounds[index].sound;

        return audio;
    }

    // 키코드를 입력받아 일치하는 키코드를 가지는 오디오 element 찾기
    // 사운드가 재생되는 순간에 key가 커지는 애니메이션 효과 주기
    const playSound = (keyCode) => {
        const $audio = get(`audio[data-key="${keyCode}"]`);
        const $key = get(`div[data-key="${keyCode}"]`);

        if($audio && $key) {
            $key.classList.add('playing');
            $audio.currentTime = 0;
            $audio.play();
        }
    }

    // 키보드를 눌렀을 때 이벤트 발생시키기
    const onKeyDown = (e) => {
        // event.keyCode는 사용자의 키입력 시, 해당 키보드의 번호를 아스키값으로 변환한 keyCode를 제공
        playSound(e.keyCode);
    }

    const onMouseDown = (e) => {
        const keyCode = e.target.getAttribute('data-key');
        playSound(keyCode);
    }

    const onTransitionEnd = (e) => {
        // transition과 관련된 property 호출
        // transform과 관련된 transition이 종료되었을 때(100ms 후) playing 클래스 제거
        if(e.propertyName === 'transform') {
            e.target.classList.remove('playing');
        }
    }

    const init = () => {
        window.addEventListener('keydown', onKeyDown);
        keys.forEach((key, index) => {
            const audio = getAudioElement(index);
            key.appendChild(audio);
            // click 이벤트 시 오디오의 data-key와 일치하는 값을 찾기 위해 부모인 key에도 data-key 속성 추가
            key.dataset.key = drumSounds[index].key;
            key.addEventListener('click', onMouseDown);
            // transitionend: 트렌지션 이벤트의 종료 여부를 감지
            key.addEventListener('transitionend', onTransitionEnd);
        });
    };

    init();
})();


