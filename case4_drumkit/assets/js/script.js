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

    const init = () => {
        keys.forEach((key, index) => {
            const audio = getAudioElement(index);
            key.appendChild(audio);
        })
    };

    init();
})();


