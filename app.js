document.addEventListener('DOMContentLoaded', () => {
    const languageSwitchers = document.querySelectorAll('.language-switcher');
    const translatableElements = document.querySelectorAll('[data-i18n-key]');

    const translatePage = async (language) => {
        // 加入淡出效果防止 FOUC
        document.body.classList.add('lang-loading');

        try {
            const response = await fetch(`locales/${language}.json`);
            if (!response.ok) throw new Error(`Could not load ${language}.json`);
            const translations = await response.json();

            translatableElements.forEach(element => {
                const key = element.getAttribute('data-i18n-key');
                if (translations[key]) {
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

            document.documentElement.lang = language;

        } catch (error) {
            console.error('Translation Error:', error);
        } finally {
            // 資料替換完畢後，移除 Loading 類別觸發 CSS 淡入
            setTimeout(() => {
                document.body.classList.remove('lang-loading');
            }, 150);
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

    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // 動態數字跳台 (Stats Counter Animation)
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const targetElement = entry.target;
                    const target = parseFloat(targetElement.getAttribute('data-target'));
                    const duration = 2000; // 2 秒動畫
                    const startTime = performance.now();

                    const updateCounter = (currentTime) => {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);

                        // Ease-out Effect
                        const easeProgress = 1 - Math.pow(1 - progress, 4);
                        const currentVal = target * easeProgress;

                        if (target % 1 !== 0) {
                            targetElement.innerText = currentVal.toFixed(1);
                        } else {
                            targetElement.innerText = Math.floor(currentVal);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            targetElement.innerText = target;
                        }
                    };
                    requestAnimationFrame(updateCounter);
                    observer.unobserve(targetElement); // 只播放一次
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    const browserLang = navigator.language === 'en-US' ? 'en-US' : 'zh-TW';
    const initialLang = localStorage.getItem('language') || browserLang;
    translatePage(initialLang);
});