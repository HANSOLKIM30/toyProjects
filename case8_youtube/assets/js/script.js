(function() {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    const getAll = (target) => {
        return document.querySelectorAll(target);
    }

    const $search = get('#search');
    const $list = getAll('.contents.list figure');
    const $searchButton = get('.btn-search');

    const init = () => {
        $search.addEventListener('keyup', search);
        $searchButton.addEventListener('click', search);

        // 마우스 오버 시 webp 재생
        for(let index = 0; index < $list.length; index++) {
            const $target = $list[index].querySelector('picture');
            $target.addEventListener('mouseover', onMouseOver);
            $target.addEventListener('mouseout', onMouseOut);
        }
    }

    const search  = () => {
        let searchText = $search.value.toLowerCase();
        for(let index = 0; index < $list.length; index++) {
            const $target = $list[index].querySelector('strong');
            // textContent: 노드와 그 자손의 텍스트 콘텐츠를 표현
            const text = $target.textContent.toLowerCase();
            // String.prototype.indexOf() ==> String 객체에서 주어진 값과 일치하는 "첫번째" 인덱스를 반환.
            if(-1 < text.indexOf(searchText)) {
                $list[index].style.display = 'flex';
            } else {
                $list[index].style.display = 'none';
            }
        }
    }

    const onMouseOver = (e) => {
        // 첫번째 source 태그인 type = image/webP가 선택됨.
        const webpPlay = e.target.parentNode.querySelector('source');
        // source를 webp로 변경
        webpPlay.setAttribute('srcset', './assets/images/sample.webp');
    }
    const onMouseOut = (e) => {
        const webpPlay = e.target.parentNode.querySelector('source');
        webpPlay.setAttribute('srcset', './assets/images/sample.jpg');

    }

    init();
})();