// ========== 페이지 로드 애니메이션 ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// 애니메이션 대상 요소들 관찰
document.querySelectorAll('.content-section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(section);
});

// 헤더 요소들 애니메이션
document.querySelectorAll('#main > header h2, #main > header p').forEach((element, index) => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = `opacity 0.8s ease ${0.2 + index * 0.2}s, transform 0.8s ease ${0.2 + index * 0.2}s`;
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
});

// Q&A 탭들 순차적 애니메이션
document.querySelectorAll('.qna-tab').forEach((tab, index) => {
    tab.style.opacity = '0';
    tab.style.transform = 'translateX(-20px)';
    tab.style.transition = `opacity 0.4s ease ${0.5 + index * 0.1}s, transform 0.4s ease ${0.5 + index * 0.1}s`;
    
    setTimeout(() => {
        tab.style.opacity = '1';
        tab.style.transform = 'translateX(0)';
    }, 100);
});