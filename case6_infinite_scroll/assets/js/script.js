// 무한스크롤: 프로그래스바가 끝까지 닿았을 때 API로 또 다른 데이터 호출
// pagination 기능을 통한 무한스크롤 구현: 1페이지가 끝나면 2페이지의 데이터를 호출.
// API 호출 시, then-catch 대신 async-await 사용

(function() {
    
    'use strict';

    // async-await를 사용해서 API 불러오기
    const get = (target) => {
        return document.querySelector(target);
    }

    let page = 1;
    const limit = 10;
    const $posts = get('.posts');
    // 총 데이터의 개수
    const end = 100;
    // 이제까지 로드한 데이터의 개수
    let total= 10;

    const $loader = get('.loader');

    const getPost = async () => {
        const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
        const response = await fetch(API_URL);
        if(!response.ok) {
            throw new Error('에러');
        }

        return await response.json();
    }
    
    const showPosts = (posts) => {
        posts.forEach(post => {
            const $post = document.createElement('div');
            $post.classList.add('post');
            $post.innerHTML = `
                <div class='header'>
                    <div class='id'>${post.id}</div>
                    <div class='title'>${post.title}</div>
                </div>
                <div class='body'>${post.body}</div>
            `;
            $posts.appendChild($post);
        });
    }
    
    const showLoader = () => {
        $loader.classList.add('show');
    }

    const hideLoader = () => {
        $loader.classList.remove('show');
    }

    const loadPost = async () => {
        // 로딩 엘리먼트를 보여줌
        showLoader();
        try {
            const response = await getPost();
            showPosts(response);
        } catch (error) { 
            console.error(error);
        } finally {
            // 로딩 엘리먼트를 사라지게 함
            hideLoader();
        }
    }

    // 끝에 다다르면 페이지가 하나씩 늘어나면서 해당 페이지의 데이터 추가
    const onScroll = () => {
        const { scrollHeight, clientHeight, scrollTop } = document.documentElement;

        if(total === end) {
            window.removeEventListener('scroll', onScroll);
            return;
        }

        // scrollHeight - scrollTop === clientHeight
        if(scrollTop + clientHeight >= scrollHeight - 5) {
            page++;
            total += 10;
            loadPost();
        }
    }

    window.addEventListener('DOMContentLoaded', () => {
        loadPost();
        window.addEventListener('scroll', onScroll);
    });
})();