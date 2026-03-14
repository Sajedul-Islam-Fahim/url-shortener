# URL Shortener

A full-stack URL Shortener SaaS with analytics built with Laravel API & React.

## Projects

| Project | Tech | Description |
|---|---|---|
| `url-shortener-api` | Laravel 10 + Sanctum | REST API backend |
| `url-shortener-web` | React 19 + Vite | Frontend SPA |

## Features

- User Authentication (Register/Login)
- Auto + Custom short code generation
- Click tracking (total clicks)
- Analytics (browser, OS, device, referrer)
- Link expiry date
- Link enable/disable
- Dashboard with stats

## Tech Stack

- **Backend:** Laravel 10, MySQL, Sanctum
- **Frontend:** React 19, Vite, Zustand, Axios

## Getting Started

### Setup API
```bash
cd url-shortener-api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

### Setup Web
```bash
cd url-shortener-web
npm install
npm run dev
```

## Author

**Sajedul Islam Fahim**
GitHub: [@Sajedul-Islam-Fahim](https://github.com/Sajedul-Islam-Fahim)
