/**
 * 장자기독학교 학교소개 페이지 스크롤 애니메이션
 * 스크롤 시 각 섹션이 교차로 애니메이션되도록 구현
 */

(function() {
    'use strict';

    /**
     * 스크롤 애니메이션 관찰자 설정
     */
    function initScrollAnimations() {
        // Intersection Observer가 지원되지 않는 경우 모든 애니메이션을 즉시 활성화
        if (!window.IntersectionObserver) {
            var sections = document.querySelectorAll('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');
            sections.forEach(function(section) {
                section.classList.add('animate');
                var spotlight = section.querySelector('.spotlight');
                if (spotlight) {
                    spotlight.classList.add('animate');
                }
            });
            return;
        }

        // Intersection Observer 설정
        var observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -80px 0px'
        };

        // 관찰자 콜백 함수
        var observerCallback = function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    // 섹션과 spotlight 모두에 애니메이션 클래스 추가
                    entry.target.classList.add('animate');
                    var spotlight = entry.target.querySelector('.spotlight');
                    if (spotlight) {
                        spotlight.classList.add('animate');
                    }
                    
                    // 성능을 위해 관찰 중단
                    observer.unobserve(entry.target);
                }
            });
        };

        // 관찰자 생성
        var observer = new IntersectionObserver(observerCallback, observerOptions);

        // spotlight 섹션들 관찰 시작
        var sections = document.querySelectorAll('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');
        sections.forEach(function(section) {
            observer.observe(section);
        });
    }

    /**
     * 스무스 스크롤 개선
     */
    function enhanceSmoothScroll() {
        var scrollLinks = document.querySelectorAll('.scrolly');
        
        scrollLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                var href = this.getAttribute('href');
                
                // 내부 링크인 경우에만 처리
                if (href && href.indexOf('#') === 0) {
                    e.preventDefault();
                    
                    var targetId = href.substring(1);
                    var targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // 부드러운 스크롤
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        
                        // URL 업데이트
                        if (history.pushState) {
                            history.pushState(null, null, href);
                        }
                    }
                }
            });
        });
    }

    /**
     * 페이지 로드 시 이미 보이는 요소들 처리
     */
    function handleInitiallyVisibleElements() {
        var sections = document.querySelectorAll('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');
        
        sections.forEach(function(section, index) {
            var rect = section.getBoundingClientRect();
            var isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                // 초기에 보이는 요소들은 약간의 딜레이를 두고 애니메이션 시작
                setTimeout(function() {
                    section.classList.add('animate');
                    var spotlight = section.querySelector('.spotlight');
                    if (spotlight) {
                        spotlight.classList.add('animate');
                    }
                }, index * 150);
            }
        });
    }

    /**
     * 애니메이션 성능 최적화
     */
    function optimizeAnimations() {
        // 사용자가 모션 감소를 선호하는 경우
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            var sections = document.querySelectorAll('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');
            sections.forEach(function(section) {
                section.classList.add('animate');
                var spotlight = section.querySelector('.spotlight');
                if (spotlight) {
                    spotlight.classList.add('animate');
                }
            });
            return;
        }

        // 저전력 모드나 성능이 낮은 디바이스 감지
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
            // 애니메이션 딜레이 단축
            var style = document.createElement('style');
            style.textContent = '.spotlight .image, .spotlight .content { transition-duration: 0.6s !important; }';
            document.head.appendChild(style);
        }
    }

    /**
     * 디버깅을 위한 섹션 상태 확인
     */
    function debugSectionStatus() {
        if (window.console && window.console.log) {
            var sections = document.querySelectorAll('#jangjahak, #vision, #chairman, #principal, #elder, #education-philosophy, #milestone, #staff');
            console.log('장자기독학교 애니메이션 섹션 수:', sections.length);
            sections.forEach(function(section, index) {
                var hasSpotlight = section.querySelector('.spotlight') !== null;
                console.log('섹션 ' + (index + 1) + ' (' + section.id + '): spotlight=' + hasSpotlight);
            });
        }
    }

    /**
     * 메인 초기화 함수
     */
    function init() {
        // 즉시 첫 번째 섹션 표시
        var firstSection = document.querySelector('#jangjahak');
        if (firstSection) {
            firstSection.classList.add('animate');
            var spotlight = firstSection.querySelector('.spotlight');
            if (spotlight) {
                spotlight.classList.add('animate');
            }
        }

        // 디버깅 정보 출력
        debugSectionStatus();
        
        // 기본 스크롤 애니메이션 설정
        initScrollAnimations();
        
        // 스무스 스크롤 향상
        enhanceSmoothScroll();
        
        // 초기 가시 요소 처리
        handleInitiallyVisibleElements();
        
        // 성능 최적화
        optimizeAnimations();
        
        // 초기화 완료 로그
        if (window.console && window.console.log) {
            console.log('장자기독학교 학교소개 교차 애니메이션 초기화 완료');
            
            // 이미지 로딩 상태 확인
            var images = document.querySelectorAll('.spotlight .image img');
            console.log('총 이미지 수: ' + images.length);
            images.forEach(function(img, index) {
                console.log('이미지 ' + (index + 1) + ': ' + img.src + ' - ' + (img.complete ? '로드됨' : '로딩중'));
            });
        }
    }

    // DOM 로드 완료 시 초기화
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // 이미 로드된 경우 즉시 실행
        init();
    }

    // 창 크기 변경 시 재계산
    var resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            handleInitiallyVisibleElements();
        }, 250);
    });

})();