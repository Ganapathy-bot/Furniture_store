# MongoDB Atlas Setup

All application data lives in the `furniture_shop` database.

| Collection | Purpose |
| --- | --- |
| `shop` | Product catalog |
| `users` | Customer and admin accounts |
| `categories` | Product categories |
| `orders` | Customer orders |
| `reviews` | Product reviews |
| `wishlists` | Saved products |

## 1. Configure Connection

PowerShell helper:

```powershell
.\scripts\configure-atlas.ps1
```

Manual `.env` value:

```env
MONGODB_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/furniture_shop?retryWrites=true&w=majority
```

If SRV DNS fails on Windows, use the standard connection string from Atlas Compass:

```env
MONGODB_URI=mongodb://USER:PASSWORD@host.mongodb.net:27017/furniture_shop?ssl=true&authSource=admin&retryWrites=true&w=majority
```

## 2. Initialize Database

```bash
npm run db:init
```

This creates seed categories, seed products, indexes, and the admin user if they do not already exist.

## 3. Verify

```bash
npm run db:inspect
```

This prints collection names, document counts, and a sample product.

## Default Admin

| Field | Value |
| --- | --- |
| Email | `admin@furnistore.com` |
| Password | `Admin@123456` |
| Login | http://localhost:5173/login |
| Admin panel | http://localhost:5173/admin |

Change the admin credentials in `.env` before production seeding.
