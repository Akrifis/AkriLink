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
// Конфигурация
const SHIKI_USER_ID = 1361053; // Найти в URL вашего профиля на Shikimori
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 час

// Получение данных с Shikimori API
async function fetchAnimeList(listType) {
    try {
        const response = await fetch(`https://shikimori.one/api/users/${SHIKI_USER_ID}/anime_rates?status=${listType}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        return [];
    }
}

// Отображение аниме
function displayAnime(list, elementId) {
    const listElement = document.getElementById(elementId);
    listElement.innerHTML = '';

    list.forEach(anime => {
        const animeItem = document.createElement('div');
        animeItem.className = 'anime-item';
        
        animeItem.innerHTML = `
            <img class="anime-poster" src="https://shikimori.one${anime.anime.image.preview}" alt="${anime.anime.name}">
            <div class="anime-title">${anime.anime.russian || anime.anime.name}</div>
        `;
        
        listElement.appendChild(animeItem);
    });
}

// Переключение табов
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            tabs.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            tab.classList.add('active');
            
            // Скрываем все списки
            document.querySelectorAll('.anime-list').forEach(list => {
                list.style.display = 'none';
            });
            
            // Показываем нужный список
            document.getElementById(`${tab.dataset.list}-list`).style.display = 'grid';
        });
    });
}

// Загрузка профиля пользователя
async function loadProfile() {
    try {
        const response = await fetch(`https://shikimori.one/api/users/${SHIKI_USER_ID}`);
        const user = await response.json();
        
        document.getElementById('user-avatar').src = `https://shikimori.one${user.avatar}`;
        document.getElementById('Aktifis').textContent = user.nickname;
    } catch (error) {
        console.error('Ошибка при загрузке профиля:', error);
    }
}

// Основная функция
async function loadAllData() {
    await loadProfile();
    
    const [watching, completed, planned] = await Promise.all([
        fetchAnimeList('watching'),
        fetchAnimeList('completed'),
        fetchAnimeList('planned')
    ]);
    
    displayAnime(watching, 'watching-list');
    displayAnime(completed, 'completed-list');
    displayAnime(planned, 'planned-list');
    
    document.getElementById('last-update').textContent = new Date().toLocaleString();
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    loadAllData();
    
    // Автообновление
    setInterval(loadAllData, UPDATE_INTERVAL);
});
