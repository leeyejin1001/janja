/* ========== 학교생활 페이지 JavaScript ========== */

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
        
        // 선택된 탭 콘텐츠 보이기
        if(targetTab === 'moments') {
            $('#our-moments').addClass('active');
        } else if(targetTab === 'works') {
            $('#our-works').addClass('active');
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
    
    // ========== 갤러리 이미지 클릭 모달 (옵션) ==========
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
        $('#imageModal').fadeIn(300);
        
        // ESC 키로 모달 닫기
        $(document).keyup(function(e) {
            if (e.keyCode === 27) {
                $('#imageModal').fadeOut(300);
            }
        });
    });
    
    // 모달 닫기
    $(document).on('click', '.modal-close, .image-modal', function(e) {
        if (e.target === this) {
            $('#imageModal').fadeOut(300);
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
        
        // 실제 업로드 처리 (백엔드 연동 필요)
        setTimeout(function() {
            // 성공 메시지 표시
            showUploadMessage('success', '성공적으로 업로드되었습니다!');
            
            // 폼 리셋
            form[0].reset();
            
            // 버튼 상태 복구
            submitBtn.val(originalText).prop('disabled', false);
            $('.loading-spinner').remove();
            
            // 갤러리 새로고침 (실제로는 새 이미지 추가)
            refreshGallery();
            
        }, 2000); // 2초 후 완료 (실제로는 서버 응답 시간)
    });
    
    // ========== 폼 검증 함수 ==========
    function validateForm(form) {
        var isValid = true;
        var requiredFields = form.find('input[required], textarea[required]');
        
        // 기존 에러 메시지 제거
        form.find('.error-message').remove();
        
        requiredFields.each(function() {
            var field = $(this);
            var value = field.val().trim();
            
            if (value === '') {
                isValid = false;
                field.addClass('error');
                field.after('<span class="error-message">이 필드는 필수입니다.</span>');
            } else {
                field.removeClass('error');
            }
        });
        
        // 파일 선택 확인
        var fileInput = form.find('input[type="file"]');
        if (fileInput.length > 0 && fileInput[0].files.length === 0) {
            isValid = false;
            fileInput.addClass('error');
            fileInput.after('<span class="error-message">파일을 선택해주세요.</span>');
        }
        
        if (!isValid) {
            showUploadMessage('error', '모든 필수 항목을 입력해주세요.');
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
        
        // 3초 후 메시지 제거
        setTimeout(function() {
            $('.upload-message').fadeOut(300);
        }, 3000);
    }
    
    // ========== 갤러리 새로고침 (새 이미지 추가) ==========
    function refreshGallery() {
        // 실제로는 서버에서 새 이미지 목록을 가져와서 갤러리 업데이트
        console.log('갤러리 새로고침');
        
        // 예시: 새 이미지 추가 애니메이션
        $('.gallery .row').append(`
            <div class="col-4 col-6-medium col-12-small new-image" style="display: none;">
                <span class="image fit">
                    <img src="images/new-upload.jpg" alt="새 업로드" />
                    <div class="overlay">
                        <h4>새로 업로드된 사진</h4>
                        <p>방금 업로드한 소중한 순간</p>
                    </div>
                </span>
            </div>
        `);
        
        $('.new-image').fadeIn(500);
        
        // 새 이미지에도 호버 효과 적용
        $('.new-image .image').hover(
            function() {
                $(this).find('.overlay').fadeIn(300);
            },
            function() {
                $(this).find('.overlay').fadeOut(300);
            }
        );
    }
    
    // ========== 스크롤 애니메이션 ==========
    function initScrollAnimations() {
        $('.box.special, .gallery .image').each(function(i) {
            var element = $(this);
            var delay = i * 100;
            
            element.css({
                'opacity': '0',
                'transform': 'translateY(30px)'
            });
            
            setTimeout(function() {
                element.animate({
                    'opacity': '1'
                }, 600);
                
                element.css({
                    'transform': 'translateY(0)',
                    'transition': 'transform 0.6s ease-out'
                });
            }, delay);
        });
    }
    
    // 페이지 로드 시 애니메이션 실행
    initScrollAnimations();
    
    // ========== 테이블 행 클릭 효과 ==========
    $('table.alt tbody tr').click(function() {
        $(this).siblings().removeClass('selected');
        $(this).addClass('selected');
    });
    
    // ========== 반응형 갤러리 조정 ==========
    function adjustGalleryLayout() {
        var windowWidth = $(window).width();
        
        if (windowWidth <= 736) {
            // 모바일에서는 1열
            $('.gallery .col-4').removeClass('col-4').addClass('col-12');
        } else if (windowWidth <= 980) {
            // 태블릿에서는 2열
            $('.gallery .col-12').removeClass('col-12').addClass('col-6');
        } else {
            // 데스크탑에서는 3열
            $('.gallery .col-6, .gallery .col-12').removeClass('col-6 col-12').addClass('col-4');
        }
    }
    
    // 윈도우 리사이즈 시 갤러리 레이아웃 조정
    $(window).resize(function() {
        adjustGalleryLayout();
    });
    
    // 초기 레이아웃 설정
    adjustGalleryLayout();
    
    // ========== 부드러운 스크롤 ==========
    $('a[href^="#"]').click(function() {
        var target = $(this.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });
    
    // ========== 파일 미리보기 기능 ==========
    $('input[type="file"]').change(function() {
        var input = this;
        var preview = $(input).siblings('.file-preview');
        
        // 기존 미리보기 제거
        preview.remove();
        
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function(e) {
                var previewHtml = `
                    <div class="file-preview">
                        <img src="${e.target.result}" alt="미리보기" style="max-width: 200px; max-height: 200px; border-radius: 8px; margin-top: 1em;">
                        <p style="margin-top: 0.5em; font-size: 0.9em; color: var(--text-light);">${input.files[0].name}</p>
                    </div>
                `;
                $(input).after(previewHtml);
            };
            
            reader.readAsDataURL(input.files[0]);
        }
    });
});