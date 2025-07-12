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
const CONFIG = {
    SHIKI_USERNAME: 'Akrifis', // Ваш ник на Shikimori
    UPDATE_INTERVAL: 60, // Интервал обновления в минутах
    USE_PROXY: true // Использовать прокси для обхода CORS
};

// Глобальные переменные
let animeData = {};
let currentStatus = 'watching';

// DOM элементы
const elements = {
    animeList: document.getElementById('anime-list'),
    username: document.getElementById('username'),
    userAvatar: document.getElementById('user-avatar'),
    userStats: document.getElementById('user-stats'),
    lastUpdate: document.getElementById('last-update'),
    updateInterval: document.getElementById('update-interval'),
    searchInput: document.getElementById('search-input'),
    tabButtons: document.querySelectorAll('.tab-btn')
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    elements.updateInterval.textContent = CONFIG.UPDATE_INTERVAL;
    setupEventListeners();
    loadUserData();
    loadAnimeData();
    startAutoUpdate();
});

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение табов
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatus = btn.dataset.status;
            renderAnimeList();
        });
    });

    // Поиск
    elements.searchInput.addEventListener('input', () => {
        renderAnimeList();
    });
}

// Загрузка данных пользователя
async function loadUserData() {
    try {
        const user = await fetchShikimoriData(`/api/users/${CONFIG.SHIKI_USERNAME}`);
        
        elements.username.textContent = user.nickname;
        elements.userAvatar.src = `https://shikimori.one${user.avatar}`;
        elements.userStats.textContent = `Аниме: ${user.stats.anime_counts.total} · Манга: ${user.stats.manga_counts.total}`;
    } catch (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        elements.username.textContent = 'Ошибка загрузки';
    }
}

// Загрузка списка аниме
async function loadAnimeData() {
    try {
        const data = await fetchShikimoriData(`/api/users/${CONFIG.SHIKI_USERNAME}/anime_rates`);
        
        // Группировка по статусу
        animeData = {
            watching: [],
            completed: [],
            planned: [],
            on_hold: [],
            dropped: []
        };
        
        data.forEach(item => {
            if (animeData[item.status]) {
                animeData[item.status].push(item);
            }
        });
        
        renderAnimeList();
        updateLastUpdateTime();
    } catch (error) {
        console.error('Ошибка загрузки списка аниме:', error);
    }
}

// Рендер списка аниме
function renderAnimeList() {
    const searchTerm = elements.searchInput.value.toLowerCase();
    const filteredAnime = animeData[currentStatus].filter(anime => {
        const title = (anime.anime.russian || anime.anime.name).toLowerCase();
        return title.includes(searchTerm);
    });
    
    elements.animeList.innerHTML = filteredAnime.map(anime => `
        <div class="anime-card">
            <img class="anime-poster" src="https://shikimori.one${anime.anime.image.preview}" alt="${anime.anime.russian || anime.anime.name}">
            <div class="anime-info">
                <div class="anime-title" title="${anime.anime.russian || anime.anime.name}">
                    ${anime.anime.russian || anime.anime.name}
                </div>
                <div class="anime-meta">
                    <span>${anime.score > 0 ? '★'.repeat(anime.score) : 'Без оценки'}</span>
                    <span>${anime.episodes}/${anime.anime.episodes || '?'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Обновление времени последнего обновления
function updateLastUpdateTime() {
    const now = new Date();
    elements.lastUpdate.textContent = now.toLocaleString();
}

// Автоматическое обновление
function startAutoUpdate() {
    setInterval(() => {
        loadAnimeData();
    }, CONFIG.UPDATE_INTERVAL * 60 * 1000);
}

// Работа с Shikimori API
async function fetchShikimoriData(endpoint) {
    const baseUrl = 'https://shikimori.one';
    const url = CONFIG.USE_PROXY 
        ? `https://cors-anywhere.herokuapp.com/${baseUrl}${endpoint}`
        : `${baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
        headers: CONFIG.USE_PROXY ? {} : {
            'User-Agent': 'AnimeListApp/1.0'
        }
    });
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
}
