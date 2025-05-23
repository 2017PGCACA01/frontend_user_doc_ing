# Frontend

A modern Angular-based frontend application for document management and user administration.

## Features

- **User Authentication & Authorization**  
  Secure login and access control using token-based authentication.

- **Document Upload & Management**  
  Upload, view, edit, and manage documents with ease.

- **Role-Based Access Control**  
  Manage access and permissions based on user roles.

- **Document Versioning**  
  Maintain and track multiple versions of a document.

- **Advanced Document Search & Filtering**  
  Quickly locate documents with dynamic search and filter options.

- **Admin User Management**  
  Admin-exclusive functionality to manage system users.

- **Ingestion Tracking**  
  Monitor document ingestion status and history.

---

## Prerequisites

Ensure the following are installed on your system:

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (v9 or later)
- [Angular CLI](https://angular.io/cli) (v17 or later)

---

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/2017PGCACA01/frontend_user_doc_ing.git
   cd frontend_user_doc_ing

   ```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4200`.

## Building for Production

To build the application for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

This project uses Jasmine and Karma for unit testing.

To run all unit tests for the project, use:

```bash
npm test
```

This will launch the Karma test runner and execute all Jasmine test cases. You can view the results in the terminal or in the browser window that opens.

### Test Coverage

To generate a code coverage report, run:

```bash
npx ng test --no-watch  --code-coverage
```

The coverage report will be available in the `coverage/` directory.

### Example Test Cases

- **ApiService:** Tests for HTTP GET, POST, PUT, DELETE.
- **DocumentService:** Tests for document CRUD operations.
- **UserListComponent:** Tests for component creation and user loading.

### Adding More Tests

Add new test files with the `.spec.ts` extension in the same directory as the file you want to test. Use Jasmine's `describe` and `it` blocks to structure your tests. Use Angular's `TestBed` and `HttpClientTestingModule` for service/component testing.

## Project Structure

```
src/
├── app/
│   ├── core/           # Core services, guards, and interceptors
│   ├── features/       # Feature modules
│   │   ├── auth/       # Authentication module
│   │   ├── documents/  # Document management module
│   │   ├── users/      # User management module
│   │   └── ingestions/ # Document ingestion module
│   ├── shared/         # Shared components and utilities
│   └── app.module.ts   # Root module
├── assets/            # Static assets
├── environments/      # Environment configurations
└── styles.css        # Global styles
```

## Deployment :

- Build frontend (Angular) → generates dist/
- Upload files to S3 bucket (private)
- CloudFront pulls from S3 → caches at edge locations
- Invalidate CloudFront cache post-deploy
- Route 53 maps domain to CloudFront
- Users access app securely via HTTPS and custom domain

```
The entire flow will be automated through github continuous workflow and gulp lib.
```
