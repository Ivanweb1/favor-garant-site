// ФАВОР-ГАРАНТ — главная: меню «Продукция», мобильное меню, демо-отправка формы.

(function () {
  const header = document.querySelector('.header');

  // Выпадающее меню «Продукция»: открывается по клику и при наведении на десктопе
  const megaToggle = document.querySelector('.nav__toggle');
  const mega = document.getElementById('mega');
  let closeTimer;

  function setMega(open) {
    megaToggle.setAttribute('aria-expanded', String(open));
    mega.hidden = !open;
  }

  megaToggle.addEventListener('click', () => setMega(mega.hidden));

  const hoverZone = [megaToggle.closest('.nav__item'), mega];
  hoverZone.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      clearTimeout(closeTimer);
      setMega(true);
    });
    el.addEventListener('mouseleave', () => {
      if (!window.matchMedia('(hover: hover)').matches) return;
      closeTimer = setTimeout(() => setMega(false), 180);
    });
  });

  mega.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMega(false);
  });

  // Слева разделы — справа подразделы выбранного: переключение наведением и фокусом
  const megaCats = [...mega.querySelectorAll('.mega__cat')];
  const megaPanels = [...mega.querySelectorAll('.mega__panel')];
  function showCat(key) {
    megaCats.forEach((cat) => cat.classList.toggle('is-active', cat.dataset.cat === key));
    megaPanels.forEach((panel) => { panel.hidden = panel.dataset.panel !== key; });
  }
  megaCats.forEach((cat) => {
    cat.addEventListener('mouseenter', () => showCat(cat.dataset.cat));
    cat.addEventListener('focus', () => showCat(cat.dataset.cat));
  });

  // Подразделы в витрине каталога — одной строкой: что не влезло, прячем в чип «Ещё N»
  function fitModels(panel) {
    const list = panel.querySelector('.showcase__body > .card__models');
    if (!list) return;
    list.querySelectorAll('.models__more').forEach((el) => el.remove());
    const items = [...list.children];
    items.forEach((li) => { li.hidden = false; });
    // на узких экранах строка переносится — прятать нечего
    if (getComputedStyle(list).flexWrap !== 'nowrap' || list.scrollWidth <= list.clientWidth) return;
    const more = document.createElement('li');
    more.className = 'models__more';
    const link = document.createElement('a');
    link.href = '#catalog';
    more.appendChild(link);
    list.appendChild(more);
    for (let i = items.length - 1; i > 0; i--) {
      items[i].hidden = true;
      link.textContent = 'Ещё ' + (items.length - i);
      if (list.scrollWidth <= list.clientWidth) return;
    }
  }
  const fitVisibleModels = () => document.querySelectorAll('.showcase__panel:not([hidden])').forEach(fitModels);
  fitVisibleModels();
  document.fonts && document.fonts.ready.then(fitVisibleModels);
  let fitTimer;
  window.addEventListener('resize', () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitVisibleModels, 150); });

  // Вкладки: «Каталог» и «Решения для заказчиков» — каждый список вкладок переключается сам по себе
  const hoverMedia = window.matchMedia('(hover: hover) and (min-width: 1081px)');
  document.querySelectorAll('[role="tablist"]').forEach((list) => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
    function selectTab(tab) {
      tabs.forEach((t) => {
        const on = t === tab;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        panel.hidden = !on;
        if (on) fitModels(panel);
      });
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        selectTab(tab);
        // на телефоне вкладки каталога листаются строкой — подтягиваем выбранную в зону видимости
        tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
      });
      // разделы каталога на десктопе переключаются наведением, как в меню «Продукция»
      if (list.classList.contains('showcase__tabs')) {
        tab.addEventListener('mouseenter', () => {
          if (hoverMedia.matches && tab.getAttribute('aria-selected') !== 'true') selectTab(tab);
        });
      }
      tab.addEventListener('keydown', (e) => {
        const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
        if (!step) return;
        e.preventDefault();
        const next = tabs[(i + step + tabs.length) % tabs.length];
        selectTab(next);
        next.focus();
      });
    });
  });

  // Бегущая строка логотипов: вторая копия списка для бесшовной прокрутки
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    const copy = marqueeTrack.firstElementChild.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.querySelectorAll('img').forEach((img) => { img.alt = ''; });
    marqueeTrack.appendChild(copy);
  }

  // Мобильное меню
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMobile(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    mobileMenu.hidden = !open;
  }

  burger.addEventListener('click', () => setMobile(mobileMenu.hidden));
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMobile(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    setMega(false);
    setMobile(false);
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      setMega(false);
      setMobile(false);
    }
  });

  // Галерея первого экрана: автосмена, стрелки, свайп, пауза при наведении
  const gallery = document.querySelector('.gallery');
  if (gallery) {
    const slides = [...gallery.querySelectorAll('.gallery__slide')];
    const caption = gallery.querySelector('.gallery__caption');
    const captionText = gallery.querySelector('.gallery__caption-text');
    const progress = gallery.querySelector('.gallery__progress');
    const SLIDE_TIME = 6000;
    const autoplay = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let timer;

    gallery.style.setProperty('--slide-time', SLIDE_TIME + 'ms');
    const bars = slides.map(() => {
      const bar = document.createElement('span');
      bar.className = 'gallery__bar';
      bar.appendChild(document.createElement('span'));
      progress.appendChild(bar);
      return bar;
    });

    function show(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-active', i === current);
        // подгружаем следующий слайд заранее
        if (i === (current + 1) % slides.length) slide.querySelector('img').loading = 'eager';
      });
      bars.forEach((bar, i) => {
        bar.classList.remove('is-active');
        bar.classList.toggle('is-done', i < current);
      });
      void bars[current].offsetWidth; // перезапуск анимации полоски
      if (autoplay) bars[current].classList.add('is-active');
      captionText.textContent = slides[current].dataset.caption;
      caption.href = slides[current].dataset.href;
      schedule();
    }

    function schedule() {
      clearTimeout(timer);
      if (!autoplay || gallery.classList.contains('is-paused')) return;
      timer = setTimeout(() => show(current + 1), SLIDE_TIME);
    }

    gallery.querySelector('.gallery__btn--prev').addEventListener('click', () => show(current - 1));
    gallery.querySelector('.gallery__btn--next').addEventListener('click', () => show(current + 1));

    gallery.addEventListener('mouseenter', () => { gallery.classList.add('is-paused'); clearTimeout(timer); });
    gallery.addEventListener('mouseleave', () => { gallery.classList.remove('is-paused'); show(current); });

    let startX = null;
    gallery.addEventListener('pointerdown', (e) => { startX = e.clientX; });
    gallery.addEventListener('pointerup', (e) => {
      if (startX === null) return;
      const dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) show(current + (dx < 0 ? 1 : -1));
    });

    show(0);
  }

  // Слайдер «Наши работы»: стрелки, сегменты под лентой, перетаскивание мышью
  const worksTrack = document.querySelector('.works__track');
  if (worksTrack) {
    const cards = [...worksTrack.querySelectorAll('.work')];
    const prevBtn = document.querySelector('.works__btn--prev');
    const nextBtn = document.querySelector('.works__btn--next');
    const dotsBox = document.querySelector('.works__dots');

    const step = () => cards[1].offsetLeft - cards[0].offsetLeft;
    const maxScroll = () => worksTrack.scrollWidth - worksTrack.clientWidth;

    const dots = cards.map((card, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'works__dot';
      dot.setAttribute('aria-label', 'Работа ' + (i + 1) + ': ' + card.querySelector('.work__title').textContent);
      dot.addEventListener('click', () => {
        worksTrack.scrollTo({ left: Math.min(maxScroll(), card.offsetLeft - cards[0].offsetLeft), behavior: 'smooth' });
      });
      dotsBox.appendChild(dot);
      return dot;
    });

    function update() {
      const max = maxScroll();
      const left = worksTrack.scrollLeft;
      // закрашиваем работы, которые видны на экране хотя бы наполовину
      const view = worksTrack.getBoundingClientRect();
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const shown = Math.min(r.right, view.right) - Math.max(r.left, view.left);
        dots[i].classList.toggle('is-visible', shown > r.width / 2);
      });
      prevBtn.disabled = left <= 4;
      nextBtn.disabled = left >= max - 4;
    }

    prevBtn.addEventListener('click', () => worksTrack.scrollBy({ left: -step(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => worksTrack.scrollBy({ left: step(), behavior: 'smooth' }));
    worksTrack.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);

    // перетаскивание мышью; на тач-устройствах лента листается нативно
    let dragX = null;
    let dragLeft = 0;
    let moved = false;
    worksTrack.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      dragX = e.clientX;
      dragLeft = worksTrack.scrollLeft;
      moved = false;
    });
    window.addEventListener('pointermove', (e) => {
      if (dragX === null) return;
      const dx = e.clientX - dragX;
      if (!moved && Math.abs(dx) < 5) return;
      moved = true;
      worksTrack.classList.add('is-dragging');
      worksTrack.scrollLeft = dragLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (dragX === null) return;
      dragX = null;
      if (!moved) return;
      // после отпускания доводим до ближайшей карточки
      const target = Math.min(maxScroll(), Math.round(worksTrack.scrollLeft / step()) * step());
      worksTrack.classList.remove('is-dragging');
      worksTrack.scrollTo({ left: target, behavior: 'smooth' });
    });
    // клик по карточке после перетаскивания не считается переходом
    worksTrack.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

    update();
  }

  // Имя прикреплённого файла
  const fileInput = document.querySelector('.file__input');
  const fileName = document.querySelector('.file__name');
  fileInput.addEventListener('change', () => {
    fileName.textContent = fileInput.files.length ? fileInput.files[0].name : 'Файл не выбран';
    fileInput.closest('.file').classList.toggle('has-file', fileInput.files.length > 0);
  });

  // Форма: проверка обязательных полей. Отправки на сервер в прототипе нет.
  const form = document.getElementById('request-form');
  const status = form.querySelector('.form__status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      const ok = input.value.trim().length > 0;
      input.classList.toggle('is-invalid', !ok);
      if (!ok && valid) input.focus();
      valid = valid && ok;
    });
    status.hidden = false;
    status.textContent = valid
      ? 'Спасибо! Заявка принята, мы свяжемся с вами. (Прототип: заявка никуда не отправляется.)'
      : 'Заполните имя и телефон.';
    if (valid) {
      form.reset();
      fileName.textContent = 'Файл не выбран';
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
