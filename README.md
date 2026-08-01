# 📚 Library Management System — Frontend

An Angular 14 client for the Library Management System, providing a responsive, role-based interface for book management, member management, borrow/return workflows, reservations, and reporting.

> 🔗 **Backend repo:** [library-management-system](https://github.com/fuadhasan01/LibraryManagementSystemAPI) — the ASP.NET Core 9 API this app consumes.

---

## 🎯 Overview

This is the client application for the Library Management System, built with **Angular 14** using an **NgModule-based architecture**. It consumes the backend REST API and provides role-based views and navigation for Admin, Librarian, and Member users.

### Key Features

- ✅ **JWT Authentication** — login flow with token storage and HTTP interceptor for authenticated requests
- ✅ **Role-based Navigation** — UI adapts to Admin, Librarian, and Member roles
- ✅ **Book Management** — browse, search, filter, create, edit, and delete books
- ✅ **Member Management** — member lifecycle, borrowing limits, fine tracking
- ✅ **Branch Management** — multi-branch views and inventory
- ✅ **Borrow & Return** — full borrowing workflow with fine calculation feedback
- ✅ **Reservation Queue** — reserve books and track queue position
- ✅ **Reports Dashboard** — visual reporting across 7+ report types
- ✅ **Reactive Forms** — form validation throughout
- ✅ **Responsive Design** — Bootstrap 5 + Font Awesome

---

## 🏗️ Project Structure

```
library-management-frontend/
├── src/
│   ├── app/
│   │   ├── core/               # Guards, interceptors, core services
│   │   ├── shared/             # Shared components, pipes, directives
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── books/
│   │   │   ├── members/
│   │   │   ├── branches/
│   │   │   ├── borrow/
│   │   │   ├── reservations/
│   │   │   └── reports/
│   │   └── app-routing.module.ts
│   ├── environments/
│   └── assets/
├── angular.json
├── package.json
└── README.md
```

### Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Angular 14 (NgModule-based) |
| **State/Forms** | Reactive Forms, RxJS |
| **HTTP** | Angular HttpClient with JWT interceptor |
| **UI Framework** | Bootstrap 5 + Font Awesome |
| **API** | ASP.NET Core 9 backend (see backend repo) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [Angular CLI 14](https://angular.io/cli)
- The backend API running locally — see the [backend repo](https://github.com/fuadhasan01/LibraryManagementSystemAPI) for setup

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/fuadhasan01/LibraryManagementSystemFrontend.git
cd library-management-frontend

# 2. Install dependencies
npm install

# 3. Run the development server
ng serve
```

The app will be available at `http://localhost:4200`. Make sure the backend API is running first (default: `https://localhost:7001`).

### Default Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@library.com` | `Admin@123` |
| Librarian | `librarian@library.com` | `Librarian@123` |
| Member | `member@library.com` | `Member@123` |

---

---

## 🧩 Application Architecture

| Concern | Approach |
|---|---|
| Authentication | JWT stored client-side, attached via `HttpInterceptor` |
| Route Protection | `AuthGuard` / role guards on feature routes |
| Forms | Reactive Forms with built-in and custom validators |
| API Communication | Typed services per feature, using `HttpClient` |
| Error Handling | Centralized error interceptor with user-facing messages |
| Styling | Bootstrap 5 utility classes + component-scoped SCSS |

---

## 📦 Build & Deployment

```bash
# Production build
ng build --configuration=production

# Output is written to dist/
```

Deploy the contents of `dist/` to any static hosting service or web server (Nginx, IIS, Azure Static Web Apps, etc.), and configure it to route all paths to `index.html` for Angular's client-side routing to work correctly.

---

---

## 📊 Feature Modules

| Module | Description | Access |
|---|---|---|
| Auth | Login and session handling | Public |
| Books | Book catalog, search, CRUD | All roles (CRUD: Admin/Librarian) |
| Members | Member management | Admin/Librarian |
| Branches | Branch and inventory views | Admin/Librarian |
| Borrow/Return | Borrowing workflow | Admin/Librarian |
| Reservations | Reservation queue | Admin/Librarian |
| Reports | Analytics dashboard | Admin/Librarian |

---

## 💡 What I Would Add Given More Time

- Standalone components / migration off NgModules
- State management with NgRx for larger shared state
- Unit test coverage for all feature modules
- Lazy-loaded feature modules for faster initial load
- Dark mode / theming support

---

## ✅ Requirements Checklist

| Requirement | Status |
|---|---|
| Responsive Web Application | ✅ Complete |
| JWT Authentication | ✅ Complete |
| Role-based Navigation | ✅ Complete |
| Book Management UI | ✅ Complete |
| Member Management UI | ✅ Complete |
| Branch Management UI | ✅ Complete |
| Borrow & Return UI | ✅ Complete |
| Reservation Queue UI | ✅ Complete |
| Reports Dashboard | ✅ Complete |
| Reactive Forms & Validation | ✅ Complete |

---

## 👤 Author

**Fuad Hasan**
Software Engineer

- Email: `<labib.knc@gmail.com>`
- GitHub: `@<https://github.com/fuadhasan01>`
- LinkedIn: `<https://www.linkedin.com/in/fuadhasan01/>`


---

*Built for a .NET Software Engineer Technical Assessment.*
