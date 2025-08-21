/* ========== 학교생활 페이지 JavaScript - Juilliard 다크 스타일 ========== */

$(document).ready(function() {
    
    // ========== 갤러리 탭 기능 ==========
    $('.tab-btn').click(function(e) {
        e.preventDefault();
        
        var targetTab = $(this).data('tab');
        
        // 모든 탭 버튼에서 active 클래스 제거
        $('.tab-btn').removeClass('active');
        
        // 클릭된 탭 버튼에 active 클래스 추가
        $(this).addClass('active');
        
        // 모든 갤러리 콘텐츠 숨기기
        $('.gallery-content').removeClass('active');
        
        // 선택된 탭 콘텐츠 보이기 (페이드 효과)
        if(targetTab === 'moments') {
            setTimeout(() => {
                $('#our-moments').addClass('active');
            }, 150);
        } else if(targetTab === 'works') {
            setTimeout(() => {
                $('#our-works').addClass('active');
            }, 150);
        }
    });
    
    // ========== 이미지 호버 효과 ==========
    $('.gallery .image').hover(
        function() {
            $(this).find('.overlay').fadeIn(300);
        },
        function() {
            $(this).find('.overlay').fadeOut(300);
        }
    );
    
    // ========== 갤러리 이미지 클릭 모달 ==========
    $('.gallery .image').click(function() {
        var imgSrc = $(this).find('img').attr('src');
        var title = $(this).find('.overlay h4').text();
        var description = $(this).find('.overlay p').text();
        
        // 모달 HTML 생성
        var modalHtml = `
            <div id="imageModal" class="image-modal">
                <div class="modal-content">
                    <span class="modal-close">&times;</span>
                    <img src="${imgSrc}" alt="${title}">
                    <div class="modal-info">
                        <h4>${title}</h4>
                        <p>${description}</p>
                    </div>
                </div>
            </div>
        `;
        
        // 기존 모달 제거 후 새로 추가
        $('#imageModal').remove();
        $('body').append(modalHtml);
        
        // 모달 표시 애니메이션
        $('#imageModal').fadeIn(300);
        
        // ESC 키로 모달 닫기
        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                closeModal();
            }
        });
    });
    
    // 모달 닫기 함수
    function closeModal() {
        $('#imageModal').fadeOut(300, function() {
            $(this).remove();
        });
        $(document).off('keyup'); // 이벤트 리스너 제거
    }
    
    // 모달 닫기 이벤트
    $(document).on('click', '.modal-close, .image-modal', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
    
    // ========== 파일 업로드 기능 ==========
    $('form').submit(function(e) {
        e.preventDefault();
        
        var form = $(this);
        var submitBtn = form.find('input[type="submit"]');
        var originalText = submitBtn.val();
        
        // 폼 검증
        var isValid = validateForm(form);
        if (!isValid) {
            return false;
        }
        
        // 로딩 상태
        submitBtn.val('업로드 중...').prop('disabled', true);
        submitBtn.after('<span class="loading-spinner"></span>');
        
        // 실제 업로드 처리 시뮬레이션
        setTimeout(function() {
            // 성공 메시지 표시
            showUploadMessage('success', '성공적으로 업로드되었습니다!');
            
            // 폼 리셋
            form[0].reset();
            $('.file-preview').remove(); // 미리보기 제거
            
            // 버튼 상태 복구
            submitBtn.val(originalText).prop('disabled', false);
            $('.loading-spinner').remove();
            
            // 갤러리 새로고침
            refreshGallery();
            
        }, 2000);
    });
    
    // ========== 폼 검증 함수 ==========
    function validateForm(form) {
        var isValid = true;
        var errors = [];
        
        // 기존 에러 메시지 제거
        form.find('.error-message').remove();
        form.find('.error').removeClass('error');
        
        // 필수 텍스트 필드 검증
        var titleField = form.find('input[name*="title"]');
        var authorField = form.find('input[name="author"]');
        
        if (titleField.val().trim() === '') {
            isValid = false;
            titleField.addClass('error');
            titleField.after('<span class="error-message">제목을 입력해주세요.</span>');
            errors.push('제목이 비어있습니다.');
        }
        
        if (authorField.val().trim() === '') {
            isValid = false;
            authorField.addClass('error');
            authorField.after('<span class="error-message">작성자를 입력해주세요.</span>');
            errors.push('작성자가 비어있습니다.');
        }
        
        // 파일 선택 확인
        var fileInput = form.find('input[type="file"]');
        if (fileInput.length > 0 && fileInput[0].files.length === 0) {
            isValid = false;
            fileInput.addClass('error');
            fileInput.after('<span class="error-message">파일을 선택해주세요.</span>');
            errors.push('파일이 선택되지 않았습니다.');
        }
        
        // 파일 크기 및 형식 검증
        if (fileInput[0] && fileInput[0].files.length > 0) {
            var file = fileInput[0].files[0];
            var maxSize = 5 * 1024 * 1024; // 5MB
            var allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
            if (file.size > maxSize) {
                isValid = false;
                fileInput.addClass('error');
                fileInput.after('<span class="error-message">파일 크기는 5MB 이하여야 합니다.</span>');
                errors.push('파일 크기가 너무 큽니다.');
            }
            
            if (!allowedTypes.includes(file.type)) {
                isValid = false;
                fileInput.addClass('error');
                fileInput.after('<span class="error-message">JPG, PNG, GIF 파일만 업로드 가능합니다.</span>');
                errors.push('지원하지 않는 파일 형식입니다.');
            }
        }
        
        if (!isValid) {
            showUploadMessage('error', '입력 오류: ' + errors.join(' '));
        }
        
        return isValid;
    }
    
    // ========== 업로드 메시지 표시 ==========
    function showUploadMessage(type, message) {
        var messageHtml = `<div class="upload-message ${type}">${message}</div>`;
        
        // 기존 메시지 제거
        $('.upload-message').remove();
        
        // 새 메시지 추가
        $('.upload-section form').prepend(messageHtml);
        
        // 메시지 애니메이션
        $('.upload-message').hide().fadeIn(300);
        
        // 3초 후 메시지 제거
        setTimeout(function() {
            $('.upload-message').fadeOut(300, function() {
                $(this).remove();
            });
        }, 3000);
    }
    
    // ========== 갤러리 새로고침 (새 이미지 추가) ==========
    function refreshGallery() {
        var activeTab = $('.gallery-content.active');
        var gallery = activeTab.find('.gallery .row');
        
        // 새 이미지 HTML 생성
        var newImageHtml = `
            <div class="col-4 col-6-medium col-12-small new-image" style="opacity: 0; transform: translateY(30px);">
                <span class="image fit">
                    <img src="images/new-upload.jpg" alt="새 업로드" />
                    <div class="overlay">
                        <h4>새로 업로드된 사진</h4>
                        <p>방금 업로드한 소중한 순간</p>
                    </div>
                </span>
            </div>
        `;
        
        // 갤러리에 새 이미지 추가
        gallery.append(newImageHtml);
        
        // 애니메이션 효과
        $('.new-image').animate({
            opacity: 1
        }, 500).css({
            transform: 'translateY(0)',
            transition: 'transform 0.5s ease-out'
        });
        
        // 새 이미지에도 호버 효과 적용
        $('.new-image .image').hover(
            function() {
                $(this).find('.overlay').fadeIn(300);
            },
            function() {
                $(this).find('.overlay').fadeOut(300);
            }
        );
        
        // 새 이미지에도 클릭 이벤트 적용
        $('.new-image .image').click(function() {
            var imgSrc = $(this).find('img').attr('src');
            var title = $(this).find('.overlay h4').text();
            var description = $(this).find('.overlay p').text();
            
            var modalHtml = `
                <div id="imageModal" class="image-modal">
                    <div class="modal-content">
                        <span class="modal-close">&times;</span>
                        <img src="${imgSrc}" alt="${title}">
                        <div class="modal-info">
                            <h4>${title}</h4>
                            <p>${description}</p>
                        </div>
                    </div>
                </div>
            `;
            
            $('#imageModal').remove();
            $('body').append(modalHtml);
            $('#imageModal').fadeIn(300);
        });
        
        // new-image 클래스 제거
        setTimeout(function() {
            $('.new-image').removeClass('new-image');
        }, 1000);
    }
    
    // ========== 스크롤 애니메이션 ==========
    function initScrollAnimations() {
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
    
    // ========== 테이블 행 클릭 효과 ==========
    $('table.alt tbody tr').click(function() {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
        
        // 선택된 행 강조 스타일
        $(this).css({
            'background': 'rgba(220, 38, 38, 0.15)',
            'transform': 'scale(1.02)'
        });
        
        // 다른 행들 원상복구
        $(this).siblings().css({
            'background': '',
            'transform': ''
        });
    });
    
    // ========== 파일 미리보기 기능 ==========
    $('input[type="file"]').change(function() {
        var input = this;
        var preview = $(input).siblings('.file-preview');
        
        // 기존 미리보기 제거
        preview.remove();
        
        if (input.files && input.files[0]) {
            var file = input.files[0];
            var reader = new FileReader();
            
            reader.onload = function(e) {
                var previewHtml = `
                    <div class="file-preview">
                        <img src="${e.target.result}" alt="미리보기" style="max-width: 200px; max-height: 200px;">
                        <p>${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                    </div>
                `;
                $(input).after(previewHtml);
                
                // 미리보기 애니메이션
                $('.file-preview').hide().fadeIn(300);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // ========== 반응형 갤러리 조정 ==========
    function adjustGalleryLayout() {
        var windowWidth = $(window).width();
        
        if (windowWidth <= 736) {
            // 모바일에서는 1열
            $('.gallery .col-4').removeClass('col-4 col-6').addClass('col-12');
        } else if (windowWidth <= 980) {
            // 태블릿에서는 2열
            $('.gallery .col-12, .gallery .col-4').removeClass('col-12 col-4').addClass('col-6');
        } else {
            // 데스크톱에서는 3열
            $('.gallery .col-6, .gallery .col-12').removeClass('col-6 col-12').addClass('col-4');
        }
    }
    
    // ========== 부드러운 스크롤 ==========
    $('a[href^="#"]').click(function(e) {
        e.preventDefault();
        var target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });
    
    // ========== 윈도우 이벤트 ==========
    $(window).resize(function() {
        adjustGalleryLayout();
    });
    
    // ========== 초기화 ==========
    adjustGalleryLayout();
    initScrollAnimations();
    
    // ========== 인터섹션 옵저버 for 고급 애니메이션 ==========
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

        // 애니메이션 대상 요소들 관찰
        document.querySelectorAll('.gallery .image, .schedule-card, .upload-section').forEach(function(el) {
            observer.observe(el);
        });
    }
    
    // ========== 터치 디바이스 최적화 ==========
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
    }
    
    // ========== 성능 최적화 ==========
    // 디바운스 함수
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // 최적화된 리사이즈 핸들러
    const optimizedResize = debounce(adjustGalleryLayout, 250);
    $(window).on('resize', optimizedResize);
    
    // ========== 스크롤 성능 최적화 ==========
    let ticking = false;
    
    function updateScrollEffects() {
        // 스크롤 관련 효과들
        const scrollTop = $(window).scrollTop();
        const windowHeight = $(window).height();
        
        // 패럴랙스 효과 (필요시)
        $('.parallax-element').each(function() {
            const element = $(this);
            const elementTop = element.offset().top;
            const elementHeight = element.outerHeight();
            
            if (elementTop < scrollTop + windowHeight && elementTop + elementHeight > scrollTop) {
                const yPos = -(scrollTop - elementTop) * 0.5;
                element.css('transform', `translateY(${yPos}px)`);
            }
        });
        
        ticking = false;
    }
    
    function requestScrollUpdate() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    $(window).on('scroll', requestScrollUpdate);
    
    // ========== 갤러리 필터링 기능 (추가) ==========
    $('.filter-btn').click(function() {
        var filter = $(this).data('filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            $('.gallery .image').parent().fadeIn(300);
        } else {
            $('.gallery .image').parent().each(function() {
                var category = $(this).find('.image').data('category');
                if (category === filter) {
                    $(this).fadeIn(300);
                } else {
                    $(this).fadeOut(300);
                }
            });
        }
    });
    
    // ========== 검색 기능 ==========
    $('#gallerySearch').on('input', debounce(function() {
        var searchTerm = $(this).val().toLowerCase();
        
        $('.gallery .image').parent().each(function() {
            var title = $(this).find('.overlay h4').text().toLowerCase();
            var description = $(this).find('.overlay p').text().toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm) || searchTerm === '') {
                $(this).fadeIn(300);
            } else {
                $(this).fadeOut(300);
            }
        });
    }, 300));
    
    // ========== 라이트박스 갤러리 기능 ==========
    let currentImageIndex = 0;
    let galleryImages = [];
    
    function initLightboxGallery() {
        galleryImages = $('.gallery .image img').map(function() {
            return {
                src: $(this).attr('src'),
                title: $(this).siblings('.overlay').find('h4').text(),
                description: $(this).siblings('.overlay').find('p').text()
            };
        }).get();
    }
    
    function showLightbox(index) {
        currentImageIndex = index;
        const image = galleryImages[index];
        
        const lightboxHtml = `
            <div id="lightbox" class="lightbox">
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <span class="lightbox-prev">&#10094;</span>
                    <span class="lightbox-next">&#10095;</span>
                    <img src="${image.src}" alt="${image.title}">
                    <div class="lightbox-info">
                        <h4>${image.title}</h4>
                        <p>${image.description}</p>
                        <span class="image-counter">${index + 1} / ${galleryImages.length}</span>
                    </div>
                </div>
            </div>
        `;
        
        $('#lightbox').remove();
        $('body').append(lightboxHtml);
        $('#lightbox').fadeIn(300);
    }
    
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }
    
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }
    
    function updateLightboxImage() {
        const image = galleryImages[currentImageIndex];
        $('#lightbox img').attr('src', image.src).attr('alt', image.title);
        $('#lightbox h4').text(image.title);
        $('#lightbox p').text(image.description);
        $('#lightbox .image-counter').text(`${currentImageIndex + 1} / ${galleryImages.length}`);
    }
    
    // 라이트박스 이벤트 바인딩
    $(document).on('click', '.lightbox-next', nextImage);
    $(document).on('click', '.lightbox-prev', prevImage);
    $(document).on('click', '.lightbox-close, .lightbox', function(e) {
        if (e.target === this) {
            $('#lightbox').fadeOut(300, function() {
                $(this).remove();
            });
        }
    });
    
    // 키보드 네비게이션
    $(document).on('keydown', function(e) {
        if ($('#lightbox').length) {
            switch(e.keyCode) {
                case 37: // 왼쪽 화살표
                    prevImage();
                    break;
                case 39: // 오른쪽 화살표
                    nextImage();
                    break;
                case 27: // ESC
                    $('#lightbox').fadeOut(300, function() {
                        $(this).remove();
                    });
                    break;
            }
        }
    });
    
    // ========== 무한 스크롤 (선택적) ==========
    let isLoading = false;
    let page = 1;
    
    function loadMoreImages() {
        if (isLoading) return;
        
        isLoading = true;
        
        // 로딩 인디케이터 표시
        $('.gallery').after('<div class="loading-more">더 많은 이미지를 불러오는 중...</div>');
        
        // 실제로는 서버에서 데이터를 가져와야 함
        setTimeout(function() {
            // 시뮬레이션된 새 이미지들
            const newImages = Array.from({length: 6}, (_, i) => `
                <div class="col-4 col-6-medium col-12-small">
                    <span class="image fit">
                        <img src="images/placeholder-${page * 6 + i + 1}.jpg" alt="새 이미지 ${page * 6 + i + 1}" />
                        <div class="overlay">
                            <h4>새 이미지 ${page * 6 + i + 1}</h4>
                            <p>무한 스크롤로 로드된 이미지</p>
                        </div>
                    </span>
                </div>
            `).join('');
            
            $('.gallery .row').append(newImages);
            $('.loading-more').remove();
            
            // 새 이미지들에 이벤트 바인딩
            $('.gallery .image').off().hover(
                function() { $(this).find('.overlay').fadeIn(300); },
                function() { $(this).find('.overlay').fadeOut(300); }
            );
            
            // 라이트박스 갤러리 재초기화
            initLightboxGallery();
            
            isLoading = false;
            page++;
        }, 1500);
    }
    
    // 스크롤 감지
    $(window).scroll(function() {
        if ($(window).scrollTop() + $(window).height() > $(document).height() - 1000) {
            loadMoreImages();
        }
    });
    
    // ========== 최종 초기화 ==========
    initLightboxGallery();
    
    // 커스텀 easing 함수 등록 (jQuery UI 없이)
    $.extend($.easing, {
        easeInOutCubic: function (x, t, b, c, d) {
            if ((t/=d/2) < 1) return c/2*t*t*t + b;
            return c/2*((t-=2)*t*t + 2) + b;
        }
    });
    
    console.log('학교생활 페이지 JavaScript 초기화 완료');
});

// ========== 페이지 언로드 시 정리 ==========
$(window).on('beforeunload', function() {
    // 이벤트 리스너 정리
    $(document).off();
    $(window).off('scroll resize');
    
    // 타이머 정리
    clearTimeout();
    clearInterval();
});