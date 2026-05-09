document.addEventListener('DOMContentLoaded', () => {
    /* -------------------------------------------
       ハンバーガーメニューの開閉制御
    ------------------------------------------- */
    const hamburger = document.querySelector('.hamburger');
    const sideMenu = document.querySelector('.side-menu');
    const body = document.body;

    const closeMenu = () => {
        if(hamburger) hamburger.classList.remove('active');
        if(sideMenu) sideMenu.classList.remove('open');
        body.style.overflow = '';
    };

    const toggleMenu = () => {
        hamburger.classList.toggle('active');
        sideMenu.classList.toggle('open');
        // メニューが開いている時は背景のスクロールを止める
        if (sideMenu.classList.contains('open')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    };

    if (hamburger && sideMenu) {
        // 三本線をクリックした時の処理
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // 画面のどこかをクリックした時の処理（メニューの外なら閉じる）
        document.addEventListener('click', (e) => {
            if (sideMenu.classList.contains('open')) {
                if (!sideMenu.contains(e.target) && !hamburger.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        // メニュー内のリンクをクリックした時に閉じる
        const menuLinks = sideMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }

    /* -------------------------------------------
       スクロールアニメーション (ふわっと表示)
    ------------------------------------------- */
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });

    /* -------------------------------------------
       予約フォームのバリデーション (火曜定休・過去日不可)
    ------------------------------------------- */
    const dateInput = document.getElementById('date');
    const dateInputEn = document.getElementById('date-en');
    const dateError = document.getElementById('date-error');
    const dateErrorEn = document.getElementById('date-error-en');

    function setupDateValidation(input, errorElement, isEn) {
        if (!input) return;

        // 過去の日付を選べないようにする
        const today = new Date().toISOString().split('T')[0];
        input.setAttribute('min', today);

        input.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const day = selectedDate.getDay();

            // 2は火曜日
            if (day === 2) {
                errorElement.textContent = isEn 
                    ? "※ We are closed on Tuesdays. Please select another date." 
                    : "※ 火曜日は定休日のため、別の日付をご選択ください。";
                input.value = ""; // 入力をリセット
            } else {
                errorElement.textContent = "";
            }
        });
    }

    setupDateValidation(dateInput, dateError, false);
    setupDateValidation(dateInputEn, dateErrorEn, true);

    /* -------------------------------------------
       お問い合わせフォーム送信シミュレーション
    ------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const contactFormEn = document.getElementById('contact-form-en');

    function handleFormSubmit(form, statusId, successMsg, errorMsg) {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const status = document.getElementById(statusId);
            const btn = form.querySelector('button');

            btn.textContent = "...";
            btn.disabled = true;

            setTimeout(() => {
                status.textContent = successMsg;
                status.className = "status-msg success";
                btn.textContent = form === contactFormEn ? "Complete" : "送信完了";
                form.reset();
            }, 1500);
        });
    }

    handleFormSubmit(
        contactForm, 
        'form-status', 
        'お問い合わせありがとうございます。メッセージは送信されました。', 
        '送信に失敗しました。時間をおいて再度お試しください。'
    );

    handleFormSubmit(
        contactFormEn, 
        'form-status-en', 
        'Thank you. Your message has been sent successfully.', 
        'Failed to send. Please try again later.'
    );
});