(function () {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    const $button = get('.modal-open-button');
    const $modal = get('.modal');
    const $body = get('body');

    const $modalCancelButton = get('.modal-button.cancel')
    const $modalConfirmButton = get('.modal-button.confirm')

    const toggleModal = () => {
        $modal.classList.toggle('show');
        $body.classList.toggle('scroll-lock');
    };

    $button.addEventListener('click', () => {
        toggleModal();
    });
    
    $modalCancelButton.addEventListener('click', () => {
        toggleModal();
    });
    
    $modalConfirmButton.addEventListener('click', () => {
        toggleModal();
        // confirm을 눌렀을 때 발생하는 로직 입력
        console.log('confirmed');
    });

    window.addEventListener('click', (e) => {
        // modal이 실행되었을 때, 전체 화면을 감싸는 modal이면 toggle.
        if(e.target === $modal) {
            toggleModal();
        };
    });
})();