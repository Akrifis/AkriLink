// Анимация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.social-link');
    
    links.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            link.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
});

// Копирование контакта
document.querySelectorAll('.social-link').forEach(link => {
    link.addEventListener('click', (e) => {
        if(e.ctrlKey) {
            e.preventDefault();
            navigator.clipboard.writeText(link.href);
            alert('Ссылка скопирована!');
        }
    });
});
