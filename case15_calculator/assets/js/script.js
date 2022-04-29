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

        // 숫자 만들기
        appendNumber(number) {
            if(number === '.') {

                // currentValue가 없는 상태에서 .을 누른 경우 ==> 0.으로 처리
                if(this.currentValue === '') {
                    this.currentValue = '0.';
                    return;
                }
                // currentValue에 이미 .이 있는 경우 ==> 입력 X
                if(this.currentValue.includes('.')) {
                    return;
                }
            }

            // '0' === ''
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

        updateDisplay() {
            if(this.currentValue) {
                this.element.value = this.currentValue;
                return;
            }
        }

        resetOperation() {
            this.operation = null;
            const elements = Array.from(getAll('.cell-button.operation'));
            elements.forEach((element => {
                element.classList.remove('active');
            }));
        }

        compute() {

            let computation;
            
            const prev = parseFloat(this.prevValue);
            
            if(this.isValueZero(this.currentValue)){ this.currentValue = '0' };
            const current = parseFloat(this.currentValue);
            
            // if() {

            // }
            console.log(this.prevValue, this.currentValue, this.operation);

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

        clear() {

        }

        reset() {

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