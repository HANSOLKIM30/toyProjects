// https://developer.mozilla.org/en-US/docs/Web/API/MediaStream
(function() {
    'use strict';

    const get = (target) => document.querySelector(target);

    const allowUser = {
        audio: true,
        video: true,
    }

    class WebRtc {
        constructor() {
            this.media = new MediaSource();
            this.recorder;
            this.blobs;
            this.playVideo = get('.video.played');
            this.recordVideo = get('.video.record');
            this.btnDownload = get('.btn-download');
            this.btnRecord = get('.btn-record');
            this.btnPlay = get('.btn-play');
            this.container = get('.webrtc');
            this.events();
            // vedio 및 audio를 허용하기 위한 요청
            navigator.mediaDevices.getUserMedia(allowUser)
            .then((videoAudio) => {
                this.success(videoAudio);
            })
            .catch(function() {
                alert('장비가 없습니다.');
            });
        }

        events() {
            this.btnRecord.addEventListener('click', this.toggleRecord.bind(this))
            this.btnPlay.addEventListener('click', this.play.bind(this))
            this.btnDownload.addEventListener('click', this.download.bind(this))
        }

        // 허용 시, playVideo 버튼에 소스 할당
        success(videoAudio) {
            this.btnRecord.removeAttribute('disabled');
            window.stream = videoAudio;
            if(window.URL){
                this.playVideo.setAttribute('src', window.URL.createObjectURL(videoAudio));
            } else {
                this.playVideo.setAttribute('src', videoAudio);
            }
        }

        toggleRecord() {
            
            if('녹화' === this.btnRecord.textContent) {
                // 녹화 시작
                this.startRecord();
            } else { 
                // 녹화 종료
                this.btnPlay.removeAttribute('disabled');
                this.btnDownload.removeAttribute('disabled');
                this.btnRecord.textContent = '녹화';
                this.stopRecord();
            }
        }

        pushBlobData(event) {
            if(event.data || event.data.size < 1) {
                return;
            }
            this.blobs.push(event.data);
        }

        startRecord() {
            let type = { 
                mimeType: 'video/webm;codecs=vp9',
            };
            this.blobs = [];
            if(!MediaRecorder.isTypeSupported(type.mimeType)) {
                type = {
                    mimeType: 'video/webm'
                };
            }
            this.recorder = new MediaRecorder(window.stream, type);
            this.btnRecord.textContent = '중지';
            this.btnPlay.setAttribute('disabled', true);
            this.btnDownload.setAttribute('disabled', true);
            // 레코딩이 시작되게 되면, ondataavailable property 사용 가능
            // 해당 property에 pushBlobData 할당. ==> pushBlobData가 자동 호출 ==> blob 데이터로서 push하여 다운로드 가능
            this.recorder.ondataavailable = this.pushBlobData.bind(this);
            // 20초 가량 녹화하도록 구현
            this.recorder.start(20);
        }

        stopRecord() {
            this.recorder.stop();
            // 비디오를 재생시킬 수 있는 상태로 변경
            this.recordVideo.setAttribute('controls', true);
        }

        play() {
            // 소스에 Blob 객체의 비디오가 할당됨.
            this.recordVideo.src = window.URL.createObjectURL(
                new Blob(this.blobs, { type: 'video/webm' })
            );
        }

        download() {
            const videoFile = new Blob(this.blobs, { type: 'video/webm' });
            // Blob 객체를 url 타입으로 변경
            const url = window.URL.createObjectURL(videoFile);
            const downloader = document.createElement('a');
            downloader.style.display = 'none';
            downloader.setAttribute('herf', url);
            downloader.setAttribute('download', 'test_video.webm');
            this.container.appendChild(downloader);
            // 자동 다운로드
            downloader.click();
            // downloader는 다운로드 시, 한 번만 나오고 남아있으면 안되기 때문에 1초 정도 후에 삭제
            setTimeout(() => {
                this.container.removeChild(downloader);
                // window.URL.createObjectURL로 할당했던 url을 취소
                window.URL.revokeObjectURL(url);
            }, 100);
        }
    }

    new WebRtc();

})();