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