/* Личный кабинет (прототип по ТЗ дизайнеру, экраны 1–2): корзина, вход, регистрация, восстановление доступа.
   Сервера нет: всё хранится в браузере. Письма на почту заменены пунктирной подсказкой «Прототип: …».
   Ключи: fg-cart { id: количество } — общий с main.js, fg-cart-note — описание, fg-cart-files — имена файлов,
   fg-auth { inn, company } — признак входа. */
(function () {
  const store = {
    get(key, fallback) { try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch (e) { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* без хранилища */ } },
    del(key) { try { localStorage.removeItem(key); } catch (e) { /* без хранилища */ } },
  };
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const money = (n) => n.toLocaleString('ru-RU') + ' ₽';
  const plural = (n, one, few, many) => {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  const params = new URLSearchParams(location.search);
  // куда вернуть после входа: из корзины — в корзину, иначе — в каталог комплектующих
  const nextUrl = () => (params.get('next') === 'cart' || Object.keys(store.get('fg-cart', {})).length ? 'cart.html?welcome=1' : 'parts-lk.html');
  const withNext = (url) => (params.get('next') ? `${url}?next=${encodeURIComponent(params.get('next'))}` : url);
  const fakeRequest = (btn, ms = 700) => new Promise((resolve) => {
    btn?.classList.add('is-loading');
    setTimeout(() => { btn?.classList.remove('is-loading'); resolve(); }, ms);
  });
  const signIn = (data) => store.set('fg-auth', data);
  const signOut = () => store.del('fg-auth');
  const auth = store.get('fg-auth', null);

  // Комплектующие (прототип): в каталоге гостя цен нет, поэтому корзина берёт их отсюда — значения из parts-lk.html.
  // На сайте цены и единицы отдаёт сервер только вошедшему клиенту.
  const PARTS = {
    'anchor-al-1': { name: 'Анкерная группа алюминиевая, тип 1', unit: 'шт.', price: 7500, img: 'img/parts/anchor-al-1.jpg' },
    'bench-al-3m': { name: 'Брус скамьи, длина 3 м', unit: 'шт.', price: 2543, img: 'img/parts/bench-al-3m.jpg' },
    'bracket-st-1015': { name: 'Кронштейн боковой длинный, L = 1015 мм', unit: 'компл.', price: 5752, img: 'img/parts/bracket-st-1015.jpg' },
    'glass-st-side-s': { name: 'Стекло боковое малое, триплекс 10 мм, 500 × 1865 мм', unit: 'шт.', price: 11798, img: 'img/parts/glass-st-side-s.jpg' },
  };
  // доп. оборудование из карточки «Атланта» (кнопки data-cart-add) — без цены, как в main.js
  const EXTRA_NAMES = {
    'atlant-board': 'Электронное табло прибытия', 'atlant-poster': 'Лайтпостер сити-формат', 'atlant-sign': 'Табличка с названием',
    'atlant-light': 'Подсветка конструкции', 'atlant-usb': 'USB-зарядка', 'atlant-wifi': 'Wi-Fi маршрутизатор',
    'atlant-camera': 'Камеры видеонаблюдения', 'atlant-sos': 'Кнопка экстренного вызова', 'atlant-sound': 'Модуль звукового дублирования',
    'atlant-pylon': 'Навигационный пилон',
  };
  const partOf = (id) => {
    if (PARTS[id]) return PARTS[id];
    const info = store.get('fg-cart-info', {})[id];
    return { name: info?.name || EXTRA_NAMES[id] || id, unit: 'шт.', price: null, img: null };
  };

  /* ---------- Поля: показать пароль, проверка ---------- */

  $$('.pass__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.pass').querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', String(show));
      btn.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
    });
  });

  // ошибка у поля: текст под полем, рамка красная; снимается при вводе
  const setError = (input, text) => {
    const holder = input.closest('.field, .check');
    const box = holder?.querySelector('.field__error');
    if (input.type === 'checkbox') holder.classList.toggle('is-invalid', !!text);
    else input.classList.toggle('is-invalid', !!text);
    if (box) box.textContent = text || '';
  };
  $$('form[data-flow] input, form[data-flow] textarea').forEach((input) => {
    input.addEventListener(input.type === 'checkbox' ? 'change' : 'input', () => setError(input, ''));
  });
  // ИНН и КПП — только цифры
  $$('[data-inn], [data-kpp]').forEach((input) => input.addEventListener('input', () => { input.value = input.value.replace(/\D/g, ''); }));

  function validate(form) {
    let first = null;
    $$('input, textarea', form).forEach((input) => {
      if (input.disabled || input.closest('[hidden]')) return;
      const v = input.type === 'checkbox' ? input.checked : input.value.trim();
      let err = '';
      if (input.required && !v) err = input.type === 'checkbox' ? 'Без этого согласия продолжить нельзя' : 'Заполните поле';
      else if (v && input.type === 'email' && !input.checkValidity()) err = 'Проверьте адрес: например, name@company.ru';
      else if (v && 'inn' in input.dataset && !/^(\d{10}|\d{12})$/.test(v)) err = 'ИНН — 10 цифр у организации или 12 у ИП';
      else if (v && 'kpp' in input.dataset && !/^\d{9}$/.test(v)) err = 'КПП — 9 цифр';
      else if (v && input.type === 'tel' && v.replace(/\D/g, '').length < 10) err = 'Проверьте номер телефона';
      else if (v && 'pass' in input.dataset && v.length < 8) err = 'Пароль — не меньше 8 символов';
      else if (v && input.dataset.match && v !== form.querySelector(input.dataset.match).value) err = 'Пароли не совпадают';
      setError(input, err);
      if (err && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }

  // переключение экранов внутри страницы: <section data-screen="…">
  const show = (root, name) => {
    $$('[data-screen]', root).forEach((s) => { s.hidden = s.dataset.screen !== name; });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const target = $(`[data-screen="${name}"] [autofocus], [data-screen="${name}"] input:not([readonly])`, root);
    if (target && matchMedia('(hover: hover)').matches) target.focus({ preventScroll: true });
  };

  /* ---------- Корзина ---------- */

  const cartPage = $('[data-page="cart"]');
  if (cartPage) {
    let cart = store.get('fg-cart', {});
    const list = $('.cart__list', cartPage);
    const headCount = $('.header__cart-count');
    const save = () => { store.set('fg-cart', cart); };

    // вошедший клиент: строка «Вы вошли как …» и кнопка оформления; гость: вход или регистрация
    $$('[data-for="auth"]', cartPage).forEach((el) => { el.hidden = !auth; });
    $$('[data-for="guest"]', cartPage).forEach((el) => { el.hidden = !!auth; });
    if (auth) $('[data-auth-name]', cartPage).textContent = auth.company || `ИНН ${auth.inn}`;
    $('[data-logout]', cartPage)?.addEventListener('click', () => { signOut(); location.reload(); });
    if (auth && params.get('welcome')) $('[data-welcome]', cartPage).hidden = false;

    const render = () => {
      const ids = Object.keys(cart);
      if (headCount) headCount.textContent = ids.length;
      $('[data-cart-full]', cartPage).hidden = !ids.length;
      $('[data-cart-empty]', cartPage).hidden = !!ids.length;
      list.innerHTML = '';
      let total = 0;
      ids.forEach((id) => {
        const p = partOf(id);
        const qty = cart[id];
        const li = document.createElement('li');
        li.className = 'citem';
        li.innerHTML = (p.img ? `<img class="citem__photo" src="${p.img}" alt="" width="72" height="54" loading="lazy">`
          : '<span class="citem__photo citem__photo--none" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 15l4-4 5 5M14 13l2-2 4 4"/></svg></span>')
          + '<div class="citem__name"><span class="citem__title"></span><span class="citem__meta"></span></div>'
          + '<div class="citem__qty"><div class="qty"><button class="qty__btn" type="button" data-step="-1" aria-label="Меньше">−</button>'
          + '<input class="qty__input" type="number" min="1" max="999" inputmode="numeric" aria-label="Количество"><button class="qty__btn" type="button" data-step="1" aria-label="Больше">+</button></div></div>'
          + '<span class="citem__sum"></span>'
          + '<button class="citem__del" type="button" aria-label="Удалить позицию"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg></button>';
        $('.citem__title', li).textContent = p.name;
        const priced = auth && p.price;
        $('.citem__meta', li).textContent = priced ? `${money(p.price)} за ${p.unit}` : `Единица: ${p.unit}`;
        const sum = $('.citem__sum', li);
        if (priced) { sum.textContent = money(p.price * qty); total += p.price * qty; }
        else { sum.textContent = auth ? 'цена по запросу' : 'цена после входа'; sum.classList.add('citem__sum--muted'); }
        const input = $('.qty__input', li);
        input.value = qty;
        const setQty = (n) => { cart[id] = Math.min(999, Math.max(1, Math.round(n) || 1)); save(); render(); };
        $$('.qty__btn', li).forEach((b) => b.addEventListener('click', () => setQty(qty + Number(b.dataset.step))));
        input.addEventListener('change', () => setQty(Number(input.value)));
        $('.citem__del', li).addEventListener('click', () => { delete cart[id]; save(); render(); });
        list.appendChild(li);
      });
      $('[data-cart-count]', cartPage).textContent = `${ids.length} ${plural(ids.length, 'позиция', 'позиции', 'позиций')}`;
      $('[data-cart-total]', cartPage).innerHTML = auth && total ? `Итого: <b>${money(total)}</b>` : '';
    };
    render();

    // дополнительное описание: сохраняется сразу, переживает вход
    const note = $('[name="note"]', cartPage);
    const counter = $('.cart__counter', cartPage);
    note.value = store.get('fg-cart-note', '');
    const count = () => { counter.textContent = `${note.value.length} / ${note.maxLength}`; };
    note.addEventListener('input', () => { store.set('fg-cart-note', note.value); count(); });
    count();

    // файлы: несколько, имя + размер + удаление. Проверка формата и размера — ошибка под полем.
    // В прототипе сами файлы не хранятся, только их имена; на сайте файл загружается на сервер сразу при выборе.
    const MAX_MB = 20;
    const EXT = ['pdf', 'dwg', 'dxf', 'jpg', 'jpeg', 'png', 'zip'];
    const fileInput = $('[name="files"]', cartPage);
    const fileBox = $('.files', cartPage);
    const fileError = fileInput.closest('.field').querySelector('.field__error');
    let files = store.get('fg-cart-files', []);
    const size = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace('.', ',')} МБ` : `${Math.max(1, Math.round(b / 1024))} КБ`);
    const renderFiles = () => {
      fileBox.innerHTML = '';
      files.forEach((f, i) => {
        const li = document.createElement('li');
        li.className = 'files__item';
        li.innerHTML = '<span class="files__icon" aria-hidden="true"></span><span class="files__name"></span><span class="files__size"></span>'
          + '<button class="files__del" type="button"><svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14"/></svg></button>';
        $('.files__icon', li).textContent = f.name.split('.').pop().slice(0, 4);
        $('.files__name', li).textContent = f.name;
        $('.files__name', li).title = f.name;
        $('.files__size', li).textContent = size(f.size);
        $('.files__del', li).setAttribute('aria-label', `Удалить файл ${f.name}`);
        $('.files__del', li).addEventListener('click', () => { files.splice(i, 1); store.set('fg-cart-files', files); renderFiles(); });
        fileBox.appendChild(li);
      });
    };
    fileInput.addEventListener('change', () => {
      const bad = [];
      [...fileInput.files].forEach((f) => {
        const ext = f.name.split('.').pop().toLowerCase();
        if (!EXT.includes(ext)) bad.push(`«${f.name}» — формат не подходит`);
        else if (f.size > MAX_MB * 1048576) bad.push(`«${f.name}» больше ${MAX_MB} МБ`);
        else if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push({ name: f.name, size: f.size });
      });
      fileError.textContent = bad.length ? `Не прикрепили: ${bad.join('; ')}.` : '';
      fileInput.value = '';
      store.set('fg-cart-files', files);
      renderFiles();
    });
    renderFiles();

    $('[data-checkout]', cartPage)?.addEventListener('click', () => { location.href = 'order.html'; });
  }

  /* ---------- Вход ---------- */

  // ссылки между входом, регистрацией и восстановлением сохраняют «куда вернуться»
  $$('a[data-keep-next]').forEach((a) => { if (!a.getAttribute('href').includes('?')) a.href = withNext(a.getAttribute('href')); });

  const loginPage = $('[data-page="login"]');
  if (loginPage) {
    if (auth) {
      show(loginPage, 'signed');
      $('[data-auth-name]', loginPage).textContent = auth.company || `ИНН ${auth.inn}`;
      $('[data-logout]', loginPage).addEventListener('click', () => { signOut(); location.reload(); });
    }
    const form = $('form', loginPage);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('[data-form-error]', form);
      err.hidden = true;
      if (!validate(form)) return;
      await fakeRequest($('[type="submit"]', form));
      // прототип: неверный пароль показываем, если он короче 8 символов
      if (form.password.value.length < 8) { err.hidden = false; form.password.focus(); return; }
      signIn({ inn: form.inn.value.trim(), company: '' });
      location.href = nextUrl();
    });
  }

  /* ---------- Восстановление доступа и активация по приглашению ---------- */

  const recPage = $('[data-page="recovery"]');
  if (recPage) {
    const start = params.get('invite') ? 'invite' : params.get('expired') ? 'expired' : 'email';
    show(recPage, start);
    let email = '';
    let timer = 0;
    // «Отправить ещё раз» — не чаще раза в минуту
    const cooldown = (btn) => {
      let left = 60;
      clearInterval(timer);
      btn.disabled = true;
      const tick = () => { btn.textContent = left > 0 ? `Отправить ещё раз через ${left} с` : 'Отправить ещё раз'; btn.disabled = left > 0; left -= 1; };
      tick();
      timer = setInterval(() => { tick(); if (left < 0) clearInterval(timer); }, 1000);
    };
    $('form[data-step="email"]', recPage).addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      if (!validate(form)) return;
      await fakeRequest($('[type="submit"]', form));
      email = form.email.value.trim();
      $$('[data-email]', recPage).forEach((el) => { el.textContent = email; });
      show(recPage, 'sent');
      cooldown($('[data-resend]', recPage));
    });
    $('[data-resend]', recPage).addEventListener('click', (e) => cooldown(e.currentTarget));
    $$('[data-go]', recPage).forEach((b) => b.addEventListener('click', () => show(recPage, b.dataset.go)));
    $$('form[data-step="password"], form[data-step="invite"]', recPage).forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!validate(form)) return;
        await fakeRequest($('[type="submit"]', form));
        if (form.dataset.step === 'invite') {
          signIn({ inn: form.inn.value, company: form.company.value });
          location.href = nextUrl();
        } else show(recPage, 'done');
      });
    });
  }

  /* ---------- Регистрация: данные → подтверждение почты → пароль → грузополучатель ---------- */

  const regPage = $('[data-page="register"]');
  if (regPage) {
    const steps = $$('.steps li', regPage);
    const go = (name) => {
      show(regPage, name);
      const i = ['data', 'confirm', 'password', 'consignee', 'consignee-form'].indexOf(name);
      const n = Math.min(i, 3);
      steps.forEach((li, k) => { li.classList.toggle('is-done', k < n); li.classList.toggle('is-current', k === n); if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      steps[0].parentElement.dataset.label = `Шаг ${n + 1} из ${steps.length} · ${steps[n].textContent.trim()}`;
    };
    go('data');
    let company = '';
    let inn = '';

    // ИНН уже зарегистрирован (прототип: 7801234567 считается занятым) — подсказка войти или восстановить пароль
    const TAKEN = ['7801234567'];
    const dataForm = $('form[data-step="data"]', regPage);
    dataForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const taken = $('[data-inn-taken]', regPage);
      taken.hidden = true;
      if (!validate(dataForm)) return;
      await fakeRequest($('[type="submit"]', dataForm));
      if (TAKEN.includes(dataForm.inn.value)) { taken.hidden = false; taken.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      company = dataForm.company.value.trim();
      inn = dataForm.inn.value;
      $$('[data-email]', regPage).forEach((el) => { el.textContent = dataForm.email.value.trim(); });
      go('confirm');
    });
    $$('[data-go]', regPage).forEach((b) => b.addEventListener('click', () => go(b.dataset.go)));
    $('[data-resend]', regPage).addEventListener('click', async (e) => {
      await fakeRequest(e.currentTarget, 500);
      $('[data-resent]', regPage).hidden = false;
    });
    $('form[data-step="password"]', regPage).addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(e.currentTarget)) return;
      await fakeRequest($('[type="submit"]', e.currentTarget));
      // кабинет создан, клиент уже вошёл — остался необязательный шаг
      signIn({ inn, company });
      go('consignee');
    });
    const finish = () => { location.href = nextUrl(); };
    $$('[data-skip]', regPage).forEach((b) => b.addEventListener('click', finish));
    $('form[data-step="consignee"]', regPage).addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(e.currentTarget)) return;
      await fakeRequest($('[type="submit"]', e.currentTarget));
      finish();
    });
  }
})();
