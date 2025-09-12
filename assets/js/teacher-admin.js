/*
	장자기독학교 교사 관리 페이지 JavaScript
*/

document.addEventListener('DOMContentLoaded', function() {
	// 로그인 체크
	if (sessionStorage.getItem('teacherLoggedIn') !== 'true') {
		window.location.href = 'teacher-login.html';
		return;
	}

	// 전역 변수
	let currentGalleryItems = [];
	let currentTab = 'dashboard';

	// 초기화
	initializeAdmin();

	function initializeAdmin() {
		// 사용자 정보 설정
		const username = sessionStorage.getItem('teacherUsername') || 'teacher';
		document.getElementById('userName').textContent = getDisplayName(username);
		document.getElementById('userAvatar').textContent = getDisplayName(username).charAt(0);

		// 이벤트 리스너 설정
		setupEventListeners();
		
		// 갤러리 아이템 로드
		loadGalleryItems();
		
		// 게시판 데이터 로드
		loadBoardData();
		
		// 반응형 처리
		handleResponsive();
	}

	function getDisplayName(username) {
		const names = {
			'teacher1': '김선생',
			'teacher2': '이선생',
			'admin': '관리자'
		};
		return names[username] || '선생님';
	}

	function setupEventListeners() {
		// 사이드바 네비게이션
		document.querySelectorAll('.nav-item').forEach(item => {
			item.addEventListener('click', function(e) {
				e.preventDefault();
				const tab = this.dataset.tab;
				switchTab(tab);
			});
		});

		// 로그아웃
		document.getElementById('logoutBtn').addEventListener('click', logout);

		// 파일 업로드
		setupFileUpload();

		// 폼 제출
		setupFormSubmissions();

		// 갤러리 탭
		document.querySelectorAll('[data-gallery-tab]').forEach(btn => {
			btn.addEventListener('click', function() {
				filterGallery(this.dataset.galleryTab);
				document.querySelectorAll('[data-gallery-tab]').forEach(b => b.classList.remove('active'));
				this.classList.add('active');
			});
		});

		// 모바일 메뉴
		const mobileMenuBtn = document.getElementById('mobileMenuBtn');
		if (mobileMenuBtn) {
			mobileMenuBtn.addEventListener('click', toggleMobileMenu);
		}

		// 새 글 작성 버튼
		const newPostBtn = document.getElementById('newPostBtn');
		if (newPostBtn) {
			newPostBtn.addEventListener('click', function() {
				showNotification('새 글 작성 기능은 준비 중입니다.', 'info');
			});
		}

		// 미리보기 버튼
		const previewBtn = document.getElementById('previewBtn');
		if (previewBtn) {
			previewBtn.addEventListener('click', handlePreview);
		}
	}

	function switchTab(tabName) {
		// 네비게이션 활성화 상태 변경
		document.querySelectorAll('.nav-item').forEach(item => {
			item.classList.remove('active');
		});
		document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

		// 콘텐츠 탭 변경
		document.querySelectorAll('.content-tab').forEach(tab => {
			tab.classList.remove('active');
		});
		document.getElementById(`${tabName}-content`).classList.add('active');

		currentTab = tabName;
	}

	function setupFileUpload() {
		const fileUpload = document.getElementById('fileUpload');
		const fileInput = document.getElementById('photoFiles');
		const filePreview = document.getElementById('filePreview');

		if (!fileUpload || !fileInput || !filePreview) return;

		// 드래그 앤 드롭
		fileUpload.addEventListener('dragover', function(e) {
			e.preventDefault();
			this.classList.add('dragover');
		});

		fileUpload.addEventListener('dragleave', function(e) {
			e.preventDefault();
			this.classList.remove('dragover');
		});

		fileUpload.addEventListener('drop', function(e) {
			e.preventDefault();
			this.classList.remove('dragover');
			
			const files = e.dataTransfer.files;
			fileInput.files = files;
			previewFiles(files);
		});

		// 클릭으로 파일 선택
		fileUpload.addEventListener('click', function() {
			fileInput.click();
		});

		// 파일 선택 시 미리보기
		fileInput.addEventListener('change', function() {
			previewFiles(this.files);
		});
	}

	function previewFiles(files) {
		const filePreview = document.getElementById('filePreview');
		filePreview.innerHTML = '';

		Array.from(files).forEach((file, index) => {
			if (file.type.startsWith('image/')) {
				const reader = new FileReader();
				reader.onload = function(e) {
					const previewItem = document.createElement('div');
					previewItem.className = 'preview-item';
					previewItem.innerHTML = `
						<img src="${e.target.result}" alt="Preview">
						<button type="button" class="preview-remove" onclick="removePreview(${index})">
							<i class="fas fa-times"></i>
						</button>
					`;
					filePreview.appendChild(previewItem);
				};
				reader.readAsDataURL(file);
			}
		});
	}

	window.removePreview = function(index) {
		const previewItem = document.querySelectorAll('.preview-item')[index];
		if (previewItem) {
			previewItem.remove();
		}
	};

	function setupFormSubmissions() {
		// 사진 업로드 폼
		const photoForm = document.getElementById('photoUploadForm');
		if (photoForm) {
			photoForm.addEventListener('submit', function(e) {
				e.preventDefault();
				handlePhotoUpload(this);
			});
		}

		// 공지사항 폼
		const noticeForm = document.getElementById('noticeForm');
		if (noticeForm) {
			noticeForm.addEventListener('submit', function(e) {
				e.preventDefault();
				handleNoticeSubmit(this);
			});
		}

		// 설정 폼
		const settingsForm = document.getElementById('settingsForm');
		if (settingsForm) {
			settingsForm.addEventListener('submit', function(e) {
				e.preventDefault();
				handleSettingsSubmit(this);
			});
		}
	}

	function handlePhotoUpload(form) {
		const formData = new FormData(form);
		
		// 업로드 시뮬레이션
		showNotification('사진을 업로드하고 있습니다...', 'info');
		
		setTimeout(() => {
			// 성공 처리
			showNotification('사진이 성공적으로 업로드되었습니다!', 'success');
			form.reset();
			document.getElementById('filePreview').innerHTML = '';
			
			// 갤러리 새로고침
			loadGalleryItems();
			
			// 활동 로그
			logActivity('upload', '새 사진이 업로드되었습니다.');
		}, 2000);
	}

	function handleNoticeSubmit(form) {
		const formData = new FormData(form);
		
		showNotification('공지사항을 게시하고 있습니다...', 'info');
		
		setTimeout(() => {
			showNotification('공지사항이 성공적으로 게시되었습니다!', 'success');
			form.reset();
			
			// 활동 로그
			logActivity('notice', '새 공지사항이 게시되었습니다.');
		}, 1500);
	}

	function handleSettingsSubmit(form) {
		const formData = new FormData(form);
		
		showNotification('설정을 저장하고 있습니다...', 'info');
		
		setTimeout(() => {
			showNotification('설정이 성공적으로 저장되었습니다!', 'success');
			
			// 활동 로그
			logActivity('settings', '설정이 변경되었습니다.');
		}, 1000);
	}

	function handlePreview() {
		const title = document.getElementById('noticeTitle').value;
		const content = document.getElementById('noticeContent').value;
		const priority = document.getElementById('noticePriority').value;
		
		if (!title || !content) {
			showNotification('제목과 내용을 입력해주세요.', 'error');
			return;
		}
		
		// 미리보기 창 열기
		const previewWindow = window.open('', 'preview', 'width=800,height=600');
		previewWindow.document.write(`
			<!DOCTYPE html>
			<html>
			<head>
				<title>공지사항 미리보기</title>
				<style>
					body { 
						font-family: 'Noto Sans KR', sans-serif; 
						margin: 40px; 
						line-height: 1.6; 
						background: #0a0a0a;
						color: #ffffff;
					}
					.priority { 
						padding: 4px 8px; 
						border-radius: 4px; 
						font-size: 12px; 
						font-weight: bold; 
					}
					.priority.important { background: #f59e0b; color: white; }
					.priority.urgent { background: #ef4444; color: white; }
					.priority.normal { background: #6b7280; color: white; }
					h1 { color: #ffffff; margin-bottom: 20px; }
					.content { white-space: pre-wrap; }
					.date { color: #a1a1aa; font-size: 14px; }
				</style>
			</head>
			<body>
				<h1>${title} ${priority !== 'normal' ? `<span class="priority ${priority}">${priority === 'important' ? '중요' : '긴급'}</span>` : ''}</h1>
				<div class="date">작성일: ${new Date().toLocaleDateString('ko-KR')}</div>
				<hr>
				<div class="content">${content}</div>
			</body>
			</html>
		`);
		previewWindow.document.close();
	}

	function loadGalleryItems() {
		// 더미 갤러리 데이터
		currentGalleryItems = [
			{
				id: 1,
				title: '체육대회 단체사진',
				category: 'moments',
				image: 'images/pic01.jpg',
				date: '2024-01-15',
				views: 156
			},
			{
				id: 2,
				title: '미술 작품 전시',
				category: 'works',
				image: 'images/pic02.jpg',
				date: '2024-01-14',
				views: 89
			},
			{
				id: 3,
				title: '졸업식 풍경',
				category: 'events',
				image: 'images/pic03.jpg',
				date: '2024-01-13',
				views: 234
			}
		];
		
		renderGalleryItems(currentGalleryItems);
	}

	function renderGalleryItems(items) {
		const galleryGrid = document.getElementById('galleryGrid');
		if (!galleryGrid) return;
		
		galleryGrid.innerHTML = '';

		items.forEach(item => {
			const galleryItem = document.createElement('div');
			galleryItem.className = 'gallery-item';
			galleryItem.innerHTML = `
				<img src="${item.image}" alt="${item.title}">
				<div class="gallery-item-info">
					<div class="gallery-item-title">${item.title}</div>
					<div class="gallery-item-meta">
						${item.date} • 조회수 ${item.views}
					</div>
					<div class="gallery-item-actions">
						<button class="btn btn-secondary" onclick="editGalleryItem(${item.id})">
							<i class="fas fa-edit"></i>
						</button>
						<button class="btn btn-warning" onclick="deleteGalleryItem(${item.id})">
							<i class="fas fa-trash"></i>
						</button>
					</div>
				</div>
			`;
			galleryGrid.appendChild(galleryItem);
		});
	}

	function filterGallery(category) {
		if (category === 'all') {
			renderGalleryItems(currentGalleryItems);
		} else {
			const filteredItems = currentGalleryItems.filter(item => item.category === category);
			renderGalleryItems(filteredItems);
		}
	}

	window.editGalleryItem = function(id) {
		showNotification('편집 기능은 준비 중입니다.', 'info');
	};

	window.deleteGalleryItem = function(id) {
		if (confirm('정말로 이 항목을 삭제하시겠습니까?')) {
			currentGalleryItems = currentGalleryItems.filter(item => item.id !== id);
			renderGalleryItems(currentGalleryItems);
			showNotification('항목이 삭제되었습니다.', 'success');
			
			// 활동 로그
			logActivity('delete', '갤러리 항목이 삭제되었습니다.');
		}
	};

	function loadBoardData() {
		// 더미 게시판 데이터
		const boardData = [
			{ id: 1, title: '2024년 입학식 안내', date: '2024-01-15', views: 245 },
			{ id: 2, title: '겨울 성경학교 참가 신청', date: '2024-01-14', views: 189 },
			{ id: 3, title: '학부모 상담 일정 공지', date: '2024-01-13', views: 156 }
		];

		const tbody = document.getElementById('boardTableBody');
		if (!tbody) return;
		
		tbody.innerHTML = '';

		boardData.forEach(item => {
			const row = document.createElement('tr');
			row.innerHTML = `
				<td>${item.id}</td>
				<td>${item.title}</td>
				<td>${item.date}</td>
				<td>${item.views}</td>
				<td>
					<button class="btn btn-secondary" onclick="editPost(${item.id})">
						<i class="fas fa-edit"></i>
					</button>
					<button class="btn btn-warning" onclick="deletePost(${item.id})">
						<i class="fas fa-trash"></i>
					</button>
				</td>
			`;
			tbody.appendChild(row);
		});
	}

	window.editPost = function(id) {
		showNotification('게시글 편집 기능은 준비 중입니다.', 'info');
	};

	window.deletePost = function(id) {
		if (confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
			showNotification('게시글이 삭제되었습니다.', 'success');
			loadBoardData(); // 다시 로드
			
			// 활동 로그
			logActivity('delete', '게시글이 삭제되었습니다.');
		}
	};

	function showNotification(message, type = 'info') {
		const notification = document.getElementById('notification');
		const content = notification.querySelector('.notification-content');
		
		// 기존 클래스 제거
		notification.className = 'notification';
		
		// 타입에 따른 클래스 추가
		if (type === 'success') {
			notification.classList.add('success');
		} else if (type === 'error') {
			notification.classList.add('error');
		}
		
		// 메시지 설정
		content.textContent = message;
		
		// 알림 표시
		notification.classList.add('show');
		
		// 5초 후 자동 숨기기
		setTimeout(() => {
			notification.classList.remove('show');
		}, 5000);
	}

	// 알림 닫기 버튼
	const notificationClose = document.querySelector('.notification-close');
	if (notificationClose) {
		notificationClose.addEventListener('click', function() {
			document.getElementById('notification').classList.remove('show');
		});
	}

	function logout() {
		if (confirm('정말로 로그아웃 하시겠습니까?')) {
			// 활동 로그
			logActivity('logout', `${getDisplayName(sessionStorage.getItem('teacherUsername'))}님이 로그아웃했습니다.`);
			
			sessionStorage.removeItem('teacherLoggedIn');
			sessionStorage.removeItem('teacherUsername');
			window.location.href = 'teacher-login.html';
		}
	}

	function handleResponsive() {
		const mobileMenuBtn = document.getElementById('mobileMenuBtn');
		const sidebar = document.getElementById('sidebar');
		
		function checkScreenSize() {
			if (window.innerWidth <= 768) {
				if (mobileMenuBtn) mobileMenuBtn.classList.remove('hidden');
			} else {
				if (mobileMenuBtn) mobileMenuBtn.classList.add('hidden');
				if (sidebar) sidebar.classList.remove('open');
			}
		}
		
		window.addEventListener('resize', checkScreenSize);
		checkScreenSize();
	}

	function toggleMobileMenu() {
		const sidebar = document.getElementById('sidebar');
		if (sidebar) {
			sidebar.classList.toggle('open');
		}
	}

	// 클릭 외부 영역 시 모바일 메뉴 닫기
	document.addEventListener('click', function(e) {
		const sidebar = document.getElementById('sidebar');
		const mobileMenuBtn = document.getElementById('mobileMenuBtn');
		
		if (window.innerWidth <= 768 && 
			sidebar && sidebar.classList.contains('open') && 
			!sidebar.contains(e.target) && 
			mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
			sidebar.classList.remove('open');
		}
	});

	// 활동 로그
	function logActivity(action, details) {
		const activity = {
			timestamp: new Date().toISOString(),
			action: action,
			details: details,
			user: sessionStorage.getItem('teacherUsername')
		};
		
		// 로컬 스토리지에 활동 로그 저장
		const logs = JSON.parse(localStorage.getItem('teacherActivityLogs') || '[]');
		logs.unshift(activity);
		logs.splice(20); // 최신 20개만 유지
		localStorage.setItem('teacherActivityLogs', JSON.stringify(logs));
		
		updateActivityFeed();
	}

	function updateActivityFeed() {
		const logs = JSON.parse(localStorage.getItem('teacherActivityLogs') || '[]');
		const activityList = document.querySelector('.activity-list');
		
		if (activityList && logs.length > 0) {
			activityList.innerHTML = logs.slice(0, 5).map(log => `
				<div class="activity-item">
					<i class="fas fa-${getActivityIcon(log.action)}"></i>
					<div>
						<strong>${log.details}</strong>
						<span class="time">${getTimeAgo(log.timestamp)}</span>
					</div>
				</div>
			`).join('');
		}
	}

	function getActivityIcon(action) {
		const icons = {
			'upload': 'camera',
			'post': 'edit',
			'notice': 'bullhorn',
			'delete': 'trash',
			'edit': 'edit',
			'login': 'sign-in-alt',
			'logout': 'sign-out-alt',
			'settings': 'cog'
		};
		return icons[action] || 'info-circle';
	}

	function getTimeAgo(timestamp) {
		const now = new Date();
		const diff = now - new Date(timestamp);
		const minutes = Math.floor(diff / (1000 * 60));
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(diff / (1000 * 60 * 60 * 24));
		
		if (minutes < 1) return '방금 전';
		if (minutes < 60) return `${minutes}분 전`;
		if (hours < 24) return `${hours}시간 전`;
		return `${days}일 전`;
	}

	// 자동 저장 기능
	function setupAutoSave() {
		const textInputs = document.querySelectorAll('textarea, input[type="text"]');
		
		textInputs.forEach(input => {
			if (input.id) {
				// 저장된 내용 복원
				const saved = localStorage.getItem(`admin_autosave_${input.id}`);
				if (saved && !input.value) {
					input.value = saved;
				}
				
				// 입력 시 자동 저장
				input.addEventListener('input', debounce(() => {
					localStorage.setItem(`admin_autosave_${input.id}`, input.value);
				}, 1000));
			}
		});
	}

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

	// 통계 업데이트
	function updateStats() {
		// 실제로는 서버에서 데이터를 가져와야 함
		const stats = {
			photos: currentGalleryItems.length,
			posts: 42,
			views: '2.1k',
			pending: 8
		};
		
		document.querySelector('.stat-card.photos .stat-number').textContent = stats.photos;
		document.querySelector('.stat-card.posts .stat-number').textContent = stats.posts;
		document.querySelector('.stat-card.views .stat-number').textContent = stats.views;
		document.querySelector('.stat-card.pending .stat-number').textContent = stats.pending;
	}

	// 키보드 단축키
	document.addEventListener('keydown', function(e) {
		// Ctrl+S: 현재 폼 저장
		if (e.ctrlKey && e.key === 's') {
			e.preventDefault();
			const activeForm = document.querySelector('.content-tab.active form');
			if (activeForm) {
				activeForm.dispatchEvent(new Event('submit'));
			}
		}
		
		// Esc: 모바일 메뉴 닫기
		if (e.key === 'Escape') {
			const sidebar = document.getElementById('sidebar');
			if (sidebar && sidebar.classList.contains('open')) {
				sidebar.classList.remove('open');
			}
		}
	});

	// 초기화 완료
	updateActivityFeed();
	updateStats();
	setupAutoSave();
	
	// 로그인 활동 기록
	logActivity('login', `${getDisplayName(sessionStorage.getItem('teacherUsername'))}님이 관리 페이지에 접속했습니다.`);

	console.log('교사 관리 시스템 초기화 완료');
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
	// 현재 작성 중인 내용들 자동 저장
	document.querySelectorAll('textarea, input[type="text"]').forEach(input => {
		if (input.value && input.id) {
			localStorage.setItem(`admin_autosave_${input.id}`, input.value);
		}
	});
});

// 에러 처리
window.addEventListener('error', function(e) {
	console.error('JavaScript 에러:', e.error);
	
	// 중요한 에러는 사용자에게 알림
	if (e.message.includes('Cannot read property')) {
		console.warn('일부 기능이 제대로 로드되지 않았습니다.');
	}
});

// 온라인/오프라인 상태 감지
window.addEventListener('online', function() {
	console.log('네트워크 연결이 복원되었습니다.');
});

window.addEventListener('offline', function() {
	console.warn('네트워크 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.');
});