(function () {
    'use strict'
  
    const get = (target) => {
      return document.querySelector(target);
    }
  
    const $todos = get('.todos');
    const $form = get('.todo-form');
    const $todoInput = get('.todo-input');
    const $pagination = get('.pagination');
    const API_URL = `http://localhost:3000/todos`;

    // 한 페이지당 보여지는 데이터의 수
    const limit = 5;
    // 현재 페이지
    let currentPage = 1;
    // json-server 내부에 들어있는 데이터의 개수를 자동으로 가져오지 못하므로 해당 값을 사용자가 직접 설정
    const totalCount = 53;
    // 한 번에 보여지는 페이지의 수
    const pageCount = 5;   

    const pagination = () => {
        // 전체 페이지 수
        let totalPage = Math.ceil(totalCount/limit);
        // current 페이지가 속해있는 페이지 그룹
        let pageGroup = Math.ceil(currentPage/pageCount);

        // 페이지 그룹의 마지막 숫자 구하기
        let lastNumber = pageGroup * pageCount;
        if(totalPage < lastNumber) {
            lastNumber = totalPage;
        }

        // 페이지 그룹의 첫번째 숫자 구하기
        let firstNumber = lastNumber - (pageCount-1);
        
        const next = lastNumber + 1;
        const prev = firstNumber - 1;

        let html = '';

        if( prev > 0 ) {
            html += '<button class="prev" data-fn="prev">이전</button>';
        }

        for(let i = firstNumber; i <= lastNumber; i++) {
            html += `<button class="pageNumber" id="page_${i}">${i}</button>`;
        }

        if( lastNumber < totalPage ) {
            html += '<button class="next" data-fn="next">다음</button>';
        }

        $pagination.innerHTML = html;

        // 현재 페이지 스타일 변경
        const currentPageNumber = get(`.pageNumber#page_${currentPage}`);
        currentPageNumber.style.color = '#9dc0e8';

        // 클릭이벤트 등록
        const currentPageNumbers = document.querySelectorAll('.pagination button');
        currentPageNumbers.forEach((button) => {
            button.addEventListener('click', () => {
                if(button.dataset.fn === 'prev') {
                    currentPage = prev;
                } else if(button.dataset.fn === 'next') {
                    currentPage = next;
                } else {
                    currentPage = button.innerText;
                }
                pagination();
                getTodos();
            })
        })
    }
  
    const createTodoElement = (item) => {
      const { id, content, completed } = item;
      const isChecked = completed ? 'checked' : '';
      const $todoItem = document.createElement('div');
      $todoItem.classList.add('item');
      $todoItem.dataset.id = id;
      $todoItem.innerHTML = `
      <div class="content">
        <input type="checkbox" class='todo-checkbox' ${isChecked} />
        <label>${content}</label>
        <input type="text" value="${content}" />
     </div>
     <div class="item-buttons content-buttons">
        <button class="todo-edit-button">
            <i class="far fa-edit"></i>
        </button>
        <button class="todo-remove-button">
            <i class="far fa-trash-alt"></i>
        </button>
     </div>
     <div class="item-buttons edit-buttons">
        <button class="todo-edit-confirm-button">
            <i class="fas fa-check"></i>
        </button>
        <button class="todo-edit-cancel-button">
            <i class="fas fa-times"></i>
        </button>
     </div>
    `;
      return $todoItem;
    }
  
    const renderAllTodos = (todos) => {
      $todos.innerHTML = '';
      todos.forEach((item) => {
        const todoElement = createTodoElement(item);
        $todos.appendChild(todoElement);
      })
    }
  
    const getTodos = () => {
      fetch(`${API_URL}?_page=${currentPage}&_limit=${limit}`)
        .then((response) => response.json())
        .then((todos) => {
          renderAllTodos(todos);
        })
        .catch((error) => console.error(error.message));
    }
  
    const addTodo = (e) => {
      e.preventDefault()
      const content = $todoInput.value;
      if (!content) return;
      const todo = {
        content,
        completed: false,
      }
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(todo),
      })
        .then((response) => response.json())
        .then(getTodos)
        .then(() => {
          $todoInput.value = ''
          $todoInput.focus();
        })
        .catch((error) => console.error(error.message));
    }
  
    const toggleTodo = (e) => {
      if (e.target.className !== 'todo-checkbox') return;
      const $item = e.target.closest('.item');
      const id = $item.dataset.id;
      const completed = e.target.checked;
      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
        .then((response) => response.json())
        .then(getTodos)
        .catch((error) => console.error(error.message));
    }
  
    const changeEditMode = (e) => {
      const $item = e.target.closest('.item');
      const $label = $item.querySelector('label');
      const $editInput = $item.querySelector('input[type="text"]');
      const $contentButtons = $item.querySelector('.content-buttons');
      const $editButtons = $item.querySelector('.edit-buttons');
      const value = $editInput.value;
  
      if (e.target.className === 'todo-edit-button') {
        $label.style.display = 'none';
        $editInput.style.display = 'block';
        $contentButtons.style.display = 'none';
        $editButtons.style.display = 'block';
        $editInput.focus();
        $editInput.value = '';
        $editInput.value = value;
      }
  
      if (e.target.className === 'todo-edit-cancel-button') {
        $label.style.display = 'block';
        $editInput.style.display = 'none';
        $contentButtons.style.display = 'block';
        $editButtons.style.display = 'none';
        $editInput.value = $label.innerText;
      }
    }
  
    const editTodo = (e) => {
      if (e.target.className !== 'todo-edit-confirm-button') return;
      const $item = e.target.closest('.item');
      const id = $item.dataset.id;
      const $editInput = $item.querySelector('input[type="text"]');
      const content = $editInput.value;
  
      fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ content }),
      })
        .then((response) => response.json())
        .then(getTodos)
        .catch((error) => console.error(error.message));
    }
  
    const removeTodo = (e) => {
      if (e.target.className !== 'todo-remove-button') return;
      const $item = e.target.closest('.item');
      const id = $item.dataset.id;
  
      fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then(getTodos)
        .catch((error) => console.error(error.message));
    }
  
    const init = () => {
      window.addEventListener('DOMContentLoaded', () => {
        getTodos();
        // 로드 시점에 pagination 실행
        pagination();
      })
  
      $form.addEventListener('submit', addTodo);
      $todos.addEventListener('click', toggleTodo);
      $todos.addEventListener('click', changeEditMode);
      $todos.addEventListener('click', editTodo);
      $todos.addEventListener('click', removeTodo);
    }
  
    init();
  })();
  