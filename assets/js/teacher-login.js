/*
	장자기독학교 교사 로그인 JavaScript
*/

document.addEventListener('DOMContentLoaded', function() {
	const loginForm = document.getElementById('loginForm');
	const loginBtn = document.getElementById('loginBtn');
	const errorMessage = document.getElementById('errorMessage');
	const loadingSpinner = loginBtn.querySelector('.loading-spinner');
	const btnText = loginBtn.querySelector('.btn-text');

	// 더미 계정 (실제로는 서버에서 검증)
	const validCredentials = {
		'teacher1': 'jangja2024',
		'teacher2': 'christian123',
		'admin': 'admin1234'
	};

	loginForm.addEventListener('submit', async function(e) {
		e.preventDefault();
		
		const username = document.getElementById('username').value.trim();
		const password = document.getElementById('password').value.trim();
		const remember = document.getElementById('remember').checked;
		
		// 입력 검증
		if (!username || !password) {
			showError('아이디와 비밀번호를 모두 입력해주세요.');
			return;
		}
		
		// 로딩 상태 시작
		setLoadingState(true);
		hideError();
		
		// 로그인 처리 시뮬레이션
		try {
			await simulateLogin(username, password);
			
			// 로그인 성공
			if (validCredentials[username] === password) {
				// 세션 저장
				sessionStorage.setItem('teacherLoggedIn', 'true');
				sessionStorage.setItem('teacherUsername', username);
				sessionStorage.setItem('loginTime', new Date().toISOString());
				
				if (remember) {
					localStorage.setItem('teacherRemember', username);
				}
				
				// 성공 메시지 표시
				showSuccess('로그인 성공! 관리 페이지로 이동합니다...');
				
				// 활동 로그
				logActivity('login', `${getDisplayName(username)}님이 로그인했습니다.`);
				
				// 2초 후 관리 페이지로 이동
				setTimeout(() => {
					window.location.href = 'teacher-admin.html';
				}, 2000);
				
			} else {
				throw new Error('잘못된 로그인 정보입니다.');
			}
			
		} catch (error) {
			showError(error.message);
			
			// 실패 로그
			logActivity('failed_login', `로그인 실패 시도: ${username}`);
			
		} finally {
			setLoadingState(false);
		}
	});

	// 로딩 상태 관리
	function setLoadingState(loading) {
		loginBtn.disabled = loading;
		if (loading) {
			btnText.style.opacity = '0';
			loadingSpinner.style.display = 'block';
		} else {
			btnText.style.opacity = '1';
			loadingSpinner.style.display = 'none';
		}
	}

	// 에러 메시지 표시
	function showError(message) {
		errorMessage.style.background = 'rgba(239, 68, 68, 0.1)';
		errorMessage.style.borderColor = '#ef4444';
		errorMessage.style.color = '#ef4444';
		errorMessage.textContent = message;
		errorMessage.classList.add('show');
		
		// 5초 후 자동 숨기기
		setTimeout(() => {
			errorMessage.classList.remove('show');
		}, 5000);
	}

	// 에러 메시지 숨기기
	function hideError() {
		errorMessage.classList.remove('show');
	}

	// 성공 메시지 표시
	function showSuccess(message) {
		errorMessage.style.background = 'rgba(34, 197, 94, 0.1)';
		errorMessage.style.borderColor = '#22c55e';
		errorMessage.style.color = '#22c55e';
		errorMessage.textContent = message;
		errorMessage.classList.add('show');
	}

	// 로그인 처리 시뮬레이션
	function simulateLogin(username, password) {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (validCredentials[username] === password) {
					resolve();
				} else {
					reject(new Error('아이디 또는 비밀번호가 올바르지 않습니다.'));
				}
			}, 1500); // 1.5초 지연 시뮬레이션
		});
	}

	// 표시 이름 가져오기
	function getDisplayName(username) {
		const names = {
			'teacher1': '김선생',
			'teacher2': '이선생',
			'admin': '관리자'
		};
		return names[username] || '선생님';
	}

	// 활동 로그
	function logActivity(action, details) {
		const activity = {
			timestamp: new Date().toISOString(),
			action: action,
			details: details,
			ip: 'localhost', // 실제로는 서버에서 처리
			userAgent: navigator.userAgent
		};
		
		// 로컬 스토리지에 활동 로그 저장
		const logs = JSON.parse(localStorage.getItem('loginLogs') || '[]');
		logs.unshift(activity);
		logs.splice(50); // 최신 50개만 유지
		localStorage.setItem('loginLogs', JSON.stringify(logs));
	}

	// 비밀번호 찾기
	document.getElementById('forgotPassword').addEventListener('click', function(e) {
		e.preventDefault();
		
		const email = prompt('등록된 이메일 주소를 입력해주세요:');
		
		if (email) {
			if (validateEmail(email)) {
				showSuccess('비밀번호 재설정 링크가 이메일로 전송되었습니다.');
				logActivity('password_reset', `비밀번호 재설정 요청: ${email}`);
			} else {
				showError('올바른 이메일 주소를 입력해주세요.');
			}
		}
	});

	// 이메일 검증
	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// 기억된 사용자 정보 복원
	const rememberedUser = localStorage.getItem('teacherRemember');
	if (rememberedUser) {
		document.getElementById('username').value = rememberedUser;
		document.getElementById('remember').checked = true;
	}

	// 테마 토글 (선택사항)
	document.querySelector('.theme-toggle').addEventListener('click', function() {
		document.body.classList.toggle('light-theme');
		const icon = this.querySelector('i');
		if (document.body.classList.contains('light-theme')) {
			icon.className = 'fas fa-sun';
		} else {
			icon.className = 'fas fa-moon';
		}
		
		// 테마 설정 저장
		localStorage.setItem('preferredTheme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
	});

	// 저장된 테마 복원
	const savedTheme = localStorage.getItem('preferredTheme');
	if (savedTheme === 'light') {
		document.body.classList.add('light-theme');
		document.querySelector('.theme-toggle i').className = 'fas fa-sun';
	}

	// 입력 필드 이벤트
	document.querySelectorAll('.form-group input').forEach(input => {
		input.addEventListener('focus', function() {
			this.parentElement.classList.add('focused');
		});
		
		input.addEventListener('blur', function() {
			this.parentElement.classList.remove('focused');
			validateField(this);
		});

		input.addEventListener('input', function() {
			// 실시간 검증
			clearFieldError(this);
		});
	});

	// 필드 검증
	function validateField(field) {
		const value = field.value.trim();
		
		if (field.type === 'text' && field.name === 'username') {
			if (value.length < 3) {
				showFieldError(field, '아이디는 3자 이상이어야 합니다.');
				return false;
			}
		}
		
		if (field.type === 'password') {
			if (value.length < 6) {
				showFieldError(field, '비밀번호는 6자 이상이어야 합니다.');
				return false;
			}
		}
		
		return true;
	}

	// 필드 에러 표시
	function showFieldError(field, message) {
		field.style.borderColor = '#ef4444';
		
		// 기존 에러 메시지 제거
		const existingError = field.parentElement.querySelector('.field-error');
		if (existingError) {
			existingError.remove();
		}
		
		// 새 에러 메시지 추가
		const errorSpan = document.createElement('span');
		errorSpan.className = 'field-error';
		errorSpan.textContent = message;
		errorSpan.style.color = '#ef4444';
		errorSpan.style.fontSize = '0.8rem';
		errorSpan.style.marginTop = '0.25rem';
		field.parentElement.appendChild(errorSpan);
	}

	// 필드 에러 제거
	function clearFieldError(field) {
		field.style.borderColor = '';
		const errorSpan = field.parentElement.querySelector('.field-error');
		if (errorSpan) {
			errorSpan.remove();
		}
	}

	// 이미 로그인된 경우 리다이렉트
	if (sessionStorage.getItem('teacherLoggedIn') === 'true') {
		// 세션 만료 체크 (24시간)
		const loginTime = sessionStorage.getItem('loginTime');
		if (loginTime) {
			const loginDate = new Date(loginTime);
			const now = new Date();
			const hoursDiff = (now - loginDate) / (1000 * 60 * 60);
			
			if (hoursDiff < 24) {
				window.location.href = 'teacher-admin.html';
			} else {
				// 세션 만료
				sessionStorage.clear();
				showError('세션이 만료되었습니다. 다시 로그인해주세요.');
			}
		}
	}

	// 키보드 접근성
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
			const form = e.target.closest('form');
			if (form && !loginBtn.disabled) {
				form.requestSubmit();
			}
		}
	});

	// 보안: 개발자 도구 감지 (선택적)
	let devtools = {
		open: false,
		orientation: null
	};

	const threshold = 160;

	setInterval(() => {
		if (window.outerHeight - window.innerHeight > threshold || 
			window.outerWidth - window.innerWidth > threshold) {
			if (!devtools.open) {
				devtools.open = true;
				console.warn('보안상의 이유로 개발자 도구 사용을 권장하지 않습니다.');
			}
		} else {
			devtools.open = false;
		}
	}, 500);

	// 자동 로그아웃 타이머 (30분 비활성)
	let inactivityTimer;
	const INACTIVITY_TIME = 30 * 60 * 1000; // 30분

	function resetInactivityTimer() {
		clearTimeout(inactivityTimer);
		inactivityTimer = setTimeout(() => {
			if (sessionStorage.getItem('teacherLoggedIn') === 'true') {
				alert('장시간 비활성으로 인해 로그아웃됩니다.');
				sessionStorage.clear();
				window.location.reload();
			}
		}, INACTIVITY_TIME);
	}

	// 사용자 활동 감지
	['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
		document.addEventListener(event, resetInactivityTimer, true);
	});

	// 초기 타이머 설정
	resetInactivityTimer();

	console.log('교사 로그인 시스템 초기화 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
	// 진행 중인 요청이 있다면 취소
	clearTimeout();
});

// 에러 처리
window.addEventListener('error', function(e) {
	console.error('JavaScript 에러:', e.error);
	// 중요한 에러는 서버로 전송하거나 로그에 기록
});

// 온라인/오프라인 상태 감지
window.addEventListener('online', function() {
	console.log('네트워크 연결이 복원되었습니다.');
});

window.addEventListener('offline', function() {
	console.warn('네트워크 연결이 끊어졌습니다.');
});