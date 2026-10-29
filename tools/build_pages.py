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
            <h2 class="tile__title tile__title--arrow">{name}</h2>
            <p class="tile__text">{text}</p>
            <p class="tile__meta">{meta}</p>
          </div>
        </a>'''

parts_tile = '''        <a class="tile tile--parts" href="index.html#catalog">
          <div class="tile__art"><span class="tile__count">Магазин</span><svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 6l15.6 9v18L24 42 8.4 33V15z"/><circle cx="24" cy="24" r="7"/></svg></div>
          <div class="tile__body">
            <h2 class="tile__title tile__title--arrow">Комплектующие</h2>
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

def shelter_tile(m):
    slug, name, text, dims, tags = m
    # бейджи типа в углу картинки; тип, совпадающий с названием модели, не дублируем
    badges = ''.join(f'<span class="tile__count">{TAG_NAMES[t]}</span>' for t in tags.split() if TAG_NAMES[t] not in name)
    # пока готова только эталонная карточка «Атланта» — остальные модели открывают её как образец
    return f'''        <a class="tile" href="bus-shelter-atlant.html" data-tags="{tags}">
          <div class="tile__media tile__media--render"><span class="tile__tags">{badges}</span><img src="img/catalog/shelter-{slug}.jpg" alt="Остановочный павильон «{name}»" loading="lazy" width="960" height="720"></div>
          <div class="tile__body">
            <h2 class="tile__title tile__title--arrow">{name}</h2>
            <p class="tile__text">{text}</p>
            <p class="tile__meta tile__dims"><span>Габариты</span>{dims} мм</p>
          </div>
        </a>'''

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
    'smart': '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/><path d="M10 8a3 3 0 0 1 4 0M8.5 6.5a5 5 0 0 1 7 0"/>',
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
    ('img/catalog/atlant-render.jpg', 'Остановочный павильон «Атлант»', True),
    ('img/catalog/atlant-photo-1.jpg', '«Атлант» на объекте, вид спереди', False),
    ('img/catalog/atlant-photo-2.jpg', '«Атлант» на объекте, вид сбоку', False),
    ('img/catalog/atlant-photo-3.jpg', '«Атлант» с лайтпостером на объекте', False),
]
thumbs = '\n'.join(
    f'''            <button class="pgallery__thumb" type="button" data-full="{src}"{' data-render' if r else ''} aria-pressed="{str(i == 0).lower()}" aria-label="Фото {i + 1}"><img src="{src}" alt="{alt}" loading="lazy"></button>'''
    for i, (src, alt, r) in enumerate(THUMBS))

others = [m for m in SHELTERS if m[0] in ('atlant-smart', 'elegant-p', 'compact', 'closed')]

atlant_main = f'''
  <section class="section section--light page-top page-top--tight">
    <div class="container">
      {crumbs(('Главная', 'index.html'), ('Продукция', 'catalog.html'), ('Остановочные павильоны', 'bus-shelters.html'), ('Атлант', None))}
      <div class="product">
        <div class="pgallery">
          <div class="pgallery__main"><img class="is-render" src="img/catalog/atlant-render.jpg" alt="Остановочный павильон «Атлант»" width="1400" height="1050"></div>
          <div class="pgallery__thumbs">
{thumbs}
          </div>
        </div>
        <div class="pinfo">
          <div>
            <p class="eyebrow">Остановочный павильон</p>
            <h1 class="h2 duo"><span>Атлант</span></h1>
          </div>
          <p class="pinfo__lead">Модульный остановочный павильон с&nbsp;интегрированной информационной системой.</p>
          <p class="pinfo__text">Увеличенный просвет между несущей конструкцией и&nbsp;крышей позволяет разместить декоративные или информационные панели с&nbsp;названием остановки и&nbsp;маршрутами общественного транспорта.</p>
          <dl class="specs">
            <div><dt>Габариты, мм</dt><dd>4996 × 2730 × 1645</dd></div>
            <div><dt>Крыша</dt><dd>Изогнутая, монолитный или сотовый поликарбонат</dd></div>
            <div><dt>Ветрозащитные панели</dt><dd>Триплекс, калёное стекло 6&nbsp;или 8&nbsp;мм, сетка-ПВЛ</dd></div>
            <div><dt>Скамья</dt><dd>Деревянный брус с&nbsp;антисептической пропиткой</dd></div>
            <div><dt>Комплектации</dt><dd>Стандартная, SMART, удлинённая 6&nbsp;и&nbsp;10&nbsp;м</dd></div>
          </dl>
          <div class="pinfo__actions">
            <a class="btn btn--primary" href="#request-form">Рассчитать стоимость</a>
            <a class="link-arrow" href="index.html#services">Монтаж под ключ</a>
          </div>
          <p class="pinfo__note">Цена рассчитывается индивидуально: зависит от&nbsp;комплектации, тиража и&nbsp;адреса доставки.</p>
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
{feature('smart', 'SMART-оборудование', 'Конструкция оптимизирована для подключения:', '<ul class="smart-list"><li>Светодиодная подсветка</li><li>Электронное табло</li><li>Видеонаблюдение</li><li>Wi-Fi</li><li>USB</li><li>Кнопка вызова 112</li></ul>')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <div class="page-head">
        <div>
          <p class="eyebrow">Остановочные павильоны</p>
          <h2 class="h2 duo">
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
