/*
	장자기독학교 웹사이트 JavaScript
	Based on Spectral by HTML5 UP - Juilliard 스타일 개선
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#page-wrapper'),
		$banner = $('#banner'),
		$header = $('#header');

	// Breakpoints (기존 유지)
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load (기존 유지)
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Mobile detection (기존 유지)
		if (browser.mobile)
			$body.addClass('is-mobile');
		else {

			breakpoints.on('>medium', function() {
				$body.removeClass('is-mobile');
			});

			breakpoints.on('<=medium', function() {
				$body.addClass('is-mobile');
			});

		}

	// Scrolly (기존 유지)
		$('.scrolly')
			.scrolly({
				speed: 1500,
				offset: $header.outerHeight()
			});

	// Menu (기존 유지)
		$('#menu')
			.append('<a href="#menu" class="close"></a>')
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Header (기존 개선)
		if ($banner.length > 0
		&&	$header.hasClass('alt')) {

			$window.on('resize', function() { $window.trigger('scroll'); });

			$banner.scrollex({
				bottom:		$header.outerHeight() + 1,
				terminate:	function() { $header.removeClass('alt'); },
				enter:		function() { $header.addClass('alt'); },
				leave:		function() { $header.removeClass('alt'); }
			});

		}

	// === 새로운 Juilliard 스타일 기능 추가 ===

	// 헤더 스크롤 효과 개선
		$window.on('scroll', function() {
			var scrollTop = $window.scrollTop();
			
			if (scrollTop > 100) {
				$header.addClass('scrolled');
			} else {
				$header.removeClass('scrolled');
			}
		});

	// 카드 호버 효과
		$('.features li, .service-card').hover(
			function() {
				$(this).addClass('hovered');
			},
			function() {
				$(this).removeClass('hovered');
			}
		);

	// 부드러운 애니메이션 효과
		$window.on('load', function() {
			// 순차적 카드 애니메이션
			$('.features li').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.addClass('fade-in-up');
				}, index * 100);
			});

			// 아이콘 애니메이션
			$('.icons.major li').each(function(index) {
				var $this = $(this);
				setTimeout(function() {
					$this.addClass('animate-icon');
				}, (index + 1) * 200);
			});
		});

	// 버튼 클릭 효과
		$('.button').on('click', function(e) {
			var $button = $(this);
			var $ripple = $('<span class="ripple"></span>');
			
			var offset = $button.offset();
			var size = Math.max($button.outerWidth(), $button.outerHeight());
			var x = e.pageX - offset.left - size / 2;
			var y = e.pageY - offset.top - size / 2;
			
			$ripple.css({
				width: size,
				height: size,
				left: x,
				top: y
			});
			
			$button.append($ripple);
			
			setTimeout(function() {
				$ripple.remove();
			}, 600);
		});

	// 스크롤 진행도 표시 (선택사항)
		if ($('.scroll-progress').length === 0) {
			$('<div class="scroll-progress"></div>').prependTo($body);
		}

		$window.on('scroll', function() {
			var scrollTop = $window.scrollTop();
			var docHeight = $(document).height() - $window.height();
			var scrollPercent = (scrollTop / docHeight) * 100;
			
			$('.scroll-progress').css('width', scrollPercent + '%');
		});

	// 이미지 레이지 로딩 (기본적인 구현)
		$('img[data-src]').each(function() {
			var $img = $(this);
			var src = $img.data('src');
			
			$img.attr('src', src).removeClass('lazy').addClass('loaded');
		});

	// 폼 유효성 검사 개선
		$('form').on('submit', function(e) {
			var $form = $(this);
			var isValid = true;
			
			// 필수 필드 체크
			$form.find('[required]').each(function() {
				var $field = $(this);
				if (!$field.val().trim()) {
					$field.addClass('error');
					isValid = false;
				} else {
					$field.removeClass('error');
				}
			});

			// 이메일 형식 체크
			$form.find('input[type="email"]').each(function() {
				var $email = $(this);
				var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				
				if ($email.val() && !emailPattern.test($email.val())) {
					$email.addClass('error');
					isValid = false;
				} else {
					$email.removeClass('error');
				}
			});

			if (!isValid) {
				e.preventDefault();
				// 첫 번째 에러 필드로 스크롤
				var $firstError = $form.find('.error').first();
				if ($firstError.length) {
					$('html, body').animate({
						scrollTop: $firstError.offset().top - 100
					}, 500);
				}
			}
		});

	// 접근성 개선 - 키보드 네비게이션
		$('a, button, input, textarea, select').on('focus', function() {
			$(this).addClass('keyboard-focus');
		}).on('blur', function() {
			$(this).removeClass('keyboard-focus');
		});

	// 브라우저 지원 확인
		function checkBrowserSupport() {
			// CSS Grid 지원 확인
			if (!window.CSS || !CSS.supports('display', 'grid')) {
				$body.addClass('no-grid-support');
			}

			// 터치 지원 확인
			if ('ontouchstart' in window) {
				$body.addClass('touch-enabled');
			}
		}

		checkBrowserSupport();

	// 성능 최적화 - 디바운스 함수
		function debounce(func, wait) {
			var timeout;
			return function executedFunction() {
				var context = this;
				var args = arguments;
				var later = function() {
					timeout = null;
					func.apply(context, args);
				};
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			};
		}

	// 최적화된 스크롤 핸들러
		var optimizedScrollHandler = debounce(function() {
			// 추가 스크롤 관련 처리가 필요한 경우 여기에 추가
		}, 10);

		$window.on('scroll', optimizedScrollHandler);

	// 에러 처리
		window.addEventListener('error', function(e) {
			console.warn('JavaScript Error:', e.error);
			// 에러가 발생해도 기본 기능은 동작하도록 처리
		});

})(jQuery);

// CSS 스타일 추가 (JavaScript로 동적 추가)
$(document).ready(function() {
	if ($('#jangja-dynamic-styles').length === 0) {
		var dynamicStyles = `
			<style id="jangja-dynamic-styles">
				/* 동적 애니메이션 클래스 */
				.fade-in-up {
					opacity: 1;
					transform: translateY(0);
					transition: all 0.6s ease;
				}

				.features li {
					opacity: 0;
					transform: translateY(30px);
					transition: all 0.6s ease;
				}

				.animate-icon {
					animation: bounceIn 0.8s ease;
				}

				@keyframes bounceIn {
					0% {
						opacity: 0;
						transform: scale(0.3) rotate(-45deg);
					}
					50% {
						opacity: 1;
						transform: scale(1.05) rotate(-45deg);
					}
					70% {
						transform: scale(0.9) rotate(-45deg);
					}
					100% {
						opacity: 1;
						transform: scale(1) rotate(-45deg);
					}
				}

				.ripple {
					position: absolute;
					border-radius: 50%;
					background: rgba(255, 255, 255, 0.3);
					transform: scale(0);
					animation: ripple 0.6s linear;
					pointer-events: none;
				}

				@keyframes ripple {
					to {
						transform: scale(4);
						opacity: 0;
					}
				}

				.scroll-progress {
					position: fixed;
					top: 0;
					left: 0;
					height: 3px;
					background: var(--gradient-primary, linear-gradient(135deg, #dc2626 0%, #1e40af 100%));
					z-index: 9999;
					transition: width 0.1s ease;
				}

				.keyboard-focus {
					outline: 2px solid #dc2626 !important;
					outline-offset: 2px !important;
				}

				.hovered {
					transform: translateY(-5px);
				}

				.error {
					border-color: #ef4444 !important;
					box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
				}

				/* 터치 디바이스 최적화 */
				.touch-enabled .button,
				.touch-enabled .features li {
					cursor: pointer;
				}

				/* 그리드 미지원 브라우저 대응 */
				.no-grid-support .features {
					display: block !important;
				}

				.no-grid-support .features li {
					width: 100% !important;
					margin-bottom: 2em !important;
				}

				/* 로딩 상태 */
				.is-preload .features li {
					opacity: 0;
					transform: translateY(50px);
				}

				/* 반응형 개선 */
				@media screen and (max-width: 736px) {
					.scroll-progress {
						height: 2px;
					}
				}
			</style>
		`;
		
		$('head').append(dynamicStyles);
	}
});