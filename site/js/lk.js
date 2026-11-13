/* Личный кабинет (прототип по ТЗ дизайнеру, экраны 1–2): корзина, вход, регистрация, восстановление доступа.
   Сервера нет: всё хранится в браузере. Письма на почту заменены пунктирной подсказкой «Прототип: …».
   Ключи: fg-cart { id: количество } — общий с main.js, fg-cart-note — описание, fg-cart-files — имена файлов,
   fg-auth { inn, company } — признак входа, fg-profile — реквизиты своей организации,
   fg-orgs — сохранённые плательщики и грузополучатели, fg-orders — отправленные заявки. */
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
  const nextUrl = () => (params.get('next') === 'account' ? 'account.html' : params.get('next') === 'cart' || Object.keys(store.get('fg-cart', {})).length ? 'cart.html?welcome=1' : 'parts-lk.html');
  const withNext = (url) => (params.get('next') ? `${url}?next=${encodeURIComponent(params.get('next'))}` : url);
  const fakeRequest = (btn, ms = 700) => new Promise((resolve) => {
    btn?.classList.add('is-loading');
    setTimeout(() => { btn?.classList.remove('is-loading'); resolve(); }, ms);
  });
  const signIn = (data) => store.set('fg-auth', data);
  const signOut = () => store.del('fg-auth');
  // ?demo=1 — показать кабинет без входа: сразу входим примером «ООО «Пример»» (для просмотра заказчиком)
  if (params.get('demo') && !store.get('fg-auth', null)) signIn({ inn: '7801234567', company: 'ООО «Пример»' });
  // …и кладём пару позиций в пустую корзину, чтобы корзина и оформление заявки были не пустыми
  if (params.get('demo') && !Object.keys(store.get('fg-cart', {})).length) store.set('fg-cart', { 'glass-st-side-s': 2, 'bench-al-3m': 4 });
  const auth = store.get('fg-auth', null);

  // Реквизиты — как в шаблоне заявки: организация, ИНН/КПП, город и адрес доставки, контактное лицо, телефон, email
  const REQ = ['company', 'inn', 'kpp', 'city', 'address', 'person', 'phone', 'email'];
  const readReq = (form) => Object.fromEntries(REQ.filter((k) => form[k]).map((k) => [k, form[k].value.trim()]));
  // прототип: при входе по ИНН без регистрации в этом браузере подставляем пример профиля
  const DEMO_PROFILE = {
    company: 'ООО «Пример»', inn: '7801234567', kpp: '780101001', city: 'Санкт-Петербург', address: 'ул. Примерная, д. 1',
    person: 'Иванов Иван Иванович', phone: '+7 900 000-00-00', email: 'zakaz@example.ru',
  };
  const setProfile = (data) => {
    store.set('fg-profile', data);
    signIn({ inn: data.inn, company: data.company });
  };

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
    // поля формы и связанные с ней снаружи через атрибут form (галочка согласия на «Оформлении заявки»)
    const inputs = [...$$('input, textarea', form), ...(form.id ? $$(`input[form="${form.id}"]`) : [])];
    inputs.forEach((input) => {
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
    // пришли из «Повторить»: что добавили и что перенесли в описание
    const repeated = store.get('fg-cart-repeat', null);
    if (repeated) {
      const box = $('[data-repeated]', cartPage);
      box.hidden = false;
      $('[data-repeated-num]', box).textContent = repeated.num;
      $('[data-repeated-missing]', box).hidden = !repeated.missing.length;
      $('[data-repeated-missing] span', box).textContent = repeated.missing.join('; ');
      store.del('fg-cart-repeat');
    }

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
    // уже вошёл — сразу в кабинет
    if (auth) { location.replace('account.html'); return; }
    const form = $('form', loginPage);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('[data-form-error]', form);
      err.hidden = true;
      if (!validate(form)) return;
      await fakeRequest($('[type="submit"]', form));
      // прототип: неверный пароль показываем, если он короче 8 символов
      if (form.password.value.length < 8) { err.hidden = false; form.password.focus(); return; }
      const saved = store.get('fg-profile', null);
      setProfile(saved && saved.inn === form.inn.value.trim() ? saved : { ...DEMO_PROFILE, inn: form.inn.value.trim() });
      location.href = nextUrl();
    });
  }

  /* ---------- Восстановление доступа и активация по приглашению ---------- */

  const recPage = $('[data-page="recovery"]');
  if (recPage) {
    // ссылка из письма: ?token=… — форма нового пароля, ?expired=1 — устаревшая ссылка, ?invite=1 — активация
    const start = params.get('invite') ? 'invite' : params.get('expired') ? 'expired' : params.get('token') ? 'password' : 'email';
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
          // название и почту завёл менеджер (в макете — из демо-профиля), клиент ввёл ИНН
          setProfile({ ...DEMO_PROFILE, inn: form.inn.value.trim() });
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
      const i = ['data', 'confirm', 'password', 'consignee', 'consignee-form', 'consignee-done'].indexOf(name);
      const n = Math.min(i, 3);
      steps.forEach((li, k) => { li.classList.toggle('is-done', k < n); li.classList.toggle('is-current', k === n); if (k === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
      steps[0].parentElement.dataset.label = `Шаг ${n + 1} из ${steps.length} · ${steps[n].textContent.trim()}`;
    };
    // ссылка подтверждения из письма: register.html?confirmed=1 — сразу шаг пароля
    let profile = (() => { try { return JSON.parse(sessionStorage.getItem('fg-reg')); } catch (_) { return null; } })() || DEMO_PROFILE;
    go(params.get('confirmed') ? 'password' : 'data');

    // ИНН уже зарегистрирован (в макете занятым считается 7801234567) — подсказка войти или восстановить пароль
    const TAKEN = ['7801234567'];
    const dataForm = $('form[data-step="data"]', regPage);
    dataForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const taken = $('[data-inn-taken]', regPage);
      taken.hidden = true;
      if (!validate(dataForm)) return;
      await fakeRequest($('[type="submit"]', dataForm));
      if (TAKEN.includes(dataForm.inn.value)) { taken.hidden = false; taken.scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
      profile = readReq(dataForm);
      try { sessionStorage.setItem('fg-reg', JSON.stringify(profile)); } catch (_) { /* приватный режим */ }
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
      setProfile(profile);
      store.set('fg-orgs', []);
      go('consignee');
    });
    const finish = () => { location.href = nextUrl(); };
    $$('[data-skip]', regPage).forEach((b) => b.addEventListener('click', finish));
    $('form[data-step="consignee"]', regPage).addEventListener('submit', async (e) => {
      e.preventDefault();
      // форму берём до await: после ожидания e.currentTarget уже null (из-за этого раньше кнопка «молчала»)
      const form = e.currentTarget;
      if (!validate(form)) return;
      await fakeRequest($('[type="submit"]', form));
      // грузополучатель — только запись в справочнике кабинета, свой кабинет ему не создаётся
      const org = { id: `o${Date.now()}`, role: 'consignee', ...readReq(form) };
      store.set('fg-orgs', [...store.get('fg-orgs', []), org]);
      $('[data-consignee-name]', regPage).textContent = org.company;
      go('consignee-done');
    });
    // «Добавить ещё» — пустая форма грузополучателя
    $('[data-add-more]', regPage).addEventListener('click', () => {
      const f = $('form[data-step="consignee"]', regPage);
      f.reset();
      $$('input', f).forEach((i) => setError(i, ''));
      go('consignee-form');
      $('input', f).focus();
    });
  }

  /* ---------- Оформление заявки (ТЗ, экран 3) ---------- */

  const orderPage = $('[data-page="order"]');
  if (orderPage) {
    // оформлять может только вошедший клиент: гостя — ко входу, после входа он вернётся в корзину
    if (!auth) { location.replace('login.html?next=cart'); return; }
    const cart = store.get('fg-cart', {});
    const ids = Object.keys(cart);
    if (!ids.length) { show(orderPage, 'empty'); return; }
    show(orderPage, 'form');

    const profile = store.get('fg-profile', null) || { ...DEMO_PROFILE, inn: auth.inn };
    const orgs = store.get('fg-orgs', []);
    const form = $('#order-form');

    // сводка справа: состав, итог, описание и файлы из корзины
    let total = 0;
    const list = $('.osum__list', orderPage);
    ids.forEach((id) => {
      const p = partOf(id);
      const li = document.createElement('li');
      li.className = 'osum__item';
      li.innerHTML = '<span class="osum__name"></span><span class="osum__qty"></span><span class="osum__sum"></span>';
      $('.osum__name', li).textContent = p.name;
      $('.osum__qty', li).textContent = p.price ? `${cart[id]} ${p.unit} × ${money(p.price)}` : `${cart[id]} ${p.unit}`;
      const sum = $('.osum__sum', li);
      if (p.price) { sum.textContent = money(p.price * cart[id]); total += p.price * cart[id]; } else { sum.textContent = 'по запросу'; sum.classList.add('osum__sum--muted'); }
      list.appendChild(li);
    });
    $('[data-osum-count]', orderPage).textContent = `${ids.length} ${plural(ids.length, 'позиция', 'позиции', 'позиций')}`;
    $('[data-osum-total]', orderPage).textContent = money(total);
    const note = store.get('fg-cart-note', '');
    const files = store.get('fg-cart-files', []);
    $('.osum__extra', orderPage).hidden = !note && !files.length;
    $('[data-osum-note]', orderPage).hidden = !note;
    $('[data-osum-note] span', orderPage).textContent = note;
    $('[data-osum-files]', orderPage).hidden = !files.length;
    $('[data-osum-files] span', orderPage).textContent = files.map((f) => f.name).join(', ');

    // плательщик и грузополучатель: карточки, по умолчанию своя организация; «Изменить реквизиты» и «Добавить»
    const own = { id: 'own', ...profile };
    const state = { payer: 'own', consignee: 'own' };
    const drafts = { payer: null, consignee: null }; // изменённые свои реквизиты для этой заявки
    const orgsFor = (role) => [own, ...orgs.filter((o) => o.role === role)];
    const orgById = (role, id) => orgsFor(role).find((o) => o.id === id);
    const metaOf = (o) => [`ИНН ${o.inn}`, o.kpp && `КПП ${o.kpp}`].filter(Boolean).join(' · ');
    const boxOf = (role) => $(`[data-org-role="${role}"]`, orderPage);
    const panelData = (panel) => Object.fromEntries($$('input[data-req]', panel).map((f) => [f.dataset.req, f.value.trim()]));

    const renderOrgs = (role) => {
      const wrap = $('.orgs', boxOf(role));
      wrap.innerHTML = '';
      orgsFor(role).forEach((o) => {
        const label = document.createElement('label');
        label.className = 'org';
        label.innerHTML = `<input class="org__input" type="radio" name="${role}-org"><span class="org__name"></span><span class="org__meta"></span>`
          + (o.id === 'own' ? '<span class="org__tag">Ваша организация</span>' : '');
        const input = $('input', label);
        input.value = o.id;
        input.checked = state[role] === o.id;
        const shown = o.id === 'own' && drafts[role] ? { ...o, ...drafts[role] } : o;
        $('.org__name', label).textContent = shown.company;
        $('.org__meta', label).textContent = metaOf(shown);
        input.addEventListener('change', () => { state[role] = o.id; closeOrgForm(role); syncAddress(); });
        wrap.appendChild(label);
      });
      if (!$('.org-form', boxOf(role))) return; // грузополучателя в заявке не добавляют — только выбор
      const add = document.createElement('button');
      add.type = 'button';
      add.className = 'org org--add';
      add.textContent = role === 'payer' ? 'Добавить плательщика' : 'Добавить грузополучателя';
      add.addEventListener('click', () => openOrgForm(role, 'new'));
      wrap.appendChild(add);
    };

    function openOrgForm(role, mode) {
      const box = boxOf(role);
      const panel = $('.org-form', box);
      if (mode === 'new') { state[role] = 'new'; $$(`[name="${role}-org"]`, box).forEach((r) => { r.checked = false; }); }
      const src = mode === 'new' ? {} : { ...orgById(role, state[role]), ...(state[role] === 'own' ? drafts[role] : null) };
      $$('input[data-req]', panel).forEach((f) => {
        f.value = src[f.dataset.req] || '';
        f.readOnly = mode !== 'new' && f.dataset.req === 'inn';
        setError(f, '');
      });
      $('.org-form__title', panel).textContent = mode === 'new'
        ? (role === 'payer' ? 'Новый плательщик' : 'Новый грузополучатель') : 'Реквизиты для этой заявки';
      $('[data-save-org]', panel).hidden = mode !== 'new';
      panel.hidden = false;
      $('.org-edit', box).hidden = true;
      $$('input[data-req]', panel).find((f) => !f.readOnly)?.focus();
    }
    function closeOrgForm(role) {
      const box = boxOf(role);
      if (!$('.org-form', box)) return;
      $('.org-form', box).hidden = true;
      $('.org-edit', box).hidden = false;
    }
    ['payer', 'consignee'].forEach((role) => {
      const box = boxOf(role);
      if (!$('.org-form', box)) { renderOrgs(role); return; }
      $('.org-edit', box).addEventListener('click', () => openOrgForm(role, 'edit'));
      $('[data-org-cancel]', box).addEventListener('click', () => {
        if (state[role] === 'new') state[role] = 'own';
        else if (state[role] === 'own') drafts[role] = null;
        renderOrgs(role); closeOrgForm(role); syncAddress();
      });
      $$('.org-form input[data-req]', box).forEach((f) => f.addEventListener('input', () => {
        if (state[role] === 'own') { drafts[role] = panelData($('.org-form', box)); renderOrgs(role); }
        checkChanges();
      }));
      renderOrgs(role);
    });

    // способ получения: доставка — город и адрес (у выбранного грузополучателя, если они сохранены), самовывоз — без адреса
    const delivery = $('[data-delivery]', orderPage);
    const pickup = $('[data-pickup]', orderPage);
    $$('[name="receive"]', orderPage).forEach((r) => r.addEventListener('change', () => {
      delivery.hidden = form.receive.value !== 'delivery';
      pickup.hidden = form.receive.value === 'delivery';
      checkChanges();
    }));
    function syncAddress() {
      const c = state.consignee === 'new' ? null : orgById('consignee', state.consignee);
      form.city.value = c?.city || profile.city || '';
      form.address.value = c?.address || profile.address || '';
      checkChanges();
    }

    // контактное лицо — из профиля
    form.person.value = profile.person || '';
    form.phone.value = profile.phone || '';
    form.email.value = profile.email || '';

    // предложение сохранить изменённые реквизиты: появляется, когда свои данные в заявке отличаются от профиля
    const offer = $('[data-save-offer]', orderPage);
    function changedParts() {
      const changed = [];
      ['payer', 'consignee'].forEach((role) => {
        const d = drafts[role];
        if (state[role] === 'own' && d && (d.company !== profile.company || d.kpp !== (profile.kpp || ''))) changed.push('реквизиты организации');
      });
      if (form.receive.value === 'delivery' && state.consignee === 'own'
        && (form.city.value.trim() !== (profile.city || '') || form.address.value.trim() !== (profile.address || ''))) changed.push('адрес доставки');
      if (['person', 'phone', 'email'].some((k) => form[k].value.trim() !== (profile[k] || ''))) changed.push('контактные данные');
      return [...new Set(changed)];
    }
    function checkChanges() {
      const changed = changedParts();
      offer.hidden = !changed.length;
      $('[data-save-what]', offer).textContent = changed.join(', ');
      if (!changed.length) $('input', offer).checked = false;
    }
    ['city', 'address', 'person', 'phone', 'email'].forEach((k) => form[k].addEventListener('input', checkChanges));
    syncAddress();

    // отправка: номер заявки и статус «Новая»; корзина, описание и файлы очищаются
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const sendError = $('[data-send-error]', orderPage);
      sendError.hidden = true;
      if (!validate(form)) return;
      await fakeRequest($('[data-submit]', orderPage), 900);
      // ошибка отправки: данные формы и корзина не теряются, можно отправить ещё раз
      if (params.get('fail') && !form.dataset.failed) { form.dataset.failed = '1'; sendError.hidden = false; sendError.focus(); return; }
      const pick = (role) => {
        const panel = $('.org-form', boxOf(role));
        if (!panel || panel.hidden) return orgById(role, state[role]);
        const data = panelData(panel);
        if (state[role] === 'new' && $('[data-save-org] input', panel).checked) orgs.push({ id: `o${Date.now()}${role}`, role, ...data });
        return data;
      };
      const payer = pick('payer');
      const consignee = pick('consignee');
      store.set('fg-orgs', orgs);
      // профиль меняем только по галочке; реквизиты прошлых заявок хранятся в самих заявках и не меняются
      if ($('input', offer).checked) {
        const next = { ...profile, person: form.person.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim() };
        ['payer', 'consignee'].forEach((role) => { if (state[role] === 'own' && drafts[role]) Object.assign(next, { company: drafts[role].company, kpp: drafts[role].kpp }); });
        if (form.receive.value === 'delivery' && state.consignee === 'own') Object.assign(next, { city: form.city.value.trim(), address: form.address.value.trim() });
        setProfile(next);
      }
      const num = String(Date.now()).slice(-6);
      const orders = store.get('fg-orders', []);
      orders.unshift({
        num, date: new Date().toISOString(), status: 'new', total, note, files,
        items: ids.map((id) => ({ id, name: partOf(id).name, unit: partOf(id).unit, qty: cart[id], price: partOf(id).price })),
        payer: { company: payer.company, inn: payer.inn, kpp: payer.kpp },
        consignee: { company: consignee.company, inn: consignee.inn, kpp: consignee.kpp },
        receive: form.receive.value,
        address: form.receive.value === 'delivery' ? `${form.city.value.trim()}, ${form.address.value.trim()}` : '',
        contact: { person: form.person.value.trim(), phone: form.phone.value.trim(), email: form.email.value.trim() },
      });
      store.set('fg-orders', orders);
      ['fg-cart', 'fg-cart-note', 'fg-cart-files'].forEach((k) => store.del(k));
      const headCount = $('.header__cart-count');
      if (headCount) headCount.textContent = '0';
      $('[data-order-num]', orderPage).textContent = num;
      $('[data-order-link]', orderPage).href = `account.html#order-${num}`;
      $('[data-order-items]', orderPage).textContent = `${ids.length} ${plural(ids.length, 'позиция', 'позиции', 'позиций')}`;
      $('[data-order-total]', orderPage).textContent = total ? money(total) : 'по запросу';
      $('[data-order-receive]', orderPage).textContent = form.receive.value === 'delivery' ? 'Доставка' : 'Самовывоз';
      $('[data-order-email]', orderPage).textContent = form.email.value.trim();
      show(orderPage, 'done');
    });
  }

  /* ---------- Кабинет: моя организация и справочники (ТЗ, экран 4) ---------- */

  const accPage = $('[data-page="account"]');
  if (accPage) {
    if (!auth) { location.replace('login.html?next=account'); return; }
    let profile = store.get('fg-profile', null) || { ...DEMO_PROFILE, inn: auth.inn };
    let orgs = store.get('fg-orgs', []);
    const toast = $('.toast');
    let toastTimer = 0;
    const say = (text) => {
      $('span', toast).textContent = text;
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => { toast.hidden = true; }, 2600);
    };
    const renderHead = () => {
      $$('[data-acc-name]', accPage).forEach((el) => { el.textContent = profile.company; });
      $$('[data-acc-inn]', accPage).forEach((el) => { el.textContent = `ИНН ${profile.inn}`; });
    };
    renderHead();
    $$('[data-logout]', accPage).forEach((b) => b.addEventListener('click', () => { signOut(); location.href = 'index.html'; }));


    /* ---------- Мои заказы (ТЗ, экран 5) ---------- */

    const STATUS = {
      new: { name: 'Новая', hint: 'Заказ отправлен' },
      work: { name: 'В работе', hint: 'Заявкой занимается менеджер' },
      delivery: { name: 'Доставка', hint: 'Передан транспортной компании' },
      shipped: { name: 'Отгружен', hint: 'Заказ завершён' },
      cancelled: { name: 'Отменён', hint: 'Заявка отменена' },
    };
    // ход заказа: при самовывозе этапа «Доставка» нет — итоговый статус ставят после выдачи
    const FLOW = { delivery: ['new', 'work', 'delivery', 'shipped'], pickup: ['new', 'work', 'shipped'] };
    const date = (iso) => new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const shortDate = (iso) => new Date(iso).toLocaleDateString('ru-RU');

    // Прототип: примеры заказов в остальных статусах, чтобы показать все состояния. На сайте список отдаёт сервер.
    const demoOrders = () => {
      const day = (n) => new Date(Date.now() - n * 864e5).toISOString();
      const item = (id, qty) => ({ id, name: PARTS[id].name, unit: PARTS[id].unit, qty, price: PARTS[id].price });
      const sum = (items) => items.reduce((t, i) => t + i.price * i.qty, 0);
      const org = { company: profile.company, inn: profile.inn, kpp: profile.kpp };
      const contact = { person: profile.person, phone: profile.phone, email: profile.email };
      const address = [profile.city, profile.address].filter(Boolean).join(', ');
      const make = (num, days, status, items, extra) => ({
        num, date: day(days), status, items, total: sum(items), note: '', files: [], payer: org, consignee: org,
        receive: 'delivery', address, contact, demo: true, ...extra,
      });
      return [
        make('104382', 3, 'work', [item('glass-st-side-s', 4), item('bracket-st-1015', 2)], { note: 'Стёкла для двух павильонов, монтаж своими силами.', files: [{ name: 'schema-pavilion.pdf', size: 420000 }] }),
        make('104217', 9, 'delivery', [item('bench-al-3m', 6)], { track: '1029384756' }),
        make('103955', 24, 'shipped', [item('anchor-al-1', 8)], { receive: 'pickup', address: '' }),
        make('103801', 40, 'cancelled', [item('bench-al-3m', 2), item('bracket-st-1015', 1),
          { id: 'seal-old', name: 'Уплотнитель стекла, 10 м', unit: 'шт.', qty: 3, price: 890 }]),
      ];
    };
    let orders = store.get('fg-orders', []);
    // примеры версии 2 (с позицией, снятой с каталога); старые примеры заменяем
    if (!orders.some((o) => o.demo === 2)) { orders = [...orders.filter((o) => !o.demo), ...demoOrders().map((o) => ({ ...o, demo: 2 }))]; store.set('fg-orders', orders); }
    orders.sort((a, b) => b.date.localeCompare(a.date));

    const statusChip = (el, s) => { el.className = `status status--${s}`; el.textContent = STATUS[s].name; };
    // состав в списке: до двух позиций, каждая своей строкой, остальное — строкой «и ещё N»
    const brief = (el, o) => {
      el.textContent = '';
      o.items.slice(0, 2).forEach((i) => {
        const line = document.createElement('span');
        line.className = 'orow__line';
        line.textContent = `${i.name} — ${i.qty} ${i.unit}`;
        el.appendChild(line);
      });
      if (o.items.length > 2) {
        const more = document.createElement('small');
        more.textContent = `и ещё ${o.items.length - 2}`;
        el.appendChild(more);
      }
    };

    const renderList = () => {
      const list = $('.olist', accPage);
      list.innerHTML = '';
      $('[data-orders-empty]', accPage).hidden = orders.length > 0;
      const demoNote = $('[data-demo-note]', accPage); if (demoNote) demoNote.hidden = !orders.some((o) => o.demo);
      orders.forEach((o) => {
        const a = document.createElement('a');
        a.className = 'orow';
        a.href = `#order-${o.num}`;
        a.innerHTML = '<span class="orow__id"><span class="orow__num"></span><span class="orow__date"></span></span>'
          + '<span class="orow__items"></span><span class="status"></span><span class="orow__sum"></span>';
        $('.orow__num', a).textContent = `№ ${o.num}`;
        $('.orow__date', a).textContent = `от ${shortDate(o.date)}`;
        brief($('.orow__items', a), o);
        statusChip($('.status', a), o.status);
        $('.orow__sum', a).textContent = o.total ? money(o.total) : 'по запросу';
        list.appendChild(a);
      });
    };

    const renderOrder = (o) => {
      current = o;
      const q = (k) => $(`[data-o="${k}"]`, accPage);
      q('num').textContent = o.num;
      statusChip(q('status'), o.status);
      q('date').textContent = `от ${date(o.date)}`;
      // ход заказа
      const flow = FLOW[o.receive] || FLOW.delivery;
      const steps = $('.ostatus', accPage);
      steps.style.setProperty('--n', flow.length);
      steps.hidden = o.status === 'cancelled';
      steps.innerHTML = '';
      const cur = flow.indexOf(o.status);
      flow.forEach((s, i) => {
        const li = document.createElement('li');
        li.className = i < cur ? 'is-done' : i === cur ? 'is-current' : '';
        if (i === cur) li.setAttribute('aria-current', 'step');
        li.innerHTML = `${STATUS[s].name}<small>${s === 'shipped' && o.receive === 'pickup' ? 'Выдан на самовывозе' : STATUS[s].hint}</small>`;
        steps.appendChild(li);
      });
      steps.dataset.label = `${STATUS[o.status].name} · ${STATUS[o.status].hint}`;
      q('cancelled-note').hidden = o.status !== 'cancelled';
      // состав с ценами на дату заявки
      q('price-head').textContent = `Цена на ${shortDate(o.date)}`;
      const body = $('.otable tbody', accPage);
      body.innerHTML = '';
      o.items.forEach((i) => {
        const tr = document.createElement('tr');
        tr.innerHTML = '<td></td><td data-cell="qty"></td><td data-cell="price"></td><td data-cell="sum"></td>';
        const [n, qty, price, sum] = $$('td', tr);
        n.textContent = i.name;
        qty.textContent = `${i.qty} ${i.unit}`;
        price.textContent = i.price ? money(i.price) : '—';
        sum.textContent = i.price ? money(i.price * i.qty) : 'по запросу';
        body.appendChild(tr);
      });
      q('total').textContent = o.total ? money(o.total) : 'по запросу';
      q('extra').hidden = !o.note && !o.files?.length;
      q('note').hidden = !o.note;
      $('span', q('note')).textContent = o.note || '';
      q('files').hidden = !o.files?.length;
      $('span', q('files')).textContent = (o.files || []).map((f) => f.name).join(', ');
      // получатели и получение
      const orgLine = (el, org) => {
        el.innerHTML = '<b></b><small></small>';
        $('b', el).textContent = org.company;
        $('small', el).textContent = [`ИНН ${org.inn}`, org.kpp && `КПП ${org.kpp}`].filter(Boolean).join(' · ');
      };
      orgLine(q('payer'), o.payer);
      orgLine(q('consignee'), o.consignee);
      q('receive').innerHTML = '<b></b><small></small>';
      $('b', q('receive')).textContent = o.receive === 'pickup' ? 'Самовывоз' : 'Доставка';
      $('small', q('receive')).textContent = o.receive === 'pickup' ? 'Адрес и время согласует менеджер' : o.address;
      q('track-row').hidden = !(o.receive === 'delivery' && o.track);
      q('track').textContent = o.track || '';
      // ссылка отслеживания: на сайте — страница транспортной компании с этим трек-номером
      q('contact').innerHTML = '<b></b><small></small>';
      $('b', q('contact')).textContent = o.contact.person;
      $('small', q('contact')).textContent = [o.contact.phone, o.contact.email].filter(Boolean).join(' · ');
      // действия: «Отменить» — пока заказ не передан в доставку и не выдан
      const canCancel = o.status === 'new' || o.status === 'work';
      q('cancel').hidden = !canCancel;
      q('hint').textContent = canCancel
        ? 'Отменить можно, пока заказ не передан в доставку или не выдан.'
        : '«Повторить» добавит позиции этого заказа в корзину.';
    };

    renderList();

    /* ---------- Повтор и отмена (ТЗ, экран 6) ---------- */

    let current = null;
    const saveOrders = () => store.set('fg-orders', orders);
    // «Повторить»: состав — в текущую корзину (количества суммируются), описание и файлы — к описанию и файлам корзины.
    // Позиции, которых больше нет в каталоге, переносим в описание названием. Заявку клиент оформляет сам из корзины.
    $('[data-o="repeat"]', accPage).addEventListener('click', async (e) => {
      const o = current;
      await fakeRequest(e.currentTarget, 400);
      const cart = store.get('fg-cart', {});
      const missing = [];
      o.items.forEach((i) => {
        if (PARTS[i.id]) cart[i.id] = Math.min(999, (cart[i.id] || 0) + i.qty);
        else missing.push(`${i.name} — ${i.qty} ${i.unit}`);
      });
      const notes = [store.get('fg-cart-note', ''), o.note, missing.length && `Из заказа № ${o.num}, нет в каталоге: ${missing.join('; ')}`].filter(Boolean);
      const files = store.get('fg-cart-files', []);
      (o.files || []).forEach((f) => { if (!files.some((x) => x.name === f.name && x.size === f.size)) files.push(f); });
      store.set('fg-cart', cart);
      store.set('fg-cart-note', notes.join('\n\n').slice(0, 2000));
      store.set('fg-cart-files', files);
      store.set('fg-cart-repeat', { num: o.num, missing });
      location.href = 'cart.html';
    });

    // «Отменить заявку»: с подтверждением; доступна до передачи в доставку или выдачи
    const cancelModal = $('#cancel-modal');
    $('[data-o="cancel"]', accPage).addEventListener('click', () => {
      $('[data-cancel-num]', cancelModal).textContent = current.num;
      cancelModal.showModal();
      document.documentElement.classList.add('has-modal');
      $('[data-cancel-no]', cancelModal).focus();
    });
    $('[data-cancel-yes]', cancelModal).addEventListener('click', async (e) => {
      await fakeRequest(e.currentTarget, 600);
      current.status = 'cancelled';
      saveOrders();
      cancelModal.close();
      renderOrder(current);
      renderList();
      say(`Заявка № ${current.num} отменена`);
    });
    $('[data-cancel-no]', cancelModal).addEventListener('click', () => cancelModal.close());

    // разделы: #orders (по умолчанию), #order-<номер>, #profile, #orgs
    const tabs = $$('[data-tab]', accPage);
    const openTab = () => {
      const h = location.hash.slice(1);
      const order = h.startsWith('order-') && orders.find((o) => o.num === h.slice(6));
      const name = order ? 'order' : ['profile', 'orgs'].includes(h) ? h : 'orders';
      if (order) renderOrder(order);
      $$('[data-screen]', accPage).forEach((s) => { s.hidden = s.dataset.screen !== name; });
      const tab = name === 'order' ? 'orders' : name;
      tabs.forEach((t) => { if (t.dataset.tab === tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current'); });
      if (name === 'order') window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', openTab);
    openTab();

    // моя организация: «Сохранить» активна, только когда что-то изменили
    const form = $('#profile-form');
    const KEYS = ['company', 'kpp', 'city', 'address', 'person', 'phone', 'email'];
    const fill = () => { REQ.forEach((k) => { if (form[k]) form[k].value = profile[k] || ''; }); };
    const dirty = () => KEYS.some((k) => form[k].value.trim() !== (profile[k] || ''));
    const saveBtn = $('[data-save]', form);
    fill();
    form.addEventListener('input', () => { saveBtn.disabled = !dirty(); });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      await fakeRequest(saveBtn);
      profile = { ...profile, ...Object.fromEntries(KEYS.map((k) => [k, form[k].value.trim()])) };
      setProfile(profile);
      renderHead();
      saveBtn.disabled = true;
      say('Изменения сохранены');
    });

    // справочники: список, добавление и правка в окне, удаление с подтверждением
    const modal = $('#org-modal');
    const orgForm = $('form', modal);
    let editing = null; // { role, id } — id нет у новой записи
    const save = () => store.set('fg-orgs', orgs);
    // правку реквизитов в справочниках клиент попросил пока убрать (13.11): только добавление и удаление
    const ICON_DEL = '<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>';

    const renderDir = (role) => {
      const box = $(`[data-dir="${role}"]`, accPage);
      const list = $('.dir__list', box);
      const items = orgs.filter((o) => o.role === role);
      list.innerHTML = '';
      $('.dir__empty', box).hidden = items.length > 0;
      items.forEach((o) => {
        const row = document.createElement('article');
        row.className = 'orgrow';
        row.innerHTML = '<p class="orgrow__name"></p><p class="orgrow__meta"></p>'
          + `<div class="orgrow__actions"><button class="icon-btn" type="button" data-del>${ICON_DEL}</button></div>`;
        $('.orgrow__name', row).textContent = o.company;
        const meta = $('.orgrow__meta', row);
        [[`ИНН ${o.inn}`, o.kpp && `КПП ${o.kpp}`].filter(Boolean).join(' · '), [o.city, o.address].filter(Boolean).join(', '), [o.person, o.phone].filter(Boolean).join(', ')]
          .filter(Boolean).forEach((t) => { const s = document.createElement('span'); s.textContent = t; meta.appendChild(s); });
        $('[data-del]', row).setAttribute('aria-label', `Удалить: ${o.company}`);
        $('[data-del]', row).addEventListener('click', () => {
          if ($('.orgrow__confirm', row)) return;
          const c = document.createElement('div');
          c.className = 'orgrow__confirm';
          c.innerHTML = '<span>Удалить из&nbsp;справочника?</span>'
            + '<button class="btn btn--danger" type="button">Удалить</button><button class="btn btn--outline" type="button">Отмена</button>';
          const [yes, no] = $$('button', c);
          yes.addEventListener('click', () => { orgs = orgs.filter((x) => x.id !== o.id); save(); renderDir(role); say('Организация удалена'); });
          no.addEventListener('click', () => c.remove());
          row.appendChild(c);
          no.focus();
        });
        list.appendChild(row);
      });
    };

    function openOrg(role, org) {
      editing = { role, id: org?.id };
      $('#org-modal-title').textContent = org
        ? 'Изменить реквизиты'
        : (role === 'payer' ? 'Новый плательщик' : 'Новый грузополучатель');
      REQ.forEach((k) => { orgForm[k].value = org?.[k] || ''; setError(orgForm[k], ''); });
      modal.showModal();
      document.documentElement.classList.add('has-modal');
      orgForm.company.focus();
    }
    $$('[data-add]', accPage).forEach((b) => b.addEventListener('click', () => openOrg(b.dataset.add, null)));
    orgForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate(orgForm)) return;
      await fakeRequest($('[type="submit"]', orgForm), 500);
      const data = readReq(orgForm);
      if (editing.id) orgs = orgs.map((o) => (o.id === editing.id ? { ...o, ...data } : o));
      else orgs.push({ id: `o${Date.now()}`, role: editing.role, ...data });
      save();
      renderDir(editing.role);
      modal.close();
      say(editing.id ? 'Реквизиты обновлены' : 'Организация добавлена');
    });
    renderDir('consignee');
    renderDir('payer');
  }
})();
