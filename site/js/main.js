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

  // Вариант для клиента: подменю в один столбец — открывается по ссылке с ?menu=1col
  if (new URLSearchParams(location.search).get('menu') === '1col') mega.classList.add('mega--single');

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

  // Выпадающий список в стилистике сайта поверх обычного select: select скрыт и хранит значение для формы
  document.querySelectorAll('select.field__input').forEach((select) => {
    const options = [...select.options].filter((o) => o.value !== '' || o.index > 0);
    const placeholder = select.options[0].value === '' ? select.options[0].textContent : '';
    const wrap = document.createElement('div');
    wrap.className = 'select';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.hidden = true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'field__input select__btn';
    btn.id = select.name + '-button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby') + ' ' + btn.id);
    const list = document.createElement('ul');
    list.className = 'select__list';
    list.setAttribute('role', 'listbox');
    list.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby'));
    list.hidden = true;
    const items = options.map((opt, i) => {
      const li = document.createElement('li');
      li.className = 'select__option';
      li.id = select.name + '-option-' + i;
      li.setAttribute('role', 'option');
      li.textContent = opt.textContent;
      li.addEventListener('mousedown', (e) => e.preventDefault()); // фокус остаётся на кнопке
      li.addEventListener('click', () => choose(i));
      li.addEventListener('mousemove', () => setActive(i));
      list.appendChild(li);
      return li;
    });
    wrap.append(btn, list);

    let active = -1;
    const selectedIndex = () => options.indexOf(select.selectedOptions[0]);
    function render() {
      const i = selectedIndex();
      btn.textContent = i >= 0 ? options[i].textContent : placeholder;
      btn.classList.toggle('is-placeholder', i < 0);
      items.forEach((li, n) => li.setAttribute('aria-selected', String(n === i)));
    }
    function setActive(i) {
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach((li, n) => li.classList.toggle('is-active', n === active));
      btn.setAttribute('aria-activedescendant', items[active].id);
      items[active].scrollIntoView({ block: 'nearest' });
    }
    function open() {
      list.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      setActive(Math.max(0, selectedIndex()));
    }
    function close() {
      list.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
      btn.removeAttribute('aria-activedescendant');
    }
    function choose(i) {
      options[i].selected = true;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      render();
      close();
    }

    btn.addEventListener('click', () => (list.hidden ? open() : close()));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (list.hidden) open();
        else setActive(active + (e.key === 'ArrowDown' ? 1 : -1));
      } else if ((e.key === 'Enter' || e.key === ' ') && !list.hidden) {
        e.preventDefault();
        choose(active);
      } else if (e.key === 'Escape' || e.key === 'Tab') {
        close();
      }
    });
    btn.addEventListener('blur', close);
    // после сброса формы показываем заглушку снова
    select.form.addEventListener('reset', () => setTimeout(render));
    render();
  });

  // Слайдер этапов производства: стрелки листают на одну карточку, на краях гаснут
  document.querySelectorAll('.slider-nav').forEach((nav) => {
    const track = document.getElementById(nav.dataset.slider);
    const [prev, next] = nav.querySelectorAll('.slider-nav__btn');
    const step = () => track.firstElementChild.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
    const update = () => {
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    };
    // считаем от целевой карточки, а не от текущей позиции — быстрые клики не теряются посреди анимации
    let target = 0;
    nav.querySelectorAll('.slider-nav__btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const max = Math.round((track.scrollWidth - track.clientWidth) / step());
        target = Math.min(max, Math.max(0, target + Number(btn.dataset.dir)));
        track.scrollTo({ left: target * step() });
      });
    });
    track.addEventListener('scrollend', () => { target = Math.round(track.scrollLeft / step()); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Каталог: фильтр моделей по чипам (data-tags у карточки)
  document.querySelectorAll('.filters[data-target]').forEach((bar) => {
    const grid = document.getElementById(bar.dataset.target);
    const chips = [...bar.querySelectorAll('.chip')];
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        const tag = chip.dataset.filter;
        grid.querySelectorAll('[data-tags]').forEach((card) => {
          card.hidden = tag !== 'all' && !card.dataset.tags.split(' ').includes(tag);
        });
      });
    });
  });

  // Карточка модели: галерея со стрелками и счётчиком, чипы комплектаций, просмотр на весь экран
  document.querySelectorAll('.pgallery').forEach((box) => {
    const main = box.querySelector('.pgallery__main img');
    const counter = box.querySelector('.pgallery__counter');
    const thumbs = [...box.querySelectorAll('.pgallery__thumb')];
    const slides = thumbs.map((t) => ({ src: t.dataset.full, alt: t.querySelector('img').alt }));
    const chips = [...document.querySelectorAll('.filters--configs .chip')];
    let index = 0;

    function show(i) {
      index = (i + slides.length) % slides.length;
      main.src = slides[index].src;
      main.alt = slides[index].alt;
      counter.textContent = (index + 1) + ' / ' + slides.length;
      thumbs.forEach((t, n) => t.setAttribute('aria-pressed', String(n === index)));
      chips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
    }

    thumbs.forEach((t, n) => t.addEventListener('click', () => show(n)));
    box.querySelector('.pgallery__nav--prev').addEventListener('click', () => show(index - 1));
    box.querySelector('.pgallery__nav--next').addEventListener('click', () => show(index + 1));

    // комплектация: на главном фото её рендер, миниатюры и стрелки возвращают к фото модели
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        main.src = chip.dataset.full;
        main.alt = 'Комплектация «' + chip.textContent + '»';
        counter.textContent = chip.textContent;
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        thumbs.forEach((t) => t.setAttribute('aria-pressed', 'false'));
      });
    });

    // просмотр на весь экран: листается по фото модели
    let lightbox;
    const sync = () => {
      const img = lightbox.querySelector('img');
      img.src = main.src;
      img.alt = main.alt;
    };
    function step(d) { show(index + d); sync(); }
    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = '';
    }
    function openLightbox() {
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.innerHTML = '<img alt="">'
          + '<button class="lightbox__close" type="button" aria-label="Закрыть">&times;</button>'
          + '<button class="lightbox__nav lightbox__nav--prev" type="button" aria-label="Предыдущее фото">' + box.querySelector('.pgallery__nav--prev').innerHTML + '</button>'
          + '<button class="lightbox__nav lightbox__nav--next" type="button" aria-label="Следующее фото">' + box.querySelector('.pgallery__nav--next').innerHTML + '</button>';
        document.body.appendChild(lightbox);
        lightbox.querySelector('.lightbox__nav--prev').addEventListener('click', () => step(-1));
        lightbox.querySelector('.lightbox__nav--next').addEventListener('click', () => step(1));
        lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
        document.addEventListener('keydown', (e) => {
          if (lightbox.hidden) return;
          if (e.key === 'Escape') closeLightbox();
          if (e.key === 'ArrowLeft') step(-1);
          if (e.key === 'ArrowRight') step(1);
        });
      }
      sync();
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lightbox.querySelector('.lightbox__close').focus();
    }
    box.querySelector('.pgallery__zoom').addEventListener('click', openLightbox);
    main.addEventListener('click', openLightbox);
  });

  // Форма: проверка обязательных полей. Отправки на сервер в прототипе нет.
  const form = document.getElementById('request-form');
  const status = form.querySelector('.form__status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach((input) => {
      // email проверяем ещё и на формат
      const ok = input.value.trim().length > 0 && (input.type !== 'email' || input.checkValidity());
      input.classList.toggle('is-invalid', !ok);
      if (!ok && valid) input.focus();
      valid = valid && ok;
    });
    status.hidden = false;
    status.textContent = valid
      ? 'Спасибо! Заявка принята, мы свяжемся с вами. (Прототип: заявка никуда не отправляется.)'
      : 'Заполните имя, телефон и email.';
    if (valid) {
      form.reset();
      fileName.textContent = 'Файл не выбран';
      fileInput.closest('.file').classList.remove('has-file');
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();
