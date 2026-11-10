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
  const setFileName = (input) => {
    const box = input.closest('.file');
    box.querySelector('.file__name').textContent = input.files.length ? input.files[0].name : 'Файл не выбран';
    box.classList.toggle('has-file', input.files.length > 0);
  };
  document.querySelectorAll('.file__input').forEach((input) => {
    input.addEventListener('change', () => setFileName(input));
  });

  // Выпадающий список в стилистике сайта поверх обычного select: select скрыт и хранит значение для формы
  document.querySelectorAll('select.field__input, select.feed__select').forEach((select) => {
    const options = [...select.options].filter((o) => o.value !== '' || o.index > 0);
    const placeholder = select.options[0].value === '' ? select.options[0].textContent : '';
    const wrap = document.createElement('div');
    wrap.className = 'select';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.hidden = true;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = (select.classList.contains('feed__select') ? 'feed__select' : 'field__input') + ' select__btn';
    btn.id = select.name + '-button';
    btn.setAttribute('aria-haspopup', 'listbox');
    btn.setAttribute('aria-expanded', 'false');
    if (select.hasAttribute('aria-labelledby')) btn.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby') + ' ' + btn.id);
    else btn.setAttribute('aria-label', select.getAttribute('aria-label') || '');
    const list = document.createElement('ul');
    list.className = 'select__list';
    list.setAttribute('role', 'listbox');
    if (select.hasAttribute('aria-labelledby')) list.setAttribute('aria-labelledby', select.getAttribute('aria-labelledby'));
    else list.setAttribute('aria-label', select.getAttribute('aria-label') || '');
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

    select.addEventListener('select:sync', render);
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
    select.form?.addEventListener('reset', () => setTimeout(render)); // у архива по годам формы нет
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
    }

    thumbs.forEach((t, n) => t.addEventListener('click', () => show(n)));
    box.querySelector('.pgallery__nav--prev').addEventListener('click', () => show(index - 1));
    box.querySelector('.pgallery__nav--next').addEventListener('click', () => show(index + 1));

    // комплектация всегда выбрана одна (по умолчанию стандартная): её рендер — первое фото галереи
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
        const desc = document.querySelector('.pinfo__config-desc');
        if (desc) desc.innerHTML = chip.dataset.desc;
        slides[0] = { src: chip.dataset.full, alt: 'Остановочный павильон «Атлант», комплектация «' + chip.textContent + '»' };
        thumbs[0].dataset.full = chip.dataset.full;
        thumbs[0].querySelector('img').src = chip.dataset.full;
        show(0);
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

  // SMART-схема: точка на фото и стрелки карточки выбирают компонент
  document.querySelectorAll('.hotspots').forEach((box) => {
    const pins = [...box.querySelectorAll('.hotspot')];
    const details = [...box.querySelectorAll('.hotspots__detail')];
    let current = 0;
    function select(i) {
      current = (i + pins.length) % pins.length;
      pins.forEach((p, n) => p.classList.toggle('is-active', n === current));
      details.forEach((d, n) => { d.hidden = n !== current; });
    }
    pins.forEach((pin, n) => {
      pin.addEventListener('click', () => select(n));
      pin.addEventListener('mouseenter', () => { if (window.matchMedia('(hover: hover)').matches) select(n); });
    });
    box.querySelector('.hotspots__prev').addEventListener('click', () => select(current - 1));
    box.querySelector('.hotspots__next').addEventListener('click', () => select(current + 1));
    select(0);
  });

  // Всплывающие окна (заявка на модель, оформление заказа): <dialog>, закрываются крестиком, Esc и кликом по фону
  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.dispatchEvent(new Event('modal:open'));
    modal.showModal();
    document.documentElement.classList.add('has-modal');
  };
  document.querySelectorAll('dialog.modal').forEach((modal) => {
    modal.addEventListener('close', () => {
      document.documentElement.classList.remove('has-modal');
      // при следующем открытии форма снова чистая
      const status = modal.querySelector('.form__status');
      if (status) status.hidden = true;
    });
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
    modal.querySelectorAll('[data-modal-close]').forEach((btn) => btn.addEventListener('click', () => modal.close()));
  });
  document.querySelectorAll('[data-modal-open]').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(btn.dataset.modalOpen); });
  });

  // Заявка на модель: выбранная комплектация подставляется в окно
  const configChips = document.querySelectorAll('.filters--configs .chip');
  configChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const name = chip.textContent.replace(/\s+/g, ' ').trim();
      document.querySelectorAll('[data-config-name]').forEach((el) => { el.textContent = name; });
      document.querySelectorAll('[data-config-input]').forEach((el) => { el.value = name; });
      document.querySelectorAll('[data-config-img]').forEach((el) => { el.src = chip.dataset.full; });
    });
  });

  // Корзина комплектующих (прототип): хранится в браузере как { id: количество }, счётчик в шапке общий для всех страниц
  const CART_KEY = 'fg-cart';
  const readCart = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(CART_KEY));
      // старый формат — просто список id
      if (Array.isArray(saved)) return Object.fromEntries(saved.map((id) => [id, 1]));
      return saved && typeof saved === 'object' ? saved : {};
    } catch (e) { return {}; }
  };
  let cart = readCart();
  const saveCart = () => {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* без хранилища — только на этой странице */ }
  };
  // доп. оборудование из карточки «Атланта» — без цены, менеджер считает отдельно
  const EXTRA_NAMES = {
    'atlant-board': 'Электронное табло прибытия', 'atlant-poster': 'Лайтпостер сити-формат', 'atlant-sign': 'Табличка с названием',
    'atlant-light': 'Подсветка конструкции', 'atlant-usb': 'USB-зарядка', 'atlant-wifi': 'Wi-Fi маршрутизатор',
    'atlant-camera': 'Камеры видеонаблюдения', 'atlant-sos': 'Кнопка экстренного вызова', 'atlant-sound': 'Модуль звукового дублирования',
    'atlant-pylon': 'Навигационный пилон',
  };
  const partRows = [...document.querySelectorAll('.parts tbody tr[data-id]')];
  // название и цена позиций запоминаются со страницы комплектующих — их показывает страница оформления заказа.
  // У гостя цен в таблице нет (data-price не задан), и цены не сохраняются.
  const INFO_KEY = 'fg-cart-info';
  let savedInfo = {};
  try { savedInfo = JSON.parse(localStorage.getItem(INFO_KEY)) || {}; } catch (e) { /* без хранилища */ }
  const partInfo = (id) => {
    const row = partRows.find((r) => r.dataset.id === id);
    if (row) return { name: row.dataset.name, price: row.dataset.price ? Number(row.dataset.price) : null };
    return savedInfo[id] || { name: EXTRA_NAMES[id] || id, price: null };
  };
  if (partRows.length) {
    partRows.forEach((row) => { savedInfo[row.dataset.id] = partInfo(row.dataset.id); });
    try { localStorage.setItem(INFO_KEY, JSON.stringify(savedInfo)); } catch (e) { /* без хранилища */ }
  }
  const money = (n) => n.toLocaleString('ru-RU') + ' ₽';
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };

  const cartLink = document.querySelector('.header__cart');
  const barSum = document.querySelector('.parts-bar__sum');
  const barBtn = document.querySelector('.parts-bar__btn');
  const orderList = document.querySelector('.order__list');

  function renderCart() {
    const ids = Object.keys(cart);
    if (cartLink) {
      cartLink.querySelector('.header__cart-count').textContent = ids.length;
      cartLink.setAttribute('aria-label', `Корзина, позиций: ${ids.length}`);
    }
    document.querySelectorAll('[data-cart-add]').forEach((btn) => {
      const added = btn.dataset.cartAdd in cart;
      btn.setAttribute('aria-pressed', String(added));
      btn.querySelector('span').textContent = added ? 'В корзине' : 'В корзину';
    });
    partRows.forEach((row) => {
      const btn = row.querySelector('.parts__cart');
      const added = row.dataset.id in cart;
      btn.setAttribute('aria-pressed', String(added));
      btn.querySelector('span').textContent = added ? 'В корзине' : 'В корзину';
      row.classList.toggle('is-added', added);
      if (added) row.querySelector('.qty__input').value = cart[row.dataset.id];
    });
    // итог: позиции и сумма по тем, у кого есть цена
    const total = ids.reduce((sum, id) => sum + (partInfo(id).price || 0) * cart[id], 0);
    if (barSum) {
      barSum.innerHTML = ids.length
        ? `В корзине ${ids.length} ${plural(ids.length, 'позиция', 'позиции', 'позиций')}` + (total ? ` <b>на ${money(total)}</b>` : '')
        : 'Корзина пуста';
      barBtn.disabled = !ids.length;
    }
    if (orderList) {
      orderList.innerHTML = '';
      ids.forEach((id) => {
        const { name, price } = partInfo(id);
        const li = document.createElement('li');
        li.className = 'order__item';
        li.innerHTML = '<span class="order__name"></span><span class="order__qty"></span><span class="order__sum"></span>'
          + '<button class="order__remove" type="button" aria-label="Убрать из заказа"><svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14"/></svg></button>';
        li.querySelector('.order__name').textContent = name;
        li.querySelector('.order__qty').textContent = price ? `${cart[id]} × ${money(price)}` : `${cart[id]} шт.`;
        li.querySelector('.order__sum').textContent = price ? money(price * cart[id]) : 'по запросу';
        li.querySelector('.order__remove').addEventListener('click', () => { delete cart[id]; saveCart(); renderCart(); });
        orderList.appendChild(li);
      });
      document.querySelector('.order__empty').hidden = ids.length > 0;
      document.querySelector('.order__total').innerHTML = ids.length && total ? `Итого: <b>${money(total)}</b>` : '';
      document.querySelector('#order [type="submit"]').disabled = !ids.length;
    }
  }

  document.querySelectorAll('[data-cart-add]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.cartAdd;
      if (id in cart) delete cart[id]; else cart[id] = 1;
      saveCart();
      renderCart();
    });
  });

  // Таблица комплектующих: количество, «В корзину», фильтр по группе и поиск
  partRows.forEach((row) => {
    const input = row.querySelector('.qty__input');
    const clamp = (n) => Math.min(999, Math.max(1, Math.round(n) || 1));
    const setQty = (n) => {
      input.value = clamp(n);
      // если позиция уже в корзине — меняем количество и там
      if (row.dataset.id in cart) { cart[row.dataset.id] = Number(input.value); saveCart(); renderCart(); }
    };
    row.querySelectorAll('.qty__btn').forEach((b) => b.addEventListener('click', () => setQty(Number(input.value) + Number(b.dataset.step))));
    input.addEventListener('change', () => setQty(Number(input.value)));
    row.querySelector('.parts__cart').addEventListener('click', () => {
      const id = row.dataset.id;
      if (id in cart) delete cart[id]; else cart[id] = clamp(Number(input.value));
      saveCart();
      renderCart();
    });
  });

  // Группы вложенные: у строки data-group="pav/al" — группа «pav», подгруппа «al».
  // Верхний ряд чипов — группы, второй ряд появляется у группы с подгруппами.
  const partChips = [...document.querySelectorAll('.parts-tools__filters .chip')];
  const subBars = [...document.querySelectorAll('.parts-tools__subs')];
  const partSearch = document.querySelector('.parts-search__input');
  let partGroup = 'all';
  const inGroup = (row, g) => g === 'all' || row.dataset.group === g || row.dataset.group.startsWith(g + '/');
  // счётчики в чипах считаем по строкам, чтобы не расходились с таблицей
  [...partChips, ...subBars.flatMap((b) => [...b.querySelectorAll('.chip')])].forEach((c) => {
    const num = c.querySelector('.chip__num');
    if (num) num.textContent = partRows.filter((r) => inGroup(r, c.dataset.group)).length;
  });
  function filterParts() {
    const q = partSearch.value.trim().toLowerCase();
    let shown = 0;
    partRows.forEach((row) => {
      const ok = inGroup(row, partGroup) && row.dataset.name.toLowerCase().includes(q);
      row.hidden = !ok;
      if (ok) shown++;
    });
    const empty = document.querySelector('.parts__empty');
    empty.hidden = shown > 0;
    empty.textContent = !q && partGroup !== 'all'
      ? 'В этой группе пока нет позиций.'
      : 'Ничего не найдено. Измените запрос или выберите другую группу.';
  }
  function selectGroup(g) {
    partGroup = g;
    const top = g.split('/')[0];
    partChips.forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.group === top)));
    subBars.forEach((bar) => {
      bar.hidden = bar.dataset.parent !== top;
      bar.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.group === g)));
    });
    filterParts();
  }
  partChips.forEach((chip) => chip.addEventListener('click', () => selectGroup(chip.dataset.group)));
  subBars.forEach((bar) => bar.querySelectorAll('.chip').forEach((chip) => chip.addEventListener('click', () => selectGroup(chip.dataset.group))));
  if (partSearch) partSearch.addEventListener('input', filterParts);
  // группа из ссылки меню «Продукция» → «Комплектующие»: parts.html#pav, #pav-al, #tri, #other; старые #al, #st, #anchor тоже открываются
  const oldHash = { al: 'pav/al', st: 'pav/st', anchor: 'pav/al' };
  const hashGroup = location.hash.slice(1);
  const wanted = oldHash[hashGroup] || hashGroup.replace('-', '/');
  if (partChips.length && wanted && [...partChips, ...subBars.flatMap((b) => [...b.querySelectorAll('.chip')])].some((c) => c.dataset.group === wanted)) selectGroup(wanted);

  // PDF-инструкции, которых ещё нет: ссылка-заглушка никуда не ведёт
  document.querySelectorAll('.parts__doc[data-pdf-pending]').forEach((a) => a.addEventListener('click', (e) => e.preventDefault()));

  // Фото комплектующего, скан награды — на весь экран
  let partZoom;
  document.querySelectorAll('[data-zoom]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      if (!partZoom) {
        partZoom = document.createElement('div');
        partZoom.className = 'lightbox';
        partZoom.setAttribute('role', 'dialog');
        partZoom.setAttribute('aria-modal', 'true');
        partZoom.innerHTML = '<img alt=""><button class="lightbox__close" type="button" aria-label="Закрыть">&times;</button>';
        document.body.appendChild(partZoom);
        const close = () => { partZoom.hidden = true; document.body.style.overflow = ''; };
        partZoom.addEventListener('click', (e) => { if (e.target === partZoom || e.target.closest('.lightbox__close')) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !partZoom.hidden) close(); });
      }
      const img = partZoom.querySelector('img');
      img.src = thumb.dataset.zoom;
      img.alt = thumb.querySelector('img').alt;
      partZoom.hidden = false;
      document.body.style.overflow = 'hidden';
      partZoom.querySelector('.lightbox__close').focus();
    });
  });

  // Корзина в шапке ведёт к оформлению заказа. Гостю на странице комплектующих — окно «войдите или зарегистрируйтесь»
  const cartModal = document.querySelector('dialog#order, dialog#auth');
  if (cartLink && cartModal) {
    cartLink.addEventListener('click', (e) => { e.preventDefault(); openModal(cartModal.id); });
    if (location.hash === '#order') openModal(cartModal.id);
  }
  // «Оформить заказ» у авторизованного — переход на отдельную страницу
  if (barBtn && barBtn.dataset.go) barBtn.addEventListener('click', () => { location.href = barBtn.dataset.go; });

  renderCart();

  // Формы: проверка обязательных полей. Отправки на сервер в прототипе нет.
  document.querySelectorAll('form.form').forEach((form) => {
    const status = form.querySelector('.form__status');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll('.field__input').forEach((input) => {
        // email проверяем ещё и на формат
        const filled = input.value.trim().length > 0;
        const ok = (!input.required || filled) && (input.type !== 'email' || !filled || input.checkValidity());
        input.classList.toggle('is-invalid', !ok);
        if (!ok && valid) input.focus();
        valid = valid && ok;
      });
      const required = [...form.querySelectorAll('[required]')].map((i) => i.closest('.field').querySelector('.field__label').firstChild.textContent.trim().toLowerCase());
      status.hidden = false;
      status.textContent = valid
        ? (form.dataset.ok || 'Спасибо! Заявка принята, мы свяжемся с вами. (Прототип: заявка никуда не отправляется.)')
        : 'Заполните обязательные поля: ' + required.join(', ') + '.';
      if (valid) {
        form.reset();
        form.querySelectorAll('.file__input').forEach(setFileName);
        if ('clearCart' in form.dataset) { cart = {}; saveCart(); renderCart(); }
      }
    });
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  // Лента (новости и блог, наши работы): тип, рубрика, год и номер страницы — фильтр по data-атрибутам карточек, состояние в адресе (?type=&tag=&year=&page=)
  document.querySelectorAll('[data-feed]').forEach((feed) => {
    const cards = [...feed.querySelector('[data-feed-list]').children];
    const pager = feed.querySelector('[data-feed-pager]');
    const empty = feed.querySelector('.feed__empty');
    const yearSel = feed.querySelector('[data-year]');
    const perPage = Number(feed.dataset.perPage) || 9;
    const params = new URLSearchParams(location.search);
    const state = {
      type: params.get('type') || 'all',
      tag: params.get('tag') || 'all',
      year: params.get('year') || 'all',
      page: Math.max(1, Number(params.get('page')) || 1),
    };
    const arrow = '<svg class="arr" width="10" height="11" viewBox="0 0 13 14" aria-hidden="true"><path d="M.74.68l11 12M11.74 12.68V1.84M11.74 12.68H1.88" fill="none" stroke="currentColor" stroke-width="2"/></svg>';

    function render(scroll) {
      const match = cards.filter((c) => (state.type === 'all' || c.dataset.type === state.type)
        && (state.tag === 'all' || c.dataset.tags.split(' ').includes(state.tag))
        && (state.year === 'all' || c.dataset.year === state.year));
      const pages = Math.max(1, Math.ceil(match.length / perPage));
      state.page = Math.min(state.page, pages);
      const shown = match.slice((state.page - 1) * perPage, state.page * perPage);
      cards.forEach((c) => { c.hidden = !shown.includes(c); });
      empty.hidden = match.length > 0;

      feed.querySelectorAll('[data-type]').forEach((b) => { if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', String(b.dataset.type === state.type)); });
      feed.querySelectorAll('button[data-tag]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.tag === state.tag)));
      if (yearSel) { yearSel.value = state.year; yearSel.dispatchEvent(new Event('select:sync')); }

      let html = `<button class="pager__btn pager__btn--prev" type="button" data-page="${state.page - 1}" aria-label="Предыдущая страница"${state.page === 1 ? ' disabled' : ''}>${arrow}</button>`;
      for (let n = 1; n <= pages; n += 1) {
        html += `<button class="pager__btn" type="button" data-page="${n}"${n === state.page ? ' aria-current="page"' : ''}>${n}</button>`;
      }
      html += `<button class="pager__btn pager__btn--next" type="button" data-page="${state.page + 1}" aria-label="Следующая страница"${state.page === pages ? ' disabled' : ''}>${arrow}</button>`;
      html += `<span class="pager__info">Показано ${shown.length} из&nbsp;${match.length}</span>`;
      pager.innerHTML = html;
      pager.hidden = match.length === 0;

      const q = new URLSearchParams();
      ['type', 'tag', 'year'].forEach((k) => { if (state[k] !== 'all') q.set(k, state[k]); });
      if (state.page > 1) q.set('page', state.page);
      history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : ''));
      if (scroll) feed.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.dispatchEvent(new CustomEvent('feed:render'));
    }

    feed.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn || !feed.contains(btn)) return;
      if (btn.dataset.page) { state.page = Number(btn.dataset.page); render(true); return; }
      if ('feedReset' in btn.dataset) { Object.assign(state, { type: 'all', tag: 'all', year: 'all', page: 1 }); render(); return; }
      if (btn.dataset.type) { state.type = btn.dataset.type; state.page = 1; render(); }
      if (btn.dataset.tag) { state.tag = btn.dataset.tag; state.page = 1; render(); }
    });
    if (yearSel) yearSel.addEventListener('change', () => { state.year = yearSel.value; state.page = 1; render(); });
    render();
  });

  // Карточки работ: номер и пометки в одну строку — не влезающие пометки прячем, вместо них «+N»
  const workTags = [...document.querySelectorAll('.work__top .tags')];
  function fitWorkTags() {
    workTags.forEach((list) => {
      list.querySelector('.tags__more')?.remove();
      list.classList.remove('is-tight');
      const items = [...list.children];
      items.forEach((li) => { li.hidden = false; });
      if (list.scrollWidth <= list.clientWidth) return;
      const more = document.createElement('li');
      more.className = 'tags__more';
      list.append(more);
      let hiddenCount = 0;
      for (let i = items.length - 1; i > 0 && list.scrollWidth > list.clientWidth; i -= 1) {
        items[i].hidden = true;
        hiddenCount += 1;
        more.textContent = '+' + hiddenCount;
        more.title = items.slice(i).map((li) => li.textContent).join(', ');
      }
      // даже одна пометка с «+N» не влезает — обрезаем её текст многоточием
      if (list.scrollWidth > list.clientWidth) list.classList.add('is-tight');
    });
  }
  if (workTags.length) {
    fitWorkTags();
    window.addEventListener('resize', fitWorkTags);
    document.addEventListener('feed:render', fitWorkTags); // карточки со следующей страницы ленты были скрыты и не измерялись
    if (document.fonts) document.fonts.ready.then(fitWorkTags);
  }

  // Текстовая страница: подсветка текущего раздела в содержании
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const seen = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)));
      const first = [...byId.keys()].find((id) => seen.has(id));
      if (first) tocLinks.forEach((a) => a.classList.toggle('is-active', a === byId.get(first)));
    }, { rootMargin: '-20% 0px -60% 0px' });
    byId.forEach((_, id) => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  // Видео в блоках (ролики немые): по кругу, пока блок на экране; на телефоне, при «меньше движения» и экономии трафика — только заставка
  const loops = [...document.querySelectorAll('video.vloop')];
  const conn = navigator.connection;
  // проверяем в момент показа, а не при загрузке: ширина могла измениться (поворот планшета, окно)
  const canAutoplay = () => window.matchMedia('(min-width: 768px)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && !(conn && conn.saveData);
  if (loops.length && 'IntersectionObserver' in window) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting && canAutoplay()) {
          if (!v.src) { v.src = v.dataset.src; }
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    loops.forEach((v) => { v.muted = true; vio.observe(v); });
  }

  // Кнопка «Смотреть видео»: окно с плеером с начала и с перемоткой, при закрытии видео останавливается
  let vmodal;
  document.querySelectorAll('[data-video]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!vmodal) {
        vmodal = document.createElement('dialog');
        vmodal.className = 'vmodal';
        vmodal.innerHTML = '<button class="modal__close" type="button" aria-label="Закрыть видео">'
          + '<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14"/></svg></button>'
          + '<video controls playsinline></video>';
        document.body.appendChild(vmodal);
        const player = vmodal.querySelector('video');
        vmodal.querySelector('.modal__close').addEventListener('click', () => vmodal.close());
        vmodal.addEventListener('click', (e) => { if (e.target === vmodal) vmodal.close(); });
        vmodal.addEventListener('close', () => {
          player.pause();
          document.documentElement.classList.remove('has-modal');
          loops.forEach((v) => { if (v.dataset.wasPlaying) { v.play().catch(() => {}); delete v.dataset.wasPlaying; } });
        });
      }
      const player = vmodal.querySelector('video');
      player.setAttribute('aria-label', btn.dataset.title || 'Видео');
      player.poster = btn.dataset.poster || '';
      if (player.getAttribute('src') !== btn.dataset.video) player.src = btn.dataset.video;
      player.currentTime = 0;
      // фоновые видео на паузу, чтобы не грузили сеть и процессор
      loops.forEach((v) => { if (!v.paused) { v.dataset.wasPlaying = '1'; v.pause(); } });
      vmodal.showModal();
      document.documentElement.classList.add('has-modal');
      player.play().catch(() => {});
    });
  });
})();
