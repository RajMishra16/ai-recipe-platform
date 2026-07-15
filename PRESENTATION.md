# AI RECIPE PLATFORM
## Complete Technical Presentation Guide

---

## TABLE OF CONTENTS
1. Project Overview
2. Architecture
3. Frontend Tech Stack
4. Backend Tech Stack
5. Database Layer
6. Authentication & Security
7. AI Integration
8. Key Workflows
9. Data Flow
10. API Endpoints
11. Deployment
12. Performance
13. Security Features
14. Scalability
15. Cost Analysis
16. Development Workflow
17. Key Features
18. Monitoring & Debugging

---

## 1. PROJECT OVERVIEW

### What is it?
A full-stack web application that uses AI to generate recipes based on ingredients with pantry management and personalized meal recommendations.

### Key Features:
- ✅ AI-powered recipe generation (Google Gemini)
- ✅ Pantry management system
- ✅ Recipe saving and collection
- ✅ Personalized meal recommendations
- ✅ Nutritional analysis (Pro feature)
- ✅ PDF recipe export
- ✅ User authentication with Clerk
- ✅ Subscription model (Free/Pro)

---

## 2. ARCHITECTURE

### Three-Tier Architecture

```
┌─────────────────────────────────────────────┐
│           PRESENTATION LAYER                │
│  (Frontend - Next.js React Application)     │
│  • User Interface                           │
│  • Client-side logic                        │
│  • Authentication (Clerk)                   │
│  • Port: 3000                               │
└──────────────┬──────────────────────────────┘
               │ API Calls (REST/JSON)
┌──────────────▼──────────────────────────────┐
│          BUSINESS LOGIC LAYER               │
│  (Backend - Strapi CMS)                     │
│  • AI Recipe Generation (Gemini)            │
│  • Data validation                          │
│  • API endpoints                            │
│  • Rate limiting (Arcjet)                   │
│  • Port: 1337                               │
└──────────────┬──────────────────────────────┘
               │ Database Query (ORM)
┌──────────────▼──────────────────────────────┐
│            DATA LAYER                       │
│  (Database - SQLite/PostgreSQL)             │
│  • Users & Authentication                   │
│  • Recipes & AI-generated content           │
│  • Saved Recipes collection                 │
│  • Pantry Items inventory                   │
│  • Location: .tmp/data.db                   │
└─────────────────────────────────────────────┘
```

---

## 3. FRONTEND TECH STACK

### Core Framework
- **Next.js 16.1.1**
  - Server-side rendering (SSR)
  - Static site generation (SSG)
  - API routes
  - App Router (latest)
  - Turbopack bundler

- **React 19.2.3**
  - Component-based UI
  - Hooks (useState, useEffect, etc.)
  - Server & Client components

### Styling & UI
- **Tailwind CSS 4**
  - Utility-first CSS framework
  - PostCSS integration
  - Custom animations

- **Radix UI**
  - Unstyled, accessible components
  - Dialog, Tabs, Slots

- **Shadcn UI**
  - Pre-built components
  - Button, Card, Badge, Dialog

- **Lucide Icons**
  - 1000+ icons
  - Consistent design

### Key Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| @clerk/nextjs | 6.36.5 | Authentication & user management |
| @google/generative-ai | 0.24.1 | AI recipe generation |
| arcjet | 1.0.0-beta.16 | Security (rate limiting, bot detection) |
| @react-pdf/renderer | 4.3.2 | PDF export |
| sonner | 2.0.7 | Toast notifications |
| react-dropzone | 14.3.8 | File upload |
| next-themes | 0.4.6 | Dark mode support |
| clsx | 2.1.1 | Class name utility |

### Build & Quality Tools
- **ESLint 9** - Code linting
- **Turbopack** - Fast bundling
- **TailwindCSS PostCSS 4** - Advanced styling

---

## 4. BACKEND TECH STACK

### CMS Framework
- **Strapi 5.33.1**
  - Headless CMS (API-first)
  - Content management
  - Role-based access control
  - GraphQL & REST API
  - Plugin system

### Key Plugins
- **@strapi/plugin-users-permissions** - User authentication & roles
- **@strapi/plugin-cloud** - Cloud deployment support

### Runtime & Package Manager
- **Node.js** - v20.0.0 to v24.x.x
- **npm** - v6.0.0+

### Database Drivers
- **better-sqlite3** - SQLite driver (development)
- **pg** - PostgreSQL driver (production)

### Additional Dependencies
- **react** v18.0.0 - Admin UI
- **react-dom** v18.0.0 - Admin rendering
- **react-router-dom** v6.0.0 - Admin routing
- **styled-components** v6.0.0 - Admin styling

---

## 5. DATABASE LAYER

### Current Configuration (Development)
- **Type**: SQLite
- **Location**: `backend/.tmp/data.db`
- **Storage**: File-based (single file)
- **Best For**: Development, testing, prototyping

### Supported Options
1. **PostgreSQL** - Production recommended
2. **MySQL** - Alternative option
3. **Neon DB** - PostgreSQL as a service

### Data Models

#### Users Table
```
- ID (Primary Key)
- Clerk ID (External auth ID)
- Email (Unique)
- First Name / Last Name
- Username
- Image URL
- Subscription Tier (free/pro)
- Confirmed (boolean)
- Blocked (boolean)
- Created At / Updated At (timestamps)
```

#### Recipes Table
```
- ID (Primary Key)
- Title (Unique)
- Description
- Category (breakfast, lunch, dinner, snack, dessert)
- Cuisine (italian, chinese, mexican, indian, american, etc.)
- Prep Time (minutes)
- Cook Time (minutes)
- Ingredients (JSON array)
- Instructions (JSON array)
- Nutritional Info (JSON - Pro only)
- Image URL
- Author (User reference/FK)
- Created At / Updated At
```

#### Saved Recipes Table
```
- ID (Primary Key)
- User ID (Foreign Key)
- Recipe ID (Foreign Key)
- Saved At (timestamp)
```

#### Pantry Items Table
```
- ID (Primary Key)
- User ID (Foreign Key)
- Item Name
- Quantity
- Unit
- Added At (timestamp)
```

### Query Examples

**Find user's recipes:**
```sql
SELECT r.* FROM recipes r 
WHERE r.author_id = {userId}
```

**Get saved recipes for user:**
```sql
SELECT r.* FROM recipes r 
JOIN saved_recipes sr ON r.id = sr.recipe_id 
WHERE sr.user_id = {userId}
```

**Get user's pantry:**
```sql
SELECT * FROM pantry_items 
WHERE user_id = {userId}
```

---

## 6. AUTHENTICATION & SECURITY

### Authentication Flow

#### Clerk Integration
1. **Sign Up/Sign In**
   - Google OAuth
   - Email/Password
   - Passwordless (email links)

2. **Session Management**
   - JWT tokens stored in browser
   - Automatic refresh
   - Secure HttpOnly cookies (backend)

3. **User Data**
   - Stored in Clerk (authentication)
   - User metadata in Strapi
   - Subscription tier sync

### Authorization

**Role-Based Access Control:**
- Anonymous (not logged in)
- Authenticated (free user)
- Authenticated + Pro (paid user)

**API Token Authentication:**
- Strapi API Token (Bearer token)
- Sent with every backend request
- Stored in `.env.local` (never commit)

### Security Features

| Feature | Purpose | Tool |
|---------|---------|------|
| **Clerk Auth** | Secure authentication | Clerk |
| **JWT Tokens** | API authorization | Node.js |
| **Arcjet Shield** | WAF (Web App Firewall) | Arcjet |
| **Bot Detection** | Prevent abuse | Arcjet |
| **Rate Limiting** | DoS protection | Arcjet |
| **HTTPS** | Encrypted communication | Deployment |
| **Env Variables** | Secret management | .env.local |

### Environment Variables (Secrets)

**Frontend (.env.local):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
STRAPI_API_TOKEN=3075b83b...
GEMINI_API_KEY=AQ.Ab8RN6LS...
UNSPLASH_ACCESS_KEY=hDkT6dIX...
```

**Backend (.env):**
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
API_TOKEN_SALT=salt
ADMIN_JWT_SECRET=secret
JWT_SECRET=secret
ENCRYPTION_KEY=key
```

### Rate Limiting Strategy (Arcjet)

**Free Tier:**
- 10 pantry scans per month
- 5 AI recommendations per month
- Token bucket algorithm

**Pro Tier:**
- 1000 requests per day
- Unlimited pantry scans
- Unlimited AI recipes

---

## 7. AI INTEGRATION (GOOGLE GEMINI)

### How Recipe Generation Works

#### Step 1: User Input
```
User enters: "Paneer Tikka"
```

#### Step 2: Validation
```
Frontend checks:
- Input not empty
- Check user auth
- Check rate limits
```

#### Step 3: Send to Backend
```
Server Action: getOrGenerateRecipe()
- Pass: { recipeName: "Paneer Tikka" }
```

#### Step 4: Database Check
```
Backend queries Strapi:
SELECT * FROM recipes 
WHERE LOWER(title) = LOWER("Paneer Tikka")

Result: Exists? → Return | Not exists? → Generate
```

#### Step 5: AI Generation
```
Call Google Gemini 2.5 Flash:

Prompt:
"Generate a detailed recipe for: Paneer Tikka
Return ONLY valid JSON with:
- title, description, category, cuisine
- prepTime, cookTime, servings
- ingredients (name, quantity, unit)
- instructions (step-by-step)
- nutritionalInfo (if Pro user)"
```

#### Step 6: Image Fetching
```
Call Unsplash API:
GET /search/photos?query=Paneer+Tikka
Returns: High-quality recipe image URL
```

#### Step 7: Save to Database
```
INSERT INTO recipes (title, description, ...)
VALUES ("Paneer Tikka", ..., userId)
```

#### Step 8: Return to Frontend
```
Response:
{
  success: true,
  recipe: { ... },
  recipeId: 123,
  isSaved: false,
  fromDatabase: false,
  message: "New recipe generated!"
}
```

#### Step 9: Display
```
Frontend renders:
- Recipe details
- Ingredients list
- Instructions
- Nutritional info (if Pro)
- Save button
- PDF download
```

### Gemini Model Details
- **Model**: gemini-2.5-flash-lite
- **Context**: Up to 1M tokens
- **Speed**: Ultra-fast responses
- **Cost**: Pay per token used

### Prompting Strategy
- Specific JSON format requirement
- Exact field names enforced
- Validation of outputs
- Error handling for malformed responses

---

## 8. KEY WORKFLOWS

### Workflow 1: Generate Recipe

```
┌─────────────────────────┐
│  User enters ingredient │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Frontend validates input            │
│ ✓ Not empty                         │
│ ✓ Length check                      │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Check user authentication           │
│ Get user from Clerk                 │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Call Server Action                  │
│ getOrGenerateRecipe(formData)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Backend validates:                  │
│ ✓ User authenticated (Strapi)       │
│ ✓ API token valid                   │
│ ✓ Rate limit check (Arcjet)         │
└────────────┬────────────────────────┘
             │
             ▼
      ┌──────┴──────┐
      │             │
      ▼             ▼
   EXISTS?        NEW?
      │             │
      │             ▼
      │  ┌─────────────────────┐
      │  │ Call Gemini API     │
      │  │ Generate JSON       │
      │  └────────┬────────────┘
      │           │
      │           ▼
      │  ┌─────────────────────┐
      │  │ Fetch from Unsplash │
      │  │ Get image URL       │
      │  └────────┬────────────┘
      │           │
      │           ▼
      │  ┌─────────────────────┐
      │  │ Save to database    │
      │  │ INSERT into recipes │
      │  └────────┬────────────┘
      │           │
      └─────┬─────┘
            │
            ▼
┌─────────────────────────────────────┐
│ Return to frontend                  │
│ {                                   │
│   success: true,                    │
│   recipe: {...},                    │
│   recipeId: 123,                    │
│   fromDatabase: true/false          │
│ }                                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Display recipe                      │
│ • Title, description                │
│ • Ingredients                       │
│ • Instructions                      │
│ • Nutrition (Pro only)              │
│ • Save/PDF buttons                  │
└─────────────────────────────────────┘
```

### Workflow 2: Subscription (Billing)

```
┌──────────────────────────┐
│ User clicks "Subscribe"  │
└────────────┬─────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ CheckoutButton from Clerk            │
│ Plan ID: cplan_3CUTMeTOPH9qOVAO...  │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Redirect to Clerk payment page       │
│ (Stripe integration)                 │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ User enters payment details          │
│ • Card number                        │
│ • Expiry, CVC                        │
│ • Billing address                    │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Payment processing                   │
│ (Stripe secures payment)             │
└────────────┬─────────────────────────┘
             │
             ▼
      ┌──────┴──────┐
      │             │
      ▼             ▼
  SUCCESS        FAILED
      │             │
      │             ▼
      │   ┌──────────────────────┐
      │   │ Show error message   │
      │   │ Retry payment        │
      │   └──────────────────────┘
      │
      ▼
┌──────────────────────────────────────┐
│ Clerk marks user as "Pro"            │
│ Update user metadata                 │
│ Send confirmation email              │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Frontend checks subscription         │
│ Sync with Strapi user record         │
│ Update subscriptionTier = "pro"      │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ User features unlocked               │
│ • Unlimited AI recipes               │
│ • Nutritional analysis               │
│ • All features accessible            │
└──────────────────────────────────────┘
```

---

## 9. DATA FLOW

### API Call Flow

```
FRONTEND (Browser)
│
├─ User triggers action
│ (Generate Recipe, Save, etc.)
│
├─ Next.js Server Action
│ (getOrGenerateRecipe)
│
├─ HTTP Request (POST/GET)
│ localhost:1337/api/recipes
│
└─► BACKEND (Strapi)
    │
    ├─ Validate request
    ├─ Check authentication token
    ├─ Verify permissions
    │
    ├─ If recipe needed:
    │ └─► GOOGLE GEMINI API
    │     (Generate recipe JSON)
    │
    ├─ If image needed:
    │ └─► UNSPLASH API
    │     (Fetch image)
    │
    ├─ Database Query (ORM)
    │ └─► SQLITE/POSTGRES
    │     (Save/retrieve data)
    │
    └─► HTTP Response (JSON)
        │
        └─── FRONTEND
            │
            ├─ Parse JSON
            ├─ Update state
            ├─ Re-render UI
            └─ Display to user
```

### Real-Time Data Sync

```
User A changes subscription
    ↓
Strapi updates: subscriptionTier = "pro"
    ↓
Frontend refetch (checkUser)
    ↓
UI updates: Pro features visible
```

---

## 10. API ENDPOINTS

### Recipe Endpoints

```
GET    /api/recipes
       Fetch all recipes
       Query params: filters, sort, pagination

GET    /api/recipes/{id}
       Get single recipe by ID
       Includes author and related data

POST   /api/recipes
       Create new recipe
       Headers: Authorization: Bearer TOKEN
       Body: { title, description, ... }

PUT    /api/recipes/{id}
       Update recipe
       Headers: Authorization: Bearer TOKEN
       Body: { fields to update }

DELETE /api/recipes/{id}
       Delete recipe
       Headers: Authorization: Bearer TOKEN
```

### Saved Recipes Endpoints

```
GET    /api/saved-recipes
       Get user's saved recipes
       Filters: filters[user][id][$eq]={userId}

POST   /api/saved-recipes
       Save recipe to collection
       Body: { user: userId, recipe: recipeId }

DELETE /api/saved-recipes/{id}
       Remove from saved collection
```

### Pantry Endpoints

```
GET    /api/pantry-items
       Get user's pantry items

POST   /api/pantry-items
       Add item to pantry
       Body: { itemName, quantity, unit }

PUT    /api/pantry-items/{id}
       Update pantry item

DELETE /api/pantry-items/{id}
       Remove from pantry
```

### User Endpoints

```
GET    /api/users
       List users (admin)

GET    /api/users/{id}
       Get user profile

POST   /api/users
       Create new user
       Body: { email, username, password }

PUT    /api/users/{id}
       Update user info
       Body: { subscriptionTier, ... }
```

---

## 11. DEPLOYMENT ARCHITECTURE

### Frontend Deployment

**Recommended: Vercel**
- One-click deployment from GitHub
- Automatic builds on push
- Environment variables in dashboard
- Built-in CI/CD
- Preview deployments

**Alternative Options:**
- Netlify
- Railway
- Render
- AWS Amplify

### Backend Deployment

**Option 1: Strapi Cloud (Easiest)**
- Managed Strapi hosting
- Automatic deployments
- Built-in database
- CDN included

**Option 2: Traditional Hosting**
- Railway.app
- Render
- Heroku
- AWS EC2

### Database Deployment

**Development:**
```
SQLite (.tmp/data.db)
↓
Local file storage
```

**Production:**
```
PostgreSQL (Neon)
↓
Cloud database
↓
Automatic backups
```

### External Services (Cloud)

| Service | Purpose | Location |
|---------|---------|----------|
| Clerk | Authentication | Cloud |
| Google Cloud | Gemini API | Cloud |
| Unsplash | Images API | Cloud |
| Arcjet | Security | Cloud |
| Stripe | Payments | Cloud |

### Deployment Flow

```
Developer pushes code
    ↓
GitHub webhook triggered
    ↓
┌─────────────────┬──────────────────┐
│                 │                  │
▼                 ▼                  ▼
Vercel         Railway         Strapi Cloud
(Frontend)     (Backend)       (DB+CMS)
    │               │              │
    ├─ npm build    ├─ npm build   ├─ Migrations
    ├─ Deploy       ├─ Deploy      └─ Deploy
    ├─ HTTPS        ├─ HTTPS
    └─ Ready        └─ Ready       Ready
    │               │              │
    └───────┬───────┴──────┬───────┘
            │              │
            ▼              ▼
    Production Environment Running
```

---

## 12. PERFORMANCE OPTIMIZATION

### Frontend Optimization

**Build Optimization:**
- Turbopack (faster than Webpack)
- Code splitting by route
- Dynamic imports for components
- Tree shaking unused code

**Runtime Optimization:**
- Next.js Image optimization
- Lazy loading images
- Server-side rendering (SSR)
- Static generation (SSG) where possible
- Caching strategies

**Network:**
- GZIP compression
- Minified CSS/JS
- CDN delivery (Vercel Edge Network)

### Backend Optimization

**API Caching:**
- Response caching
- Database query caching
- Redis integration (optional)

**Database Optimization:**
- Indexing on foreign keys
- Connection pooling
- Query optimization
- Pagination for large results

**Rate Limiting:**
- Prevents abuse
- Arcjet token bucket algorithm
- Per-user limits

### Monitoring

**Frontend:**
- Google Analytics
- Error tracking (Sentry optional)
- Performance metrics

**Backend:**
- Request logging
- Error logs
- Performance monitoring

---

## 13. SECURITY FEATURES

### Authentication Security
- OAuth 2.0 (Google)
- JWT tokens (stateless)
- Secure session handling
- Passwordless option

### API Security
- Bearer token authentication
- CORS protection
- Rate limiting (Arcjet)
- Request validation

### Data Security
- Encryption at rest (database)
- HTTPS/TLS encryption in transit
- Secure environment variables
- No secrets in code

### Application Security
- Web Application Firewall (Arcjet Shield)
- Bot detection
- DDoS protection
- XSS prevention
- CSRF tokens

### Infrastructure Security
- HTTPS only
- Secure headers
- Regular updates
- Dependency scanning

---

## 14. SCALABILITY STRATEGY

### Current Limitations (SQLite)
- Single user: ✅ Works great
- 10 users: ✅ Works
- 100 users: ⚠️ Might slow down
- 1000+ users: ❌ Not recommended

### Scaling to Production

**Step 1: Database Migration**
```
SQLite → PostgreSQL (Neon)
- Better concurrency
- Handles more users
- Professional backup/restore
```

**Step 2: Caching Layer**
```
Add Redis
- Cache API responses
- Cache Gemini results
- Session storage
```

**Step 3: Load Balancing**
```
Multiple backend instances
- Load balancer (nginx)
- Auto-scaling
- High availability
```

**Step 4: CDN & Caching**
```
Global content delivery
- Static assets on CDN
- Image optimization
- Edge caching
```

**Step 5: Microservices (Future)**
```
Separate concerns:
- Auth service
- Recipe service
- Recommendation engine
- Payment service
```

### Expected Scalability

| Users | Database | Backend | Frontend |
|-------|----------|---------|----------|
| 1-10 | SQLite | 1 instance | Vercel |
| 10-100 | PostgreSQL | 1-2 instances | Vercel |
| 100-1000 | PostgreSQL + Redis | 3-5 instances | Vercel + CDN |
| 1000+ | Distributed DB | Auto-scaling | Edge network |

---

## 15. COST ANALYSIS

### Monthly Cost Breakdown

#### Hosting Costs

| Service | Free Tier | Paid Tier | Monthly Cost |
|---------|-----------|-----------|--------------|
| **Vercel (Frontend)** | 100GB bandwidth | Usage | $0-50 |
| **Railway (Backend)** | $5 credit/mo | $0.10/hour | $20-100 |
| **Neon (Database)** | 3GB storage | $0.16/GB | $10-50 |
| **Clerk (Auth)** | 10k MAU | $30/10k MAU | $0-30 |
| **Arcjet (Security)** | Basic | $20 | $20 |
| **Total** | - | - | **$50-250/mo** |

#### API Costs (Usage-based)

| API | Pricing | Usage |
|-----|---------|-------|
| Gemini API | $0.075 per 1M tokens | ~1.5M tokens/month = $0.11 |
| Unsplash API | Free (50 req/hour) | Included |
| Stripe (Payments) | 2.9% + $0.30 | ~$10 revenue = $0.59 |

#### Subscription Revenue

**Pricing Model:**
- Free: $0
- Pro: $7.99/month

**Break-even Analysis:**
```
Revenue needed per customer: $5-10
With $7.99 Pro plan:
- 100 Pro users = $799/mo revenue
- Costs ~$150/mo
- Profit = $649/mo ✓ Profitable
```

---

## 16. DEVELOPMENT WORKFLOW

### Local Setup

```bash
# 1. Clone repository
git clone <repo-url>
cd ai-recipe-platform

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Create environment files
# .env (backend)
# .env.local (frontend)

# 4. Start backend
cd backend
npm run develop
# Runs on http://localhost:1337

# 5. Start frontend (new terminal)
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Local URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:1337
- Strapi Admin: http://localhost:1337/admin
- Strapi GraphQL: http://localhost:1337/graphql

### Development Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Run production build
npm run lint         # Lint code

# Backend
npm run develop      # Start dev server
npm run build        # Production build
npm run start        # Run production build
npm run strapi       # CLI commands
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/recipe-generation

# Make changes
git add .
git commit -m "feat: add recipe generation"

# Push to GitHub
git push origin feature/recipe-generation

# Create Pull Request
# Review → Merge → Auto-deploy
```

---

## 17. KEY FEATURES DETAILED

### Feature 1: AI Recipe Generation

**How it works:**
1. User enters ingredient/recipe name
2. Backend checks if recipe exists
3. If not, calls Gemini API
4. AI generates detailed recipe
5. Image fetched from Unsplash
6. Saved to database
7. Displayed to user

**Tech Stack:**
- Google Gemini 2.5 Flash
- Strapi for storage
- Unsplash for images

### Feature 2: Authentication

**Providers:**
- Google OAuth (recommended)
- Email/Password
- Passwordless (email links)

**Features:**
- Automatic signup
- Session management
- Profile management
- Subscription tracking

**Tech Stack:**
- Clerk (authentication)
- JWT tokens
- Secure sessions

### Feature 3: Subscription

**Tiers:**
- **Free**: $0/month
  - 10 pantry scans
  - 5 AI recommendations
  - Standard recipes

- **Pro**: $7.99/month
  - Unlimited scans
  - Unlimited AI recipes
  - Nutrition analysis
  - Chef tips & tricks
  - Ingredient substitutions
  - Priority support

**Tech Stack:**
- Clerk Billing
- Stripe payment processing
- Custom plan ID management

### Feature 4: Pantry Management

**Features:**
- Add/remove items
- Track quantities
- Unit measurements
- Search functionality

**Use Cases:**
- Plan meals based on what you have
- Avoid buying duplicates
- Calculate what recipes you can make

### Feature 5: Recipe Saving

**Features:**
- Save favorite recipes
- Organize collection
- Quick access
- Sync across devices

**Tech Stack:**
- Database relationships
- User-recipe association
- Fast retrieval

### Feature 6: PDF Export

**Features:**
- Download recipe as PDF
- Print-friendly format
- Includes ingredients & instructions
- Professional layout

**Tech Stack:**
- @react-pdf/renderer
- Dynamic PDF generation
- Client-side rendering

---

## 18. MONITORING & DEBUGGING

### Frontend Debugging

**Browser DevTools:**
- Network tab (API calls)
- Console (errors/logs)
- React DevTools (component inspection)
- Performance tab (load times)

**Checking State:**
```javascript
console.log("Recipe state:", recipe);
console.log("User data:", user);
console.log("Loading state:", loadingRecipe);
```

### Backend Debugging

**Strapi Admin:**
- Content Manager (database inspection)
- Settings (configuration)
- API Tokens (auth)
- Webhooks (events)

**Server Logs:**
```bash
# Check backend terminal for logs
npm run develop
# Look for [INFO], [ERROR], [WARN]
```

### API Testing

**Manual Testing Tools:**
- Postman
- Insomnia
- REST Client (VS Code)

**Example Request:**
```bash
curl -X GET http://localhost:1337/api/recipes \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

### Error Handling

**Common Errors:**

| Error | Cause | Fix |
|-------|-------|-----|
| 401 Unauthorized | Invalid API token | Regenerate in Strapi |
| 403 Forbidden | No permission | Check user role |
| 429 Too Many | Rate limit exceeded | Wait or upgrade plan |
| 500 Server Error | Backend crash | Check server logs |

### Performance Metrics

**Frontend:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

**Backend:**
- API response time: < 500ms
- Database query time: < 100ms
- Gemini API call: 2-5s

---

## CONCLUSION

This AI Recipe Platform demonstrates:

✅ **Modern Architecture**
- Three-tier design
- Microservices ready
- Scalable infrastructure

✅ **Full-Stack Development**
- Frontend: React, Next.js, Tailwind
- Backend: Strapi, Node.js
- Database: SQLite/PostgreSQL

✅ **Cloud Integration**
- Google Gemini AI
- Clerk authentication
- Multiple external APIs

✅ **Production Ready**
- Security (Arcjet, encryption)
- Authentication (OAuth)
- Error handling
- Performance optimized

✅ **Business Logic**
- Subscription model
- Rate limiting
- User management

### Technologies Highlight

**Most Important Technologies:**
1. **React/Next.js** - Frontend framework
2. **Strapi** - Headless CMS
3. **Clerk** - Authentication
4. **Google Gemini** - AI generation
5. **PostgreSQL** - Production database

### Future Enhancements

- [ ] Mobile app (React Native)
- [ ] Meal planning calendar
- [ ] Social features (share recipes)
- [ ] Machine learning recommendations
- [ ] Real-time collaboration
- [ ] Multi-language support
- [ ] Voice commands
- [ ] Smart grocery list integration

---

## REFERENCES & RESOURCES

**Official Documentation:**
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Strapi: https://strapi.io/documentation
- Clerk: https://clerk.com/docs
- Google Gemini: https://ai.google.dev
- Tailwind CSS: https://tailwindcss.com

**Deployment:**
- Vercel: https://vercel.com
- Railway: https://railway.app
- Neon: https://neon.tech

**Learning Resources:**
- Next.js Tutorial: https://nextjs.org/learn
- Strapi Blog: https://strapi.io/blog
- Web Dev: https://web.dev

---

**Document Generated:** April 17, 2026
**Project:** AI Recipe Platform
**Tech Stack Version:** Latest (2026)
