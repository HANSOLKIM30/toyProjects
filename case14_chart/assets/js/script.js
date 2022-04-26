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

        drawCahrt = (donut, centerX, centerY, labelOptions) => {
            let initial = 0;
            let index = 0;
            let fontSize = labelOptions.font.split('px')[0] || 14;

            for(const [index, value] of this.datas) {
                const angleValue = 2 * Math.PI * value / this.total; // 호(arc)
                this.drawCanvas(centerX, centerY, this.radius, initial, initial + angleValue, this.colors[index]);
            }

            this.ctx.moveTo(centerX, centerY);

            // label
            // Math.sin, Math.cos: 라디안 값이 인자로 주어짐. 
            // 라디안: 반지름과 호의 값이 같을 때의 중심각의 크기
            const triangleCenterX = Math.cos(initial * angleValue / 2);
            const triangeCenterY = Math.sin(initial + angleValue / 2); 
        };
        
    };

    const data = {
        guitar: 30,
        base: 20,
        drum: 25,
        piano: 18
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
    chart.drawCahrt(false, width / 2 - 10 - radius, height / 2, labelOptions);
    // donut

    // 인스턴스 속성과 정적(클래스사이트) / 프로토타입 데이터 속성은 클래스 선언부 바깥에서 정의되어야 함.
})();