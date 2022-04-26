(function() {
    'user strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    const cellCount = 6;    // item의 개수
    let selectedIndex = 0;  // Carousel이 처음 실행되었을 때의 맨 앞의 index
    const $prevButton = get('.prev-button');
    const $nextButton = get('.next-button');
    const $carousel = get('.carousel');

    const rotateCarousel = () => {
        // item은 가만히 있고, carousel 자체를 회전
        // 양수는 시계방향, 음수는 반시계방향
        const angle = (selectedIndex / cellCount) * -360;
        $carousel.style.transform = `translateZ(-346px) rotateY(${angle}deg)`;
    }

    // 반시계방향 회전
    $prevButton.addEventListener('click', () => {
        selectedIndex++;
        rotateCarousel();
    });

    // 시계방향 회전
    $nextButton.addEventListener('click', () => {
        selectedIndex--;
        rotateCarousel();
    });
})();