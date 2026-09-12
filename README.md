# AURA Fashion Store

A full-stack women's fashion e-commerce web application built with React, Node.js, Express, PostgreSQL, and Prisma.

AURA provides a responsive shopping experience with product browsing, search and filtering, product details, cart management, customer authentication, wishlist, checkout, order tracking, and an admin dashboard for product and order management.

## Features

### Customer Features

- Responsive women's fashion shopping interface
- Browse women's clothing products
- Product categories:
  - Sarees
  - Kurtis
  - Dresses
  - Lehengas
- Search products by name
- Filter products by category
- Filter by size
- Filter by maximum price
- Sort products by price
- Product details page
- Product image display
- Size selection
- Quantity selection
- Stock availability
- Add products to cart
- Increase/decrease cart quantity
- Remove products from cart
- Cart persistence using localStorage
- Customer registration and login
- Customer logout
- Wishlist
- Checkout
- Order placement
- Order history
- Order status display
- Responsive mobile and desktop layouts

### Admin Features

- Admin authentication
- Admin dashboard
- Product statistics
- Customer statistics
- Order statistics
- Revenue statistics
- Add products
- Edit products
- Delete products
- Product image upload
- Stock management
- Product validation
- View customer orders
- Update order status

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- JavaScript
- Axios / Fetch API

### Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs
- Multer

### Database

- PostgreSQL
- Prisma ORM

## Project Structure

```text
womens-fashion-store/
│
├── backend/
│   ├── middleware/
│   ├── prisma/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   └── routes/
│   ├── package.json
│   └── prisma.config.ts
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```
## Setup & Installation

### Prerequisites

Make sure the following are installed:

- Node.js
- npm
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/arjunwaman7498/aura-fashion-store.git
cd aura-fashion-store
```
### 2. Backend Setup
Open a terminal and run:
```bash
cd backend
npm install
npm start
```
### 3. Frontend Setup
Open a new terminal and run:
```bash
cd frontend
npm install
npm run dev
```





## Authentication

AURA Fashion Store uses **JWT (JSON Web Token)** authentication with role-based access control.

### Customer Authentication

- Customer registration and login
- Password hashing using `bcryptjs`
- Protected wishlist, checkout and order pages
- Customer-only API access

### Admin Authentication

- Secure admin login
- Protected product management
- Protected dashboard and order management
- Admin-only API access

### Authorization

Protected API requests use a Bearer token:

```text
Authorization: Bearer <token>
```

Customer and admin roles are validated separately to prevent unauthorized access.


## Environment Variable Details

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection string |
| `ADMIN_USERNAME` | Username used for administrator authentication |
| `ADMIN_PASSWORD` | Password used for administrator authentication |
| `JWT_SECRET` | Secret key used to generate and verify JWT authentication tokens |

### Example

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/aura_fashion?schema=public"

ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_admin_password"

JWT_SECRET="your_jwt_secret"
```

## API Details

The backend provides RESTful APIs for product management, customer authentication, wishlist management, order management, and admin operations.

### Product APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/products` | Public | Get all products |
| GET | `/products/:id` | Public | Get product by ID |
| POST | `/products` | Admin | Create a new product |
| PUT | `/products/:id` | Admin | Update an existing product |
| DELETE | `/products/:id` | Admin | Delete a product |

### Authentication APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new customer |
| POST | `/auth/login` | Public | Login as customer or admin |

### Wishlist APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| GET | `/wishlist` | Customer | Get logged-in customer's wishlist |
| POST | `/wishlist/:productId` | Customer | Add a product to wishlist |
| DELETE | `/wishlist/:productId` | Customer | Remove a product from wishlist |

### Order APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/orders` | Customer | Place a new order |
| GET | `/orders/my` | Customer | Get logged-in customer's orders |

### Admin APIs

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| POST | `/admin/login` | Public | Authenticate administrator |
| GET | `/admin/stats` | Admin | Get dashboard statistics |
| GET | `/admin/orders` | Admin | Get all customer orders |
| PUT | `/admin/orders/:id/status` | Admin | Update order status |

  ## Database

AURA Fashion Store uses **PostgreSQL** as the SQL database and **Prisma ORM** for database management.

### Database Models

- `Product` — Product details, pricing, sizes, stock, category and images
- `User` — Customer accounts and authentication
- `Wishlist` — Customer wishlist items
- `Order` — Customer order and delivery information
- `OrderItem` — Products included in each order

### Database Setup

Create a PostgreSQL database:

```text
aura_fashion
```

Configure the connection in `backend/.env`:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/aura_fashion?schema=public"
```

Run the following commands from the `backend` directory:

```bash
npx prisma migrate deploy
npx prisma generate
npm run seed
```

### Schema & Migrations

Prisma schema:

```text
backend/prisma/schema.prisma
```

Migrations:

```text
backend/prisma/migrations/
```

Product data is stored in PostgreSQL and retrieved through backend APIs rather than being hardcoded in the frontend.

## Screenshots

### Home Page

![AURA Fashion Store - Home Page](screenshots/home.png)

### Product Listing

![AURA Fashion Store - Product Listing](screenshots/products.png)

### Product Details

![AURA Fashion Store - Product Details](screenshots/product-details.png)

### Shopping Cart

![AURA Fashion Store - Shopping Cart](screenshots/cart.png)

### Wishlist

![AURA Fashion Store - Wishlist](screenshots/wishlist.png)

### Customer Orders

![AURA Fashion Store - Orders](screenshots/orders.png)

### Admin Dashboard

![AURA Fashion Store - Admin Dashboard](screenshots/admin-dashboard.png)

### Admin Management

![AURA Fashion Store - Admin Management](screenshots/admin-management.png)


## Author

**Arjun Waman**
-BE Graduate (Information Technology)

## License

This project was developed as part of the **EduNest Full-Stack Developer Internship Assessment**.

This project is intended for educational and assessment purposes.
