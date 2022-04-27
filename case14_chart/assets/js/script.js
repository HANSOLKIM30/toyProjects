(function() {
    // class에는 use strict가 기본적으로 적용이 되어 필요 없지만 그 외의 것들을 위해 선언.
    'use strict';
    
    const get = (target) => {
        return document.querySelector(target);
    };
    
    // 클래스의 특징: 호이스팅이 일어나지 않는다.
    class Chart {
        constructor(parent='body', data={}, {width, height, radius, colors}) {
            this.parent = get(parent);

            // 캔버스 
            this.canvas = document.createElement('canvas');
            this.canvas.width = width;
            this.canvas.height = height;
            this.ctx = this.canvas.getContext('2d');
            
            // 범주
            this.legends = document.createElement('div');
            this.legends.classList.add('lengends');

            // canvas div에 추가
            this.parent.appendChild(this.canvas);
            this.parent.appendChild(this.legends);

            this.label = '';
            this.total = 0;

            // Obejct.entries ==> for...in과 같은 순서로 주어진 객체 자체의 enumerable 속성 [key, value] 쌍의 배열을 반환
            this.datas = Object.entries(data);
            this.radius = radius;
            this.colors = colors;
        };

        getTotal = () => {
            for(const [index, value] of this.datas) {
                this.total += value;
            }
        };

        drawLegend = () => {

        };

        drawCanvas = (centerX, centerY, radius, startAngle, endAnlge, color) => {
            this.ctx.beginPath();
            this.ctx.fillStyle = color;
            this.ctx.moveTo(centerX, centerY);
            // arc(arc's center X, arc's center Y, radius, startAngle, endAngle)
            this.ctx.arc(centerX, centerY, radius, startAngle, endAnlge);
            this.ctx.closePath();
            this.ctx.fill();
        };

        drawChart = (donut, centerX, centerY, labelOptions) => {
            let initial = 0;
            let index = 0;
            let fontSize = labelOptions.font.split('px')[0] || 14;

            for(const [data, value] of this.datas) {
                // get radius value
                const angleValue = (2 * Math.PI) * (value / this.total);
                // draw a pie
                this.drawCanvas(centerX, centerY, this.radius, initial, initial + angleValue, this.colors[index]);
                // return to center of the circle

                // draw a label of the pie
                this.ctx.beginPath();
                this.ctx.moveTo(centerX, centerY);

                // Math.sin(radian), Math.cos(radian)
                const triangleRatioX = Math.cos(initial + (angleValue / 2));
                const triangleRatioY = Math.sin(initial + (angleValue / 2)); 
                let radiusRatio = 3 / 5;

                if(donut) {
                    radiusRatio = 4 / 5;
                }

                const triangleCenterX = this.radius * radiusRatio * triangleRatioX;
                const triangleCenterY = this.radius * radiusRatio * triangleRatioY;

                const text = Math.round(value / this.total * 100) + '%';
            
                let labelX = centerX + triangleCenterX;
                let labelY = centerY + triangleCenterY;
                
                this.ctx.fillStyle = labelOptions ? labelOptions.color : '#fff';
                this.ctx.font = labelOptions ? labelOptions.font : `${fontSize}px aria;`
                this.ctx.textAlign = 'center';
                this.ctx.fillText(text, labelX, labelY);
                
                // 이전 파이의 끝 각도 = 다음 파이의 시작 각도
                initial += angleValue;
                index++;
            }

            // donut일 경우 가운데에 원 그려주기
            if(donut) {
                this.drawCanvas(centerX, centerY, this.radius / 3.5, 0, Math.PI *2, 'white');
            }
        };
    };

    const data = {
        guitar: 30,
        base: 10,
        drum: 25,
        piano: 50
    };

    const option = {
        radius: 150,
        width: 700,
        height: 500,
        colors: ['#c15454', '#6fd971', '#687bd2', '#b971e0'],
    };

    const labelOptions = {
        color: '#fff',
        font: "20px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif"
    };

    const chart = new Chart('.canvas', data, option);
    const { width, height, radius } = option;

    chart.getTotal();
    chart.drawLegend();
    // pie 
    // x축: 캔버스 가로길이의 중앙 - 원의 중심을 반지름만큼 이동 - 약간의 여유공간 10
    chart.drawChart(false, width / 2 - 10 - radius, height / 2, labelOptions);
})();