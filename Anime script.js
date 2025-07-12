// Конфигурация
const SHIKI_USER_ID = '1361053'; // Найти в URL вашего профиля на Shikimori
const UPDATE_INTERVAL = 60 * 60 * 1000; // 1 час

// Получение данных с Shikimori API
async function fetchAnimeList(listType) {
    try {
        const response = await fetch(`https://shikimori.me/api/users/${SHIKI_USER_ID}/anime_rates?status=${listType}`);
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
            <img class="anime-poster" src="https://shikimori.me${anime.anime.image.preview}" alt="${anime.anime.name}">
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
        const response = await fetch(`https://shikimori.me/api/users/${SHIKI_USER_ID}`);
        const user = await response.json();
        
        document.getElementById('user-avatar').src = `https://shikimori.me${user.avatar}`;
        document.getElementById('username').textContent = user.nickname;
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
