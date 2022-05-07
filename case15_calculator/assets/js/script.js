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
            this.total = 0;
            this.operation = null;
        }

        reset() {
            this.currentValue = '';
            this.prevValue = '';
            this.resetOperation();
        }

        
        clear() {
            if(this.currentValue) {
                this.currentValue = '';
                return;
            }

            if(this.operation) {
                // 연산자 취소
                this.resetOperation();
                // 연산자를 취소했으므로,
                // prevValue에 할당했던 currentValue 값을 되돌리기
                this.currentValue = this.prevValue;
                return;
            }

            if(this.prevValue) {
                this.prevValue = '';
            }
        }

        appendNumber(number) {
            if(number === '.') {
                if(this.currentValue === '') {
                    this.currentValue = '0.';
                    return;
                }
                if(this.currentValue.includes('.')) {
                    return;
                }
            }

            if(number === '0' && this.currentValue === '') {
                return;        
            }

            this.currentValue = this.currentValue.toString() + number.toString();
        }

        isValueZero(value) {
            if(value === '' || value === '0.') {
                return true;
            } 
            return false;
        }

        // 연산자 할당
        setOperation(operation) {

            // 기존 operation에 할당된 연산자 및 스타일 제거
            this.resetOperation();
            
            this.operation = operation;
            
            this.isValueZero(this.currentValue) ? this.prevValue = '0' : this.prevValue = this.currentValue;

            this.currentValue = '';
            
            const elements = Array.from(getAll('.cell-button.operation'));
            // filter: 주어진 함수의 테스트를 통과하는 모든 요소들을 모아 새로운 배열로 반환
            const element = elements.filter((element) => 
                element.innerText.includes(operation)
            )[0];
            
            element.classList.add('active');
        }

        compute() {

            let computation;
            
            const prev = parseFloat(this.prevValue);
            
            if(this.isValueZero(this.currentValue)){ this.currentValue = '0' };
            const current = parseFloat(this.currentValue);

            if(isNaN(prev) || isNaN(current)) {
                return;
            }

            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;    
                    break;    
                case '÷':
                    computation = prev / current;
                    break;
                default:
                    return;
            }
            this.currentValue = computation.toString();
        }

        updateDisplay() {
            if(this.currentValue) {
                this.element.value = this.currentValue;
                return;
            }

            // 연산자 버튼을 눌러서 currentValue -> prevValue가 된 경우
            if(this.prevValue) {
                this.element.value = this.prevValue;
                return;
            }

            this.element.value = 0;
        }

        resetOperation() {
            this.operation = null;
            const elements = Array.from(getAll('.cell-button.operation'));
            elements.forEach((element => {
                element.classList.remove('active');
            }));
        }
    };

    const $numberButtons = getAll('.cell-button.number');
    const $operationButtons = getAll('.cell-button.operation');
    const $compute = get('.cell-button.compute');
    const $clearButton = get('.cell-button.clear');
    const $allClearButton = get('.cell-button.all-clear');
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
    });

    $compute.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
    });
    
    $clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
    });

    $allClearButton.addEventListener('click', () => {
        calculator.reset();
        calculator.updateDisplay();
    });
})();