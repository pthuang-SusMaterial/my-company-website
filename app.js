document.addEventListener('DOMContentLoaded', () => {
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    const translatableElements = document.querySelectorAll('[data-i18n-key]');

    const translatePage = async (language) => {
        try {
            const response = await fetch(`locales/${language}.json`);
            if (!response.ok) throw new Error(`Could not load ${language}.json`);
            const translations = await response.json();

            translatableElements.forEach(element => {
                const key = element.getAttribute('data-i18n-key');
                if (translations[key]) {
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[key];
                    } else {
                        element.innerHTML = translations[key];
                    }
                }
            });
            
            // 同步更新按鈕狀態
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === language);
            });

            // 更新網頁標題 (SEO 優化)
            const titleKey = language === 'zh-TW' ? 'navHome' : 'navHome'; // 可根據頁面自訂
            // document.title = translations['pageTitle'] || document.title; 

        } catch (error) {
            console.error('Translation Error:', error);
        }
    };

    const setLanguage = (language) => {
        localStorage.setItem('language', language);
        translatePage(language);
    };

    languageSwitchers.forEach(switcher => {
        switcher.addEventListener('click', (e) => {
            if (e.target.classList.contains('lang-btn')) {
                setLanguage(e.target.getAttribute('data-lang'));
            }
        });
    });

    // 優先順序：1. 使用者上次選擇 2. 瀏覽器語言 3. 預設繁中
    const browserLang = navigator.language === 'en-US' ? 'en-US' : 'zh-TW';
    const initialLang = localStorage.getItem('language') || browserLang;
    translatePage(initialLang);
});