# Development and Debug Guide

## Debugging

### Enable Debug Logging

Set environment variable:

```bash
NODE_ENV=development npm run serve
```

This enables:

- Debug-level logging
- Enhanced error messages
- Detailed operation traces

### Firebase Functions Local Debugging

```bash
npm run serve
```

This starts:
- Local Firestore emulator
- Local Functions emulator
- Local storage emulator
- Web UI at http://localhost:4000

### Inspecting Firestore Emulator Data

1. Open http://localhost:4000/firestore in your browser
2. Browse collections and documents
3. Create test data
4. Export data for testing

### Viewing Logs

```bash
# Live logs
npm run logs

# Retrieve historical logs
firebase functions:log --limit 50
```

## Development Workflow

### 1. Start Development Environment

```bash
npm run serve
```

### 2. Run in Another Terminal

```bash
# Format code
npm run format

# Type checking
npm run type-check

# Linting
npm run lint

# Tests
npm run test -- --watch
```

### 3. Database Development

```bash
# Start database studio
npm run db:studio

# Open Drizzle Studio at http://localhost:3000
```

### 4. Making Changes

- Edit files (auto-reload is enabled with emulator)
- Check logs immediately: `npm run logs`
- Use browser DevTools for client-side debugging

## Common Issues

### Issue: "Cannot find module 'firebase-admin'"

```bash
npm install
firebase deploy --only functions
```

### Issue: Email not sending in development

Email sending requires:
1. Gmail App Password configured
2. Email credentials in `.env`
3. Firebase Functions must have network access

Check logs:
```bash
firebase functions:log --limit 20
```

### Issue: TypeScript compilation errors

Run type check:
```bash
npm run type-check
```

Fix issues and try again.

### Issue: Database connection refused

Ensure PostgreSQL is running:
```bash
# macOS
brew services start postgresql

# Check if running
psql -U postgres -c "SELECT version();"
```

### Issue: Migrations failing

```bash
# Reset and reapply
npm run db:push -- --force
```

## Testing Locally

### Test Email Sending

Create test document:
```javascript
// In Firestore emulator
artifacts/skywings-v2/users/{userId}/bookings/{bookingId}
{
  email: "test@example.com",
  ref: "SKYW-123456",
  paxName: "Test User",
  flight: {
    number: "SKW101",
    date: "2024-03-15"
  },
  seats: ["12A", "12B"]
}
```

Function triggers automatically and logs to console.

### Test Validation

```bash
npm run test -- validation.test.ts
```

### Load Testing

```bash
# Install ab (Apache Bench)
brew install httpd

# Simple load test
ab -n 100 -c 10 http://localhost:5000/your-function
```

## Performance Profiling

### Firebase Functions Performance

```bash
firebase functions:log --limit 100 | grep "duration"
```

### Database Query Performance

```bash
npm run db:studio
# Check query execution times in Drizzle Studio
```

## Environment Debugging

### View All Environment Variables

```bash
firebase functions:config:get
```

### Set/Update Environment Variables

```bash
firebase functions:config:set email.user="new@email.com"
firebase deploy --only functions
```

## Firestore Rules Testing

### Test Rules Locally

Use Firestore emulator with security rules:
```bash
npm run serve
```

Then test with curl or your client SDK.

### Validate Rules Syntax

```bash
firebase deploy --only firestore:rules --dry-run
```

## Git Workflow

### Before Pushing

```bash
npm run format
npm run lint
npm run type-check
npm run test
git add .
git commit -m "feat: description"
git push
```

### Revert Changes

```bash
# Undo local changes
git checkout -- .

# Undo commits
git reset --hard HEAD~1
```

## Deployment Debugging

### Dry Run

```bash
firebase deploy --dry-run
```

### Check Deployment Status

```bash
firebase deploy:list
```

### View Deployment Errors

Check Firebase Console: https://console.firebase.google.com

## Performance Tips

1. **Use indexes**: Check query performance in Firestore console
2. **Batch operations**: Group multiple writes together
3. **Cache results**: Store frequently accessed data
4. **Optimize queries**: Use filters instead of downloading all data
5. **Monitor logs**: Watch for slow operations

## Chrome DevTools Debugging

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Look for your JavaScript files
4. Set breakpoints
5. Reload to debug

## VS Code Debugging

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Firebase Emulator",
      "program": "${workspaceFolder}/node_modules/.bin/firebase",
      "args": ["emulators:start"],
      "cwd": "${workspaceFolder}",
      "runtimeArgs": ["--nolazy"]
    }
  ]
}
```

Then press F5 to debug.
