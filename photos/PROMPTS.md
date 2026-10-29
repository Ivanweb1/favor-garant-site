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

---

## 5. Слайдер первого экрана — отдельные кадры

Слайдер занимает всю ширину и остаток высоты окна под заголовком. Поэтому кадр бывает очень разным:
- ноутбук 1366×768 — около 3.6:1, узкая полоса;
- десктоп 1920×1080 — около 2.3:1;
- телефон — около 1.25:1, почти квадрат.

Чтобы ничего важного не срезалось, каждый кадр делаем широким, а сюжет — компактным в центре:
- **сюжет** целиком в центральных 40% по ширине и в полосе от 25% до 75% по высоте;
- **левый и правый края** — спокойное продолжение сцены (улица, небо, цех), их можно отрезать;
- **нижние 20%** — спокойная поверхность: туда ложатся подпись слайда, стрелки и полоски прогресса.

Референс для каждого кадра — уже готовая ИИ-версия из `photos/ai/`, чтобы конструкция осталась той же. Готовые файлы класть в `photos/ai/` под именами ниже.

### 40-slide-pavilion — павильон «Городской», день
Референс: `photos/ai/01-hero-pavilion.png`.

```
Aspect ratio 21:9 (if 21:9 is not available, use 16:9).
Use the attached image as the reference. Keep the bus shelter exactly as it is: same design, proportions, dark grey frame, clear glass roof and walls, wooden bench — do not redesign it. No text, letters or logos anywhere.
Composition: wide eye-level street view. The shelter is small in the frame and fully visible: it sits exactly in the center and takes no more than 35% of the frame width; its roof is below the top quarter and its base is above the bottom quarter of the frame. Left and right of it the calm city sidewalk continues: trimmed hedge, fir trees, historic red-brick and light buildings, softly out of focus — these sides may be cropped. The bottom 20% of the frame is clean, even grey paving with nothing on it.
Light: late-summer morning, soft sun from the side, gentle long shadows. No people, no cars.
Style: unretouched documentary architectural photo, not CGI: true-to-life slightly muted colors, natural lens, no HDR glow, straight vertical lines, 35 mm lens.
```

### 41-slide-evening — павильоны вечером
Референс: `photos/ai/02-hero-alt-evening.png`.

```
Aspect ratio 21:9 (if 21:9 is not available, use 16:9).
Use the attached image as the reference. Keep both bus shelters and the information stand exactly as they are: same design, light grey frames, glass, lit panels — do not redesign them. Panels show soft unreadable graphics; no readable text or logos anywhere.
Composition: wide view along a historic St Petersburg street. The main shelter is in the exact center, fully visible, no more than 35% of the frame width, its roof below the top quarter and its base above the bottom quarter. The street with lit shop windows continues to the left and right — these sides may be cropped. The bottom 20% is calm stone paving with soft reflections and nothing on it.
Light: blue hour right after sunset, warm light inside the shelter and windows. No people, no cars.
Style: real evening photograph, not a render: natural noise, true-to-life colors, no HDR glow, straight vertical lines, 35 mm lens.
```

### 42-slide-production — собственное производство
Референс: `photos/ai/21-prod-metalworking.png`.

```
Aspect ratio 21:9 (if 21:9 is not available, use 16:9).
Use the attached image as the reference. Keep the CNC cutting machine, its control panel, the worker in dark navy workwear with safety glasses and the sparks from the cutting. No readable text or logos.
Composition: step back to a wide shot of the workshop. The machine with the worker is in the exact center, no more than 40% of the frame width, between the top quarter and the bottom quarter of the frame. To the left and right the clean, orderly production hall continues — racks of metal profiles, other machines, roof windows — softly out of focus; these sides may be cropped. The bottom 20% is the calm, clean workshop floor with nothing on it.
Light: even daylight from roof windows, cool industrial tones, slightly desaturated; the sparks are the only warm accent.
Style: unretouched documentary industrial photo, not CGI, natural lens, no HDR, straight vertical lines.
```

### 43-slide-stele-gatchina — въездная стела «Гатчина»
Референс: `photos/ai/31-work-stele-gatchina.png`. После генерации сверить надписи и гербы с референсом.

```
Aspect ratio 21:9 (if 21:9 is not available, use 16:9).
Use the attached image as the reference. Keep the entrance stele exactly as it is: same shape, slatted grey body, yellow sign, both coats of arms and all lettering — copy the lettering from the reference without redrawing it.
Composition: step back so the whole stele is visible from the top of the upper coat of arms to the ground, small in the frame: in the exact center, no more than 35% of the frame width, with the top of the coat of arms below the top quarter and the base above the bottom quarter. Left and right — the roadside, green fields, a few low houses and the summer sky; these sides may be cropped. The bottom 20% is a calm strip of grass and roadside with nothing important.
Light: late-summer day, soft sun, a few white clouds. No cars close to the camera.
Style: unretouched documentary photo, not CGI, true-to-life colors, no HDR, straight vertical lines.
```

### 44-slide-stele-ponsse — бренд-стела PONSSE
Референс: `photos/ai/32-work-stele-ponsse.png`.

```
Aspect ratio 21:9 (if 21:9 is not available, use 16:9).
Use the attached image as the reference. Keep the brand stele, its yellow PONSSE sign and the aerial lift with the installer exactly as they are — same shape, colors and lettering, do not redraw the letters.
Composition: step back to a wider, less dramatic angle so the whole stele and the lift basket are visible and small in the frame: in the exact center, no more than 40% of the frame width, between the top quarter and the bottom quarter of the frame. Left and right — clean blue sky with a few clouds and a low industrial building; these sides may be cropped. The bottom 20% is calm: ground or the lower part of the stele base with nothing important.
Light: bright late-summer day.
Style: unretouched documentary photo, not CGI, true-to-life colors, no HDR, straight vertical lines.
```

---

## 6. Новости — 2 карточки

Кадр: на десктопе фото слева в карточке, квадрат 1:1. На телефоне фото сверху 16:10 — от квадрата остаётся средняя полоса примерно 62% высоты.
Значит: **главный объект целиком в средней полосе от 19% до 81% по высоте**, верх и низ — спокойные небо и асфальт или пол, их можно срезать. Текст на фото не кладём.

Исходники — обложки новостей со старого сайта, на них вшит текст и рамка. Их надо убрать.
Готовые файлы класть в `photos/ai/` под именами ниже.

### 50-news-transport-reform — «Транспортная реформа в Санкт-Петербурге»
Исходник: `source/50-news-transport-reform.jpg`.

```
Aspect ratio 1:1.
Edit the attached image: use only the photo part on the right — the trolleybus at a bus stop with a glass shelter. Remove the white frame, all text, logos and graphic elements; extend the photo naturally to a square.
Keep the scene as it is: the same modern trolleybus with its livery and the same glass bus shelter, city street with residential high-rise buildings. Make the shelter look clean and brand-new. Destination signs and route numbers become soft and unreadable.
Composition: the shelter and the front half of the trolleybus are fully inside the middle band of the frame — between 20% and 80% of the height; the shelter is slightly right of center. The top 18% is calm sky with light clouds, the bottom 18% is clean asphalt and sidewalk with nothing important — these strips may be cropped.
Light: clear late-summer day, soft sun.
Style: unretouched documentary street photo, not CGI, true-to-life colors, no HDR glow, straight verticals, 35 mm lens.
```

### 51-news-smarttransport — «Форум SmartTransport»
Исходник: `source/51-news-smarttransport.jpg`.

```
Aspect ratio 1:1.
Edit the attached image: use only the photo part — the red-and-white tram on display at an exhibition hall. Remove the white frame, all text, logos and graphic elements; extend the photo naturally to a square.
Keep the tram exactly as it is: same shape, red-and-white livery, lighting and the route display (make the display text soft and unreadable). Keep one or two visitors looking at the tram, the rest of the hall calm.
Composition: step back so the front of the tram and its first doors are fully visible, inside the middle band of the frame — between 20% and 80% of the height; the tram nose slightly left of center. The top 18% is the calm, dimly lit exhibition ceiling, the bottom 18% is the clean floor of the stand with soft blue light — these strips may be cropped.
Light: exhibition lighting, soft and even, no harsh glare.
Style: unretouched documentary event photo, not CGI, true-to-life colors, no HDR glow, 35 mm lens.
```

---

## 7. Меню «Продукция» — вертикальные кадры (4:5)

В меню фото стоит в вертикальной рамке 360×430. Горизонтальные кадры каталога 4:3 там обрезаются до 63% ширины, и у трёх разделов конструкция не помещается: вышка стрельбища, навес для мотоцикла и скамья. Для меню делаем отдельные вертикальные версии. Карточки каталога остаются на старых файлах.

Исходник — уже готовый ИИ-кадр из `site/img/photos/`, чтобы конструкция совпадала с каталогом. Готовый файл кладём в `photos/ai/` под новым именем.

Безопасная зона: рамка меню срезает до ~4% сверху и снизу, края кадра могут попасть под скругление, поэтому конструкция целиком внутри центральных 80% ширины и 85% высоты.

### 14-menu-shooting — Оборудование для стрельбищ (4:5)
Исходник: `site/img/photos/14-cat-shooting.jpg`.

```
Aspect ratio 4:5, vertical.
Edit the attached photo and recompose it as a vertical frame. Keep the steel trap tower, the throwing machine inside it and the platform roof exactly as they are: same structure, proportions and dark paint — do not redesign them. No text or logos.
Composition: step back so the whole tower fits, from the roof to the ground, centered horizontally, about 70% of the frame height. Nothing of the tower or the platform is cut by the frame edges: keep at least 10% of calm space on the left and right and 8% at the top and bottom. Birch forest behind, softly out of focus; sky visible above the roof.
Light: early-autumn day, soft sun, a few golden leaves. No people.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals.
```

### 15-menu-custom — Нестандартные конструкции (4:5)
Исходник: `site/img/photos/15-cat-custom.jpg`.

```
Aspect ratio 4:5, vertical.
Edit the attached photo and recompose it as a vertical frame. Keep the fan-shaped motorcycle shelter exactly as it is: same segmented amber polycarbonate shell, dark steel ribs, base platform and proportions — do not redesign it. Keep the motorcycle inside. No text or logos.
Composition: shoot from a three-quarter angle from the open side so the shelter is narrower in the frame. The shelter with the motorcycle is centered, about 75% of the frame width, fully visible including the base platform; at least 10% of calm space on the left and right. Lower half: clean paving; upper part: the modern low house and garden softly out of focus and a strip of sky.
Light: late-summer afternoon, warm low sun shining through the amber shell.
Style: photorealistic architectural photography, not CGI, natural colors, sharp, straight verticals.
```

### 16-menu-maf — Малые архитектурные формы (4:5)
Исходник: `site/img/photos/16-cat-maf.jpg`.

```
Aspect ratio 4:5, vertical.
Edit the attached photo and recompose it as a vertical frame. Keep the bench exactly as it is: same wooden slats, dark steel legs and armrests, proportions — do not redesign it. Keep the dark steel bollard with the chain only if it fits without touching the frame edges. No text or logos.
Composition: a steeper three-quarter view, looking along the bench, so its full length fits: the whole bench, both armrests and all legs, centered, about 75% of the frame width, in the lower half of the frame; at least 10% of calm space on the left and right. Wooden deck in the foreground, the pond, trees and the small bridge behind, softly out of focus, sky in the upper part.
Light: late-summer morning, soft sun. No people.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp.
```

Павильоны (10) и щиты (13) в меню помещаются, но впритык. Если после трёх новых кадров они будут выделяться, по тому же принципу сделаем `10-menu-pavilions` и `13-menu-billboards`.

---

## 8. Каталог на главной — широкие кадры (21:9)

В каталоге фото стоит над полосой с текстом, кадр примерно 2,6:1 (около 980×375 на экране 1440). Кадры 4:3 там теряют половину высоты: у тумбы, лайтпостера, щита, вышки и пилона срезается верх или низ. Нужны широкие версии.

Исходник — нынешний ИИ-кадр из `site/img/photos/`, чтобы конструкция совпадала с остальным сайтом. Готовый файл кладём в `photos/ai/` под новым именем `NN-wide-….jpg`.

Безопасная зона: рамка срезает до 10% сверху и снизу, поэтому конструкция целиком в центральных 70% высоты и не выше 65% кадра; по горизонтали — в центре, примерно 35–45% ширины, остальное — спокойное окружение.

Общий хвост для всех восьми промптов (добавить в конец каждого):

```
Composition: wide horizontal frame. The whole structure is fully visible from top to bottom, standing in the center, about 60% of the frame height, with at least 15% of calm space above it (sky, facade or trees) and 15% below it (paving or grass). Nothing of the structure touches the frame edges. Calm surroundings extend to the left and right.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals. No people unless stated, no text or logos.
```

### 10-wide-pavilions — Остановочные павильоны (21:9)
Исходник: `site/img/photos/10-cat-pavilions.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the bus shelter exactly as it is: same dark steel frame, glass roof, side glass panels, yellow safety stripe, bench and the two ad panels with the navy-and-grey abstract graphic — do not redesign it.
Setting: a city park sidewalk, trees behind, softly out of focus. Light: late-summer day, soft sun.
[общий хвост]
```

### 11-wide-tumby — Рекламные тумбы (21:9)
Исходник: `site/img/photos/11-cat-tumby.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the round advertising column exactly as it is: same dark dome top, dark base and the navy-and-grey abstract graphic — do not redesign it. Step back so the dome and the base are both in frame.
Setting: the paved square in front of the historic yellow building with arches, softly out of focus; a few distant passers-by are fine. Light: late-summer day.
[общий хвост]
```

### 12-wide-lightposters — Лайтпостеры (21:9)
Исходник: `site/img/photos/12-cat-lightposters.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the city-format lightposter exactly as it is: same dark frame, rust-red leg and the navy-and-grey abstract graphic — do not redesign it. Step back so the top of the frame and the foot are both in frame.
Setting: paving in front of the red-brick historic building with steps, softly out of focus. Light: late-summer day. No people.
[общий хвост]
```

### 13-wide-billboards — Рекламные щиты (21:9)
Исходник: `site/img/photos/13-cat-billboards.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the billboard exactly as it is: same single pole, frame, lamps and the navy-and-grey abstract graphic — do not redesign it. Step back so the whole billboard and the base of the pole are in frame.
Setting: a residential street with trees and apartment buildings, clear blue sky above. Light: late-summer day. No people.
[общий хвост]
```

### 14-wide-shooting — Оборудование для стрельбищ (21:9)
Исходник: `site/img/photos/14-cat-shooting.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the steel trap tower, the throwing machine inside it and the platform roof exactly as they are — do not redesign them. Step back so the whole tower is in frame, from the roof to the ground.
Setting: a shooting ground at the edge of a birch forest, golden early-autumn leaves, grass in the foreground. Light: soft early-autumn sun. No people.
[общий хвост]
```

### 15-wide-custom — Нестандартные конструкции (21:9)
Исходник: `site/img/photos/15-cat-custom.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the fan-shaped motorcycle shelter exactly as it is: same amber polycarbonate shell, dark steel ribs, base platform and the motorcycle inside — do not redesign it.
Setting: clean paving in front of a modern low house with a neat garden, softly out of focus. Light: late-summer afternoon, warm low sun through the amber shell.
[общий хвост]
```

### 16-wide-maf — Малые архитектурные формы (21:9)
Исходник: `site/img/photos/16-cat-maf.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the bench exactly as it is: same wooden slats, dark steel legs and armrests — do not redesign it. The whole bench with all legs is in frame.
Setting: a wooden deck on a park embankment, the pond, trees and a small bridge behind, softly out of focus. Light: late-summer morning. No people.
[общий хвост]
```

### 17-wide-navigation — Навигация (21:9)
Исходник: `site/img/photos/17-cat-navigation.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the information pylon exactly as it is: same tall slim shape, brushed metal finish and the tree illustration; the text panels show soft, unreadable lines — do not redesign it. Step back so the whole pylon, from top to base, is in frame.
Setting: a square with lawn and flowers in front of a historic Stalin-era building, softly out of focus. Light: late-summer day. No people, no cars.
[общий хвост]
```

---

## 9. Слайдер первого экрана — кадр «Полный цикл» (21:9)

Слайдер теперь идёт по четырём акцентам брифа (п. 04): российское производство → свой парк оборудования → нестандартные конструкции → полный цикл. Для последнего слайда стоит кадр монтажа 4:3, и в широком слайде у него срезается крыша павильона. Нужна широкая версия.

### 45-slide-installation — Полный цикл: от идеи до монтажа (21:9)
Исходник: `site/img/photos/24-prod-installation.jpg`. Готовый файл — `photos/ai/45-slide-installation.jpg`.

```
Aspect ratio 21:9.
Edit the attached photo and extend it to a wide frame. Keep the installation crew in orange vests, the bus shelter frame they are assembling, the flatbed truck with glass panels and the city street exactly as they are — do not redesign them.
Composition: step back so the whole shelter frame including its roof is fully visible, standing slightly right of center, about 55% of the frame height, with at least 20% of calm sky above the roof and paving below. The left third is calm street and buildings, softly out of focus — a caption will sit there at the bottom left.
Light: late-summer overcast day, soft even light.
Style: photorealistic, not CGI, natural colors, slightly cool neutral grade, sharp, straight verticals. No text or logos.
```

---

## 10. Карточка модели «Атлант» — блок «Материалы и оснащение» (6 кадров 4:3)

Зачем: в блоке сейчас иконки и текст, а это самые «осязаемые» вещи — крыша, стекло, скамья, герб. Крупный план материала сразу показывает качество. Каждый пункт блока станет карточкой: фото сверху, заголовок и текст под ним.

Кадр: 4:3, файл 1600×1200. Карточка на сайте около 400×300, на телефоне во всю ширину. Главная деталь — в центральных 70% кадра. Верхние и нижние 10% можно обрезать, ничего важного туда не ставим. Текст поверх фото не кладём.

Исходники: фото «Атланта» на объекте — `site/img/catalog/atlant-photo-1.jpg` (вид спереди, улица Соборная), `atlant-photo-4.jpg` (вид сбоку у кирпичного здания), и рендер `atlant-render.jpg`. Загружать **два файла**: фото на объекте и рендер — по ним генератор держит профиль каркаса, форму крыши и цвет.

Общий блок, он уже вставлен в начало каждого промпта ниже:
- каркас — светлый серебристо-серый алюминиевый профиль с порошковым покрытием, квадратное сечение, как на исходниках;
- крыша — изогнутые волнами секции прозрачного поликарбоната, как на исходниках;
- никакого текста, букв, логотипов, водяных знаков FG, людей и машин;
- реалистичная предметная фотосъёмка, не рендер.

### 60-atlant-roof — «Крыша»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference for the frame and roof. Keep the same light silver-grey square aluminium profiles and the same wave-shaped clear polycarbonate roof sections — do not redesign.
Shot: close-up from below at a 30° angle of the roof edge where two curved polycarbonate sections meet the aluminium beam. Clear sky with soft clouds seen through the transparent polycarbonate, gentle light refraction on the curves, crisp bolt heads and clean seams. The roof edge crosses the frame diagonally from lower left to upper right and fills the central 70%.
Light: late-summer morning, soft sun from behind the roof.
Style: photorealistic architectural detail photography, not CGI, true-to-life colors, slightly cool neutral grade, shallow depth of field, 85 mm lens. No text, letters, logos, watermarks, people or cars.
```

### 61-atlant-glass — «Ветрозащитные панели»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference. Keep the same silver-grey square aluminium frame — do not redesign.
Shot: close-up three-quarter view of a corner of the shelter: a vertical aluminium post holding a tall tempered glass side panel. Show the thickness of the glass edge (about 8 mm, slight green tint on the edge), clean rubber gasket and fastening clamps. Through the glass — a softly blurred historic St Petersburg street with trees. The post stands at about one third of the frame width, the glass panel fills the rest.
Light: overcast bright day, soft reflections on the glass, no glare spots.
Style: photorealistic product detail photography, not CGI, true-to-life colors, slightly cool neutral grade, 70 mm lens, shallow depth of field. No text, letters, logos, stickers, watermarks, people or cars.
```

### 62-atlant-bench — «Скамья»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference for the bench: warm honey-coloured wooden slats on curved silver-grey metal brackets, mounted between the shelter posts. Do not redesign.
Shot: close-up at seat height, slightly from the side: two smooth planed wooden slats with visible wood grain and rounded edges, an antiseptic oil finish with a soft satin sheen, the curved metal bracket underneath and the clean paving below. The bench runs diagonally across the frame; the bracket sits in the central third.
Light: late-summer afternoon, warm sun from the side, soft shadows.
Style: photorealistic product detail photography, not CGI, true-to-life colors, 85 mm lens, shallow depth of field. No text, letters, logos, watermarks, people, bags or litter.
```

### 63-atlant-emblem — «Герб или логотип»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference for the frame and glass. Do not redesign.
Shot: frontal close-up of a glass side panel with a printed emblem in the middle: a simple heraldic shield shape filled with deep navy #2A2560 and a thin silver outline, with an abstract geometric pattern inside — no letters, no real coat of arms, no animals or crowns. The print is crisp, opaque, slightly glossy, applied to the glass. Around it — clean transparent glass with a softly blurred green park behind. The shield takes about 35% of the frame height and sits in the center.
Light: bright overcast day, even light, faint reflections.
Style: photorealistic detail photography, not CGI, true-to-life colors, 70 mm lens. No text, letters, numbers, logos, watermarks, people or cars.
```

### 64-atlant-long — «Увеличенные версии»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference for the design. Keep the same silver-grey square aluminium frame and the same wave-shaped clear polycarbonate roof — do not change the design, only make it longer.
Shot: a long semi-enclosed version of the same shelter, about 10 metres long, built from repeated identical modules with glass side and front panels, standing along a wide clean sidewalk of a St Petersburg avenue. Eye-level view from a three-quarter angle so the whole length is visible and recedes into perspective. The shelter fills the central 80% of the frame width.
Light: late-summer morning, soft sun from the side, gentle long shadows.
Style: photorealistic architectural photography, not CGI, true-to-life colors, slightly cool neutral grade, straight vertical lines, 35 mm lens. No text, letters, logos, watermarks, people or cars.
```

### 65-atlant-lightposter — «Сменные панели»
```
Aspect ratio 4:3.
Use the attached photo and render of the "Atlant" bus shelter as the exact reference. Keep the same silver-grey square aluminium frame — do not redesign.
Shot: three-quarter view of one end of the shelter where the side glass panel is replaced by a city-format lightbox of the same height, built into the same frame. The lightbox glows softly from inside and shows a calm abstract poster in deep navy #2A2560 and light grey shapes — no text, letters or numbers. Next to it, a regular glass side panel, so the two are clearly the same size. The lightbox sits in the central third of the frame.
Light: early evening blue hour, the lightbox is the brightest element, the street is still visible.
Style: photorealistic architectural photography, not CGI, true-to-life colors, 50 mm lens. No text, letters, logos, watermarks, people or cars.
```

---

## 11. Карточка модели «Атлант» — блок «Умная остановка» (7 кадров 4:3)

Зачем: сейчас в блоке временные вырезки со старого листа «Элегант П» — мелкие и разного качества. Нужны единые фото: крупный кадр павильона SMART и 6 компонентов прямо на павильоне.

Кадр: 4:3, файл 1600×1200. Главный кадр стоит на сайте крупно (2×2 карточки), остальные — маленькими карточками около 300×225, поэтому деталь должна читаться крупно и занимать центральные 60–70% кадра.

Исходники: рендер `site/img/catalog/atlant-cfg-smart.jpg` (павильон с лайтпостером SMART), фото на объекте `atlant-photo-1.jpg` и вырезка нужного компонента `site/img/catalog/smart-<имя>.jpg`. Загружать все три: рендер и фото держат павильон, вырезка — сам компонент.

Общее для всех кадров:
- павильон «Атлант»: светлый серебристо-серый алюминиевый каркас, волнистая крыша из прозрачного поликарбоната, как на исходниках;
- экраны и табло без читаемого текста: только абстрактные светящиеся строки и цветные метки маршрутов, кириллица генератору не даётся;
- никаких людей крупно, машин, водяных знаков FG, логотипов производителей техники;
- один свет на всю серию: синий час, ранние сумерки — подсветка и экраны светятся, город ещё виден.

### 70-smart-hero — «Атлант SMART» целиком
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter as the exact reference: light silver-grey square aluminium frame, wave-shaped clear polycarbonate roof, a tall city-format digital lightbox with a route map as one side panel, wooden bench. Do not redesign.
Shot: the complete SMART shelter on a clean wide sidewalk of a historic St Petersburg street, three-quarter eye-level view. Built-in LED roof lighting is on and casts soft light on the bench; the digital lightbox glows with an abstract route-map design; a small LED arrival board under the roof shows glowing green and amber lines. The shelter fills the central 75% of the frame width.
Light: blue hour, early evening, the shelter is the brightest element, street lamps just turned on.
Style: photorealistic architectural photography, not CGI, true-to-life colors, slightly cool grade, straight vertical lines, 35 mm lens. No readable text, letters or numbers on screens, no logos, watermarks, people or cars.
```

### 71-smart-board — электронное табло прибытия
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached board picture as the exact reference. Keep the shelter frame silver-grey aluminium; the board is a slim black LED dot-matrix display mounted under the roof beam.
Shot: close-up from below at a 20° angle of the arrival board under the roof edge. The display glows with several rows of green and amber LED dot-matrix lines and small coloured route markers, like a real arrival board, but no readable letters or numbers. The polycarbonate roof and the evening sky above it are softly visible. The board fills the central 65% of the frame.
Light: blue hour, the board is the brightest element.
Style: photorealistic product detail photography, not CGI, 85 mm lens, shallow depth of field. No readable text, letters, numbers, logos, watermarks or people.
```

### 72-smart-poster — лайтпостер сити-формат
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached lightbox picture as the exact reference. Keep the same silver-grey aluminium frame — do not redesign.
Shot: three-quarter view of the shelter end with a city-format lightbox built in as the side panel. It glows evenly from inside and shows a calm abstract poster with soft navy #2A2560, light grey and a touch of warm orange shapes — no text. A sliver of the glass panel and the bench is visible next to it. The lightbox fills the central 60% of the frame.
Light: blue hour, the lightbox is the brightest element, soft reflections on the paving.
Style: photorealistic architectural detail photography, not CGI, 50 mm lens. No readable text, letters, numbers, logos, watermarks or people.
```

### 73-smart-usb — USB-зарядка
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached USB picture as the exact reference. Keep the silver-grey square aluminium post — do not redesign.
Shot: close-up of a vandal-proof stainless steel USB charging socket set into the shelter post at bench height, with a small glowing blue ring around it. A hand holds a smartphone with a cable plugged into the socket, only the hand and the phone are in frame, the phone screen is dark. Softly blurred bench and evening street behind. The socket sits in the central third of the frame.
Light: blue hour, warm light from the shelter roof lighting.
Style: photorealistic product detail photography, not CGI, 85 mm lens, shallow depth of field. No readable text, letters, logos, watermarks; no face.
```

### 74-smart-sos — кнопка экстренного вызова 112
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached emergency button picture as the exact reference: a red metal box with a white "112" and a round steel push button. Keep the shelter post silver-grey aluminium.
Shot: close-up three-quarter view of the red emergency call box mounted on the shelter post at chest height. The "112" digits are crisp and white, the steel button is clean, a small speaker grille above it. Softly blurred glass panel and evening street behind. The box fills the central 55% of the frame.
Light: blue hour, soft light from the shelter roof lighting, gentle reflection on the red paint.
Style: photorealistic product detail photography, not CGI, 85 mm lens, shallow depth of field. No other text or letters except "112", no logos, watermarks or people.
```

### 75-smart-camera — камера видеонаблюдения
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached camera picture as the exact reference: a white dome CCTV camera. Keep the shelter frame silver-grey aluminium.
Shot: close-up from below of the white dome camera mounted under the roof beam inside the shelter, the lens looking down into the waiting area. The polycarbonate roof and evening sky above are softly visible. The camera fills the central 50% of the frame.
Light: blue hour, soft light from the roof LED lighting.
Style: photorealistic product detail photography, not CGI, 85 mm lens, shallow depth of field. No brand names, letters, logos, watermarks or people.
```

### 76-smart-sound — модуль звукового дублирования
```
Aspect ratio 4:3.
Use the attached render and photo of the "Atlant" bus shelter and the attached module picture as the exact reference: a bright yellow metal box with a round steel button, a speaker icon and raised Braille dots. Keep the shelter post silver-grey aluminium.
Shot: close-up three-quarter view of the yellow audio module mounted on the shelter post at hand height, a finger about to press the steel button. Raised Braille dots are clearly visible; any printed words are replaced by Braille dots only. Softly blurred bench and evening street behind. The module fills the central 55% of the frame.
Light: blue hour, soft light from the shelter roof lighting.
Style: photorealistic product detail photography, not CGI, 85 mm lens, shallow depth of field. No readable text or letters, no logos, watermarks; no face.
```
