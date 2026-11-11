"""Страницы личного кабинета по «ТЗ дизайнеру · оставшиеся экраны» (экраны 1–2):
корзина (cart.html), вход (login.html), восстановление доступа и активация по приглашению (recovery.html),
регистрация (register.html). Логика — site/js/lk.js.

Шапку и подвал берём из parts.html (гостевая шапка: «Войти» → login.html, корзина → cart.html).
Правки этих страниц вносить сюда и пересобирать.
Запуск: python tools/build_lk_pages.py
"""
import re
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / 'site'
shell = (SITE / 'parts.html').read_text(encoding='utf-8')
head, rest = shell.split('<main>', 1)
_, foot = rest.split('</main>', 1)

POLICY = 'privacy.html'
# Тексты согласия и оферты у клиента есть (ТЗ: «дизайнер их не пишет»), на сайт ещё не выложены — ссылки ведут на «Политику»
CONSENT = 'privacy.html'
OFFER = 'privacy.html'
PHONE = '8 (812) 640-222-7'
PHONE_HREF = 'tel:+78126402227'

EYE = ('<button class="pass__toggle" type="button" aria-pressed="false" aria-label="Показать пароль">'
       '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/>'
       '<circle cx="12" cy="12" r="3"/><path class="pass__slash" d="M4 4l16 16"/></svg></button>')
TICK = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
MAIL = ('<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/>'
        '<path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>')
LOCK = ('<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2"/>'
        '<path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>')
CLOCK = '<svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
CHECK = '<svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'


def field(label, name, kind='text', req=True, auto='', hint='', extra='', value=''):
    star = ' <span class="field__req" aria-hidden="true">*</span>' if req else ''
    attrs = f' type="{kind}" name="{name}"'
    if auto:
        attrs += f' autocomplete="{auto}"'
    if req:
        attrs += ' required'
    if value:
        attrs += f' value="{value}"'
    attrs += extra
    hint_html = f'\n            <span class="field__hint">{hint}</span>' if hint else ''
    return f'''<label class="field">
            <span class="field__label">{label}{star}</span>
            <input class="field__input"{attrs}>{hint_html}
            <span class="field__error" aria-live="polite"></span>
          </label>'''


def password(label, name, auto='new-password', extra=' data-pass', hint=''):
    hint_html = f'\n            <span class="field__hint">{hint}</span>' if hint else ''
    return f'''<div class="field">
            <label class="field__label" for="{name}">{label} <span class="field__req" aria-hidden="true">*</span></label>
            <div class="pass"><input class="field__input" id="{name}" type="password" name="{name}" autocomplete="{auto}" required{extra}>{EYE}</div>{hint_html}
            <span class="field__error" aria-live="polite"></span>
          </div>'''


def check(name, text, small=''):
    small_html = f'<small>{small}</small>' if small else ''
    return f'''<label class="check">
              <input class="check__input" type="checkbox" name="{name}" required>
              <span class="check__box">{TICK}</span>
              <span class="check__text">{text}{small_html}<span class="field__error" aria-live="polite"></span></span>
            </label>'''


def requisites(prefix=''):
    """Реквизиты как в шаблоне заявки (ТЗ, экран 3): организация, ИНН/КПП, город и адрес доставки, контакт, телефон, email."""
    return f'''<div class="form__row">
          {field('ИНН', 'inn', auto='off', extra=' inputmode="numeric" maxlength="12" data-inn', hint='10 цифр у организации, 12 — у ИП')}
          {field('КПП', 'kpp', req=False, auto='off', extra=' inputmode="numeric" maxlength="9" data-kpp', hint='Если есть')}
        </div>
        {field('Название компании', 'company', auto='organization', extra=' placeholder="ООО «Название»"')}
        <div class="form__row">
          {field('Город', 'city', auto='address-level2')}
          {field('Адрес доставки', 'address', auto='street-address', extra=' placeholder="Улица, дом, корпус"')}
        </div>
        {field('Ф. И. О. контактного лица', 'person', auto='name')}
        <div class="form__row">
          {field('Телефон', 'phone', kind='tel', auto='tel', extra=' placeholder="+7"')}
          {field('Email для связи', 'email', kind='email', auto='email', hint=prefix)}
        </div>'''


def page(file, title, desc, crumbs, main):
    h = head
    h = re.sub(r'<title>.*?</title>', f'<title>{title} — ФАВОР-ГАРАНТ</title>', h)
    h = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', h)
    crumb_html = '<li><a href="index.html">Главная</a></li>' + ''.join(
        f'<li><a href="{href}">{name}</a></li>' if href else f'<li><span aria-current="page">{name}</span></li>' for name, href in crumbs)
    body = f'''<main>

  <!-- {title}: собрано tools/build_lk_pages.py — правки вносить в скрипт -->
  <section class="section section--light page-top">
    <div class="container">
      <ol class="crumbs" aria-label="Навигация по сайту">{crumb_html}</ol>
{main}
    </div>
  </section>

</main>'''
    f = foot.replace('<script src="js/main.js', '<script src="js/lk.js?v=VERSION"></script>\n<script src="js/main.js')
    ver = re.search(r'main\.js\?v=(\w+)', f).group(1)
    f = f.replace('VERSION', ver)
    (SITE / file).write_text(h + body + f, encoding='utf-8')
    print('ok', file)


# ---------- Корзина (ТЗ, экран 1) ----------

cart = f'''      <div class="page-head">
        <div>
          <h1 class="h2 duo"><span>Корзина</span><span class="duo__second">комплектующих</span></h1>
        </div>
        <p class="page-head__text">Проверьте позиции и&nbsp;количество. К&nbsp;заявке можно добавить описание и&nbsp;чертежи&nbsp;— они дополняют выбранные комплектующие.</p>
      </div>

      <div data-page="cart">
        <div class="notice notice--ok" data-welcome hidden style="margin-bottom: 20px"><span>Вы вошли в&nbsp;кабинет. Корзина, описание и&nbsp;файлы сохранены, цены обновлены.</span></div>

        <div class="cart" data-cart-full hidden>
          <div class="cart__main">
            <div class="cart__head">
              <h2 class="cart__title">Выбранные позиции</h2>
              <a class="lk-back" href="parts-lk.html">Вернуться к&nbsp;каталогу</a>
            </div>
            <div class="cart__price-hint" data-for="guest">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">{LOCK[LOCK.index('<rect'):]}
              <span>Цены видны после входа в&nbsp;кабинет. Содержимое корзины при входе не&nbsp;сбросится.</span>
            </div>
            <ul class="cart__list"></ul>
            <div class="cart__foot">
              <span class="cart__total" data-cart-count></span>
              <span class="cart__total" data-cart-total></span>
            </div>
          </div>

          <aside class="cart__side" aria-label="Дополнение к заявке">
            <p class="cart__side-title">Дополнительное описание</p>
            <p class="cart__side-text">Уточнения к&nbsp;выбранным позициям: размеры, модель павильона, сроки.</p>
            <form class="form form--modal" data-flow="cart" onsubmit="return false">
              <label class="field">
                <span class="visually-hidden">Дополнительное описание</span>
                <textarea class="field__input field__input--area cart__note" name="note" rows="4" maxlength="2000" placeholder="Например: стёкла для павильона «Атлант», 2019 года"></textarea>
              </label>
              <span class="cart__counter" aria-live="off"></span>
              <div class="field">
                <label class="file">
                  <input type="file" name="files" class="file__input" multiple accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.zip">
                  <span class="file__icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4l7.8-7.8"/></svg></span>
                  <span class="file__btn">Прикрепить чертёж или файл</span>
                </label>
                <span class="field__hint">PDF, DWG, DXF, JPG, PNG или ZIP, до&nbsp;20&nbsp;МБ каждый</span>
                <span class="field__error" aria-live="polite"></span>
                <ul class="files" aria-label="Прикреплённые файлы"></ul>
              </div>
            </form>

            <div class="cart__go" data-for="auth" hidden>
              <p class="cart__user"><span>Вы вошли: <b data-auth-name></b></span><button type="button" data-logout>Выйти</button></p>
              <button class="btn btn--primary btn--block" type="button" data-checkout>Перейти к&nbsp;оформлению</button>
            </div>
            <div class="cart__go" data-for="guest">
              <a class="btn btn--primary btn--block" href="login.html?next=cart">Войти и&nbsp;оформить</a>
              <a class="btn btn--outline btn--block" href="register.html?next=cart">Зарегистрироваться</a>
              <p class="cart__go-note">Оформить заявку можно после входа. Товары, описание и&nbsp;файлы сохранятся.</p>
            </div>
          </aside>
        </div>

        <div class="cart__main empty" data-cart-empty hidden>
          <span class="empty__icon" aria-hidden="true"><svg width="32" height="32" viewBox="0 0 24 24"><path d="M3 4h2.2l2.3 11h10.8l2-8H6.4"/><circle cx="9.5" cy="19.5" r="1.5"/><circle cx="17" cy="19.5" r="1.5"/></svg></span>
          <p class="empty__title">Корзина пуста</p>
          <p class="empty__text">Заявка оформляется на&nbsp;комплектующие из&nbsp;каталога. Выберите позиции&nbsp;— описание и&nbsp;чертежи можно будет добавить здесь.</p>
          <a class="btn btn--primary" href="parts-lk.html">Перейти в&nbsp;каталог</a>
        </div>
      </div>'''

page('cart.html', 'Корзина', 'Корзина комплектующих ФАВОР-ГАРАНТ: выбранные позиции, описание и чертежи к заявке.',
     [('Комплектующие', 'parts-lk.html'), ('Корзина', '')], cart)


# ---------- Вход (ТЗ, экран 2) ----------

login = f'''      <div class="auth" data-page="login">
        <section data-screen="form">
          <div class="auth__head">
            <h1 class="h2 duo"><span>Вход</span><span class="duo__second">в&nbsp;личный кабинет</span></h1>
            <p class="auth__lead">Для организаций и&nbsp;ИП. После входа видны цены комплектующих и&nbsp;оформление заявки.</p>
          </div>
          <form class="form" data-flow="login" novalidate>
            <div class="notice notice--warn" data-form-error hidden role="alert"><span><b>Неверный ИНН или пароль.</b> Проверьте данные или <a class="lk-link" href="recovery.html" data-keep-next>восстановите пароль</a>.</span></div>
            {field('ИНН', 'inn', auto='username', extra=' inputmode="numeric" maxlength="12" data-inn')}
            {password('Пароль', 'password', auto='current-password', extra='')}
            <div class="auth__links">
              <a class="lk-link" href="recovery.html" data-keep-next>Забыли пароль?</a>
              <a class="lk-link" href="register.html" data-keep-next>Регистрация</a>
            </div>
            <button class="btn btn--primary btn--block" type="submit">Войти</button>
            <p class="proto">Прототип: пароль короче 8&nbsp;символов покажет ошибку входа, любой другой&nbsp;— войдёт.</p>
          </form>
          <div class="notice" style="margin-top: 20px">
            <span><b>Вы&nbsp;уже работаете с&nbsp;нами?</b> Для постоянных клиентов кабинет создаёт менеджер&nbsp;— на&nbsp;почту придёт приглашение со&nbsp;ссылкой для установки пароля.
              <span class="notice__actions"><a class="lk-link" href="recovery.html?invite=1" data-keep-next>Прототип: открыть приглашение</a></span>
            </span>
          </div>
        </section>

        <section data-screen="signed" hidden>
          <div class="form auth__center">
            <span class="auth__icon" aria-hidden="true">{CHECK}</span>
            <p class="auth__title">Вы вошли в&nbsp;кабинет</p>
            <p class="auth__sub" style="margin-top: 0">Организация: <b data-auth-name></b>. Разделы кабинета&nbsp;— профиль и&nbsp;заказы&nbsp;— появятся на&nbsp;следующих экранах.</p>
            <div class="auth__actions">
              <a class="btn btn--primary" href="cart.html">Корзина</a>
              <a class="btn btn--outline" href="parts-lk.html">Каталог комплектующих</a>
            </div>
            <button class="lk-link" type="button" data-logout style="border: 0; background: none; font: inherit; font-size: 14px; cursor: pointer">Выйти</button>
          </div>
        </section>
      </div>'''

page('login.html', 'Вход в личный кабинет', 'Вход в личный кабинет ФАВОР-ГАРАНТ по ИНН и паролю.', [('Вход', '')], login)


# ---------- Восстановление доступа + активация по приглашению (ТЗ, экран 2) ----------

legal = f'<p class="auth__legal">Мы&nbsp;обрабатываем данные по&nbsp;<a href="{POLICY}">Политике обработки персональных данных</a>.</p>'

recovery = f'''      <div class="auth" data-page="recovery">
        <section data-screen="email">
          <div class="auth__head">
            <h1 class="h2 duo"><span>Восстановление</span><span class="duo__second">доступа</span></h1>
            <p class="auth__lead">Укажите email, который указан в&nbsp;кабинете. Пришлём ссылку для нового пароля.</p>
          </div>
          <form class="form" data-flow="recovery" data-step="email" novalidate>
            {field('Email', 'email', kind='email', auto='email')}
            <button class="btn btn--primary btn--block" type="submit">Получить ссылку</button>
            <div class="auth__links"><a class="lk-link" href="login.html" data-keep-next>Вернуться ко&nbsp;входу</a></div>
            {legal}
          </form>
        </section>

        <section data-screen="sent" hidden>
          <div class="form auth__center">
            <span class="auth__icon" aria-hidden="true">{MAIL}</span>
            <p class="auth__title">Проверьте почту</p>
            <p class="auth__sub" style="margin-top: 0">Отправили ссылку на&nbsp;<b data-email></b>. Если письма нет&nbsp;— загляните в&nbsp;«Спам».</p>
            <div class="auth__actions">
              <button class="btn btn--outline" type="button" data-resend>Отправить ещё раз</button>
              <button class="btn btn--outline" type="button" data-go="email">Другой email</button>
            </div>
            <p class="proto">Прототип вместо письма: <button type="button" data-go="password">открыть ссылку</button> <button type="button" data-go="expired">открыть устаревшую ссылку</button></p>
          </div>
        </section>

        <section data-screen="password" hidden>
          <div class="auth__head">
            <h1 class="h2 duo"><span>Новый</span><span class="duo__second">пароль</span></h1>
          </div>
          <form class="form" data-flow="recovery" data-step="password" novalidate>
            {password('Новый пароль', 'pass1', hint='Не меньше 8 символов')}
            {password('Повторите пароль', 'pass2', extra=' data-match="#pass1"')}
            <button class="btn btn--primary btn--block" type="submit">Сохранить пароль</button>
            {legal}
          </form>
        </section>

        <section data-screen="done" hidden>
          <div class="form auth__center">
            <span class="auth__icon" aria-hidden="true">{CHECK}</span>
            <p class="auth__title">Пароль изменён</p>
            <p class="auth__sub" style="margin-top: 0">Войдите с&nbsp;новым паролем&nbsp;— корзина сохранена.</p>
            <div class="auth__actions"><a class="btn btn--primary" href="login.html" data-keep-next>Войти</a></div>
          </div>
        </section>

        <section data-screen="expired" hidden>
          <div class="form auth__center">
            <span class="auth__icon" aria-hidden="true">{CLOCK}</span>
            <p class="auth__title">Ссылка устарела</p>
            <p class="auth__sub" style="margin-top: 0">Ссылка из&nbsp;письма уже использована или истёк срок её&nbsp;действия. Запросите новую.</p>
            <div class="auth__actions"><button class="btn btn--primary" type="button" data-go="email">Запросить новую ссылку</button></div>
          </div>
        </section>

        <!-- Постоянный клиент: кабинет заводит менеджер, клиент приходит по ссылке из приглашения. Данные — из приглашения, ИНН не меняется -->
        <section data-screen="invite" hidden>
          <div class="auth__head">
            <h1 class="h2 duo"><span>Активация</span><span class="duo__second">кабинета</span></h1>
            <p class="auth__lead">Менеджер создал кабинет для вашей организации. Проверьте данные и&nbsp;задайте пароль.</p>
          </div>
          <form class="form" data-flow="recovery" data-step="invite" novalidate>
            <!-- прототип: данные приглашения — пример -->
            {field('Организация', 'company', req=False, extra=' readonly', value='ООО «Пример»')}
            <div class="form__row">
              {field('ИНН', 'inn', req=False, extra=' readonly', value='7801234567')}
              {field('Email', 'email', kind='email', req=False, extra=' readonly', value='zakaz@example.ru')}
            </div>
            {password('Пароль', 'ipass1', hint='Не меньше 8 символов')}
            {password('Повторите пароль', 'ipass2', extra=' data-match="#ipass1"')}
            <div class="checks-list">
              {check('consent', f'Даю <a href="{CONSENT}" target="_blank">согласие на&nbsp;обработку персональных данных</a>')}
            </div>
            <button class="btn btn--primary btn--block" type="submit">Активировать и&nbsp;войти</button>
            <p class="auth__legal">Если данные неверны&nbsp;— позвоните менеджеру: <a href="{PHONE_HREF}">{PHONE}</a>. <a href="{POLICY}">Политика обработки персональных данных</a>.</p>
          </form>
        </section>
      </div>'''

page('recovery.html', 'Восстановление доступа', 'Восстановление пароля и активация личного кабинета ФАВОР-ГАРАНТ.', [('Вход', 'login.html'), ('Восстановление доступа', '')], recovery)


# ---------- Регистрация (ТЗ, экран 2) ----------

register = f'''      <div class="auth auth--wide" data-page="register">
        <div class="auth__head">
          <h1 class="h2 duo"><span>Регистрация</span><span class="duo__second">организации</span></h1>
          <p class="auth__lead">Кабинет открывается на&nbsp;ИНН. В&nbsp;нём видны цены, оформление заявок и&nbsp;история заказов.</p>
        </div>
        <ol class="steps" aria-label="Шаги регистрации">
          <li><span>Данные организации</span></li>
          <li><span>Подтверждение почты</span></li>
          <li><span>Пароль</span></li>
          <li><span>Грузополучатель</span></li>
        </ol>

        <section data-screen="data">
          <form class="form" data-flow="register" data-step="data" novalidate>
            {requisites('На&nbsp;него придёт письмо для подтверждения')}
            <div class="notice notice--warn" data-inn-taken hidden role="alert">
              <span><b>Кабинет с&nbsp;этим ИНН уже есть.</b> Войдите или восстановите пароль. Если вы&nbsp;не&nbsp;регистрировались&nbsp;— позвоните нам: <a class="lk-link" href="{PHONE_HREF}">{PHONE}</a>, разберёмся.
                <span class="notice__actions"><a class="lk-link" href="login.html" data-keep-next>Войти</a><a class="lk-link" href="recovery.html" data-keep-next>Восстановить пароль</a></span>
              </span>
            </div>
            <!-- две отдельные галочки, обе изначально пустые: согласие на ПД не объединяем с офертой -->
            <div class="checks-list">
              {check('consent', f'Даю <a href="{CONSENT}" target="_blank">согласие на&nbsp;обработку персональных данных</a>')}
              {check('offer', f'Принимаю условия <a href="{OFFER}" target="_blank">оферты</a>')}
            </div>
            <div class="form__bottom">
              <button class="btn btn--primary" type="submit">Продолжить</button>
              <p class="form__note">Уже есть кабинет? <a href="login.html" data-keep-next>Войти</a>. Данные обрабатываем по&nbsp;<a href="{POLICY}">Политике обработки персональных данных</a>.</p>
            </div>
            <p class="proto">Прототип: ИНН 7801234567 считается уже зарегистрированным.</p>
          </form>
        </section>

        <section data-screen="confirm" hidden>
          <div class="form auth__center">
            <span class="auth__icon" aria-hidden="true">{MAIL}</span>
            <p class="auth__title">Подтвердите почту</p>
            <p class="auth__sub" style="margin-top: 0">Отправили письмо на&nbsp;<b data-email></b>. Перейдите по&nbsp;ссылке из&nbsp;письма, чтобы продолжить.</p>
            <div class="auth__actions">
              <button class="btn btn--outline" type="button" data-resend>Отправить ещё раз</button>
              <button class="btn btn--outline" type="button" data-go="data">Изменить email</button>
            </div>
            <p class="auth__legal" data-resent hidden>Письмо отправлено повторно.</p>
            <p class="proto">Прототип вместо письма: <button type="button" data-go="password">открыть ссылку подтверждения</button></p>
          </div>
        </section>

        <section data-screen="password" hidden>
          <form class="form" data-flow="register" data-step="password" novalidate>
            <p class="auth__title">Почта подтверждена. Задайте пароль</p>
            <p class="auth__sub">Входить в&nbsp;кабинет будете по&nbsp;ИНН и&nbsp;этому паролю.</p>
            <div class="form__row">
              {password('Пароль', 'rpass1', hint='Не меньше 8 символов')}
              {password('Повторите пароль', 'rpass2', extra=' data-match="#rpass1"')}
            </div>
            <div class="form__bottom"><button class="btn btn--primary" type="submit">Создать кабинет</button></div>
          </form>
        </section>

        <section data-screen="consignee" hidden>
          <div class="form">
            <p class="auth__title">Кабинет создан. Добавить грузополучателя?</p>
            <p class="auth__sub">Если товар принимает другая организация, добавьте её&nbsp;— при оформлении заявки останется только выбрать. Кабинет для грузополучателя не&nbsp;создаётся. Шаг можно пропустить и&nbsp;вернуться к&nbsp;нему в&nbsp;кабинете.</p>
            <div class="auth__actions">
              <button class="btn btn--primary" type="button" data-go="consignee-form">Добавить</button>
              <button class="btn btn--outline" type="button" data-skip>Пропустить</button>
            </div>
          </div>
        </section>

        <section data-screen="consignee-form" hidden>
          <form class="form" data-flow="register" data-step="consignee" novalidate>
            <p class="auth__title">Грузополучатель</p>
            <p class="auth__sub">Реквизиты, как в&nbsp;заявке. Доступа к&nbsp;вашему кабинету у&nbsp;грузополучателя не&nbsp;будет.</p>
            {requisites()}
            <div class="form__bottom">
              <button class="btn btn--primary" type="submit">Сохранить и&nbsp;продолжить</button>
              <button class="btn btn--outline" type="button" data-skip>Пропустить</button>
              <p class="form__note">Данные контактного лица обрабатываем по&nbsp;<a href="{POLICY}">Политике обработки персональных данных</a>.</p>
            </div>
          </form>
        </section>
      </div>'''

page('register.html', 'Регистрация', 'Регистрация организации в личном кабинете ФАВОР-ГАРАНТ.', [('Вход', 'login.html'), ('Регистрация', '')], register)
