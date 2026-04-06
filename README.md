# SkyWings Flight Booking System

A premium flight booking system built with Firebase Cloud Functions, Firestore, and Drizzle ORM.

## Project Structure

```text
├── config/              # Configuration modules
│   └── email.config.js  # Email transporter setup
├── db/                  # Database setup and schema
│   ├── index.ts         # Database connection management
│   ├── schema.ts        # Drizzle ORM schema definitions
│   └── seed.ts          # Database seeding script
├── utils/               # Utility functions
│   ├── validation.js    # Input validation helpers
│   └── logger.js        # Logging utilities
├── index.js             # Firebase Cloud Function entry point
├── firestore.rules      # Firestore security rules
└── drizzle.config.ts    # Drizzle ORM configuration
```

## Quick Start

### Prerequisites

- Node.js 18+
- Firebase CLI
- PostgreSQL (for development)
- Gmail account with App Password (for email notifications)

### Installation

1. **Clone and install dependencies**

```bash
npm install
```

2. **Configure environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Email Configuration
EMAIL_USER=your-airline-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/skywings

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# Environment
NODE_ENV=development
```

3. **Setup PostgreSQL Database**

```bash
# Create database
createdb skywings

# Run migrations
npm run db:push

# Seed initial data
npm run db:seed
```

4. **Deploy Firebase Functions**

```bash
# Development
npm run serve

# Production
npm run deploy:all
```

## API Endpoints

### Booking Confirmation Email Function

**Trigger**: When a booking is created in Firestore

**Path**: `artifacts/{appId}/users/{userId}/bookings/{bookingId}`

**Automatically sends confirmation emails with**:
- Booking reference
- Flight details
- Passenger information
- Seat assignments

## Security Features

### Firestore Security Rules

- **User Data**: Only authenticated users can access their own data
- **Public Data**: Flight information readable by authenticated users
- **Admin Operations**: Only admins can create/update/delete flights and bookings
- **Booking Privacy**: Users can only read their own bookings

### Data Validation

All inputs are validated before processing:
- Email format validation
- Booking structure validation
- Flight data validation
- Seat number validation

### Environmental Security

- Credentials stored in `.env` (never committed to version control)
- No hardcoded secrets in code
- Email credentials managed through environment variables

## Development

### Running the Development Server

```bash
npm run serve
```

This starts the Firebase emulator suite with both Functions and Firestore.

### Code Quality

```bash
# Format code
npm run format

# Check code style
npm run lint

# Type checking
npm run type-check

# Run tests
npm run test
```

### Database Management

```bash
# Create migrations
npm run db:migrate

# Push schema changes
npm run db:push

# View database in studio
npm run db:studio

# Seed database
npm run db:seed
```

## Logging

The application uses a centralized logger that outputs structured JSON logs:

```javascript
logger.info('Booking confirmation sent', { bookingId, email });
logger.error('Email sending failed', error, { bookingId });
logger.warn('Email service not configured');
```

## Deployment

### Firebase Functions

```bash
# Deploy functions only
npm run deploy

# Deploy everything (functions, rules, hosting)
npm run deploy:all
```

### Environment Variables

Set environment variables in Firebase:

```bash
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"
firebase functions:config:set firebase.project_id="your-project-id"
```

Then redeploy:

```bash
npm run deploy
```

## Testing

```bash
# Run all tests
npm run test

# Run with coverage
npm run test -- --coverage
```

## Troubleshooting

### "Unable to load schema from 'https://raw.githubusercontent.com/firebase/firebase-tools/master/schema/firebase-config.json'"

This error occurs when Firebase CLI tries to fetch schema online but your connection is offline.

**Solution**: This is a temporary network issue. Try again when connection is restored. It doesn't affect functionality since the schema is cached locally.

### Email not sending

1. Check environment variables are set correctly
2. Verify Gmail App Password is correct
3. Ensure 2FA is enabled on Gmail account
4. Check Firebase logs: `npm run logs`

### Database connection errors

1. Verify PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Ensure database exists: `createdb skywings`

## Contributing Guidelines

1. Follow code style: `npm run format`
2. Pass linting: `npm run lint`
3. Type-safe: `npm run type-check`
4. Add tests for new features
5. Update documentation

## License

Proprietary - SkyWings
