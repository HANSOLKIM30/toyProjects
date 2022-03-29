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
    // js 실행 시 바로 실행되도록 함.
    const init = () => {
        const url = '';
        fetch(url).then((response) => this = response.json())
    }
    init();
})();