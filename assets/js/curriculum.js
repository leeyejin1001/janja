$(document).ready(function() {
    
    // 부드러운 스크롤
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
    // 스크롤 애니메이션 - Intersection Observer 사용
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const slideContent = entry.target;
                slideContent.classList.add('slide-in');
                
                // 한 번 애니메이션이 실행되면 관찰 중지
                observer.unobserve(slideContent);
            }
        });
    }, observerOptions);
    
    // 모든 slide-content 요소를 관찰
    $('.slide-content').each(function() {
        observer.observe(this);
    });
    
    // 네비게이션 버튼 활성화
    $(window).scroll(function() {
        var scrollPos = $(window).scrollTop() + 150;
        
        $('.curriculum-nav .button').each(function() {
            var target = $(this.attr('href'));
            if (target.length && 
                target.offset().top <= scrollPos && 
                target.offset().top + target.outerHeight() > scrollPos) {
                $('.curriculum-nav .button').removeClass('active');
                $(this).addClass('active');
            }
        });
    });
    
    // 이미지 로드 에러 처리
    $('img').on('error', function() {
        console.log('이미지 로드 실패:', $(this).attr('src'));
        // 플레이스홀더 이미지로 대체
        $(this).attr('src', 'https://via.placeholder.com/800x400/2EBAAE/ffffff?text=장자기독학교');
    });
    
    // 초기 로드 시 첫 번째 섹션이 보이는 경우 애니메이션 트리거
    setTimeout(function() {
        const firstSlide = $('.slide-content').first()[0];
        if (firstSlide && isElementInViewport(firstSlide)) {
            $(firstSlide).addClass('slide-in');
        }
    }, 500);
    
    // 뷰포트 체크 함수
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // 페이지 로드 완료 후 스크롤 위치에 따른 네비게이션 업데이트
    $(window).on('load', function() {
        $(window).trigger('scroll');
    });
    
    // 리사이즈 이벤트 처리
    $(window).resize(function() {
        // 리사이즈 시 스크롤 위치 재계산
        setTimeout(function() {
            $(window).trigger('scroll');
        }, 100);
    });
    
});