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
                    // 根據標籤類型更新內容
                    if (element.tagName === 'META') {
                        element.setAttribute('content', translations[key]);
                    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        element.placeholder = translations[key];
                    } else if (element.tagName === 'TITLE') {
                        document.title = translations[key];
                    } else {
                        element.innerHTML = translations[key];
                    }
                }
            });
            
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === language);
            });

            // 設定 HTML 語系標籤
            document.documentElement.lang = language;

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

    const browserLang = navigator.language === 'en-US' ? 'en-US' : 'zh-TW';
    const initialLang = localStorage.getItem('language') || browserLang;
    translatePage(initialLang);
});