# Собирает внутренние страницы каталога ФАВОР-ГАРАНТ: шапка, заявка и подвал берутся из site/index.html.
import re, sys, pathlib

SITE = pathlib.Path(sys.argv[1])
index = (SITE / 'index.html').read_text(encoding='utf-8')

def cut(start, end, include_end=True):
    i = index.index(start)
    j = index.index(end, i) + (len(end) if include_end else 0)
    return index[i:j]

head = cut('<!doctype html>', '</head>')
head = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', head, flags=re.S)
header = cut('<!-- Шапка -->', '</header>')
request = cut('<!-- 8. Заявка -->', '</section>')
footer = cut('<footer', '</footer>')

# Якоря главной на внутренних страницах ведут на главную; заявка и контакты остаются на странице
LOCAL = {'request-form', 'contacts', 'top'}
def fix_links(html):
    html = re.sub(r'href="#([a-z-]+)"', lambda m: m.group(0) if m.group(1) in LOCAL else f'href="index.html#{m.group(1)}"', html)
    return html.replace('class="header__logo" href="#top"', 'class="header__logo" href="index.html"')

header, request, footer = fix_links(header), fix_links(request), fix_links(footer)

def page(fname, title, desc, main):
    h = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', head)
    h = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', h)
    html = f'''{h}
<body>

{header}

<main>
{main}
  {request}

</main>

{footer}

<script src="js/main.js"></script>
</body>
</html>
'''
    (SITE / fname).write_text(html, encoding='utf-8')
    print('ok', fname)

def crumbs(*items):
    li = []
    for i, (name, href) in enumerate(items):
        if href:
            li.append(f'<li><a href="{href}">{name}</a></li>')
        else:
            li.append(f'<li><span aria-current="page">{name}</span></li>')
    return '<ol class="crumbs" aria-label="Навигация по сайту">' + ''.join(li) + '</ol>'

# ---------- Общий раздел «Продукция» ----------

CATS = [
    # (название, ссылка, фото, позиция, описание, счётчик, подпись)
    ('Остановочные павильоны', 'bus-shelters.html', 'img/photos/10-cat-pavilions.jpg', '50% 50%',
     'Модульные, городские, курортные и&nbsp;закрытые павильоны, в&nbsp;том числе SMART и&nbsp;для маломобильных групп.', '15 моделей',
     'Элегант · Атлант · Городской · Чайка · Закрытый'),
    ('Рекламные тумбы', 'index.html#catalog', 'img/photos/11-cat-tumby.jpg', '100% 50%',
     'Тумбы с&nbsp;внутренней светодиодной подсветкой.', '3 модели', 'Круглая · Плоская · Вогнутая'),
    ('Лайтпостеры', 'index.html#catalog', 'img/photos/12-cat-lightposters.jpg', '50% 50%',
     'Конструкции сити-формата с&nbsp;двумя информационными поверхностями и&nbsp;подсветкой.', '2 модели', 'Лайтпостер · Скроллер'),
    ('Рекламные щиты', 'index.html#catalog', 'img/photos/13-cat-billboards.jpg', '0% 50%',
     'Несущие конструкции для рекламы и&nbsp;городской информации.', '3 модели', 'Рекламный щит · Триборд · Тривижн'),
    ('Навигация', 'index.html#catalog', 'img/photos/17-cat-navigation.jpg', '50% 50%',
     'Информационные указатели и&nbsp;стелы для городской среды.', '5 моделей', 'Пилон · Указатель · Афишный стенд · Стелы'),
    ('Малые архитектурные формы', 'index.html#catalog', 'img/photos/16-cat-maf.jpg', '50% 50%',
     'Элементы городской среды.', '7 моделей', 'Павильоны · Кабинки · Скамья · Книжный шкаф'),
    ('Оборудование для стрельбищ', 'index.html#catalog', 'img/photos/14-cat-shooting.jpg', '50% 50%',
     'Конструкции для стендовой стрельбы по&nbsp;требованиям международной федерации.', '2 модели', 'Пирамиды для ружей · Ракушки для машин'),
    ('Нестандартные конструкции', 'index.html#catalog', 'img/photos/15-cat-custom.jpg', '50% 50%',
     'Металлоконструкции по&nbsp;эскизам и&nbsp;чертежам заказчика&nbsp;— от&nbsp;деталей до&nbsp;сборки готовых изделий.', 'Под заказ', 'По эскизу · По чертежу · По ТЗ'),
]

def cat_tile(c):
    name, href, img, pos, text, count, meta = c
    return f'''        <a class="tile" href="{href}">
          <div class="tile__media"><span class="tile__count">{count}</span><img src="{img}" style="object-position: {pos}" alt="{name}" loading="lazy" width="1400" height="1050"></div>
          <div class="tile__body">
            <h2 class="tile__title">{name}</h2>
            <p class="tile__text">{text}</p>
            <p class="tile__meta">{meta}</p>
          </div>
        </a>'''

parts_tile = '''        <a class="tile tile--parts" href="index.html#catalog">
          <div class="tile__art"><span class="tile__count">Магазин</span><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l15.6 9v18L24 42 8.4 33V15z"/><circle cx="24" cy="24" r="7"/></svg></div>
          <div class="tile__body">
            <h2 class="tile__title">Комплектующие</h2>
            <p class="tile__text">Запасные части и&nbsp;комплектующие для конструкций&nbsp;— можно заказать онлайн и&nbsp;положить в&nbsp;корзину.</p>
            <p class="tile__meta">Онлайн-заказ · Корзина</p>
          </div>
        </a>'''

catalog_main = f'''
  <section class="section section--light page-top">
    <div class="container">
      {crumbs(('Главная', 'index.html'), ('Продукция', None))}
      <div class="page-head">
        <div>
          <h1 class="h2 duo">
            <span>Продукция</span>
            <span class="duo__second">для городской среды</span>
          </h1>
        </div>
        <p class="page-head__text">Проектируем, производим и&nbsp;монтируем металлоконструкции на&nbsp;собственном производстве в&nbsp;Санкт-Петербурге. Работаем по&nbsp;всей России.</p>
      </div>
      <div class="cards">
{chr(10).join(cat_tile(c) for c in CATS)}
{parts_tile}
      </div>
    </div>
  </section>
'''

page('catalog.html', 'Продукция — ФАВОР-ГАРАНТ',
     'Каталог продукции ФАВОР-ГАРАНТ: остановочные павильоны, рекламные конструкции, навигация, МАФ, оборудование для стрельбищ, нестандартные конструкции и комплектующие.',
     catalog_main)

# ---------- Раздел «Остановочные павильоны» ----------

# Тексты и габариты — со страниц моделей на favor-garant.ru; группы для фильтра — наша разбивка по описаниям
SHELTERS = [
    ('elegant', 'Элегант', 'Модульный павильон с&nbsp;широкой крышей, каркас из&nbsp;алюминиевого профиля.', '4996 × 2500 × 1645', 'modular'),
    ('elegant-p', 'Элегант П', 'Плоская крыша и&nbsp;увеличенный просвет для информационных панелей.', '4996 × 2500 × 1645', 'modular'),
    ('standart', 'Стандарт', 'Элегантная зауженная крыша, лаконичный дизайн для любой городской среды.', '4996 × 2500 × 1300', 'modular'),
    ('gallant', 'Галант', 'Компактный павильон с&nbsp;зауженной крышей для узких тротуаров.', '4996 × 2460 × 1300', 'modular'),
    ('atlant', 'Атлант', 'Увеличенный просвет между каркасом и&nbsp;крышей для информационной панели.', '4996 × 2730 × 1645', 'modular'),
    ('atlant-smart', 'Атлант SMART', 'Повышенная комфортность: фронтальные панели защищают от&nbsp;ветра и&nbsp;сохраняют тепло.', '6000 × 2730 × 1645', 'modular smart'),
    ('compact', 'Компакт', 'Модульный павильон с&nbsp;плоской крышей и&nbsp;информационной панелью.', '5100 × 2730 × 1700', 'modular'),
    ('city', 'Городской', 'Павильон городского типа с&nbsp;каркасом из&nbsp;оцинкованной стали.', '4115 × 2690 × 1600', 'city'),
    ('city-smart', 'Городской SMART', 'Оцинкованный каркас, готовность к&nbsp;SMART-оборудованию «Умного города».', '4115 × 2690 × 1600', 'city smart'),
    ('chajka', 'Чайка', 'Изогнутая декоративная крыша, каркас с&nbsp;цинкованием для морского климата.', '5200 × 2770 × 1620', 'resort'),
    ('albatros', 'Альбатрос', 'Закрытый тип с&nbsp;комбинированной крышей для курортов с&nbsp;ветровыми нагрузками.', '5200 × 2770 × 1620', 'resort closed'),
    ('region', 'Регион', 'Антивандальные ветрозащитные панели для оживлённых пригородных магистралей.', '4100 × 2400 × 1800', 'suburb'),
    ('closed', 'Закрытый', 'Широкие боковые панели и&nbsp;комбинированная крыша&nbsp;— защита от&nbsp;ветра и&nbsp;осадков.', '4140 × 2500 × 1600', 'closed'),
    ('closed-region', 'Закрытый Регион', 'Вариативные боковые панели: подъезжающий транспорт видно заранее.', '3700 × 2380 × 1500', 'closed suburb'),
    ('mgn', 'Закрытый для МГН', 'Для маломобильных групп: защита от&nbsp;непогоды и&nbsp;обслуживание средств мобильности.', '4140 × 2500 × 1600', 'closed'),
]

FILTERS = [('all', 'Все'), ('modular', 'Модульные'), ('city', 'Городские'), ('resort', 'Курортные'),
           ('suburb', 'Пригородные'), ('closed', 'Закрытые'), ('smart', 'SMART')]

TAG_NAMES = {'modular': 'Модульный', 'city': 'Городской', 'resort': 'Курортный', 'suburb': 'Пригородный',
             'closed': 'Закрытый', 'smart': 'SMART'}

# реальные фото с объектов есть не у всех моделей: показываем их на наведении вместо рендера
PHOTOS = {'elegant', 'elegant-p', 'standart', 'gallant', 'atlant', 'atlant-smart', 'city', 'city-smart', 'closed'}

def shelter_tile(m):
    slug, name, text, dims, tags = m
    # бейджи типа в углу картинки — у каждой модели, даже если тип совпадает с названием
    badges = ''.join(f'<span class="tile__count">{TAG_NAMES[t]}</span>' for t in tags.split())
    photo = (f'<img class="tile__photo" src="img/catalog/shelter-{slug}-photo.jpg" alt="" loading="lazy" width="960" height="720">'
             if slug in PHOTOS else '')
    # вся карточка кликабельна через ссылку в заголовке; кнопка «Подробнее» ведёт туда же.
    # пока готова только эталонная карточка «Атланта» — остальные модели открывают её как образец
    return f'''        <article class="tile tile--model" data-tags="{tags}">
          <div class="tile__media tile__media--render"><span class="tile__tags">{badges}</span><img src="img/catalog/shelter-{slug}.jpg" alt="Остановочный павильон «{name}»" loading="lazy" width="960" height="720">{photo}</div>
          <div class="tile__body">
            <h2 class="tile__title"><a class="tile__link" href="bus-shelter-atlant.html">{name}</a></h2>
            <p class="tile__text">{text}</p>
            <div class="tile__meta tile__foot">
              <p class="tile__dims"><span>Габариты</span>{dims} мм</p>
              <a class="btn btn--outline tile__calc" href="bus-shelter-atlant.html" tabindex="-1">Подробнее</a>
            </div>
          </div>
        </article>'''

def count(tag):
    return len(SHELTERS) if tag == 'all' else sum(tag in m[4].split() for m in SHELTERS)

chips = '\n'.join(
    f'        <button class="chip" type="button" data-filter="{t}" aria-pressed="{str(t == "all").lower()}">{n}<span class="chip__num">{count(t)}</span></button>'
    for t, n in FILTERS)

shelters_main = f'''
  <section class="section section--light page-top">
    <div class="container">
      {crumbs(('Главная', 'index.html'), ('Продукция', 'catalog.html'), ('Остановочные павильоны', None))}
      <div class="page-head">
        <div>
          <h1 class="h2 duo">
            <span>Остановочные</span>
            <span class="duo__second">павильоны</span>
          </h1>
        </div>
        <p class="page-head__text">Павильоны для ожидания общественного транспорта: от&nbsp;компактных модульных до&nbsp;закрытых и&nbsp;SMART. Размеры и&nbsp;комплектация адаптируются под ваш регион.</p>
      </div>
      <div class="filters" data-target="shelters" role="group" aria-label="Тип павильона">
{chips}
      </div>
      <div class="cards cards--models" id="shelters">
{chr(10).join(shelter_tile(m) for m in SHELTERS)}
      </div>
    </div>
  </section>
'''

page('bus-shelters.html', 'Остановочные павильоны — ФАВОР-ГАРАНТ',
     'Остановочные павильоны от производителя ФАВОР-ГАРАНТ: модульные, городские, курортные, закрытые и SMART. Производство в Санкт-Петербурге, доставка и монтаж по России.',
     shelters_main)

# ---------- Эталонная карточка «Атлант» ----------

ICON = {
    'roof': '<path d="M3 11c3-4 6-6 9-6s6 2 9 6"/><path d="M5 11v9M19 11v9M3 20h18"/>',
    'glass': '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7l-2 2M14 7l-5 5"/>',
    'bench': '<path d="M3 11h18M4 15h16M6 15v5M18 15v5M6 11V8M18 11V8"/>',
    'brand': '<circle cx="12" cy="10" r="5"/><path d="M9 14.5 8 21l4-2 4 2-1-6.5"/>',
    'size': '<path d="M3 7h18M3 17h18M7 3v4M17 3v4M7 17v4M17 17v4"/>',
    'swap': '<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="M10 9h4M12 7l2 2-2 2M14 15h-4M12 13l-2 2 2 2"/>',
}

def feature(icon, title, text, extra=''):
    return f'''          <div class="feature">
            <span class="feature__icon"><svg viewBox="0 0 24 24" aria-hidden="true">{ICON[icon]}</svg></span>
            <h3 class="feature__title">{title}</h3>
            <div class="feature__text">{text}{extra}</div>
          </div>'''

CONFIGS = [
    ('atlant-cfg-base', 'Атлант', 'Широкие боковые ветрозащитные панели и&nbsp;изогнутая крыша.', 'Стандартная'),
    ('atlant-cfg-light', 'С&nbsp;лайтпостером', 'Узкая боковая панель и&nbsp;лайтпостер ситиформата вместо широкой. Можно поставить несколько лайтпостеров.', 'Стандартная'),
    ('atlant-cfg-smart', 'С&nbsp;лайтпостером SMART', 'Лайтпостер с&nbsp;электронным табло прибытия транспорта.', 'SMART'),
    ('atlant-cfg-6m', 'Полузакрытый удлинённый 6&nbsp;м', 'Широкие боковые и&nbsp;фронтальные ветрозащитные панели.', 'Увеличенная'),
    ('atlant-cfg-10m', 'Полузакрытый удлинённый 10&nbsp;м', 'Боковые и&nbsp;фронтальные панели, лайтпостер и&nbsp;пилон.', 'Увеличенная'),
]

def cfg_tile(c):
    img, name, text, kind = c
    return f'''        <div class="tile">
          <div class="tile__media tile__media--render"><span class="tile__count">{kind}</span><img src="img/catalog/{img}.jpg" alt="Комплектация «{re.sub('&nbsp;', ' ', name)}»" loading="lazy" width="700" height="420"></div>
          <div class="tile__body">
            <h3 class="tile__title">{name}</h3>
            <p class="tile__text">{text}</p>
          </div>
        </div>'''

THUMBS = [
    ('img/catalog/atlant-cfg-base.jpg', 'Остановочный павильон «Атлант», стандартная комплектация', True),
    ('img/catalog/atlant-photo-1.jpg', '«Атлант» на объекте, вид спереди', False),
    ('img/catalog/atlant-photo-2.jpg', '«Атлант» на объекте, вид сбоку', False),
    ('img/catalog/atlant-photo-3.jpg', '«Атлант» с лайтпостером на объекте', False),
]
thumbs = '\n'.join(
    f'''            <button class="pgallery__thumb" type="button" data-full="{src}" aria-pressed="{str(i == 0).lower()}" aria-label="Фото {i + 1}"><img src="{src}" alt="{alt}" loading="lazy"></button>'''
    for i, (src, alt, r) in enumerate(THUMBS))

ARR = '<svg class="arr arr--%s" width="10" height="11" viewBox="0 0 13 14" aria-hidden="true"><path d="M.74.68l11 12M11.74 12.68V1.84M11.74 12.68H1.88" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

# чипы у фото: клик показывает рендер выбранной комплектации (картинки те же, что в блоке «Комплектации»)
CHIP_NAMES = {'atlant-cfg-base': 'Стандартная', 'atlant-cfg-light': 'С&nbsp;лайтпостером', 'atlant-cfg-smart': 'SMART',
              'atlant-cfg-6m': '6&nbsp;м', 'atlant-cfg-10m': '10&nbsp;м'}
cfg_chips = '\n'.join(
    f'              <button class="chip" type="button" data-full="img/catalog/{img}.jpg" aria-pressed="{str(n == 0).lower()}">{CHIP_NAMES[img]}</button>'
    for n, (img, *_) in enumerate(CONFIGS))

# SMART-компоненты: тексты со старой страницы «Элеганта» — оборудование общее для модульных павильонов
SMART_ICON = {
    'board': '<rect x="3" y="5" width="18" height="11" rx="1"/><path d="M7 9h4M7 12h7M16 9h1M9 20h6M12 16v4"/>',
    'light': '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z"/>',
    'wifi': '<path d="M2 9a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19" r="1"/>',
    'usb': '<path d="M12 21V7M12 3l-2.5 4h5zM12 16l-4-2.5V11M12 13l4-2.5V8"/><circle cx="8" cy="10" r="1.2"/><rect x="15" y="6.5" width="2" height="2"/>',
    'poster': '<rect x="6" y="2" width="12" height="17" rx="1"/><path d="M9 22h6M12 19v3M9 7h6M9 10h6M9 13h3"/>',
    'sos': '<circle cx="12" cy="12" r="9"/><path d="M8.5 10.5c0-1 .7-1.5 1.5-1.5s1.5.5 1.5 1.5-3 1-3 3h3M14 9v5h2M15.5 9v6"/>',
    'camera': '<path d="M3 7h12l3 3-3 3H3z"/><path d="M18 10h3M7 13v4M5 17h4"/>',
    'sign': '<rect x="3" y="6" width="18" height="8" rx="1"/><path d="M7 10h10M12 14v6M9 20h6"/>',
}
SMART_PARTS = [
    ('board', 'Электронное табло прибытия', 'Номера и&nbsp;время ожидания маршрутов городского транспорта'),
    ('light', 'Подсветка конструкции', 'Светодиодная подсветка павильона в&nbsp;тёмное время суток'),
    ('wifi', 'Wi-Fi маршрутизатор', 'Пассажиры подключаются к&nbsp;интернету во&nbsp;время ожидания'),
    ('usb', 'USB-зарядка', 'Для подзарядки телефонов, планшетов и&nbsp;других гаджетов'),
    ('poster', 'Лайтпостер сити-формат', 'Световой короб с&nbsp;подсветкой для информационного баннера'),
    ('sos', 'Кнопка экстренного вызова', 'Моментальный вызов единого номера экстренных служб 112'),
    ('camera', 'Камеры видеонаблюдения', 'Обзор пространства внутри павильона'),
    ('sign', 'Табличка с&nbsp;названием', 'Название остановки общественного транспорта с&nbsp;подсветкой'),
]
smart_parts = '\n'.join(
    f'''        <li class="smart-part">
          <span class="smart-part__icon"><svg viewBox="0 0 24 24" aria-hidden="true">{SMART_ICON[i]}</svg></span>
          <h3 class="smart-part__title">{t}</h3>
          <p class="smart-part__text">{d}</p>
        </li>'''
    for i, t, d in SMART_PARTS)

# Выполненный проект «Атланта» — подпись со старой страницы модели
PROJECT_PHOTOS = [
    ('img/catalog/atlant-photo-1.jpg', '«Атлант» на объекте, вид спереди'),
    ('img/catalog/atlant-photo-4.jpg', '«Атлант» у кирпичного здания'),
    ('img/catalog/atlant-photo-2.jpg', '«Атлант» на объекте, вид сбоку'),
    ('img/catalog/atlant-photo-3.jpg', '«Атлант» с лайтпостером на объекте'),
]
project_photos = '\n'.join(
    f'        <img src="{src}" alt="{alt}" loading="lazy">' for src, alt in PROJECT_PHOTOS)

others = [m for m in SHELTERS if m[0] in ('atlant-smart', 'elegant-p', 'compact', 'closed')]

atlant_main = f'''
  <section class="section section--light page-top page-top--tight">
    <div class="container">
      {crumbs(('Главная', 'index.html'), ('Продукция', 'catalog.html'), ('Остановочные павильоны', 'bus-shelters.html'), ('Атлант', None))}
      <div class="product">
        <div class="pgallery">
          <div class="pgallery__main">
            <img src="img/catalog/atlant-cfg-base.jpg" alt="Остановочный павильон «Атлант», стандартная комплектация" width="1120" height="840">
            <button class="pgallery__nav pgallery__nav--prev" type="button" aria-label="Предыдущее фото">{ARR % 'prev'}</button>
            <button class="pgallery__nav pgallery__nav--next" type="button" aria-label="Следующее фото">{ARR % 'next'}</button>
            <span class="pgallery__counter" aria-live="polite">1 / {len(THUMBS)}</span>
            <button class="pgallery__zoom" type="button" aria-label="Открыть фото на весь экран"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg></button>
          </div>
          <div class="pgallery__thumbs">
{thumbs}
          </div>
        </div>
        <div class="pinfo">
          <h1 class="h2 duo"><span>Атлант</span></h1>
          <p class="pinfo__lead">Модульный павильон с&nbsp;увеличенным просветом между каркасом и&nbsp;крышей&nbsp;— для информационной панели с&nbsp;названием остановки и&nbsp;маршрутами транспорта.</p>
          <div class="pinfo__configs">
            <p class="pinfo__label">Комплектация</p>
            <div class="filters filters--configs" role="group" aria-label="Комплектация">
{cfg_chips}
            </div>
          </div>
          <dl class="specs">
            <div><dt>Габариты, мм</dt><dd>4996 × 2730 × 1645</dd></div>
            <div><dt>Крыша</dt><dd>Изогнутая, монолитный или сотовый поликарбонат</dd></div>
            <div><dt>Ветрозащитные панели</dt><dd>Триплекс, калёное стекло 6&nbsp;или 8&nbsp;мм, сетка-ПВЛ</dd></div>
            <div><dt>Скамья</dt><dd>Деревянный брус с&nbsp;антисептической пропиткой</dd></div>
          </dl>
          <div class="pinfo__actions">
            <a class="btn btn--primary" href="#request-form">Рассчитать стоимость</a>
            <a class="link-arrow" href="index.html#services">Монтаж под ключ</a>
          </div>
          <ul class="trust">
            <li><span class="trust__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M4 21V11l5 3v-3l5 3v-3l5 3V4h2v17"/></svg></span>Производство в&nbsp;СПб</li>
            <li><span class="trust__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 6h11v10H2zM13 9h4l4 4v3h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg></span>Доставка и&nbsp;монтаж по&nbsp;РФ</li>
            <li><span class="trust__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.4 8-8 9-4.6-1-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg></span>Гарантия производителя</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="page-head">
        <div>
          <p class="eyebrow">Комплектации</p>
          <h2 class="h2 duo">
            <span>Подберите</span>
            <span class="duo__second">конфигурацию</span>
          </h2>
        </div>
        <p class="page-head__text">Стандартный вариант, увеличенная версия или модель с&nbsp;информационными панелями, цифровыми табло и&nbsp;USB-зарядками.</p>
      </div>
      <div class="cards">
{chr(10).join(cfg_tile(c) for c in CONFIGS)}
      </div>
    </div>
  </section>

  <section class="section section--dark">
    <div class="container warm">
      <div class="warm__media"><img src="img/catalog/atlant-cfg-6m.jpg" alt="Полузакрытый удлинённый «Атлант»" loading="lazy" width="1120" height="840"></div>
      <div class="warm__body">
        <h2 class="h2 duo duo--light">
          <span>Тёплый</span>
          <span class="duo__second">павильон</span>
        </h2>
        <p class="warm__lead">Фронтальные ветрозащитные панели формируют тепловой барьер: снижают продувание и&nbsp;сохраняют тепло в&nbsp;зоне ожидания.</p>
        <ul class="warm__grid">
          <li><span class="warm__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h10a3 3 0 1 0-3-3M3 12h15a3 3 0 1 1-3 3M3 16h7"/></svg></span>Защита от&nbsp;холода, ветра и&nbsp;осадков</li>
          <li><span class="warm__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/></svg></span>Адаптация под требования заказчика</li>
          <li><span class="warm__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5V5a2 2 0 1 1 4 0v8.5a4 4 0 1 1-4 0z"/><path d="M12 9v6"/></svg></span>Теплоизоляция и&nbsp;долговечность</li>
          <li><span class="warm__icon"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="10" height="10" rx="1"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/></svg></span>Готов к&nbsp;опциям и&nbsp;smart-технологиям</li>
        </ul>
        <a class="btn btn--light" href="#request-form">Рассчитать тёплый павильон</a>
      </div>
    </div>
  </section>

  <section class="section section--light">
    <div class="container">
      <div class="page-head">
        <div>
          <p class="eyebrow">Конструкция</p>
          <h2 class="h2 duo">
            <span>Материалы</span>
            <span class="duo__second">и&nbsp;оснащение</span>
          </h2>
        </div>
      </div>
      <div class="features">
{feature('roof', 'Крыша', 'Широкая изогнутая крыша из&nbsp;монолитного или сотового поликарбоната.')}
{feature('glass', 'Ветрозащитные панели', 'Триплекс, калёное стекло 6&nbsp;или 8&nbsp;мм или сетка-ПВЛ. Доступны широкие, узкие и&nbsp;комбинированные боковые панели.')}
{feature('bench', 'Скамья', 'Деревянный брус со&nbsp;специальной антисептической пропиткой. Возможны варианты из&nbsp;пластика, алюминия и&nbsp;других материалов.')}
{feature('brand', 'Герб или логотип', 'Наносим герб города или логотип компании на&nbsp;вертикальные панели.')}
{feature('size', 'Увеличенные версии', 'Полузакрытые удлинённые павильоны 6&nbsp;и&nbsp;10&nbsp;м с&nbsp;фронтальными панелями, лайтпостером и&nbsp;пилоном.')}
{feature('swap', 'Сменные панели', 'Боковые панели стандартного размера: их&nbsp;можно заменить лайтпостерами для рекламы или информации без изменения конструкции павильона.')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="page-head">
        <div>
          <p class="eyebrow">SMART-оснащение</p>
          <h2 class="h2 duo">
            <span>Умная</span>
            <span class="duo__second">остановка</span>
          </h2>
        </div>
        <p class="page-head__text">Умные модули встраиваются в&nbsp;базовую конструкцию: стандартный павильон превращается в&nbsp;комплекс с&nbsp;информированием, связью и&nbsp;мониторингом, совместимый со&nbsp;стратегией «Умного города».</p>
      </div>
      <ul class="smart-parts">
{smart_parts}
      </ul>
    </div>
  </section>

  <section class="section section--light">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="eyebrow">Выполненные проекты</p>
          <h2 class="h2 duo">
            <span>«Атлант»</span>
            <span class="duo__second">на&nbsp;объекте</span>
          </h2>
        </div>
        <div class="section-head__side section-head__side--slider">
          <p class="section-head__text">Павильон с&nbsp;изогнутой крышей из&nbsp;монолитного поликарбоната установлен на&nbsp;тротуаре для комфортного ожидания транспорта.</p>
          <div class="slider-nav" data-slider="project-track">
            <button class="slider-nav__btn" type="button" data-dir="-1" aria-label="Предыдущее фото">
              {ARR % 'prev'}
            </button>
            <button class="slider-nav__btn" type="button" data-dir="1" aria-label="Следующее фото">
              {ARR % 'next'}
            </button>
          </div>
        </div>
      </div>
      <div class="project-track" id="project-track">
{project_photos}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="page-head">
        <div>
          <p class="eyebrow">Остановочные павильоны</p>
          <h2 class="h2 duo duo--inline">
            <span>Другие</span>
            <span class="duo__second">модели</span>
          </h2>
        </div>
        <a class="btn btn--outline" href="bus-shelters.html">Все павильоны</a>
      </div>
      <div class="cards cards--4 cards--models">
{chr(10).join(shelter_tile(m) for m in others)}
      </div>
    </div>
  </section>
'''

page('bus-shelter-atlant.html', 'Остановочный павильон «Атлант» — ФАВОР-ГАРАНТ',
     'Остановочный павильон «Атлант» от производителя ФАВОР-ГАРАНТ: модульная конструкция с увеличенным просветом для информационной панели, комплектации стандарт, SMART и удлинённые 6 и 10 м.',
     atlant_main)
