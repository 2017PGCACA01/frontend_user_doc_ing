## Features

- User authentication and authorization
- Document upload and management
- Role-based access control
- Document versioning
- Document search and filtering
- User management (admin only)
- Document ingestion tracking

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- Angular CLI (v17 or later)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/jk-tech-frontend.git
cd jk-tech-frontend
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
ng test --code-coverage
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
