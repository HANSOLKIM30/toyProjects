// 즉시실행 함수
;(function () {
    // 엄격한 모드
    'use strict'

    const get = (target) => {
        return document.querySelector(target);
    }

    const API_URL = 'http://localhost:3000/todos';
    const $todos = get('.todos');
    const $form = get('.todo-form');
    const $todoInput = get('.todo-input');

    const createTodoElement = (item) => {
        // 구조 분해 할당
        const { id, completed, content } = item;
        const $todoItem = document.createElement('div');
        const isChecked = completed ? 'checked' : '';
        $todoItem.classList.add('item');
        $todoItem.dataset.id = id;
        $todoItem.innerHTML = `
        <div class="content">
            <input type="checkbox" class='todo_checkbox' ${isChecked} />
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
        </div>
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
        fetch(API_URL)
        .then((response) => response.json())
        .then((todos) => renderAllTodos(todos))
        .catch((error) => console.error(error));
    }

    // POST 이후, 자동 새로고침을 끄려면 Go Live 기능 끄기
    const addTodo = (event) => {
        // submit의 기본 동작인 새로고침을 막기.
        event.preventDefault();
        const content = $todoInput.value;
        if(!content) {
            return;
        }
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content,
                completed: false,
            })
        }).then(getTodos)
        .catch((error) => console.error(error));
    }

    const toggleTodo = (event) => {
        if(event.target.className !== 'todo_checkbox') {
            return;
        };

        const $item = event.target.closest('.item');
        const id = $item.dataset.id;
        const completed = event.target.checked;

        // PUT은 전체를 모두 update, PATCH는 특정 데이터만 update
        fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed })
        }).then(getTodos)
        .catch((error) => console.error(error));
    }

    // js 실행 시 바로 실행되도록 하는 init 익명함수
    const init = () => {
        // DOMContentLoaded(초기 html 문서를 완전히 불러오고 분석했을 때) 시, fetch 발생.
        window.addEventListener('DOMContentLoaded', getTodos);
        $form.addEventListener('submit', addTodo);
        $todos.addEventListener('click', toggleTodo)
    }
    init();
})();