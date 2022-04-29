(function() {
    const get = (target) => {
        return document.querySelector(target);
    };

    const getAll = (target) => {
        return document.querySelectorAll(target);
    };

    class Calculator {
        constructor(element) {
            this.element = element;
            this.currentValue = '';
            this.prevValue = '';
            this.operation = null;
        };

        appendNumber(number) {
            if(number === '.') {
                // currentValue가 없는 상태에서 .을 누른 경우
                if(this.currentValue === '') {
                    this.currentValue = '0.';
                    return;
                }
                if(this.currentValue.includes('.')) {
                    return;
                }
            }

            // 0을 반복해서 누를 경우
            if(number === '0' && this.currentValue === '') {
                return;
            }
            this.currentValue = this.currentValue.toString() + number.toString();
        };

        setOperation(operation) {
            // initialize
            this.resetOperation();
            this.operation = operation;
            this.prevValue = this.currentValue; 
            this.currentValue = '';
            
            const elements = Array.from(getAll('.cell-button.operation'));
            // filter: 주어진 함수의 테스트를 통과하는 모든 요소들을 모아 새로운 배열로 반환
            const element = elements.filter((element) => 
                element.innerText.includes(operation)
            )[0];
            
            element.classList.add('active');
        };

        updateDisplay() {
            if(this.currentValue) {
                this.element.value = this.currentValue;
                return;
            }
        };

        resetOperation() {
            this.operation = null;
            const elements = Array.from(getAll('.cell-button.operation'));
            elements.forEach((element => {
                element.classList.remove('active');
            }));
        };
    }

    const $numberButtons = getAll('.cell-button.number');
    const $operationButtons = getAll('.cell-button.operation');
    const $display = get('.display');

    const calculator = new Calculator($display);

    $numberButtons.forEach((button) => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        });
    });

    $operationButtons.forEach((button) => {
        button.addEventListener('click', () => {
            calculator.setOperation(button.innerText);
        });
    })
    
})();