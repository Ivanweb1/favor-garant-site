# Собирает страницы новостей ФАВОР-ГАРАНТ: site/news-*.html.
# Также собирает ленту на site/news.html (тип, рубрики, год, пагинация).
# Шапка, заявка и подвал берутся из site/news.html, тексты статей — со старого сайта (favor-garant.ru/tpost/...).
# Фото из статей один раз скачиваются в site/img/news/ (если файла ещё нет).
# Запуск: python tools/build_news.py
import re
import time
import urllib.request
from pathlib import Path

SITE = Path(__file__).resolve().parent.parent / 'site'
IMG = SITE / 'img' / 'news'
CDN = 'https://static.tildacdn.com/'

# slug, дата, заголовок, обложка (уже лежит в img/news), alt обложки, тело статьи (HTML со старого сайта)
ARTICLES = [
    ('rnp', '21.08.2026', 'ООО «ФАВОР-ГАРАНТ» внесено в Реестр надёжных партнёров (РНП)', '52-news-rnp',
     'Свидетельство о внесении ООО «ФАВОР-ГАРАНТ» в Реестр надёжных партнёров', '''
<h2>Мы — в Реестре надёжных партнёров ТПП РФ!</h2>
<p>Уважаемые коллеги, партнёры и клиенты!</p>
<p>С гордостью сообщаем вам важную новость: <strong>Общество с ограниченной ответственностью «ФАВОР-ГАРАНТ» официально внесено в Реестр надёжных партнёров Торгово-промышленной палаты Российской Федерации.</strong></p>
<h2>Что это за статус?</h2>
<p>Реестр надёжных партнёров (РНП) — это единый общероссийский автоматизированный банк данных юридических лиц и индивидуальных предпринимателей, финансовое и экономическое положение которых свидетельствует об их надёжности как партнёров для предпринимательской деятельности в Российской Федерации и за рубежом. Реестр ведётся Торгово-промышленной палатой РФ и территориальными ТПП в электронном виде на официальном сайте <a href="https://reestr.tpprf.ru/registry/8799393/" target="_blank" rel="noopener">по ссылке</a>.</p>
<p>Включение в Реестр — это не просто формальность, а <strong>официальное признание деловой репутации и финансовой устойчивости компании</strong>. Сведения о нас размещены в открытом доступе, и любой контрагент может убедиться в нашей добросовестности.</p>
[[tild3766-3663-4662-a664-313462366361/__NP-SPB-246__240720.jpg|56-news-rnp-certificate|Свидетельство о внесении в Реестр надёжных партнёров ТПП РФ]]
<h2>Почему это важно для вас?</h2>
<p>Статус надёжного партнёра подтверждает, что:</p>
<ul>
<li><strong>Мы — проверенная компания.</strong> Наше финансовое и экономическое положение прошло оценку Торгово-промышленной палаты РФ.</li>
<li><strong>Мы — открыты для сотрудничества.</strong> Информация о нас доступна в публичном реестре, что упрощает процедуру проверки при заключении договоров.</li>
<li><strong>Мы — ответственный партнёр.</strong> ООО «ФАВОР-ГАРАНТ» не входит в реестр недобросовестных поставщиков, в составе исполнительных органов нет дисквалифицированных лиц, а по итогам проверок нарушения не выявлялись.</li>
</ul>
<h2>Наши обязательства</h2>
<p>Получение статуса надёжного партнёра — это не финиш, а новый старт. Мы подтверждаем свою приверженность высоким стандартам ведения бизнеса и качеству предоставляемых услуг. Мы ценим доверие наших клиентов и партнёров и продолжим работать с максимальной ответственностью.</p>
<p>Благодарим всех, кто был с нами на этом пути. Впереди — новые достижения и совместные проекты!</p>
<p class="article__sign">С уважением,<br><strong>ООО «ФАВОР-ГАРАНТ»</strong></p>
'''),
    ('award', '13.07.2026', 'Признание экспертов и новые горизонты: «ФАВОР-ГАРАНТ» удостоена награды и расширяет производство', '53-news-award',
     'Команда «ФАВОР-ГАРАНТ» с благодарственным письмом', '''
<p>Визит генерального директора Регионального центра компетенций (РЦК) Ирины Голубцовой на производственную площадку «ФАВОР-ГАРАНТ» ознаменовался важным событием — компания получила высокую оценку за результаты внедрения инструментов бережливого производства. Итоги адресной поддержки в рамках <a href="https://rckspb.ru/" target="_blank" rel="noopener">национального проекта «Производительность труда»</a> были признаны показательными для отрасли.</p>
[[tild3263-6238-4034-b961-333864376533/_.jpg|57-news-award-visit|Визит руководства РЦК на производство «ФАВОР-ГАРАНТ»]]
<p>За профессионализм и высокую вовлечённость коллектива руководство РЦК вручило команде «ФАВОР-ГАРАНТ» благодарственное письмо. За время совместной работы сотрудники предприятия не только прошли профильное обучение и освоили современные методики оптимизации, но и подготовили внутренних тренеров, которые будут транслировать полученный опыт на все производственные линии.</p>
<p>«Производительность — это не случайность, а закономерный итог постоянного развития», — прокомментировал успех начальник производства Сергей Дьяконов. В ближайших планах компании — масштабирование успешных практик на весь технологический цикл. Эксперты РЦК, в свою очередь, подтвердили готовность сопровождать предприятие на следующих этапах реализации нацпроекта.</p>
<h2>Новые возможности для городской среды</h2>
<p>В «ФАВОР-ГАРАНТ» модернизирована производственная линия, обновлён парк металлообрабатывающих станков и оптимизированы технологические процессы. Это позволило расширить ассортимент: компания начала выпуск малых архитектурных форм (МАФ) — современных скамей, урн, велопарковок, элементов уличных площадок, а также декоративных ограждений. Обновлённое оборудование обеспечивает высокую точность обработки крупных металлоконструкций и стабильность серийных партий.</p>
[[tild3030-6130-4537-b538-636335623263/photo.jpg|58-news-award-production|Производственная площадка «ФАВОР-ГАРАНТ»]]
'''),
    ('temirkanov', '08.05.2026', 'Великий дирижёр на карте города: площадь имени Юрия Темирканова появилась в Петербурге', '54-news-temirkanov',
     'Площадь имени Юрия Темирканова в Петербурге', '''
<p>Санкт-Петербург продолжает сохранять имена своих легенд. Теперь в исторической части города, где переплелись театральные и музыкальные традиции, появилась площадь, названная в честь Юрия Темирканова — маэстро, чьё имя навсегда вписано в мировую культуру.</p>
<p>«Для петербуржцев Юрий Темирканов — пример служения искусству и родному городу. 2026 год объявлен Годом петербургской культуры, и сегодня мы делаем ещё один шаг, чтобы передать память о великом маэстро следующим поколениям», — отметил губернатор Александр Беглов.</p>
<p>Мы гордимся, что внесли свой вклад в это знаковое событие. Силами нашей компании был изготовлен и установлен информационный стенд с табличкой для новой площади. Надёжные металлоконструкции, точность исполнения и уважение к деталям — именно так мы поддерживаем проекты, важные для города и его жителей.</p>
<p>Качество, которое остаётся в веках — такая же, как память о великих современниках.</p>
<p>Следите за обновлением городского пространства вместе с нами.</p>
'''),
    ('maf-park', '15.11.2024', 'Проекты благоустройства: организация пространства в парке с помощью МАФ', '55-news-maf-park',
     'Малые архитектурные формы в парке', '''
<p class="article__lead">Современные города всё больше стремятся к созданию комфортной и эстетически привлекательной городской среды. Элементы малых архитектурных форм (МАФ) не только функциональны, но и способны значительно изменить восприятие городского пространства.</p>
<p>Малые архитектурные формы играют важную роль в проектировании парков, превращая дикие зелёные зоны в организованные места, где хочется проводить время.</p>
<p>МАФы делают парк более удобным для посетителей, обеспечивая необходимую инфраструктуру для отдыха и развлечений.</p>
[[tild3734-3562-4637-a133-376564613862/_-3.jpg|59-news-maf-park-1|Малые архитектурные формы в парке]]
<p><strong>Навигация</strong> — важный аспект организации паркового пространства. Умело интегрированные указатели помогают легко находить нужные объекты: будь то детская площадка или выход из парка. Использование указателей в едином дизайне создаёт фирменный стиль парка, подчёркивая его уникальность и поддерживая визуальную гармонию.</p>
[[tild3661-6436-4162-b636-343138643765/_-2.jpg|60-news-maf-park-2|Навигационные указатели в парке]]
<p><strong>Дизайнерские стелы</strong> — это ещё один способ сделать парк более привлекательным. Стелы могут нести историческую или культурную информацию о месте, тем самым обогащая опыт посещения. Помимо своей практической функции, стелы становятся арт-объектами.</p>
[[tild3932-6335-4338-b966-326662376265/_-1.jpg|61-news-maf-park-3|Дизайнерская стела в парке]]
<p class="article__note">МАФы играют незаменимую роль в организации пространства парков, делая их более удобными, интересными и привлекательными для всех категорий населения. Это пример того, как даже небольшие архитектурные решения могут существенно повлиять на качество городской жизни.</p>
'''),
]

# анонсы карточек — со старой ленты /news (у статьи о площади Темирканова анонса нет)
DESCR = {
    'rnp': 'С&nbsp;гордостью сообщаем вам важную новость: Общество с&nbsp;ограниченной ответственностью «ФАВОР-ГАРАНТ» официально внесено в&nbsp;Реестр надёжных партнёров Торгово-промышленной палаты Российской Федерации.',
    'award': 'За&nbsp;профессионализм и&nbsp;высокую вовлечённость коллектива руководство РЦК вручило команде «ФАВОР-ГАРАНТ» благодарственное письмо.',
    'temirkanov': '',
    'maf-park': 'Элементы малых архитектурных форм (МАФ) не&nbsp;только функциональны, но&nbsp;и&nbsp;способны значительно изменить восприятие городского пространства.',
}

# Тип (новость или статья блога) и рубрики — наша разметка по содержанию статей, у старого сайта их не было.
TYPES = {'news': 'Новости', 'blog': 'Блог'}
TAGS = {  # ключ для адреса news.html?tag=... → название рубрики
    'company': 'О компании',
    'production': 'Производство',
    'blagoustroystvo': 'Благоустройство',
    'navigation': 'Навигация',
    'maf': 'МАФ',
    'spb': 'Санкт-Петербург',
}
META = {
    'rnp': ('news', ['company']),
    'award': ('news', ['company', 'production']),
    'temirkanov': ('news', ['blagoustroystvo', 'navigation', 'spb']),
    'maf-park': ('blog', ['blagoustroystvo', 'maf', 'navigation']),
}
# «По теме»: куда ведёт статья внутри сайта
RELATED = {
    'rnp': [('О компании', 'about.html'), ('Сертификаты и лицензии', 'certificates.html'), ('Контакты и документы', 'contacts.html#documents')],
    'award': [('Станочный парк', 'services.html#equipment'), ('О компании', 'about.html'), ('Сертификаты и лицензии', 'certificates.html')],
    'temirkanov': [('Наши работы', 'portfolio.html'), ('Навигация в каталоге', 'catalog.html'), ('Металлообработка', 'services.html#equipment')],
    'maf-park': [('Малые архитектурные формы', 'catalog.html'), ('Наши работы', 'portfolio.html'), ('Дизайн-бюро', 'services.html#design')],
}
CLOCK = '<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.25"/><path d="M8 4.5V8l2.5 1.5"/></svg>'


def read_min(body):
    """Время чтения: слова статьи / 180 в минуту, не меньше 1."""
    words = len(re.sub(r'<[^>]+>|\[\[[^\]]+\]\]', ' ', body).split())
    return max(1, round(words / 180))


NBSP_WORDS = re.compile(r'(?<=[\s>(«—])([а-яА-ЯёЁ]{1,2}|[А-Я]{2,3}) (?=[^\s<])')


def nbsp(text):
    """Неразрывный пробел после коротких слов — как в остальных текстах сайта (только в тексте, не в тегах)."""
    parts = re.split(r'(<[^>]+>)', text)
    return ''.join(p if p.startswith('<') else NBSP_WORDS.sub(r'\1&nbsp;', ' ' + p)[1:] for p in parts)


def fetch(src, name):
    """Скачивает фото статьи в img/news/<name>.jpg (ширина до 1600), если его ещё нет. Возвращает (ширина, высота)."""
    from PIL import Image
    out = IMG / f'{name}.jpg'
    if not out.exists():
        req = urllib.request.Request(CDN + src, headers={'User-Agent': 'Mozilla/5.0'})
        tmp = IMG / f'{name}.tmp'
        tmp.write_bytes(urllib.request.urlopen(req, timeout=60).read())
        im = Image.open(tmp).convert('RGB')
        if im.width > 1600:
            im = im.resize((1600, round(im.height * 1600 / im.width)), Image.LANCZOS)
        im.save(out, quality=84)
        tmp.unlink()
        time.sleep(1)
    with Image.open(out) as im:
        return im.size


def figures(body):
    def repl(m):
        src, name, alt = m.group(1).split('|')
        w, h = fetch(src, name)
        return f'<figure class="article__figure"><img src="img/news/{name}.jpg" alt="{alt}" loading="lazy" width="{w}" height="{h}"></figure>'
    return re.sub(r'\[\[([^\]]+)\]\]', repl, body)


def card(slug, date, title, cover, alt, body, text=True):
    d, m, y = date.split('.')
    kind, tags = META[slug]
    t = f'\n            <p class="news__text">{DESCR[slug]}</p>' if text and DESCR[slug] else ''
    labels = ''.join(f'<li>{TAGS[k]}</li>' for k in tags)
    return f'''        <a class="news__card" href="news-{slug}.html" data-type="{kind}" data-tags="{' '.join(tags)}" data-year="{y}">
          <div class="news__media"><img src="img/news/{cover}.jpg" alt="{alt}" loading="lazy" width="1200" height="930"></div>
          <div class="news__body">
            <p class="news__meta"><span class="news__kind news__kind--{kind}">{TYPES[kind]}</span><time class="news__tag" datetime="{y}-{m}-{d}">{date}</time></p>
            <h3 class="news__title">{nbsp(title)}</h3>{t}
            <ul class="news__tags">{labels}</ul>
            <div class="news__foot">
              <span class="link-arrow">Читать</span>
              <span class="news__time">{CLOCK}{read_min(body)}&nbsp;мин чтения</span>
            </div>
          </div>
        </a>'''


def chip(group, key, label, count, pressed=False):
    return f'<button class="chip" type="button" data-{group}="{key}" aria-pressed="{str(pressed).lower()}">{label}<span class="chip__num">{count}</span></button>'


shell = (SITE / 'news.html').read_text(encoding='utf-8')
head = shell[:shell.index('<main>') + len('<main>\n')]
tail = shell[shell.index('  <!-- 8. Заявка -->'):]

for i, (slug, date, title, cover, alt, body) in enumerate(ARTICLES):
    d, m, y = date.split('.')
    kind, tags = META[slug]
    first = re.sub(r'<[^>]+>', '', re.search(r'<p[^>]*>(.*?)</p>', body, re.S).group(1))
    desc = (first[:157] + '…') if len(first) > 160 else first
    page_head = re.sub(r'<title>[^<]*</title>', f'<title>{title} — ФАВОР-ГАРАНТ</title>', head)
    page_head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', page_head)
    page_head = page_head.replace('href="news.html" aria-current="page">Новости<', 'href="news.html">Новости<')
    # «Читайте также»: сначала статьи с общими рубриками, потом остальные по дате
    others = sorted((a for a in ARTICLES if a[0] != slug), key=lambda a: -len(set(META[a[0]][1]) & set(tags)))
    others = '\n'.join(card(*a, text=False) for a in others[:3])
    related = ''.join(f'<li><a class="link-arrow" href="{h}">{n}</a></li>' for n, h in RELATED[slug])
    # соседние статьи по дате: ARTICLES идут от новых к старым
    newer = ARTICLES[i - 1] if i > 0 else None
    older = ARTICLES[i + 1] if i + 1 < len(ARTICLES) else None
    pager = ''
    if older:
        pager += f'<a class="article-nav__link article-nav__link--prev" href="news-{older[0]}.html"><span>Предыдущая</span>{nbsp(older[2])}</a>'
    if newer:
        pager += f'<a class="article-nav__link article-nav__link--next" href="news-{newer[0]}.html"><span>Следующая</span>{nbsp(newer[2])}</a>'
    main = f'''  <!-- Статья: текст и фото со старой страницы новости, собрано tools/build_news.py — правки вносить в скрипт -->
  <section class="section page-top">
    <div class="container">
      <ol class="crumbs" aria-label="Навигация по сайту"><li><a href="index.html">Главная</a></li><li><a href="news.html">Новости и&nbsp;блог</a></li><li><a href="news.html?type={kind}">{TYPES[kind]}</a></li><li><span aria-current="page">{nbsp(title)}</span></li></ol>
      <article class="article">
        <header class="article__head">
          <p class="news__meta"><a class="news__kind news__kind--{kind}" href="news.html?type={kind}">{TYPES[kind]}</a><time class="article__date" datetime="{y}-{m}-{d}">{date}</time><span class="news__time">{CLOCK}{read_min(body)}&nbsp;мин чтения</span></p>
          <h1 class="article__title">{nbsp(title)}</h1>
        </header>
        <figure class="article__cover"><img src="img/news/{cover}.jpg" alt="{alt}" width="1200" height="930"></figure>
        <div class="article__body">
{nbsp(figures(body)).strip()}
        </div>
        <aside class="article__related" aria-label="По теме">
          <p class="article__related-title">По теме</p>
          <ul>{related}</ul>
        </aside>
        <nav class="article-nav" aria-label="Соседние статьи">{pager}</nav>
      </article>
    </div>
  </section>

  <!-- Читайте также: статьи с общими рубриками -->
  <section class="section section--light">
    <div class="container">
      <div class="section-head">
        <h2 class="h2 duo duo--inline duo--one-line">
          <span>Читайте</span>
          <span class="duo__second">также</span>
        </h2>
        <a class="btn btn--outline section-head__link others__all" href="news.html">Все новости и&nbsp;статьи</a>
      </div>
      <div class="news news--feed news--three">
{others}
      </div>
      <a class="btn btn--outline btn--block others__all-bottom" href="news.html">Все новости и&nbsp;статьи</a>
    </div>
  </section>

'''
    # заявка на светлом фоне сразу после светлого «Читайте также» — переводим её на белый
    page_tail = tail.replace('<section class="section section--light" id="request">', '<section class="section" id="request">', 1)
    (SITE / f'news-{slug}.html').write_text(page_head + '\n' + main + page_tail, encoding='utf-8', newline='')
    print('ok', f'news-{slug}.html')

# ---------- страница «Новости и блог»: тип, рубрики, архив по годам, пагинация ----------
years = sorted({a[1].split('.')[2] for a in ARTICLES}, reverse=True)
types = chip('type', 'all', 'Все', len(ARTICLES), True) + ''.join(
    chip('type', k, n, sum(META[a[0]][0] == k for a in ARTICLES)) for k, n in TYPES.items())
tags = chip('tag', 'all', 'Все рубрики', len(ARTICLES), True) + ''.join(
    chip('tag', k, n, sum(k in META[a[0]][1] for a in ARTICLES)) for k, n in TAGS.items())
year_opts = '<option value="all">Все годы</option>' + ''.join(
    f'<option value="{y}">{y} ({sum(a[1].endswith(y) for a in ARTICLES)})</option>' for y in years)
cards = '\n'.join(card(*a) for a in ARTICLES)
top = f'''  <!-- 1. Новости и блог: четыре статьи со старой страницы /news; страницы статей и эту ленту собирает tools/build_news.py.
       Фильтры (тип, рубрика, год) и страница пишутся в адрес: news.html?type=blog&tag=maf&year=2024&page=2 -->
  <section class="section page-top">
    <div class="container">
      <ol class="crumbs" aria-label="Навигация по сайту"><li><a href="index.html">Главная</a></li><li><span aria-current="page">Новости и&nbsp;блог</span></li></ol>
      <div class="page-head">
        <div>
          <h1 class="h2 duo duo--inline">
            <span>Новости</span>
            <span class="duo__second">и&nbsp;блог</span>
          </h1>
        </div>
        <p class="page-head__text">События компании, выполненные проекты и&nbsp;статьи о&nbsp;благоустройстве городской среды.</p>
      </div>
      <div class="feed" data-feed data-per-page="9">
        <div class="feed__bar">
          <div class="feed__types" role="group" aria-label="Тип материала">{types}</div>
          <div class="feed__year">
            <svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="4" width="15" height="13" rx="2"/><path d="M2.5 8h15M6.5 2v4M13.5 2v4"/></svg>
            <select class="feed__select" name="year" data-year aria-label="Архив по годам">{year_opts}</select>
          </div>
        </div>
        <div class="filters feed__tags" role="group" aria-label="Рубрики">{tags}</div>
        <div class="news news--feed" data-feed-list>
{cards}
        </div>
        <p class="feed__empty" hidden>По&nbsp;выбранным условиям материалов нет. <button class="link-arrow" type="button" data-feed-reset>Сбросить фильтры</button></p>
        <nav class="pager" aria-label="Страницы ленты" data-feed-pager></nav>
      </div>
    </div>
  </section>

'''
news = (SITE / 'news.html').read_text(encoding='utf-8')
start = news.index('  <!-- 1. Новости')
end = news.index('  <!-- 8. Заявка -->')
news = news[:start] + top + news[end:]
news = re.sub(r'<title>[^<]*</title>', '<title>Новости и блог — ФАВОР-ГАРАНТ</title>', news)
(SITE / 'news.html').write_text(news, encoding='utf-8', newline='')
print('ok news.html')
