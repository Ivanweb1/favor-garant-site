# Фото для главной: исходники и промпты

Исходники взяты с текущего сайта и лежат в `photos/source/`. Обзор всех исходников — [overview.jpg](overview.jpg).
Все 741 картинку старого сайта в оригинале я сохранил локально в `current-site/images/` (в git не идут). Список с адресами — `current-site/images/urls.txt`.

## Как пользоваться

1. Загрузить в генератор фото из `photos/source/` и вставить промпт под ним целиком.
2. Пропорции выставить в настройках генератора. Они продублированы первой строкой промпта.
3. Готовый файл положить в `photos/ai/` под тем же именем.

Промпты на английском: генераторы точнее его понимают. Кириллицу генератору не доверяем: где на конструкции есть русские буквы, после генерации сверяем их с оригиналом. Если буквы поплыли, вставляем этот кусок из исходника.

Общие правила, которые уже зашиты в каждый промпт:
- конструкция остаётся той же: форма, пропорции, цвет, детали;
- конструкция выглядит новой: стекло чистое, покраска свежая, нет наклеек и грязи;
- водяные знаки FG убираем — при необходимости водяной знак наложим на сайте сами (брендбук, п. 10);
- реклама на поверхностях заменяется спокойной абстракцией в синем #2A2560 и светло-сером, без текста;
- реалистичное фото без ощущения рендера, конец лета, мягкий дневной свет.

---

## 1. Первый экран

Кадр: фото во всю ширину под заголовком, как в AXION. На десктопе 1440×640 (9:4), на мобильном обрезка до 4:5 по центру. Текст поверх фото не кладём.

### 01-hero-pavilion — основной вариант
Исходник: `source/01-hero-pavilion.jpg` (павильон «Городской», страница bus-shelter-city).

```
Aspect ratio 16:9.
Edit the attached photo. Keep the bus shelter exactly as it is: same design, shape, proportions, dark grey frame, clear glass roof and walls, wooden bench — do not redesign or add parts. Make it look brand-new: spotless glass, fresh even paint, no dirt, stickers or scratches. Remove all diagonal watermark logos. No text, letters or logos anywhere.
Composition: wide eye-level view of the shelter standing on a clean, calm city sidewalk in St Petersburg. The shelter is in the center and fully visible, about 45% of the frame width, with free space around it. Keep the trimmed hedge, fir trees and historic red-brick buildings behind it, tidy and slightly out of focus. The top 20% of the frame is calm sky or soft treetops and the bottom 15% is clean grey paving with nothing important — these strips will be cropped. Everything important stays inside the central 60% of the width.
Light: late-summer morning, soft sun from the side, gentle long shadows. No people, no cars, no trash bins.
Style: photorealistic architectural photography, not CGI, true-to-life colors with a slightly cool neutral grade, sharp detail, straight vertical lines, 35 mm lens.
```

### 02-hero-alt-evening — запасной, вечерний
Исходник: `source/02-hero-alt-evening.jpg` (сейчас это рендер на главной). Подходит, если захочется более дорогого настроения.

```
Aspect ratio 16:9.
Edit the attached image and turn it into a real evening photograph, not a 3D render. Keep both bus shelters and the information stand exactly as they are: same design, proportions, light grey frames, glass, lit panels — do not redesign them. No readable text: the map and timetable panels show soft, unreadable graphics; remove the bus-stop sign letters.
Composition: the main shelter on the left-center, fully visible, about 40% of the frame width; the historic St Petersburg street recedes into the background. The top 20% is calm dusk sky and building tops, the bottom 15% is clean stone paving — these strips will be cropped. Everything important stays inside the central 60% of the width.
Light: blue hour right after sunset, warm light inside the shelter and shop windows, wet-looking but dry paving with soft reflections. No people, no cars.
Style: photorealistic, true-to-life colors, sharp detail, straight vertical lines, 35 mm lens.
```

---

## 2. Каталог продукции — 8 карточек

Кадр: фото сверху, название на белом под фото, текст на фото не ложится. Карточка «Остановочные павильоны» большая, 1:1. Остальные 4:3. На мобильном все карточки 4:3, поэтому у квадрата верх и низ по 12% должны быть спокойными.

### 10-cat-pavilions — Остановочные павильоны (1:1)
Исходник: `source/10-cat-pavilions.jpg` (закрытый павильон).

```
Aspect ratio 1:1.
Edit the attached photo. Keep the bus shelter exactly as it is: same design, proportions, dark grey frame, glass walls, roof, bench and the yellow safety stripe on the glass — do not redesign or add parts. Make it look brand-new: spotless glass, fresh paint, no dirt or stickers. Remove all diagonal watermark logos. Replace the posters inside the shelter with a calm abstract graphic in deep navy #2A2560 and light grey, no text. Remove the trash bins.
Composition: three-quarter eye-level view, the shelter in the center, about 70% of the frame width, fully visible. Green park trees behind, clean light paving in front. The top and bottom 12% contain only sky/trees and paving — they will be cropped on mobile.
Light: late-summer day, soft sun. No people.
Style: photorealistic architectural photography, not CGI, natural colors with a slightly cool neutral grade, sharp, straight verticals, 35 mm lens.
```

### 11-cat-tumby — Рекламные тумбы (4:3)
Исходник: `source/11-cat-tumby.jpg`.

```
Aspect ratio 4:3.
Edit the attached photo. Keep the round advertising column exactly as it is: same shape, dark dome top, proportions and base — do not redesign it. Make it look brand-new, clean paint. Replace the poster on the column with a calm abstract graphic in deep navy #2A2560 and light grey, no text. Remove the large "FAVOR GARANT" watermark text and all other watermarks. Replace the banners on the building with plain neutral panels without text.
Composition: the column slightly right of center, about 55% of the frame height, fully visible, with the historic arcaded facade behind it, softly out of focus. Keep 10% of calm space on all sides.
Light: late-summer day, soft sun. Only two or three distant pedestrians, motion-blurred.
Style: photorealistic street photography, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 12-cat-lightposters — Лайтпостеры (4:3)
Исходник: `source/12-cat-lightposters.jpg` (вертикальный — нужно дорисовать по бокам).

```
Aspect ratio 4:3.
Extend the attached photo to the left and right so it becomes horizontal, continuing the red historic facade, the steps and the stone paving naturally. Keep the freestanding lightposter exactly as it is: same frame, proportions and base — do not redesign it. Make it look brand-new. Replace the poster with a calm abstract graphic in deep navy #2A2560 and light grey, no text. Remove all watermarks. No text or logos anywhere.
Composition: the lightposter slightly left of center, about 60% of the frame height, fully visible, with 10% of calm space on all sides.
Light: soft overcast daylight. No people.
Style: photorealistic street photography, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 13-cat-billboards — Рекламные щиты (4:3)
Исходник: `source/13-cat-billboards.jpg`.

```
Aspect ratio 4:3.
Edit the attached photo. Keep the billboard exactly as it is: same single pole, frame, proportions and lamps — do not redesign it. Make it look brand-new, clean metal. Replace the advertisement with a calm abstract graphic in deep navy #2A2560 and light grey, no text. Remove all diagonal watermark logos. No text or logos anywhere.
Composition: the billboard fully in frame, upper half of the image, slightly left of center, with clear blue sky above it; trees and residential buildings below and behind, tidy. Keep 10% of calm space on all sides.
Light: late-summer day, clear sky. No people.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp.
```

### 14-cat-shooting — Оборудование для стрельбищ (4:3)
Исходник: `source/14-cat-shooting.jpg` (вышка с метательной машинкой).

```
Aspect ratio 4:3.
Edit the attached photo. Keep the steel trap tower, the throwing machine inside it and the platform roof exactly as they are: same structure, proportions and dark paint — do not redesign them. Make the metal look freshly painted and clean. Remove all diagonal watermark logos. No text or logos.
Composition: the tower on the right third, fully visible from top to the platform, birch forest behind, softly out of focus. Keep 10% of calm space on all sides.
Light: early-autumn day, soft sun, a few golden leaves. No people.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 15-cat-custom — Нестандартные конструкции (4:3)
Исходник: `source/15-cat-custom.jpg` (навес для мотоцикла, сейчас рендер, квадрат).

```
Aspect ratio 4:3.
Turn the attached render into a real photograph and extend it to the left and right. Keep the fan-shaped motorcycle shelter exactly as it is: same segmented amber polycarbonate shell, dark steel ribs, base platform and proportions — do not redesign it. Keep the motorcycle inside. No text or logos.
Composition: the shelter in the center, about 55% of the frame width, fully visible, on clean paving in front of a modern low house with a neat garden, softly out of focus. Keep 10% of calm space on all sides.
Light: late-summer afternoon, warm low sun shining through the amber shell.
Style: photorealistic architectural photography, not CGI, natural colors, sharp, straight verticals.
```

### 16-cat-maf — Малые архитектурные формы (4:3)
Исходник: `source/16-cat-maf.jpg` (скамья, сейчас коллаж).

```
Aspect ratio 4:3.
Turn the attached collage into a real photograph and extend it to the left and right. Keep the bench exactly as it is: same wooden slats, dark steel legs and armrests, proportions — do not redesign it. Make it look brand-new. No text or logos.
Composition: three-quarter view, the bench in the center, about 55% of the frame width, on a wooden deck of a city park embankment, a pond and trees behind, softly out of focus. Keep 10% of calm space on all sides.
Light: late-summer morning, soft sun. No people.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp.
```

### 17-cat-navigation — Навигация (4:3)
Исходник: `source/17-cat-navigation.jpg` (пилон у сталинского дома).

```
Aspect ratio 4:3.
Edit the attached photo. Keep the information pylon exactly as it is: same tall slim shape, brushed metal finish and the tree illustration — do not redesign it. The text panels on the pylon show soft, unreadable lines. Make it look brand-new. Remove all watermarks. No readable text anywhere.
Composition: move closer to the pylon so it is the clear main subject, about 65% of the frame height, slightly left of center, fully visible. The historic building, lawn and flowers behind it are softly out of focus. Keep 10% of calm space at the top and bottom.
Light: late-summer day, soft sun. No people, no cars.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals, 50 mm lens.
```

---

## 3. Тёмный блок «Производство и услуги»

Кадр: карточки разного размера на синем фоне, как в Swift Logix. Название и короткая подпись лежат на фото снизу слева белым. Поэтому нижние 35% кадра должны быть спокойными и темнее. Большая карточка 4:5, остальные 4:3.

### 20-prod-hall — Производство (большая, 4:5)
Исходник: `source/20-prod-hall.jpg` (цех).

```
Aspect ratio 4:5.
Edit the attached photo and extend it upward and downward to a vertical frame, continuing the factory roof and floor naturally. Keep the production hall as it is: same layout, machines, metal profiles and stacked parts — do not invent new equipment. Make the hall look clean and orderly: tidy floor, no trash or random boxes. Remove all diagonal watermark logos. No readable text or logos.
Composition: deep one-point perspective along the central aisle. The bottom 35% of the frame is a calm, slightly darker clean floor with nothing important — white text will be placed there.
Light: even daylight from the roof windows, cool industrial tones, slightly desaturated.
Style: photorealistic industrial photography, not CGI, sharp, straight verticals.
```

### 21-prod-metalworking — Металлообработка (4:3)
Исходник: `source/21-prod-metalworking.jpg` (плазменная резка).

```
Aspect ratio 4:3.
Edit the attached photo. Keep the CNC cutting machine, its control panel and the worker's pose as they are. Dress the worker in clean dark navy workwear with safety glasses and gloves. Keep the bright sparks from the cutting. Tidy the background. Remove all watermarks. No readable text or logos.
Composition: the machine and the worker in the upper 65% of the frame; the bottom 35% is the calm, darker steel table surface — white text will be placed there.
Light: workshop light, sparks as the warm accent, the rest cool and slightly desaturated.
Style: photorealistic industrial photography, not CGI, sharp, shallow depth of field on the background.
```

### 22-prod-bending — Станочный парк (4:3)
Исходник: `source/22-prod-bending.jpg` (листогиб).

```
Aspect ratio 4:3.
Edit the attached photo. Keep the press brake exactly as it is: same orange body, shape and tooling; the lettering on the machine may stay as it is or become unreadable. Make the machine and floor look clean. Remove all watermarks and any other text.
Composition: the machine in the upper 65% of the frame at a slight angle; the bottom 35% is a calm, darker clean workshop floor — white text will be placed there.
Light: soft workshop light, cool and slightly desaturated surroundings, the orange machine is the only bright accent.
Style: photorealistic industrial photography, not CGI, sharp, straight verticals.
```

### 23-prod-kb — Конструкторское и дизайн-бюро (4:3)
Исходник: `source/23-prod-kb.jpg`. Нижняя часть исходника обрезана бежевой заливкой — её дорисовать.

```
Aspect ratio 4:3.
Recreate the attached image as a complete photograph: an engineering office where two or three engineers discuss a project at a large monitor showing a technical CAD drawing of a bus shelter. Printed technical drawings lie on the wooden desk. Keep the same mood, layout and colors as the source and fill the beige area at the bottom with the continuation of the desk and drawings. No readable text, logos or brand marks on screens or papers.
Composition: the monitor and people in the upper 65%; the bottom 35% is the calm, darker desk surface with drawings, softly out of focus — white text will be placed there.
Light: soft daylight from large office windows, cool neutral tones.
Style: photorealistic, not CGI, natural skin tones, sharp focus on the monitor.
```

### 24-prod-installation — Шеф-монтаж (4:3)
Исходник: `source/24-prod-installation.jpg` (бригада ставит павильон).

```
Aspect ratio 4:3.
Edit the attached photo. Keep the bus shelter frame being installed, the curved roof frame, the truck and the workers' poses as they are. Dress the workers in clean dark navy workwear with orange high-visibility vests and helmets. Tidy the sidewalk: no trash or loose debris. Remove all watermarks. No readable text or logos.
Composition: the workers and the shelter in the upper 65% of the frame; the bottom 35% is calm clean paving — white text will be placed there.
Light: soft overcast daylight, cool neutral grade, slightly desaturated.
Style: photorealistic documentary photography, not CGI, sharp, straight verticals.
```

---

## 4. Наши работы — 6 карточек

Кадр: 3:2, как в CONS. Фото сверху, под ним название объекта и теги. Текст на фото не ложится, поле вокруг сюжета — 8%.
Все 6 — реальные объекты с текущего сайта. Названия, города и годы для подписей нужно взять у клиента.

### 30-work-smart-stops — остановки SMART у вокзала
Исходник: `source/30-work-smart-stops.jpg`.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the bus shelter with the large city-map panel exactly as it is: same design, dark frame, glass roof, wooden bench, map panel and the round advertising column behind — do not redesign them. Make everything look brand-new and clean. The map and signs show soft, unreadable graphics. Remove all diagonal watermark logos. No readable text or logos.
Composition: keep the original framing, the shelter fully visible, 8% of free space around it. Keep two or three people naturally waiting, the rest of the square tidy.
Light: late-summer day, soft sun.
Style: photorealistic street photography, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 31-work-stele-gatchina — въездная стела
Исходник: `source/31-work-stele-gatchina.jpg`. После генерации сверить надписи с оригиналом.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the entrance stele exactly as it is: same shape, slatted grey body, yellow sign, coat of arms and all lettering — copy the lettering from the source without redrawing it. Make the stele look brand-new and clean. Remove all diagonal watermark logos and the roadside billboard in the background.
Composition: the stele right of center, fully visible, about 70% of the frame height, the road and green fields behind it, 8% of free space around.
Light: late-summer day, soft sun, a few white clouds.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 32-work-stele-ponsse — брендовая стела PONSSE
Исходник: `source/32-work-stele-ponsse.jpg`.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the brand stele, its yellow PONSSE sign and the aerial lift with the installer exactly as they are — same shape, colors and lettering, do not redraw the letters. Make the metal look brand-new and clean. Remove all diagonal watermark logos.
Composition: low angle as in the source, the stele and the lift fully visible, 8% of free space around, clean blue sky with a few clouds.
Light: bright late-summer day.
Style: photorealistic documentary photography, not CGI, natural colors, sharp.
```

### 33-work-pylon-smart — информационный пилон SMART
Исходник: `source/33-work-pylon-smart.jpg`.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the smart information pylon exactly as it is: same tall dark body, green LED display and city-map panel — the display and map show soft, unreadable graphics. Make it look brand-new and clean. Remove all diagonal watermark logos. No readable text or logos.
Composition: the pylon slightly left of center, fully visible, about 75% of the frame height; the fence, trees and street behind it softly out of focus, 8% of free space around.
Light: change the weather to a dry, bright late-summer day with soft sun; dry pavement. One distant pedestrian at most.
Style: photorealistic street photography, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 34-work-shooting-range — стрелковый комплекс
Исходник: `source/34-work-shooting-range.jpg`.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the shooting-range pavilion, the wooden fence and the round blue ear-protection pictogram sign exactly as they are — do not redesign them. Make the structures look brand-new and clean. Remove all diagonal watermark logos. No readable text or logos.
Composition: the pavilion and the sign fully visible, the brick path leading into the frame, 8% of free space around.
Light: late-summer day, clear blue sky, green grass.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 35-work-tumba-street — тумба на центральной улице
Исходник: `source/35-work-tumba-street.jpg`.

```
Aspect ratio 3:2.
Edit the attached photo. Keep the round advertising column exactly as it is: same shape, dark dome top and base — do not redesign it. Make it look brand-new. Replace the poster on the column with a calm abstract graphic in deep navy #2A2560 and light grey, no text. Remove the large "FAVOR GARANT" watermark text and all other watermarks. Shop signs in the background become soft and unreadable.
Composition: the column right of center, fully visible, about 70% of the frame height; the historic street with flower boxes behind it, softly out of focus, 8% of free space around. Only a few pedestrians, motion-blurred.
Light: late-summer day, soft sun.
Style: photorealistic street photography, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```
