# URL Shortener API

REST API backend for URL Shortener built with Laravel 10 and Sanctum.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register |
| POST | `/api/login` | Login |
| POST | `/api/logout` | Logout |
| GET | `/api/me` | Current user |

### URLs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/urls` | Get all URLs |
| POST | `/api/urls` | Create URL |
| PUT | `/api/urls/{id}` | Update URL |
| DELETE | `/api/urls/{id}` | Delete URL |
| GET | `/api/urls/{id}/analytics` | Get analytics |

### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Dashboard stats |

### Redirect
| Method | Endpoint | Description |
|---|---|---|
| GET | `/{code}` | Redirect to original URL |

## Author

**Sajedul Islam Fahim**
GitHub: [@Sajedul-Islam-Fahim](https://github.com/Sajedul-Islam-Fahim)
