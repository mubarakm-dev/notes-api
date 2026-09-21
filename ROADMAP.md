# Notes API Learning Roadmap

A complete step-by-step guide from Day 0 to a working NestJS app with Postgres.

**Philosophy:** Every command explained. Every file explained. Nothing assumed.

---

## 📊 Progress Status

| Day | Topic | Status |
|-----|-------|--------|
| **Day 0** | Environment Setup | ✅ **COMPLETED** |
| **Day 1** | Config, Database, First Module | ✅ **COMPLETED** |
| **Day 2** | DTOs, Validation, Error Handling | ✅ **COMPLETED** |
| **Day 3** | Authentication Basics | ⏳ Pending |
| **Day 4** | Advanced Queries & Testing | ⏳ Pending |
| **Day 5** | Relationships & Nested Routes | ⏳ Pending |
| **Day 6** | Unit & E2E Testing | ⏳ Pending |
| **Day 7** | Deployment Prep | ⏳ Pending |

---

---

# DAY 0 — Environment Setup

## What Day 0 Accomplishes

You're setting up your **development environment** — the tools and infrastructure your code will run on.

Think of it like building a house:
- Day 0 = Build the foundation, electrical, plumbing
- Day 1 onwards = Build the rooms

Without a solid Day 0, Day 1 will fail.

---

## Day 0 Checklist

- [ ] Node.js v20+ installed
- [ ] NestJS CLI installed globally
- [ ] NestJS project created (`notes-api`)
- [ ] Docker Desktop installed
- [ ] Docker containers running (Postgres + Redis)
- [ ] Can connect to Postgres
- [ ] Strict TypeScript flags enabled
- [ ] First git commit made

---

## Step 0.1 — Check Node.js Version

**What this does:** Verifies you have a recent version of Node.js (the JavaScript runtime).

**Why:** NestJS requires Node v18+, but v20 or v22 is recommended. Old versions silently break.

**Command:**
```powershell
node -v
```

**Expected output:**
```
v20.x.x or v22.x.x
```

**If older:** Install [nvm-windows](https://github.com/coreybutler/nvm-windows) or update Node manually.

---

## Step 0.2 — Install NestJS CLI Globally

**What this does:** Installs the NestJS command-line tool system-wide so you can generate code.

**Why:** The `nest` command lets you:
- Create new projects: `nest new my-app`
- Generate modules, controllers, services: `nest g module notes`

**Command:**
```powershell
npm i -g @nestjs/cli
```

**Breaking it down:**
| Part | Means |
|---|---|
| `npm` | Node Package Manager (installed with Node) |
| `i` | install (shorthand) |
| `-g` | global (system-wide, not in a project folder) |
| `@nestjs/cli` | the package to install |

**Verify:**
```powershell
nest --version
```

Should print a version number.

---

## Step 0.3 — Create NestJS Project

**What this does:** Generates a new NestJS project with all the boilerplate code.

**Why:** You could write everything from scratch, but NestJS gives you a solid starting point with proper structure, configuration, and scripts.

**Command (in your projects folder):**
```powershell
nest new notes-api
```

**What happens:**
1. NestJS creates a folder called `notes-api`
2. Downloads dependencies (takes 2-5 minutes)
3. Initializes git

**When it asks which package manager:** Choose **npm**.

**Folder structure created:**
```
notes-api/
├── src/
│   ├── main.ts                 ← Entry point (boots the app)
│   ├── app.module.ts           ← Root module (organizes the app)
│   ├── app.controller.ts       ← Example controller (delete later)
│   ├── app.service.ts          ← Example service (delete later)
│   └── app.controller.spec.ts  ← Example test
├── test/                       ← End-to-end tests folder
├── package.json                ← Dependencies and scripts
├── tsconfig.json               ← TypeScript configuration
├── nest-cli.json               ← NestJS CLI settings
└── .eslintrc.js                ← Linting rules
```

---

## Step 0.4 — Open in Your Editor

**Command:**
```powershell
cd notes-api
code .
```

This opens the project in VS Code. If you use a different editor (Cursor, Vim, etc.), use that instead.

---

## Step 0.5 — Read the Foundation Files

**Don't skip this.** Read these two files to understand the structure:

**File 1: `src/main.ts`**

This is the **entry point** — where the app boots.

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

**What it does:**
1. `NestFactory.create(AppModule)` — Tells Nest "use AppModule to build the app"
2. `app.listen(3000)` — Listen on http://localhost:3000

**Why:** This is the single entry point. Everything else is pulled in through modules.

---

**File 2: `src/app.module.ts`**

This is the **root module** — the top-level organizer.

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**What it does:**
- `@Module({})` — Says "this is a module"
- `imports: []` — Other modules this one needs
- `controllers: [AppController]` — Classes that handle HTTP
- `providers: [AppService]` — Classes that do business logic

**Why:** This is how Nest knows what to wire up. Express you wrote `app.use()` by hand. Here you declare structure in a decorator.

---

## Step 0.6 — Run the App (Hello World)

**Command:**
```powershell
npm run start:dev
```

**What it does:**
1. Starts the NestJS server in watch mode (restarts on file save)
2. Listens on http://localhost:3000

**Expected output:**
```
[Nest] 12345  - 08/31/2026, 10:30:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 08/31/2026, 10:30:01 AM     LOG [InstanceLoader] AppModule dependencies initialized +25ms
[Nest] 12345  - 08/31/2026, 10:30:01 AM     LOG [RoutesResolver] AppController {...}:
[Nest] 12345  - 08/31/2026, 10:30:01 AM     LOG [RouterExplorer] Mapped {/, GET} route +4ms
[Nest] 12345  - 08/31/2026, 10:30:01 AM     LOG [NestApplication] Nest application successfully started
```

**Open in browser:** http://localhost:3000

Should see: `Hello World!`

**Keep this running.** Open a second PowerShell tab for the next steps.

---

## Step 0.7 — Enable Strict TypeScript

**Why:** TypeScript can be loose (like JavaScript) or strict (catches bugs at compile time). Strict mode is harder at first but saves hours later.

**Open:** `tsconfig.json`

**Find:** `compilerOptions` section

**Add/update these flags:**
```json
"strict": true,
"strictNullChecks": true,
"noImplicitAny": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true
```

**What each does:**

| Flag | Means |
|---|---|
| `strict` | Master switch for all strict checks |
| `strictNullChecks` | `null` is not automatically included in types; you must handle it explicitly |
| `noImplicitAny` | `any` is not allowed (you must specify types) |
| `noUncheckedIndexedAccess` | `arr[0]` might not exist; TypeScript tracks this |
| `noImplicitReturns` | Every code path must return a value |

**After saving:** Your terminal may show errors in the generated files. Fix them (you'll learn TypeScript doing this).

---

## Step 0.8 — Ban `any` in the Linter

**Why:** `any` turns off type checking. The linter forces you to be explicit instead of lazy.

**Open:** `eslint.config.mjs` (or `.eslintrc.js` in older projects)

**Find:** `rules` section

**Add:**
```js
'@typescript-eslint/no-explicit-any': 'error',
```

---

## Step 0.9 — Install Docker Desktop

**What Docker is:**

Docker lets you run **isolated mini-computers** (containers) on your machine. Each container has its own OS, databases, everything.

**Why you need it:**
- Install Postgres and Redis without cluttering your system
- Same environment locally as production
- Easy to delete and start fresh
- Portable to teammates and cloud

**How to install:**

1. Go to https://docs.docker.com/get-docker/
2. Download **Docker Desktop for Windows** (x86_64)
3. Run the installer
4. Restart your computer
5. Verify:
   ```powershell
   docker --version
   ```

---

## Step 0.10 — Understand `docker-compose.yml`

**What it is:** A recipe file that says "I want these containers running."

**Why YAML:** It's human-readable, indentation-matters, no brackets/braces clutter.

**The file format:**

```yaml
services:           # Containers to run
  db:               # Container name: "db"
    image: postgres:16    # Use official Postgres v16 image
    environment:          # Pass variables to the container
      POSTGRES_USER: notes
      POSTGRES_PASSWORD: notes
      POSTGRES_DB: notes
    ports:
      - "5432:5432"       # hostPort:containerPort (make it accessible)
    volumes:
      - pgdata:/var/lib/postgresql/data  # Persist data across restarts

  redis:            # Another container: "redis"
    image: redis:7
    ports:
      - "6379:6379"

volumes:            # Define named volumes
  pgdata:           # Data storage for Postgres
```

**Line-by-line breakdown:**

| Line | What It Does | Why |
|---|---|---|
| `services:` | List the containers | Tells Docker "here's what I want running" |
| `db:` | Container name | You'll refer to it as "db" |
| `image: postgres:16` | Use official Postgres v16 | Pre-built container, ready to go |
| `POSTGRES_USER: notes` | Username inside container | When Postgres starts, create this user |
| `POSTGRES_PASSWORD: notes` | Password for that user | Your app will use this to connect |
| `POSTGRES_DB: notes` | Database name | Create a DB called "notes" on startup |
| `ports: "5432:5432"` | Make it accessible | Container's 5432 → your machine's 5432 |
| `volumes: pgdata:/var/lib/postgresql/data` | Persist data | When container stops, data survives |
| `volumes: pgdata:` | Define the volume | Storage location |

---

## Step 0.11 — Create `docker-compose.yml`

**In your project root** (same folder as `package.json`), create a file named `docker-compose.yml` with this content:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_USER: notes
      POSTGRES_PASSWORD: notes
      POSTGRES_DB: notes
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7
    ports:
      - "6379:6379"

volumes:
  pgdata:
```

**Save it.** No editing needed.

---

## Step 0.12 — Start the Containers

**Command:**
```powershell
docker compose up -d
```

**Breaking it down:**
| Part | Means |
|---|---|
| `docker compose` | Docker container manager |
| `up` | Start containers |
| `-d` | Detached (background; returns your prompt) |

**What happens:**
1. Docker downloads Postgres v16 image (first time only, ~500MB)
2. Docker downloads Redis v7 image (~100MB)
3. Containers start
4. Your prompt returns immediately

**Verify they're running:**
```powershell
docker compose ps
```

**Expected output:**
```
NAME                COMMAND             STATUS
notes-api-db-1      postgres            Up 10 seconds
notes-api-redis-1   redis-server        Up 11 seconds
```

Both should say `Up`. If they say `Exited`, something failed. Show me the error.

---

## Step 0.13 — Connect to Postgres

**Why:** Verify the database is actually running and reachable.

**Option A: Using DBeaver (GUI, recommended)**

1. Install DBeaver: https://dbeaver.io/download/
2. Open DBeaver
3. Click `Database` → `New Database Connection` → `PostgreSQL`
4. Fill in:
   ```
   Server Host: localhost
   Port: 5432
   Database: notes
   Username: notes
   Password: notes
   ```
5. Click `Test Connection` → Should say "Connected"

**Option B: Using `psql` (command line)**

```powershell
psql -h localhost -U notes -d notes
```

When prompted for password, type: `notes`

If you see `postgres=#` prompt, ✅ you're connected.

Type `\q` to exit.

---

## Step 0.14 — Commit to Git

**What this does:** Saves your progress in version control.

**Why:** If you break something later, `git diff` shows what changed. You can roll back.

**Commands:**
```powershell
git add .
git commit -m "Day 0: NestJS scaffold with strict TS, Docker, and Postgres setup"
```

**What happened:**
1. `git add .` — Stage all new files
2. `git commit -m "..."` — Save with a message

---

## Day 0 Complete When

- ✅ `npm run start:dev` serves `Hello World!`
- ✅ `docker compose ps` shows both containers running
- ✅ Can connect to Postgres (DBeaver or `psql`)
- ✅ Strict TypeScript flags enabled
- ✅ First commit made

**Next:** Read Day 1 section below, then implement.

---

# DAY 1 — Configuration, Database, First Module

## What Day 1 Accomplishes

You're wiring up the **database connection** and creating your **first feature module** with a working route.

By end of Day 1, you'll understand:
- How NestJS loads config from `.env`
- How to inject the database into services
- How modules organize code
- How to make a complete request: HTTP → Controller → Service → Database

---

## Day 1 Checklist

- [ ] Install config and validation packages
- [ ] Create `.env` file with database credentials
- [ ] Create validation schema with Joi
- [ ] Set up ConfigModule in app.module.ts
- [ ] Install Drizzle ORM and Postgres driver
- [ ] Create database schema
- [ ] Create database module with custom provider
- [ ] Generate and run first migration
- [ ] Generate notes module, controller, service
- [ ] Create GET /notes route that queries the database
- [ ] Commit progress

---

## Step 1.1 — Install Config Package

**Command:**
```powershell
npm i @nestjs/config joi
```

**Breaking it down:**
| Part | Means |
|---|---|
| `npm i` | Install |
| `@nestjs/config` | NestJS's config module |
| `joi` | Validation library for env vars |

**Why:**
- `@nestjs/config` — Loads `.env` file and provides `ConfigService`
- `joi` — Validates env vars at startup; catches missing variables before bugs happen

---

## Step 1.2 — Create `.env` File

**In project root**, create `.env` with your credentials:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://notes:notes@localhost:5432/notes
JWT_ACCESS_SECRET=dev-only-change-me-at-least-16-chars-long
JWT_REFRESH_SECRET=dev-only-change-me-too-at-least-16-chars-long
```

**What each variable means:**

| Variable | Value | Why |
|---|---|---|
| `NODE_ENV` | `development` | Tells the app it's in dev mode (not production) |
| `PORT` | `3000` | Which port to listen on |
| `DATABASE_URL` | `postgres://...` | Where to find Postgres (same as docker-compose.yml) |
| `JWT_ACCESS_SECRET` | Long string | Secret key for access tokens (needed later) |
| `JWT_REFRESH_SECRET` | Long string | Secret key for refresh tokens (needed later) |

**Important:** Never commit `.env` to git. Add to `.gitignore`:

```
.env
.env.local
```

---

## Step 1.3 — Create Validation Schema

**Create file:** `src/config/validation.schema.ts`

```ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
});
```

**What it does:**

Each line is a validation rule:

| Line | Means |
|---|---|
| `NODE_ENV: Joi.string().valid(...)` | `NODE_ENV` must be one of these strings |
| `.required()` | This variable must exist |
| `PORT: Joi.number().default(3000)` | `PORT` must be a number, default to 3000 if missing |
| `DATABASE_URL: Joi.string().required()` | Must be a string and must exist |
| `JWT_ACCESS_SECRET: Joi.string().min(16)` | Must be 16+ characters (security) |

**Why:**

When the app boots, Joi validates all env vars. If any are missing or wrong, the app refuses to start with a clear error:

```
[error] Missing required environment variable: DATABASE_URL
```

Better than a confusing crash three hours into a request.

---

## Step 1.4 — Wire Config Into App Module

**Open:** `src/app.module.ts`

**Replace the whole file with:**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validation.schema';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**What it does:**

| Part | Means |
|---|---|
| `ConfigModule.forRoot({...})` | Load `.env` file globally |
| `isGlobal: true` | Every module can access `ConfigService` without importing |
| `validationSchema` | Use the Joi schema to validate on startup |

**Why:**

Now every service can inject `ConfigService` and read env vars:

```ts
constructor(private config: ConfigService) {}

getDbUrl() {
  return this.config.getOrThrow<string>('DATABASE_URL');
}
```

---

## Step 1.5 — Test Config Validation

**Temporarily** comment out `DATABASE_URL` in `.env`:

```
# DATABASE_URL=postgres://notes:notes@localhost:5432/notes
```

**Restart the app** (`npm run start:dev`):

```
[error] Config validation error: "DATABASE_URL" is required
```

Perfect! Now Nest refuses to boot if a required var is missing.

**Uncomment it back:**

```
DATABASE_URL=postgres://notes:notes@localhost:5432/notes
```

---

## Step 1.6 — Install Drizzle ORM

**Command:**
```powershell
npm i drizzle-orm pg
npm i -D drizzle-kit @types/pg
```

**Breaking it down:**

| Part | Means |
|---|---|
| `drizzle-orm` | The ORM (maps database to TypeScript) |
| `pg` | Postgres driver (connects to Postgres) |
| `-D drizzle-kit` | CLI tool to generate migrations |
| `@types/pg` | TypeScript types for the Postgres driver |

**Why:**

- `drizzle-orm` — Instead of writing raw SQL, you write TypeScript: `db.select().from(users).where(eq(users.id, 1))`
- `pg` — The actual connection to Postgres
- `drizzle-kit` — Tool to compare your schema to the database and generate migration SQL

---

## Step 1.7 — Define Your Database Schema

**Create file:** `src/database/schema.ts`

```ts
import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['user', 'admin'] }).notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
```

**Line-by-line breakdown:**

| Line | Means |
|---|---|
| `pgTable('users', {...})` | Create a table called "users" |
| `uuid('id')` | Column named "id", type UUID |
| `.primaryKey()` | This is the unique identifier |
| `.defaultRandom()` | Auto-generate a random UUID on insert |
| `text('email')` | Column named "email", type text |
| `.notNull()` | This column cannot be empty |
| `.unique()` | No two rows can have the same email |
| `.references(() => users.id)` | This note points to a user (foreign key) |
| `timestamp('created_at').defaultNow()` | Auto-set to current time on insert |

**Why:**

Drizzle lets you define your database in TypeScript instead of raw SQL. Benefits:
- Type-safe queries
- Auto-generated migrations
- Relationships are explicit (`.references()`)
- Postgres enforces referential integrity (you can't delete a user if notes reference them)

---

## Step 1.8 — Create Database Module

**Create file:** `src/database/database.module.ts`

```ts
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

export const DB = 'DB_CONNECTION';

@Global()
@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DB],
})
export class DatabaseModule {}
```

**This is your first custom provider. Breaking it down:**

| Part | Means |
|---|---|
| `@Global()` | Export this module globally (every module can use it) |
| `provide: DB` | The token to inject (a string, since it's not a class) |
| `inject: [ConfigService]` | Dependencies the factory needs |
| `useFactory: (config) => {...}` | Function to create the provider |
| `new Pool({...})` | Create a Postgres connection pool (reuses connections) |
| `drizzle(pool, { schema })` | Wrap the pool with Drizzle's query builder |
| `exports: [DB]` | Other modules can inject this |

**Why this pattern:**

Normally a provider is a class and Nest calls `new ClassName()`. But `drizzle()` is a function returning an object. So you use a **custom provider** with `useFactory`.

This is how you'd create any complex object (databases, Redis clients, caches, etc.).

---

## Step 1.9 — Add DatabaseModule to AppModule

**Open:** `src/app.module.ts`

**Update imports:**

```ts
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({...}),
    DatabaseModule,  // ← Add this
  ],
  // ...
})
```

---

## Step 1.10 — Create Drizzle Config File

**Create file in project root:** `drizzle.config.ts`

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

**What it does:**

Tells drizzle-kit where your schema is and where to write migrations.

| Field | Means |
|---|---|
| `schema` | Location of your database schema file |
| `out` | Where to write migration files |
| `dialect` | Database type (PostgreSQL) |
| `dbCredentials.url` | How to connect (from `.env`) |

---

## Step 1.11 — Add Migration Scripts

**Open:** `package.json`

**In the `scripts` section, add:**

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate"
```

**What they do:**

| Script | Does |
|---|---|
| `npm run db:generate` | Compare schema.ts to database, generate migration SQL |
| `npm run db:migrate` | Run pending migrations against the database |

---

## Step 1.12 — Generate and Run First Migration

**Command:**
```powershell
npm run db:generate
```

**What happens:**

Drizzle sees your schema and creates migration files:

```
src/database/migrations/
├── 0001_initial_schema.sql
└── meta/
```

**Open `0001_initial_schema.sql` and read it.** This is real SQL:

```sql
CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "email" text NOT NULL UNIQUE,
  "password_hash" text NOT NULL,
  ...
);

CREATE TABLE "notes" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id"),
  ...
);
```

**Why read it:**

Understanding your ORM means understanding the SQL it generates. This habit keeps you from writing slow queries or wrong logic.

**Run the migration:**

```powershell
npm run db:migrate
```

**What happens:**

Drizzle executes the SQL against Postgres. Tables are now created.

**Verify in DBeaver or psql:**

```powershell
psql -h localhost -U notes -d notes -c "\dt"
```

Should list `users` and `notes` tables. ✅

---

## Step 1.13 — Generate Notes Module

**Commands:**
```powershell
nest g module notes
nest g controller notes
nest g service notes
```

**What happened:**

NestJS created three files and wired them up:
- `src/notes/notes.module.ts` — Organizes the notes feature
- `src/notes/notes.controller.ts` — Handles HTTP requests
- `src/notes/notes.service.ts` — Business logic
- `NotesModule` is imported in `AppModule`
- `NotesService` is in `NotesModule`'s providers
- `NotesController` is in `NotesModule`'s controllers

---

## Step 1.14 — Implement NotesService

**Open:** `src/notes/notes.service.ts`

**Replace with:**

```ts
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../database/database.module';
import * as schema from '../database/schema';

@Injectable()
export class NotesService {
  constructor(
    @Inject(DB) private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async findAll() {
    return this.db.select().from(schema.notes);
  }
}
```

**Breaking it down:**

| Part | Means |
|---|---|
| `@Injectable()` | Nest can create and inject this |
| `constructor(...)` | What this service needs |
| `@Inject(DB)` | Give me the DB connection (using the string token) |
| `private readonly db` | Store it as a private property |
| `NodePgDatabase<typeof schema>` | Type annotation for Drizzle (with your schema) |
| `async findAll()` | Query all notes (async because DB I/O is slow) |
| `this.db.select().from(schema.notes)` | Drizzle query: SELECT * FROM notes |

---

## Step 1.15 — Implement NotesController

**Open:** `src/notes/notes.controller.ts`

**Replace with:**

```ts
import { Controller, Get } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  findAll() {
    return this.notesService.findAll();
  }
}
```

**Breaking it down:**

| Part | Means |
|---|---|
| `@Controller('notes')` | All routes start with `/notes` |
| `constructor(private readonly notesService: NotesService)` | Inject the service (Nest handles it) |
| `@Get()` | This method handles GET requests |
| `return this.notesService.findAll()` | Delegate to the service |

**The flow:**

```
GET /notes
  ↓
Controller.findAll() called
  ↓
Calls this.notesService.findAll()
  ↓
Service queries: SELECT * FROM notes
  ↓
Returns array of notes
  ↓
Controller returns as JSON
```

---

## Step 1.16 — Test It End-to-End

**Open browser:** http://localhost:3000/notes

**Expected response:**

```json
[]
```

Empty because you haven't created any notes yet. ✅

**Insert a row manually:**

In DBeaver or psql:

```sql
INSERT INTO notes (title, body, user_id) VALUES ('My first note', 'Hello world', UUID);
```

(Get a UUID from the users table first, or create one manually.)

**Refresh http://localhost:3000/notes**

Should now return your note! ✅

This is the full request cycle:
- HTTP GET arrives
- Controller receives it
- Calls service
- Service queries Postgres
- Result travels back as JSON

---

## Step 1.17 — Commit

**Command:**
```powershell
git add .
git commit -m "Day 1: Config module, database setup, first notes route"
```

---

## Day 1 Complete When

- ✅ App validates env vars and refuses to boot if missing
- ✅ `npm run db:generate && npm run db:migrate` creates tables
- ✅ You read the generated migration SQL
- ✅ `GET /notes` returns a JSON array from Postgres
- ✅ You can explain what `@Injectable()` does
- ✅ You can explain the difference between `imports` and `providers`
- ✅ Second commit made

---

# FUTURE ROADMAP (Days 2-7)

## Day 2 — DTOs, Validation, Error Handling
- Create `CreateNoteDto`
- Add `@IsString()`, `@MinLength()` decorators
- Create POST /notes route
- Handle validation errors automatically

## Day 3 — Authentication Basics
- Hash passwords with bcrypt
- Implement login/signup
- Create JWT tokens
- Add `@UseGuards(JwtAuthGuard)`

## Day 4 — Advanced Queries
- Filter notes by user
- Pagination (limit, offset)
- Sorting
- Write unit tests for services

## Day 5 — Relationships & Nested Routes
- GET /users/:id/notes
- Eagerly load related data
- Handle not found errors

## Day 6 — Testing
- Set up Jest
- Write controller tests
- Write service tests
- Mock the database

## Day 7 — Deployment Prep
- Environment-specific configs
- Docker for the app itself
- Docker Compose with app + db + redis
- Health checks

---

# Commands Cheat Sheet

```powershell
# Development
npm run start:dev              # Start in watch mode
npm run build                  # Compile to JavaScript

# Database
docker compose up -d           # Start Postgres + Redis
docker compose down            # Stop containers (data persists)
docker compose logs db         # View Postgres logs
npm run db:generate            # Generate migrations
npm run db:migrate             # Run migrations

# Code generation
nest g module <name>           # Create a module
nest g controller <name>       # Create a controller
nest g service <name>          # Create a service
nest g class <name>            # Create a class (often a DTO)

# Git
git status                      # See changes
git add .                       # Stage all
git commit -m "message"        # Commit
git log --oneline              # See history
```

---

# Key Concepts to Keep in Mind

1. **Decorators = Metadata:** `@Controller()`, `@Get()`, `@Injectable()` are just labels. NestJS reads them at startup to build the app.

2. **DI = Dependency Injection:** Declare what you need in the constructor, Nest provides it. Never call `new Service()`.

3. **Modules = Organization:** Each feature has a module. Controllers go in, Services go in, Exports define what others can use.

4. **Services = Logic:** Business logic, database queries, calculations. Controllers don't do this — they're just HTTP handlers.

5. **Custom Providers = Complex Objects:** When you need to create something that's not a simple class (like a database connection), use `useFactory`.

6. **Migrations = Versioned SQL:** Generated from your schema, readable, reviewable, reversible. Always read the SQL.

---

# Resources

- NestJS Docs: https://docs.nestjs.com/
- Drizzle Docs: https://orm.drizzle.team/
- TypeScript Docs: https://www.typescriptlang.org/docs/
- Docker Docs: https://docs.docker.com/

---

Last updated: 2026-08-31
