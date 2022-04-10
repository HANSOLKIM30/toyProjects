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

    const $player = get('.view video');
    const $btnPlay = get('.js-play');
    const $btnReplay = get('.js-replay');
    const $btnStop = get('.js-stop');
    const $btnMute = get('.js-mute');
    const $progress = get('.js-progress');
    const $volume = get('.js-volume');
    const $fullScreen = get('.js-fullScreen');

    const init = () => {
        $search.addEventListener('keyup', search);
        $searchButton.addEventListener('click', search);

        // 마우스 오버 시 webp 재생
        for(let index = 0; index < $list.length; index++) {
            const $target = $list[index].querySelector('picture');
            $target.addEventListener('mouseover', onMouseOver);
            $target.addEventListener('mouseout', onMouseOut);
        }

        for(let index = 0; index < $list.length; index++) {
            // $list 클릭 시, hashChange 이벤트 발생
            $list[index].addEventListener('click', hashChange);
        }

        window.addEventListener('hashchange', () => {
            // hash에서 view String이 있는지 확인하기
            const isView = -1 < window.location.hash.indexOf('view');
            if(isView) {
                getViewPage();
            } else {
                getListPage();
            }
        })
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
        // source를 webp로 변경 => 재생
        webpPlay.setAttribute('srcset', './assets/images/sample.webp');
    }

    const onMouseOut = (e) => {
        const webpPlay = e.target.parentNode.querySelector('source');
        webpPlay.setAttribute('srcset', './assets/images/sample.jpg');

    }

    const hashChange = (e) => {
        e.preventDefault();
        const parentNode = e.target.closest('figure');
        const viewTitle = parentNode.querySelector('strong').textContent;
        // view + viewTitle을 hash 값으로 넣어주기
        window.location.hash = `view&${viewTitle}`;
        getViewPage();
    }

    const getViewPage = () => {
        const viewTitle = get('.view strong');
        // decode하지 않으면 문자열이 엉망이 될 수도 있음.
        // 넣어준 hash를 &기준으로 나눠서 ${viewTitle} 부분 가져오기
        const urlTitle = decodeURI(window.location.hash.split('&')[1]);
        viewTitle.innerText = urlTitle;

        get('.list').style.display = 'none';
        get('.view').style.display = 'flex';
    }

    const getListPage = () => {
        get('.list').style.display = 'flex';
        get('.view').style.display = 'none';
    }

    init();
})();