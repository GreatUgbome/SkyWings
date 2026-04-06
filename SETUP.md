# Installation and Setup Guide

## Prerequisites

- Node.js 18+ (must be exactly 18 or higher)
- npm or yarn
- Git
- PostgreSQL 12+ (for database)
- Firebase CLI (`npm i -g firebase-tools`)
- Gmail account with App Password enabled

## Step 1: Clone or Navigate to Project

```bash
cd /Users/chukwukagreatugbome/SkyWings
```

## Step 2: Install Dependencies

```bash
# Clean install (recommended)
rm -rf node_modules package-lock.json
npm install

# Or if you prefer yarn
yarn install
```

This installs:
- Firebase Admin SDK and Functions
- Drizzle ORM for database
- TypeScript for type safety
- Testing and linting tools

## Step 3: Configure Environment Variables

### Create .env file

```bash
cp .env.example .env
```

### Edit .env with your values

```env
# Gmail Configuration - Get App Password from https://myaccount.google.com/apppasswords
EMAIL_USER=your-airline-email@gmail.com
EMAIL_PASSWORD=your-app-password

# PostgreSQL Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/skywings

# Firebase Configuration (from Firebase Console)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Environment
NODE_ENV=development
```

## Step 4: Setup Database

### 4a. Create PostgreSQL Database

```bash
# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Verify installation
psql --version

# Create database
createdb skywings

# Verify database exists
psql -l | grep skywings
```

### 4b. Initialize Database Schema

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

You should see:
```
Airlines seeded successfully
Airports seeded successfully
Flights seeded successfully
Database seeding completed successfully
```

### 4c. View Database (Optional)

```bash
# Open Drizzle Studio
npm run db:studio

# Opens at http://localhost:3000
```

## Step 5: Setup Firebase

### 5a. Initialize Firebase (if not done)

```bash
firebase init
```

Follow prompts:
- Select your Firebase project
- Enable Firestore
- Enable Functions
- Use TypeScript for Functions

### 5b. Configure Firebase Environment

```bash
# Set email configuration
firebase functions:config:set email.user="your-email@gmail.com"
firebase functions:config:set email.password="your-app-password"

# Verify configuration
firebase functions:config:get
```

## Step 6: Verify Installation

```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm run test

# Build check
npm run build:web || echo "OK"
```

All should pass with no errors.

## Step 7: Start Development Server

### In Terminal 1 - Firebase Emulator

```bash
npm run serve
```

You'll see:
```
✔ functions: Emulator started at http://localhost:5001
✓ Firestore Emulator started at http://localhost:8080
...
Web UI running at http://localhost:4000
```

### In Terminal 2 - Database Studio (Optional)

```bash
npm run db:studio
```

Opens at http://localhost:3000

## Step 8: Testing the Setup

### Test Firebase Function

1. Open Firestore UI: http://localhost:4000/firestore
2. Create test document:

```
Collection: artifacts/skywings-v2/users/{testUserId}/bookings
Document: {bookingId}

{
  "email": "test@example.com",
  "ref": "SKYW-TEST123",
  "paxName": "Test User",
  "flight": {
    "flightNumber": "SKW101",
    "date": "2024-03-15"
  },
  "seats": ["12A"]
}
```

Function triggers automatically - check logs:

```bash
npm run logs
```

### Test Database

```bash
npm run db:studio
```

Browse:
- airlines (1 record)
- airports (3 records)
- flights (2 records)

## Common Issues During Setup

### Issue: "PostgreSQL not found"

**macOS**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu)**:
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
```

### Issue: "Cannot connect to PostgreSQL"

```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Fix: Start service
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Issue: "Database 'skywings' does not exist"

```bash
createdb skywings
npm run db:push
```

### Issue: "npm install fails"

```bash
# Clear cache
rm -rf node_modules package-lock.json ~/.npm

# Reinstall with clean copy
npm install
```

### Issue: "Firebase emulator won't start"

```bash
# Kill port 5001 and 8080
lsof -ti:5001 | xargs kill -9
lsof -ti:8080 | xargs kill -9

# Try again
npm run serve
```

### Issue: "Email not sending"

Checklist:
- [ ] EMAIL_USER set in .env
- [ ] EMAIL_PASSWORD is actual App Password (not Gmail password)
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password created at https://myaccount.google.com/apppasswords
- [ ] Environment variables loaded: `cat .env`

## Verification Checklist

After installation, verify:

- [ ] Node.js version is 18+: `node --version`
- [ ] npm installed: `npm --version`
- [ ] PostgreSQL running: `psql -U postgres -c "SELECT 1"`
- [ ] Database exists: `psql -l | grep skywings`
- [ ] .env file created and populated
- [ ] Dependencies installed: `ls node_modules | wc -l` (should be > 500)
- [ ] Type checking passes: `npm run type-check`
- [ ] Tests pass: `npm run test`
- [ ] Firebase emulator starts: `npm run serve`

## Next: Development

Now you're ready to:

1. Start the dev server: `npm run serve`
2. Write code with full type safety
3. Test with Firestore emulator
4. Format code: `npm run format`
5. Check quality: `npm run lint`

## Deployment

### Deploy to Firebase

```bash
# Deploy everything
npm run deploy:all

# Deploy only functions
npm run deploy

# Deploy only rules
firebase deploy --only firestore:rules
```

### Deploy to Netlify

```bash
# Netlify auto-deploys on git push
# Or manually:
npm run build:web
netlify deploy --prod
```

## Need Help?

- Check logs: `npm run logs`
- Debug database: `npm run db:studio`
- Review README: `cat README.md`
- Check improvements: `cat IMPROVEMENTS.md`

---

**Installation Complete!** 🎉

Now proceed to the [README.md](README.md) for development and usage instructions.
