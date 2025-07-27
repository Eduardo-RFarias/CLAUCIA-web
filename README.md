# Professional Management System

A modern Angular application for healthcare institutions to manage their nursing professionals. Built with Angular 20, Angular Material, and TypeScript.

## Features

- 🏥 **Institution Authentication** - Secure login system with JWT tokens
- 👥 **Professional Management** - Create, read, update, and delete nursing professionals
- 🎨 **Modern UI** - Material Design 3 components with responsive layout
- 🔒 **Route Protection** - Authentication guards to protect sensitive routes
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- ⚡ **Performance** - Lazy loading, signals, and optimized Angular features

## Tech Stack

- **Angular 20** - Latest Angular with standalone components and signals
- **Angular Material** - Material Design components
- **TypeScript** - Type-safe development
- **RxJS** - Reactive programming
- **SCSS** - Advanced styling capabilities

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd tcc-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## API Integration

The application integrates with a backend API running on `http://localhost:3000`. Ensure your backend API is running and follows the swagger specification provided in `swagger.json`.

### API Endpoints Used

- `POST /auth/login/institution` - Institution authentication
- `GET /professionals` - List all professionals
- `POST /professionals` - Create new professional
- `PATCH /professionals/{coren}` - Update professional
- `DELETE /professionals/{coren}` - Delete professional

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── login/                 # Login component
│   │   ├── dashboard/             # Main dashboard
│   │   └── professional-dialog/   # Professional form dialog
│   ├── services/
│   │   ├── auth.service.ts        # Authentication service
│   │   └── professional.service.ts # Professional API service
│   ├── guards/
│   │   └── auth.guard.ts          # Route protection
│   ├── interceptors/
│   │   └── auth.interceptor.ts    # JWT token interceptor
│   ├── models/
│   │   └── api.models.ts          # TypeScript interfaces
│   ├── app.config.ts              # App configuration
│   └── app.routes.ts              # Routing configuration
└── styles.scss                    # Global styles
```

## Features Overview

### Authentication

- Institution-based login with name and password
- JWT token storage in localStorage
- Automatic token validation and refresh
- Protected routes with authentication guards

### Professional Management

- **View Professionals**: Table view with pagination and sorting
- **Add Professional**: Modal form with validation
- **Edit Professional**: In-place editing with change detection
- **Delete Professional**: Confirmation dialog for safe deletion

### User Experience

- **Loading States**: Spinners and progress indicators
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation messages for actions
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels and keyboard navigation

## Development

### Code Style

- **Angular Style Guide**: Follows official Angular coding standards
- **TypeScript**: Strict type checking enabled
- **Reactive Forms**: Template-driven forms with validation
- **Signals**: Modern Angular reactivity patterns
- **Standalone Components**: No NgModules approach

### Testing

```bash
# Run unit tests
npm test

# Run e2e tests
npm run e2e
```

### Building

```bash
# Development build
npm run build

# Production build
npm run build --prod
```

## Configuration

### Environment Variables

The application uses the following configuration:

- **API_URL**: Backend API URL (default: `http://localhost:3000`)
- **TOKEN_KEY**: LocalStorage key for JWT token
- **INSTITUTION_KEY**: LocalStorage key for institution data

### Material Theme

The app uses Angular Material with a custom theme configured in `src/styles.scss`. You can customize colors and typography by modifying the Material theme configuration.

## Security

- JWT tokens are stored in localStorage
- HTTP interceptor automatically adds authorization headers
- Route guards prevent unauthorized access
- Form validation prevents malicious input
- CSRF protection through Angular's built-in mechanisms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## License

This project is licensed under the MIT License.
