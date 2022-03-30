// 즉시실행 함수
(function () {
    // 엄격한 모드
    'use strict'

    // 더 편한게 작업할 수 있도록 기초 작업
    const get = (target) => {
        return document.querySelector(target);
    }

    const createTodoElement = (item) => {
        // 구조 분해 할당
        const { id, content } = item;
        const $todoItem = document.createElement('div');
        $todoItem.classList.add('item');
        $todoItem.dataset.id = id;  // getAttribite('id')
        $todoItem.innerHTML = `
        <div class="content">
            <input type="checkbox"class='todo_checkbox'/>
            <label>${content}</label>
            <input type="text" value="${content}" />
        </div>
        <div class="item_buttons content_buttons">
            <button class="todo_edit_button">
                <i class="far fa-edit"></i>
            </button>
            <button class="todo_remove_button">
                <i class="far fa-trash-alt"></i>
            </button>
        </div>y
        <div class="item_buttons edit_buttons">
            <button class="todo_edit_confirm_button">
                <i class="fas fa-check"></i>
            </button>
            <button class="todo_edit_cancel_button">
                <i class="fas fa-times"></i>
            </button>
        </div>
        `
        return $todoItem;
    }

    // .todos DOM element 가져오기
    const $todos = get('.todos');

    // todos 렌더링
    const renderAllTodos = (todos) => {
        // .todos DOM element 초기화
        $todos.innerHTML = '';
        todos.forEach((item) => {
            const todoElement = createTodoElement(item);
            $todos.appendChild(todoElement);
        });
    }

    const getTodos = () => {
        // axios의 경우 json() 형변환 없이 사용 가능하나, fetch는 필요.
        fetch('http://localhost:3000/todos')
        .then((response) => response.json())
        .then((todos) => renderAllTodos(todos))
        .catch((error) => console.error(error))
    }

    // js 실행 시 바로 실행되도록 하는 init 익명함수
    const init = () => {
        // DOMContentLoaded(초기 html 문서를 완전히 불러오고 분석했을 때) 시, fetch 발생.
        window.addEventListener('DOMContentLoaded', (event) => {
            getTodos();
        });
    }


    init();
})();