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



async function loadAnimeData() {
    try {
        // Получаем ВСЕ аниме (лимит 5000)
        const url = `https://api.allorigins.win/get?url=${encodeURIComponent(
            `https://shikimori.one/api/users/${USERNAME}/anime_rates?limit=5000`
        )}`;
        
        const response = await fetch(url);
        const data = await response.json();
        const allAnime = JSON.parse(data.contents);
        
        console.log('Всего аниме получено:', allAnime.length); // Проверка
        
        animeData = {
            watching: allAnime.filter(a => a.status === 'watching'),
            completed: allAnime.filter(a => a.status === 'completed'),
            planned: allAnime.filter(a => a.status === 'planned')
        };
        
        console.log('Отфильтровано:', { // Проверка
            watching: animeData.watching.length,
            completed: animeData.completed.length
        });
        
        showList(currentTab);
    } catch (error) {
        console.error('Ошибка загрузки:', error);
    }
}
