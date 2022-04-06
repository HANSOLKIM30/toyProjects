(function() {
    'use strict';

    const get = (target) => {
        return document.querySelector(target);
    }

    // 캐러셀 관련 변수들과 메서드를 모아놓은 Carousel Class
    class Carousel {
        constructor(carouselElement) {
            this.carouselElement = carouselElement;
            // 클래스 이름을 Carousel Class 내에서 활용할 예정
            this.itemClassName = 'carousel-item';
            this.items = this.carouselElement.querySelectorAll('.carousel-item');

            this.totalItems = this.items.length; // 5개
            this.current = 0; // 첫 item의 index
        }

        // 캐러셀 초기화 메서드
        initCarousel() {
            this.items[0].classList.add('active');
            this.items[this.totalItems-1].classList.add('prev');
            this.items[1].classList.add('next');
        }

        // prevButton과 nextButton을 통한 클릭이벤트를 받는 메서드
        setEventListener() {
            this.prevButton = this.carouselElement.querySelector('.carousel-button-prev');
            this.nextButton = this.carouselElement.querySelector('.carousel-button-next');

            this.prevButton.addEventListener('click', () => {
                this.movePrev();
            });
            this.nextButton.addEventListener('click', () => {
                this.moveNext();
            });

            
        }

        moveCarouselTo() {
            // current를 기준으로 prev와 next 정해주기
            let prev = this.current - 1;
            let next = this.current + 1;

            // 예외처리
            if(this.current === 0) {
                prev = this.totalItems - 1;
            } else if(this.current === this.totalItems - 1) {
                next = 0;
            }

            for( let i = 0; i < this.totalItems; i++ ) {
                if(i === this.current ) {
                    this.items[i].className = this.itemClassName + ' active';
                } else if ( i === prev ) {
                    this.items[i].className = this.itemClassName + ' prev';
                } else if ( i === next ) {
                    this.items[i].className = this.itemClassName + ' next';
                } else {
                    this.items[i].className = this.itemClassName;
                }
            }
        }

        movePrev() {
            if(this.current === 0) {
                this.current = this.totalItems - 1;
            } else {
                this.current--;
            }
            this.moveCarouselTo();
        }

        moveNext() {
            if(this.current === this.totalItems - 1) {
                this.current = 0;
            } else {
                this.current++;
            }
            this.moveCarouselTo();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const carouselElement = get('.carousel');
        const carousel = new Carousel(carouselElement);
        
        carousel.initCarousel();
        carousel.setEventListener();
    });

})();