# Quick Reference Guide

## Common Commands

### Development

```bash
npm run serve          # Start Firebase emulator + functions
npm run dev            # Alternative: same as serve

npm run format         # Auto-format all code
npm run lint           # Check code quality
npm run type-check     # TypeScript validation
npm run test           # Run test suite
```

### Database

```bash
npm run db:seed        # Seed initial data
npm run db:push        # Apply schema to database
npm run db:migrate     # Create migrations
npm run db:studio      # Open Drizzle Studio UI
```

### Deployment

```bash
npm run deploy         # Deploy functions
npm run deploy:all     # Deploy everything (functions + rules + hosting)
npm run logs           # View function logs
```

---

## Project Structure Quick Lookup

| Directory | Purpose | Key Files |
|-----------|---------|-----------|
| `config/` | Configuration modules | `constants.ts`, `email.config.js` |
| `db/` | Database layer | `schema.ts`, `index.ts`, `seed.ts` |
| `utils/` | Utility functions | `validation.js`, `logger.js`, `errors.ts` |
| `__tests__/` | Test suites | `validation.test.ts` |
| `public/` | Static web files | `index.html` |
| `functions/` | Firebase function code | `index.js` |

---

## Environment Variables

```env
# Email
EMAIL_USER=your-airline-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/skywings

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="..."
FIREBASE_CLIENT_EMAIL=...@iam.gserviceaccount.com

# Runtime
NODE_ENV=development
```

---

## Firestore Collection Structure

```
artifacts/{appId}/
├── users/{userId}/
│   ├── bookings/{bookingId}
│   ├── profile/{...}
│   └── preferences/{...}
└── public/data/
    ├── flights/{flightId}
    ├── bookings/{bookingId}
    └── alerts/{alertId}
```

---

## Key Classes & Functions

### Validation (`utils/validation.js`)

```javascript
validateBooking(booking)        // Validate booking data
validateFlightData(flight)      // Validate flight data
sanitizeBookingData(booking)    // Sanitize inputs
```

### Logger (`utils/logger.js`)

```javascript
logger.info(msg, context)       // Info level
logger.warn(msg, context)       // Warning level
logger.error(msg, error, ctx)   // Error level
logger.debug(msg, context)      // Debug level (dev only)
```

### Error Classes (`utils/errors.ts`)

```javascript
new ValidationError(msg)        // Input validation failed
new NotFoundError(resource)     // Resource not found
new UnauthorizedError(msg)      // Access denied
new ConflictError(msg)          // Conflict (409)
```

### Booking Utils (`utils/booking.ts`)

```javascript
generateBookingReference()      // Create booking ref
calculateFlightDuration(dep, arr)
formatFlightDuration(hours)
calculateBookingPrice(price, count, tax)
isFlightAvailable(seats, required)
```

---

## Essential URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Firebase Emulator | http://localhost:4000 | Local Firestore UI |
| Firestore Emulator | http://localhost:8080 | Firestore data |
| Drizzle Studio | http://localhost:3000 | Database UI |
| Firebase Functions | http://localhost:5001 | Functions emulator |

---

## Troubleshooting Quick Fixes

### Issue: "Cannot find module 'firebase-admin'"
```bash
npm install
npm run serve
```

### Issue: "PostgreSQL connection refused"
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Issue: "Email not sending"
- Check `.env` has EMAIL_USER and EMAIL_PASSWORD
- Verify App Password (not Gmail password)
- Enable 2FA on Gmail account

### Issue: "Type errors in TypeScript"
```bash
npm run type-check
# Fix errors, then:
npm run format
npm run lint
```

### Issue: "Port already in use"
```bash
# Find and kill process
lsof -ti:4000,5001,8080 | xargs kill -9
npm run serve
```

---

## Git Workflow

```bash
# Before committing
npm run format              # Format code
npm run lint                # Check style
npm run type-check          # Check types
npm run test                # Run tests

# Then commit
git add .
git commit -m "feat: description"
git push
```

---

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage report
npm run test -- --coverage

# Single test file
npm run test validation.test.ts
```

---

## Logging Examples

```javascript
// Info
logger.info('Booking created', { bookingId: 'SKYW-123', userId: 'user123' });

// Warning
logger.warn('Email service not configured', { bookingId });

// Error
logger.error('Payment failed', paymentError, { bookingId, amount: 450 });

// Debug (dev only)
logger.debug('Query executed', { query, result });
```

---

## Validation Examples

```javascript
import { validateBooking, sanitizeBookingData } from './utils/validation';

// Validate
const validation = validateBooking(bookingData);
if (!validation.isValid) {
  console.log(validation.errors);  // Array of error messages
}

// Sanitize
const clean = sanitizeBookingData(bookingData);
// Trims whitespace, lowercases email, etc.
```

---

## Database Queries (Drizzle ORM)

```javascript
import { getDatabase } from './db';

const db = getDatabase();

// Select flights
const flights = await db.query.flights.findMany();

// Insert booking
await db.insert(bookings).values({ /* ... */ });

// Update booking
await db.update(bookings)
  .set({ status: 'confirmed' })
  .where(eq(bookings.id, bookingId));
```

---

## Firebase Security Rules Quick Reference

```firestore
// Check user is authenticated
function isAuthenticated() {
  return request.auth != null;
}

// Check user is owner
function isOwner(userId) {
  return request.auth.uid == userId;
}

// Check user is admin
function isAdmin() {
  return request.auth.token.admin == true;
}
```

---

## Constants Reference

```javascript
import { FLIGHT_STATUS, BOOKING_STATUS } from './config/constants';

FLIGHT_STATUS.SCHEDULED    // 'scheduled'
FLIGHT_STATUS.ON_TIME      // 'on_time'
FLIGHT_STATUS.DELAYED      // 'delayed'

BOOKING_STATUS.PENDING     // 'pending'
BOOKING_STATUS.CONFIRMED   // 'confirmed'
BOOKING_STATUS.CANCELLED   // 'cancelled'
```

---

## Performance Tips

1. Use database indexes for common queries
2. Batch multiple operations together
3. Cache frequently accessed data
4. Use pagination for large datasets
5. Monitor function execution time
6. Set appropriate timeouts

---

## Resources

- 📖 [README.md](README.md) - Full documentation
- 🚀 [SETUP.md](SETUP.md) - Setup guide
- 🐛 [DEBUG.md](DEBUG.md) - Debugging guide
- 📊 [IMPROVEMENTS.md](IMPROVEMENTS.md) - Change log
- 📋 [CLEANUP_REPORT.md](CLEANUP_REPORT.md) - Full report

---

**Keep this guide handy for quick reference during development!**
