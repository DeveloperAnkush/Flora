# Flora ERP

A modern ERP Dashboard built for **Ramnarayan Sales** — Home Care Cleaning Products Mfg. & Suppliers. Manage products, generate GST-compliant tax invoices, preview documents, and export professional PDFs from a premium SaaS-style admin dashboard.

## 🌟 Overview

Flora App is a Next.js-based ERP dashboard that streamlines day-to-day billing operations. It provides secure admin authentication, a product catalog, tax invoice creation with CGST/SGST/IGST support, invoice history, PDF generation, and a responsive dashboard with KPIs and analytics.

## 🚀 Key Features

### 🔐 Authentication

- **Admin Login** with email and password
- **JWT session cookies** (HTTP-only, secure in production)
- **Protected routes** for all dashboard pages
- **Logout confirmation** dialog



### 📊 Dashboard

- **Welcome section** with quick overview
- **KPI cards**: total revenue, invoice count, product count, monthly revenue
- **Monthly revenue chart** (last 6 months)
- **Recent invoices** and **recent customers**
- **Top products** by price
- **Quick actions** for common workflows



### 🧾 Invoice Management

- **Invoice list** with search, sticky table headers, and view actions
- **Create invoice form** with customer details, product rows, and tax selection
- **Searchable product selector** when adding line items
- **Automatic invoice numbering** (persisted, date-based)
- **Tax support**:
  - GST → CGST (9%) + SGST (9%)
  - IGST (18%) for inter-state supply
  - Dynamic subtotal, tax breakdown, and grand total
- **Invoice preview modal** fetched by invoice ID
- **PDF generation**, download, and print via jsPDF



### 📦 Product Management

- **Product catalog** with search
- **Add / edit / delete** products
- **Field-level validation** with inline error messages
- Products used directly in invoice line items



### 🎨 UI / UX

- **Premium SaaS dashboard** layout (sidebar + top navbar)
- **Collapsible sidebar** (desktop) and mobile drawer
- **Light & dark theme** with persistence
- **Framer Motion** animations
- **Skeleton loaders** and empty states
- **Responsive design** for desktop, tablet, and mobile
- **Geist** typography and shadcn/ui components



### 🔜 Planned (Sidebar placeholders)

- Customers
- Reports
- Settings



## 🛠️ Technical Stack



### Frontend

- **Next.js 16** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Framer Motion** for animations
- **Geist** font



### UI Components

- **Radix UI** (dialog, checkbox, label, separator)
- **Lucide React** icons
- **shadcn/ui**-style component library
- **class-variance-authority** + **tailwind-merge**



### Forms & Validation

- **React Hook Form** for invoice forms
- **Yup** validation schemas
- **@hookform/resolvers** for integration



### Backend & Data

- **Next.js API Routes** (App Router)
- **MongoDB** with **Mongoose**
- **bcryptjs** for password hashing
- **jose** for JWT session tokens



### PDF & Documents

- **jsPDF** + **jspdf-autotable** for invoice PDF export



## 🚀 Getting Started



### Prerequisites

- **Node.js 20+**
- **npm** (or yarn / pnpm)
- **MongoDB Atlas** account (or local MongoDB for development)



### Installation

1. **Clone the repository**
  ```bash
   git clone <repository-url>
   cd Flora
  ```
2. **Install dependencies**
  ```bash
   npm install
  ```
3. **Set up environment variables**
  ```bash
   cp env.example .env.local
  ```
   Edit `.env.local` with your values (see [Environment Variables](#-environment-variables)).
4. **Seed the database** (admin user + default products)
  ```bash
   npm run seed
  ```
5. **Run the development server**
  ```bash
   npm run dev
  ```
6. **Open your browser**
  Navigate to [http://localhost:3000](http://localhost:3000)



## 📁 Project Structure

```
Flora/
├── scripts/
│   └── seed-products.ts          # Seed admin user & products
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/             # Login & logout routes
│   │   │   ├── invoices/         # Invoice CRUD API
│   │   │   └── products/         # Product CRUD API
│   │   ├── dashboard/
│   │   │   ├── invoice/          # Invoice list & create
│   │   │   ├── products/         # Product catalog
│   │   │   ├── layout.tsx        # Dashboard shell
│   │   │   └── page.tsx          # Dashboard overview
│   │   ├── login/                # Admin login page
│   │   ├── layout.tsx            # Root layout & theme
│   │   └── globals.css           # Design tokens & themes
│   ├── components/
│   │   ├── dashboard/            # KPI cards, charts, widgets
│   │   ├── invoice/              # Invoice form sections
│   │   ├── layout/               # Sidebar, top navbar, shell
│   │   ├── shared/               # Empty states, skeletons
│   │   ├── theme/                # Light/dark theme provider
│   │   └── ui/                   # shadcn/ui primitives
│   ├── data/
│   │   └── products.json         # Default product seed data
│   ├── lib/
│   │   ├── auth.ts               # JWT & password utilities
│   │   ├── mongodb.ts            # MongoDB connection cache
│   │   ├── invoice-*.ts          # Calculations, PDF, API helpers
│   │   ├── product-api.ts        # Product serialization
│   │   ├── validation-schema.ts  # Yup schemas
│   │   └── agency.ts             # Company / GST details
│   ├── models/                   # Mongoose models
│   ├── types/                    # TypeScript interfaces
│   └── proxy.ts                  # Auth route protection
├── env.example                   # Environment template
└── package.json
```



## 🔧 Available Scripts


| Script          | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start development server             |
| `npm run build` | Build for production                 |
| `npm run start` | Start production server              |
| `npm run lint`  | Run ESLint                           |
| `npm run seed`  | Seed admin user and default products |




## 🌍 Environment Variables

Create a `.env.local` file based on `env.example`:

```env
# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/flora-billing?retryWrites=true&w=majority

# Secret key for JWT session tokens (min 32 characters)
AUTH_SECRET=your-super-secret-random-string-at-least-32-chars
```

Generate a secure `AUTH_SECRET`:

```bash
openssl rand -base64 32
```



## 🔐 Authentication

- Sessions use **HTTP-only cookies** signed with `AUTH_SECRET`
- Dashboard routes (`/dashboard/*`) require a valid session
- Unauthenticated users are redirected to `/login`
- Logged-in users visiting `/login` are redirected to `/dashboard`



## 📱 Responsive Design

The application is optimized for:

- Desktop (sidebar + full dashboard layout)
- Tablet (collapsible sidebar, stacked content)
- Mobile (drawer navigation, single-column forms and tables)



## 🎨 Theming

- **Light theme** — default SaaS palette (slate backgrounds, blue primary)
- **Dark theme** — toggle from the header; preference saved in `localStorage`
- Theme is applied via CSS variables on the `<html>` element



## 🚀 Deployment



### Vercel (Recommended)

1. Push the repository to **GitHub**
2. Import the project on [Vercel](https://vercel.com)
3. Add environment variables:
  - `MONGODB_URI`
  - `AUTH_SECRET`
4. Deploy
5. Run the seed script locally against your **production** MongoDB URI:
  ```bash
   MONGODB_URI="your-production-uri" AUTH_SECRET="your-secret" npm run seed
  ```



### MongoDB Atlas Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Under **Network Access**, allow `0.0.0.0/0` (required for Vercel serverless)
4. Copy the connection string into `MONGODB_URI`



### Other Platforms

Flora can be deployed anywhere that supports Next.js 16 and provides environment variables:

- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted Node.js server (`npm run build && npm run start`)



## 🧾 Invoice Business Rules

- Invoice numbers are generated automatically on save
- GST selection splits into CGST + SGST at 9% each
- IGST applies at 18% when selected
- Line totals = unit price × quantity
- Grand total = subtotal + applicable taxes
- PDF output uses Indian Rupee formatting (PDF-safe `Rs.` prefix)



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a pull request



## 📄 License

This project is private and intended for Ramnarayan Sales internal use.

---

**Flora App** — Modern ERP Dashboard for Ramnarayan Sales.