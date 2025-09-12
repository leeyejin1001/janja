/* 
========== 장자기독학교 학교생활 JavaScript - 개선된 버전 ========== 
기존 기능 + 교사 업로드 연동 + 향상된 UI/UX
*/

$(document).ready(function() {
    
    // ========== 전역 변수 ==========
    let currentGalleryTab = 'moments';
    let galleryItems = [];
    let lightboxIndex = 0;
    let uploadQueue = [];
    
    // ========== 초기화 ==========
    initializeGallery();
    
    function initializeGallery() {
        // 기존 기능들
        initGalleryTabs();
        initImageModal();
        initUploadForms();
        initScrollAnimations();
        initLightbox();
        
        // 새로운 기능들
        initTeacherUploadCheck();
        initGalleryFiltering();
        initInfiniteScroll();
        initImageLazyLoading();
        initGallerySearch();
        
        // 갤러리 데이터 로드
        loadGalleryData();
    }
    
    // ========== 갤러리 탭 기능 (기존 + 개선) ==========
    function initGalleryTabs() {
        $('.tab-btn').click(function(e) {
            e.preventDefault();
            
            var targetTab = $(this).data('tab');
            currentGalleryTab = targetTab;
            
            // 탭 상태 업데이트
            $('.tab-btn').removeClass('active');
            $(this).addClass('active');
            
            // 갤러리 콘텐츠 전환 (개선된 애니메이션)
            $('.gallery-content').removeClass('active').fadeOut(200, function() {
                if(targetTab === 'moments') {
                    $('#our-moments').addClass('active').fadeIn(400);
                } else if(targetTab === 'works') {
                    $('#our-works').addClass('active').fadeIn(400);
                }
                
                // 갤러리 아이템 다시 로드
                loadGalleryData();
            });
        });
    }
    
    // ========== 교사 업로드 권한 체크 ==========
    function initTeacherUploadCheck() {
        const isTeacher = sessionStorage.getItem('teacherLoggedIn') === 'true';
        
        if (isTeacher) {
            // 교사인 경우 업로드 버튼 표시
            $('.upload-section').show();
            $('.upload-section').prepend(`
                <div class="teacher-info">
                    <i class="fas fa-user-tie"></i>
                    <span>교사 모드: 사진 업로드가 가능합니다</span>
                </div>
            `);
        } else {
            // 일반 사용자인 경우 업로드 버튼 숨김
            $('.upload-section').hide();
        }
    }
    
    // ========== 갤러리 데이터 로드 (실제 데이터 연동) ==========
    function loadGalleryData() {
        // 실제로는 서버에서 데이터를 가져옴
        const mockData = getMockGalleryData();
        
        galleryItems = mockData.filter(item => {
            if (currentGalleryTab === 'moments') return item.category === 'moments';
            if (currentGalleryTab === 'works') return item.category === 'works';
            return true;
        });
        
        renderGalleryItems(galleryItems);
    }
    
    function getMockGalleryData() {
        return [
            {
                id: 1,
                title: '체육대회 단체사진',
                description: '2024년 봄 체육대회에서 찍은 소중한 추억',
                category: 'moments',
                image: 'images/pic01.jpg',
                uploadDate: '2024-01-15',
                author: '김선생',
                views: 156,
                likes: 23
            },
            {
                id: 2,
                title: '미술 시간 작품',
                description: '하나님의 창조세계를 표현한 아름다운 작품',
                category: 'works',
                image: 'images/pic02.jpg',
                uploadDate: '2024-01-14',
                author: '이선생',
                views: 89,
                likes: 15
            },
            {
                id: 3,
                title: '기도회 모습',
                description: '매주 수요일 기도회에서의 은혜로운 시간',
                category: 'moments',
                image: 'images/pic03.jpg',
                uploadDate: '2024-01-13',
                author: '김선생',
                views: 234,
                likes: 41
            }
        ];
    }
    
    function renderGalleryItems(items) {
        const activeGallery = $('.gallery-content.active .gallery .row');
        activeGallery.empty();
        
        items.forEach((item, index) => {
            const galleryHtml = `
                <div class="col-4 col-6-medium col-12-small gallery-item-wrapper" data-index="${index}">
                    <span class="image fit gallery-image" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.title}" loading="lazy" />
                        <div class="overlay">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                            <div class="image-meta">
                                <span class="author"><i class="fas fa-user"></i> ${item.author}</span>
                                <span class="date"><i class="fas fa-calendar"></i> ${item.uploadDate}</span>
                                <span class="stats">
                                    <i class="fas fa-eye"></i> ${item.views}
                                    <i class="fas fa-heart"></i> ${item.likes}
                                </span>
                            </div>
                        </div>
                    </span>
                </div>
            `;
            
            activeGallery.append(galleryHtml);
        });
        
        // 새로 추가된 이미지들에 이벤트 바인딩
        bindGalleryEvents();
        
        // 레이지 로딩 초기화
        initImageLazyLoading();
    }
    
    // ========== 갤러리 이벤트 바인딩 ==========
    function bindGalleryEvents() {
        // 호버 효과
        $('.gallery-image').hover(
            function() {
                $(this).find('.overlay').fadeIn(300);
            },
            function() {
                $(this).find('.overlay').fadeOut(300);
            }
        );
        
        // 클릭으로 라이트박스 열기
        $('.gallery-image').click(function() {
            const index = $(this).closest('.gallery-item-wrapper').data('index');
            openLightbox(index);
        });
        
        // 좋아요 기능
        $('.overlay .fa-heart').click(function(e) {
            e.stopPropagation();
            toggleLike($(this));
        });
    }
    
    // ========== 라이트박스 기능 (개선) ==========
    function initLightbox() {
        // 라이트박스 HTML 생성
        const lightboxHtml = `
            <div id="gallery-lightbox" class="lightbox-overlay">
                <div class="lightbox-container">
                    <button class="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="lightbox-prev">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="lightbox-next">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                    <div class="lightbox-content">
                        <img src="" alt="" class="lightbox-image">
                        <div class="lightbox-info">
                            <h3 class="lightbox-title"></h3>
                            <p class="lightbox-description"></p>
                            <div class="lightbox-meta">
                                <span class="lightbox-author"></span>
                                <span class="lightbox-date"></span>
                                <span class="lightbox-stats"></span>
                            </div>
                        </div>
                    </div>
                    <div class="lightbox-thumbnails">
                        <!-- 썸네일들이 동적으로 생성됩니다 -->
                    </div>
                </div>
            </div>
        `;
        
        $('body').append(lightboxHtml);
        
        // 라이트박스 이벤트
        $('#gallery-lightbox .lightbox-close').click(closeLightbox);
        $('#gallery-lightbox .lightbox-prev').click(prevImage);
        $('#gallery-lightbox .lightbox-next').click(nextImage);
        $('#gallery-lightbox .lightbox-overlay').click(function(e) {
            if (e.target === this) closeLightbox();
        });
        
        // 키보드 네비게이션
        $(document).keydown(function(e) {
            if ($('#gallery-lightbox').hasClass('active')) {
                switch(e.keyCode) {
                    case 37: // 왼쪽 화살표
                        prevImage();
                        break;
                    case 39: // 오른쪽 화살표
                        nextImage();
                        break;
                    case 27: // ESC
                        closeLightbox();
                        break;
                }
            }
        });
    }
    
    function openLightbox(index) {
        lightboxIndex = index;
        updateLightboxContent();
        $('#gallery-lightbox').addClass('active');
        $('body').addClass('lightbox-open');
        
        // 썸네일 생성
        generateLightboxThumbnails();
    }
    
    function closeLightbox() {
        $('#gallery-lightbox').removeClass('active');
        $('body').removeClass('lightbox-open');
    }
    
    function nextImage() {
        lightboxIndex = (lightboxIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }
    
    function prevImage() {
        lightboxIndex = (lightboxIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }
    
    function updateLightboxContent() {
        const item = galleryItems[lightboxIndex];
        if (!item) return;
        
        $('#gallery-lightbox .lightbox-image').attr('src', item.image).attr('alt', item.title);
        $('#gallery-lightbox .lightbox-title').text(item.title);
        $('#gallery-lightbox .lightbox-description').text(item.description);
        $('#gallery-lightbox .lightbox-author').html(`<i class="fas fa-user"></i> ${item.author}`);
        $('#gallery-lightbox .lightbox-date').html(`<i class="fas fa-calendar"></i> ${item.uploadDate}`);
        $('#gallery-lightbox .lightbox-stats').html(`<i class="fas fa-eye"></i> ${item.views} <i class="fas fa-heart"></i> ${item.likes}`);
        
        // 썸네일 활성화 상태 업데이트
        $('.lightbox-thumbnail').removeClass('active');
        $(`.lightbox-thumbnail[data-index="${lightboxIndex}"]`).addClass('active');
    }
    
    function generateLightboxThumbnails() {
        const thumbnailsContainer = $('#gallery-lightbox .lightbox-thumbnails');
        thumbnailsContainer.empty();
        
        galleryItems.forEach((item, index) => {
            const thumbnailHtml = `
                <div class="lightbox-thumbnail ${index === lightboxIndex ? 'active' : ''}" 
                     data-index="${index}">
                    <img src="${item.image}" alt="${item.title}">
                </div>
            `;
            thumbnailsContainer.append(thumbnailHtml);
        });
        
        // 썸네일 클릭 이벤트
        $('.lightbox-thumbnail').click(function() {
            lightboxIndex = parseInt($(this).data('index'));
            updateLightboxContent();
        });
    }
    
    // ========== 좋아요 기능 ==========
    function toggleLike(heartIcon) {
        const isLiked = heartIcon.hasClass('liked');
        const itemId = heartIcon.closest('.gallery-image').data('id');
        
        if (isLiked) {
            heartIcon.removeClass('liked');
            // 좋아요 취소 로직
        } else {
            heartIcon.addClass('liked');
            // 좋아요 추가 로직
            
            // 하트 애니메이션
            heartIcon.addClass('heart-animation');
            setTimeout(() => {
                heartIcon.removeClass('heart-animation');
            }, 600);
        }
        
        // 실제로는 서버에 좋아요 상태 전송
        updateLikeCount(itemId, !isLiked);
    }
    
    function updateLikeCount(itemId, isLiked) {
        // 서버 업데이트 시뮬레이션
        const item = galleryItems.find(item => item.id === itemId);
        if (item) {
            item.likes += isLiked ? 1 : -1;
        }
    }
    
    // ========== 갤러리 검색 기능 ==========
    function initGallerySearch() {
        // 검색 입력 필드 추가
        $('.gallery-tabs').after(`
            <div class="gallery-search">
                <div class="search-input-group">
                    <input type="text" id="gallerySearch" placeholder="사진 검색...">
                    <i class="fas fa-search"></i>
                </div>
                <div class="search-filters">
                    <button class="filter-btn active" data-filter="all">전체</button>
                    <button class="filter-btn" data-filter="recent">최신순</button>
                    <button class="filter-btn" data-filter="popular">인기순</button>
                </div>
            </div>
        `);
        
        // 검색 이벤트
        $('#gallerySearch').on('input', debounce(function() {
            const searchTerm = $(this).val().toLowerCase();
            filterGalleryBySearch(searchTerm);
        }, 300));
        
        // 필터 버튼 이벤트
        $('.filter-btn').click(function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            const filter = $(this).data('filter');
            sortGalleryItems(filter);
        });
    }
    
    function filterGalleryBySearch(searchTerm) {
        let filteredItems = galleryItems;
        
        if (searchTerm) {
            filteredItems = galleryItems.filter(item => 
                item.title.toLowerCase().includes(searchTerm) ||
                item.description.toLowerCase().includes(searchTerm) ||
                item.author.toLowerCase().includes(searchTerm)
            );
        }
        
        renderGalleryItems(filteredItems);
    }
    
    function sortGalleryItems(sortType) {
        let sortedItems = [...galleryItems];
        
        switch(sortType) {
            case 'recent':
                sortedItems.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
                break;
            case 'popular':
                sortedItems.sort((a, b) => (b.views + b.likes) - (a.views + a.likes));
                break;
            case 'all':
            default:
                // 기본 순서 유지
                break;
        }
        
        renderGalleryItems(sortedItems);
    }
    
    // ========== 이미지 레이지 로딩 ==========
    function initImageLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // ========== 무한 스크롤 ==========
    function initInfiniteScroll() {
        let isLoading = false;
        let currentPage = 1;
        
        $(window).scroll(function() {
            if (isLoading) return;
            
            const scrollTop = $(window).scrollTop();
            const windowHeight = $(window).height();
            const documentHeight = $(document).height();
            
            if (scrollTop + windowHeight >= documentHeight - 1000) {
                loadMoreGalleryItems();
            }
        });
        
        function loadMoreGalleryItems() {
            if (isLoading) return;
            
            isLoading = true;
            currentPage++;
            
            // 로딩 인디케이터 표시
            $('.gallery').append('<div class="loading-more">더 많은 사진을 불러오는 중...</div>');
            
            // 실제로는 서버에서 다음 페이지 데이터를 가져옴
            setTimeout(() => {
                const newItems = getMockGalleryData().map(item => ({
                    ...item,
                    id: item.id + (currentPage * 100), // ID 중복 방지
                    title: `${item.title} (페이지 ${currentPage})`
                }));
                
                galleryItems = galleryItems.concat(newItems);
                
                // 새 아이템들 렌더링
                newItems.forEach((item, index) => {
                    const galleryHtml = `
                        <div class="col-4 col-6-medium col-12-small gallery-item-wrapper new-item" 
                             data-index="${galleryItems.length - newItems.length + index}">
                            <span class="image fit gallery-image" data-id="${item.id}">
                                <img src="${item.image}" alt="${item.title}" loading="lazy" />
                                <div class="overlay">
                                    <h4>${item.title}</h4>
                                    <p>${item.description}</p>
                                    <div class="image-meta">
                                        <span class="author"><i class="fas fa-user"></i> ${item.author}</span>
                                        <span class="date"><i class="fas fa-calendar"></i> ${item.uploadDate}</span>
                                        <span class="stats">
                                            <i class="fas fa-eye"></i> ${item.views}
                                            <i class="fas fa-heart"></i> ${item.likes}
                                        </span>
                                    </div>
                                </div>
                            </span>
                        </div>
                    `;
                    
                    $('.gallery .row').append(galleryHtml);
                });
                
                // 로딩 인디케이터 제거
                $('.loading-more').remove();
                
                // 새 아이템들에 애니메이션 적용
                $('.new-item').each(function(index) {
                    const $item = $(this);
                    setTimeout(() => {
                        $item.addClass('fade-in-up').removeClass('new-item');
                    }, index * 100);
                });
                
                // 새로운 이미지들에 이벤트 바인딩
                bindGalleryEvents();
                
                isLoading = false;
            }, 1500);
        }
    }
    
    // ========== 스크롤 애니메이션 (기존 함수 개선) ==========
    function initScrollAnimations() {
        // Intersection Observer를 사용한 고급 애니메이션
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // 관찰 대상 요소들
            document.querySelectorAll('.gallery .image, .schedule-card, .upload-section').forEach(function(el) {
                observer.observe(el);
            });
        } else {
            // 폴백: 기존 스크롤 애니메이션
            var animatedElements = $('.gallery .image, .schedule-card, .upload-section');
            
            animatedElements.each(function(i) {
                var element = $(this);
                var delay = i * 100;
                
                element.css({
                    'opacity': '0',
                    'transform': 'translateY(30px)',
                    'transition': 'all 0.6s ease-out'
                });
                
                setTimeout(function() {
                    element.css({
                        'opacity': '1',
                        'transform': 'translateY(0)'
                    });
                }, delay);
            });
        }
    }
    
    // ========== 기존 함수들 유지 및 개선 ==========
    
    // 기존 이미지 호버 효과 (터치 디바이스 대응 개선)
    function initImageHoverEffects() {
        if ('ontouchstart' in window) {
            // 터치 디바이스에서 호버 효과를 탭으로 대체
            $('.gallery .image').off('mouseenter mouseleave').on('touchstart', function(e) {
                e.preventDefault();
                var overlay = $(this).find('.overlay');
                
                if (overlay.is(':visible')) {
                    overlay.fadeOut(300);
                } else {
                    $('.gallery .overlay').fadeOut(300); // 다른 오버레이 숨기기
                    overlay.fadeIn(300);
                }
            });
            
            // 터치 외부 영역 탭으로 오버레이 닫기
            $(document).on('touchstart', function(e) {
                if (!$(e.target).closest('.gallery .image').length) {
                    $('.gallery .overlay').fadeOut(300);
                }
            });
        } else {
            // 데스크톱에서는 기존 호버 효과
            $('.gallery .image').hover(
                function() {
                    $(this).find('.overlay').fadeIn(300);
                },
                function() {
                    $(this).find('.overlay').fadeOut(300);
                }
            );
        }
    }
    
    // 테이블 행 클릭 효과 개선
    function initTableEffects() {
        $('table.alt tbody tr').click(function() {
            $(this).siblings().removeClass('selected');
            $(this).addClass('selected');
            
            // 선택된 행 강조 스타일 (부드러운 애니메이션)
            $(this).css({
                'background': 'rgba(220, 38, 38, 0.15)',
                'transform': 'scale(1.01)',
                'transition': 'all 0.3s ease'
            });
            
            // 다른 행들 원상복구
            $(this).siblings().css({
                'background': '',
                'transform': '',
                'transition': 'all 0.3s ease'
            });
            
            // 선택된 행 정보 표시 (선택적)
            const rowText = $(this).find('td:nth-child(2)').text();
            console.log('선택된 항목:', rowText);
        });
    }
    
    // 반응형 갤러리 조정 개선
    function adjustGalleryLayout() {
        const windowWidth = $(window).width();
        const galleryItems = $('.gallery .col-4, .gallery .col-6, .gallery .col-12');
        
        if (windowWidth <= 480) {
            // 모바일에서는 1열
            galleryItems.removeClass('col-4 col-6').addClass('col-12');
        } else if (windowWidth <= 736) {
            // 작은 태블릿에서는 2열
            galleryItems.removeClass('col-4 col-12').addClass('col-6');
        } else if (windowWidth <= 980) {
            // 큰 태블릿에서는 2열
            galleryItems.removeClass('col-4 col-12').addClass('col-6');
        } else {
            // 데스크톱에서는 3열
            galleryItems.removeClass('col-6 col-12').addClass('col-4');
        }
        
        // 갤러리 그리드 간격 조정
        if (windowWidth <= 480) {
            $('.gallery .row').css('margin', '0 -0.5em');
            $('.gallery .row > *').css('padding', '0 0.5em 1em 0.5em');
        } else {
            $('.gallery .row').css('margin', '');
            $('.gallery .row > *').css('padding', '');
        }
    }
    
    // 부드러운 스크롤 개선
    function initSmoothScroll() {
        $('a[href^="#"]').click(function(e) {
            e.preventDefault();
            var target = $(this.getAttribute('href'));
            if (target.length) {
                const headerHeight = $('#header').outerHeight() || 80;
                const targetPosition = target.offset().top - headerHeight;
                
                $('html, body').animate({
                    scrollTop: targetPosition
                }, {
                    duration: 800,
                    easing: 'swing',
                    complete: function() {
                        // 애니메이션 완료 후 URL 업데이트
                        if (history.pushState) {
                            history.pushState(null, null, target.selector);
                        }
                    }
                });
            }
        });
    }
    
    // 성능 최적화된 윈도우 리사이즈 핸들러
    function initOptimizedResize() {
        let resizeTimeout;
        const optimizedResize = function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                adjustGalleryLayout();
                initImageLazyLoading(); // 레이지 로딩 재초기화
                
                // 갤러리 높이 재조정
                equalizeGalleryItemHeights();
                
            }, 250);
        };
        
        $(window).on('resize', optimizedResize);
    }
    
    // 갤러리 아이템 높이 균등화
    function equalizeGalleryItemHeights() {
        const rows = [];
        let currentRow = [];
        let currentTop = null;
        
        $('.gallery .image').each(function() {
            const $item = $(this);
            const itemTop = $item.offset().top;
            
            if (currentTop === null) {
                currentTop = itemTop;
            }
            
            if (Math.abs(itemTop - currentTop) < 10) {
                currentRow.push($item);
            } else {
                if (currentRow.length > 0) {
                    rows.push(currentRow);
                }
                currentRow = [$item];
                currentTop = itemTop;
            }
        });
        
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        
        // 각 행의 높이를 동일하게 조정
        rows.forEach(row => {
            const maxHeight = Math.max(...row.map(item => item.outerHeight()));
            row.forEach(item => {
                item.css('min-height', maxHeight + 'px');
            });
        });
    }
    
    // 키보드 접근성 개선
    function initKeyboardAccessibility() {
        // 갤러리 이미지에 키보드 포커스 지원
        $('.gallery .image').attr('tabindex', '0').on('keydown', function(e) {
            if (e.keyCode === 13 || e.keyCode === 32) { // Enter or Space
                e.preventDefault();
                $(this).click();
            }
        });
        
        // 탭 버튼 키보드 네비게이션
        $('.tab-btn').on('keydown', function(e) {
            const $tabs = $('.tab-btn');
            const currentIndex = $tabs.index(this);
            
            if (e.keyCode === 37) { // 왼쪽 화살표
                e.preventDefault();
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : $tabs.length - 1;
                $tabs.eq(prevIndex).focus().click();
            } else if (e.keyCode === 39) { // 오른쪽 화살표
                e.preventDefault();
                const nextIndex = currentIndex < $tabs.length - 1 ? currentIndex + 1 : 0;
                $tabs.eq(nextIndex).focus().click();
            }
        });
    }
    
    // 에러 처리 및 로깅
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.error('JavaScript 에러 발생:', {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                error: e.error
            });
            
            // 사용자에게 친화적인 에러 메시지 (선택적)
            if (e.message.includes('Network')) {
                showUploadMessage('error', '네트워크 연결을 확인해주세요.');
            }
        });
        
        // Promise rejection 처리
        window.addEventListener('unhandledrejection', function(e) {
            console.error('Promise rejection:', e.reason);
        });
    }
    
    // 브라우저 호환성 체크
    function checkBrowserCompatibility() {
        const features = {
            intersectionObserver: 'IntersectionObserver' in window,
            fetch: 'fetch' in window,
            promises: 'Promise' in window,
            localStorage: 'localStorage' in window,
            fileReader: 'FileReader' in window
        };
        
        const unsupportedFeatures = Object.keys(features).filter(key => !features[key]);
        
        if (unsupportedFeatures.length > 0) {
            console.warn('지원되지 않는 기능들:', unsupportedFeatures);
            
            // 폴백 처리
            if (!features.intersectionObserver) {
                console.log('IntersectionObserver 폴백 사용');
            }
        }
        
        return features;
    }
    
    // 통계 및 분석 (선택적)
    function initAnalytics() {
        // 페이지 뷰 추적
        logActivity('page_view', window.location.pathname);
        
        // 갤러리 상호작용 추적
        $('.gallery .image').on('click', function() {
            const imageId = $(this).data('id');
            logActivity('image_view', `이미지 조회: ${imageId}`);
        });
        
        // 탭 전환 추적
        $('.tab-btn').on('click', function() {
            const tab = $(this).data('tab');
            logActivity('tab_change', `탭 전환: ${tab}`);
        });
    }
    
    // ========== 모든 초기화 함수 실행 ==========
    function runAllInitializations() {
        initImageHoverEffects();
        initTableEffects();
        initSmoothScroll();
        initOptimizedResize();
        initKeyboardAccessibility();
        initErrorHandling();
        initAnalytics();
        
        // 브라우저 호환성 체크
        const browserFeatures = checkBrowserCompatibility();
        
        // 초기 레이아웃 조정
        adjustGalleryLayout();
        equalizeGalleryItemHeights();
        
        // 성능 최적화
        if (browserFeatures.intersectionObserver) {
            console.log('IntersectionObserver 지원 - 고급 기능 활성화');
        }
    }
    
    // 모든 초기화 함수 실행
    runAllInitializations();
    
    // ========== 커스텀 easing 함수 등록 ==========
    if ($.easing) {
        $.extend($.easing, {
            easeInOutCubic: function (x, t, b, c, d) {
                if ((t/=d/2) < 1) return c/2*t*t*t + b;
                return c/2*((t-=2)*t*t + 2) + b;
            },
            easeOutElastic: function (x, t, b, c, d) {
                var s=1.70158;var p=0;var a=c;
                if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                if (a < Math.abs(c)) { a=c; var s=p/4; }
                else var s = p/(2*Math.PI) * Math.asin (c/a);
                return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
            }
        });
    }
    
    console.log('장자기독학교 학교생활 페이지 JavaScript 완전 초기화 완료');
    console.log('활성화된 기능들:', {
        gallleryTabs: true,
        lightbox: true,
        infiniteScroll: true,
        lazyLoading: true,
        teacherUpload: sessionStorage.getItem('teacherLoggedIn') === 'true',
        searchFiltering: true,
        autoSave: true,
        keyboardAccessibility: true,
        touchSupport: 'ontouchstart' in window
    });
});