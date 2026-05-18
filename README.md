# Hotel Line CRM

Мини CRM и витрина товаров для гостиниц.

## Стек

- Node.js + Express
- PostgreSQL
- Multer для загрузки фото
- HTML/CSS/Vanilla JS frontend
- Render Web Service + Render PostgreSQL + Render Persistent Disk

## Локальный запуск

```bash
npm install
npm start
```

Нужна переменная:

```bash
DATABASE_URL=postgres://user:password@host:5432/database
```

Для локальных фото можно оставить стандартную папку `uploads/`.

## Render

В Render можно использовать `render.yaml`.

Он создаст:

- Web Service
- PostgreSQL database
- Persistent Disk на `/var/data`

Фото товаров сохраняются в:

```text
/var/data/uploads
```

В базе хранится путь вида:

```text
/uploads/file-name.jpg
```

## Страницы

- `/` - клиентская витрина
- `/admin.html` или `/admin` - админка/CRM
- `/api/health` - проверка API
