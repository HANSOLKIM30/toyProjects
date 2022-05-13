/*
[Used API]
1. FileReader
https://developer.mozilla.org/ko/docs/Web/API/FileReader

2. crop
https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage

3. drag and drop
https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop
*/

(function() {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    class PhotoEditor {
        constructor() {
            this.container = get('main');
            
            // BoxSize 
            this.box = get('.image-wrap');
            console.log(this.box)
            this.boxWidth = this.box.clientWidth;
            this.boxHeight = this.box.clientHeight;

            // Original Image
            this.originalImage = get('.fileImage');
            
            // Crop Canvas
            this.canvas = get('.canvas');
            this.ctx = this.canvas.getContext('2d');
            this.width = this.originalImage.width;
            this.height = this.originalImage.height;
            this.minSize = 20;  // crop시의 최소 사이즈
            this.canvas.width = this.width;
            this.canvas.height = this.height;
            this.ctx.lineWidth = 4;
            this.ctx.strokeStyle = '#ff0000';

            // target Canvas
            // destination target(crop한 이미지를 띄워주는 canvas) 설정
            this.targetImage = get('.image-wrap');
            this.targetCanvas = document.createElement('canvas');
            this.targetCtx = this.targetCanvas.getContext('2d');
            this.targetWidth;
            this.targetHeight;
            // targetCanvas에 crop된 이미지가 들어갈 위치
            this.sourceX;
            this.sourceY;
            this.sourceWidth;
            this.sourceHeight;
            this.img = new Image();

            // Button Group
            this.btnFlip = get('.btn-filp');
            this.btnSepia = get('.btn-sepia');
            this.btnGray = get('.btn-gray');
            this.btnSave = get('.btn-save');

            // Drag & Upload Image Area
            this.fileDrag = get('.drag-area');
            this.fileInput = get('.drag-area input');
            this.fileImage = get('.fileImage');

            // events
            this.clickEvent();
            this.fileEvent();
            this.drawEvent();
        }

        clickEvent() {

        }

        fileEvent() {
            this.fileInput.addEventListener('change', (event) => {
                // createObjectURL: DOM File 객체를 사용해 참조된 데이터에 대한 참조로 사용할 수 있는 간단한 URL 문자열 - 일종의 blob URL을 생성.
                // Blob URL이므로 canvas-wrap의 사이즈보다 더 클 경우, 자동으로 rendering되어 표시된다. 
                const fileName = URL.createObjectURL(event.target.files[0]);
                this.fileImage.setAttribute('src', fileName);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            });
        } 

        sepiaEvent() {

        }

        grayEvent() {

        }

        download() {

        }

        drawEvent() {
            // Canvas의 넓이와 높이, 위치를 가져오는 메서드
            const canvasX = this.canvas.getBoundingClientRect().left;
            const canvasY = this.canvas.getBoundingClientRect().top;
            // s ==> start point, e ==> end point
            let  sX, sY, eX, eY;
            let drawStart = false;

            this.canvas.addEventListener('mousedown', (event) => {
                // canvas 상의 시작점의 위치 - 10진수로 표현
                sX = parseInt(event.clientX - canvasX, 10);
                sY = parseInt(event.clientY - canvasY, 10);
                drawStart = true;
            });

            this.canvas.addEventListener('mousemove', (event) => {
                // mousedown이 아닌 채로(drawStart===false) canvas 상에서 마우스를 그냥 움직일 때는 return 처리
                if(!drawStart) {
                    return;
                }
                eX = parseInt(event.clientX - canvasX, 10);
                eY = parseInt(event.clientY - canvasY, 10);
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.ctx.strokeRect(sX, sY, eX - sX, eY -sY);
            });

            this.canvas.addEventListener('mouseup', () => {
                drawStart = false;

                // 너무 작게 crop한 요소에 대한 예외처리
                if(
                    Math.abs(eX - sX) < this.minSize || 
                    Math.abs(eY - sY) < this.minSize
                ) {
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    return;
                }

                // drawOuput(시작점의 X좌표, 시작점의 Y좌표, width, height)
                this.drawOutput(sX, sY, eX - sX, eY -sY);
            });
        }

        drawOutput(x, y, width, height) {
            this.targetImage.innerHTML = '';

            // target Canvas의 가로, 세로 비율 계산
            // 세로가 더 길 경우 ==> 세로 100%, 세로에 맞춰 가로 비율 계산
            // 가로가 더 길 경우 ==> 가로 100%, 가로에 맞춰 세로 비율 계산
            if (Math.abs(width) <= Math.abs(height)) {
                this.targetHeight = this.boxHeight;
                this.targetWidth = (this.targetHeight * width) / height;
            } else {
                this.targetWidth = this.boxWidth;
                this.targetHeight = (this.targetWidth * height) / width;
            }

            this.targetCanvas.width = this.targetWidth;
            this.targetCanvas.height = this.targetHeight;

            this.img.addEventListener('load', () => {
                // 이미지가 로드되면 원본 이미지와의 비율을 계산하여 캔버스에 drawImage
                const widthRate = this.img.width / this.width;
                const heightRate = this.img.height / this.height;

                this.sourceX = x * widthRate;
                this.sourceY = y * heightRate;

                this.sourceWidth = width * widthRate;
                this.sourceHeight = height * widthRate;

                this.targetCtx.drawImage(
                    this.img,
                    this.sourceX,
                    this.sourceY,
                    this.sourceWidth,
                    this.sourceHeight,
                    0,
                    0,
                    this.targetWidth,
                    this.targetHeight
                );
            })
            this.img.src = this.fileImage.getAttribute('src');
            this.targetImage.appendChild(this.targetCanvas);
    }
    }

    new PhotoEditor();

})();