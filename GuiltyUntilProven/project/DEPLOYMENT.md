# Deployment Guide

This guide explains how to deploy your AI Detective Game and troubleshoot common deployment issues.

## Pre-Deployment Checklist

Before deploying, ensure:

- ✅ All Supabase migrations are applied
- ✅ Environment variables are configured
- ✅ Local build completes successfully
- ✅ No TypeScript errors
- ✅ Database connection is working

## Environment Variables Required

Your deployment platform needs these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

**Important**: Never commit these values to Git. Use your platform's environment variable management.

## Build Configuration

The project is configured to suppress common warnings that don't affect functionality:

### Next.js Config (`next.config.js`)

```javascript
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,  // Skip linting during build
  },
  images: { unoptimized: true },  // Optimize for static export
  webpack: (config, { isServer }) => {
    // Suppress Supabase realtime warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    return config;
  },
};
```

## Common Deployment Issues & Solutions

### Issue 1: Critical Dependency Warning

**Symptom**:
```
Critical dependency: the request of a dependency is an expression
Import trace: @supabase/realtime-js
```

**Solution**: ✅ Already fixed in `next.config.js`

This warning is harmless and comes from Supabase's realtime library. It doesn't affect functionality.

### Issue 2: Browserslist Outdated

**Symptom**:
```
Browserslist: caniuse-lite is outdated. Please run:
npx browserslist@latest --update-db
```

**Solution**: ✅ Already fixed by running the update command

To update manually:
```bash
npx update-browserslist-db@latest
```

### Issue 3: Build Timeout

**Symptom**: Build takes too long and times out

**Solutions**:
1. Increase build timeout in your platform settings
2. Check for infinite loops in components
3. Verify API calls aren't blocking the build

### Issue 4: Environment Variables Not Loading

**Symptom**:
```
TypeError: Cannot read property 'supabase' of undefined
```

**Solutions**:
1. Verify all env vars are set in deployment platform
2. Check variable names match exactly (including NEXT_PUBLIC_ prefix)
3. Redeploy after adding/changing variables

### Issue 5: Database Connection Fails

**Symptom**:
```
Error: Database connection failed
```

**Solutions**:
1. Verify Supabase URL is correct
2. Check anon key is valid
3. Ensure RLS policies are applied
4. Check Supabase project is not paused

### Issue 6: TypeScript Errors

**Symptom**:
```
Type error: Cannot find name 'xyz'
```

**Solutions**:
1. Run `npm run typecheck` locally first
2. Fix all TypeScript errors before deploying
3. Check all imports are correct

## Platform-Specific Instructions

### Vercel

1. Connect your Git repository
2. Add environment variables in Project Settings
3. Deploy automatically on push

**Build Command**: `npm run build`
**Output Directory**: `.next`

### Netlify

1. Connect your Git repository
2. Add environment variables in Site Settings
3. Configure build settings:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `.next`

### Railway

1. Create new project from GitHub repo
2. Add environment variables
3. Railway auto-detects Next.js and builds

### Self-Hosted

Requirements:
- Node.js 18+
- npm or yarn
- Process manager (PM2 recommended)

```bash
# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "detective-game" -- start

# Or use Node directly
npm start
```

## Testing Your Deployment

After deployment, test these features:

### Anonymous User Flow
1. Visit your deployed URL
2. Try playing without logging in
3. Verify leaderboard loads
4. Check game completion works

### Authenticated User Flow
1. Sign up for a new account
2. Verify email (if required)
3. Log in
4. Play a complete game
5. Check stats are saved
6. Verify leaderboard shows your score
7. Check profile page displays correctly

### API Endpoints
Test these URLs (replace with your domain):

- `https://your-domain.com/` - Should load landing page
- `https://your-domain.com/api/test` - Should return test response
- `https://your-domain.com/api/ai/ask` - Should handle AI queries (POST)

## Performance Optimization

For better performance:

1. **Enable Caching**
   - Static assets cached by CDN
   - API responses cached when appropriate

2. **Optimize Images**
   - Already configured with `unoptimized: true`
   - Consider using Next.js Image optimization in production

3. **Monitor Performance**
   - Check Supabase dashboard for slow queries
   - Monitor API response times
   - Watch for memory leaks

## Monitoring & Logs

### Check Application Logs

**Vercel**: Project → Deployments → Logs
**Netlify**: Site → Deploys → Deploy Log
**Railway**: Project → Logs

### Check Database Logs

Supabase Dashboard → Logs → Database

Look for:
- Failed queries
- RLS policy violations
- Connection errors

### Check API Logs

Supabase Dashboard → Logs → API

Look for:
- Authentication failures
- Rate limit issues
- Invalid requests

## Rollback Procedure

If deployment fails:

1. **Immediate**: Revert to previous deployment in platform
2. **Fix**: Address issues in development
3. **Test**: Verify fix works locally
4. **Deploy**: Push fixed version

## Security Checklist

Before going live:

- [ ] All environment variables are set correctly
- [ ] API keys are not exposed in client code
- [ ] RLS policies are applied and tested
- [ ] Leaked password protection is enabled
- [ ] HTTPS is enforced
- [ ] CORS is configured correctly
- [ ] Rate limiting is enabled (if available)

## Getting Help

If you encounter issues:

1. Check browser console for errors
2. Check deployment platform logs
3. Check Supabase logs
4. Review this deployment guide
5. Check other documentation:
   - `README.md` - Project overview
   - `SUPABASE_SETUP.md` - Database setup
   - `SECURITY_FIXES.md` - Security configuration
   - `QUICK_START.md` - Quick setup guide

## Build Output

A successful build should show:

```
✓ Compiled successfully
✓ Checking validity of types
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    ~90 kB         ~170 kB
├ ○ /_not-found                          ~1 kB          ~80 kB
├ λ /api/ai/ask                          0 B                0 B
└ λ /api/test                            0 B                0 B
```

No warnings or errors should appear.

## Post-Deployment

After successful deployment:

1. Test all features thoroughly
2. Monitor error logs for 24 hours
3. Check database performance
4. Verify authentication works
5. Test from different devices/browsers
6. Share with test users

## Troubleshooting Commands

Run these locally to diagnose issues:

```bash
# Check TypeScript types
npm run typecheck

# Build locally
npm run build

# Start production build locally
npm run start

# Check for outdated packages
npm outdated

# Update dependencies (carefully)
npm update
```

## Support

For platform-specific issues, consult:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Documentation](https://supabase.com/docs)

---

Your deployment should now work smoothly! 🚀
