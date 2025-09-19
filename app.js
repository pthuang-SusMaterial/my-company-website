document.addEventListener('DOMContentLoaded', () => {
    const languageSwitcher = document.querySelector('.language-switcher');
    
    // 獲取所有需要翻譯的元素
    const translatableElements = document.querySelectorAll('[data-i18n-key]');

    // 異步函數，用於加載語言文件並翻譯頁面
    const translatePage = async (language) => {
        try {
            const response = await fetch(`locales/${language}.json`);
            if (!response.ok) {
                throw new Error(`Could not load ${language}.json`);
            }
            const translations = await response.json();

            translatableElements.forEach(element => {
                const key = element.getAttribute('data-i18n-key');
                if (translations[key]) {
                    // 根據元素類型，更新 textContent 或其他屬性
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[key];
                    } else {
                        element.innerHTML = translations[key];
                    }
                }
            });
            
            // 更新切換按鈕的顯示狀態
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-lang') === language) {
                    btn.classList.add('active');
                }
            });

        } catch (error) {
            console.error('Translation Error:', error);
        }
    };

    // 設定語言並儲存到瀏覽器的 localStorage
    const setLanguage = (language) => {
        localStorage.setItem('language', language);
        translatePage(language);
    };

    // 為語言切換按鈕添加點擊事件
    languageSwitcher.addEventListener('click', (e) => {
        if (e.target.classList.contains('lang-btn')) {
            const selectedLanguage = e.target.getAttribute('data-lang');
            setLanguage(selectedLanguage);
        }
    });

    // 初始化頁面：檢查 localStorage 中是否有已儲存的語言偏好
    const savedLanguage = localStorage.getItem('language') || 'zh-TW'; // 如果沒有，預設為繁體中文
    translatePage(savedLanguage);
});