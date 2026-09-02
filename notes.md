# Notes API — Day 0 & Day 1, Step by Step

Every command, what it does, and what to read before running it.

---

# DAY 0 — Setup

**Read before you start (30 min):**
- https://docs.nestjs.com/first-steps — skim the whole page
- https://docs.nestjs.com/cli/overview — just the intro

---

## Step 1 — Pick where the project lives

Open your terminal.

- macOS: Terminal or iTerm
- Windows: use **WSL2 + Ubuntu**, not PowerShell. Nest works on Windows, but Docker, file watching, and most tutorials assume Linux. Fighting Windows path issues is wasted learning time.
- Linux: whatever you use

Make a folder for your projects and go into it:

```bash
mkdir -p ~/projects
cd ~/projects
```

`mkdir -p` creates the folder (and parents) and doesn't error if it exists. `cd` moves you into it. Everything from here runs inside `~/projects`.

Check Node:

```bash
node -v
```

You want v20 or v22 (LTS). If it's older, install [nvm](https://github.com/nvm-sh/nvm) and run `nvm install 22`. Nest needs a recent Node and silently misbehaves on old versions.

---

## Step 2 — Install the Nest CLI

```bash
npm i -g @nestjs/cli
```

Breaking this down:

| Part | Meaning |
|---|---|
| `npm` | Node's package manager — already on your machine with Node |
| `i` | short for `install` |
| `-g` | **global** — installs to your system, not a project folder |
| `@nestjs/cli` | the package name |

`-g` matters here. Normally `npm i express` installs into the current project's `node_modules`. But the CLI is a *tool you run*, not a library you import — you need the `nest` command available from any folder, before a project even exists.

Verify:

```bash
nest --version
```

If you get "command not found", npm's global bin folder isn't on your PATH. Run `npm config get prefix`, then add `<that path>/bin` to your PATH in `~/.zshrc` or `~/.bashrc`.

---

## Step 3 — Generate the project

```bash
nest new notes-api
```

It asks which package manager. Pick **npm** unless you already prefer pnpm. Then it downloads dependencies — a few minutes.

**What it just created:**

```
notes-api/
├── src/
│   ├── main.ts                    entry point — boots the app
│   ├── app.module.ts              the root module
│   ├── app.controller.ts          example controller (delete later)
│   ├── app.service.ts             example service (delete later)
│   └── app.controller.spec.ts     example test
├── test/                          e2e tests
├── nest-cli.json                  CLI settings
├── tsconfig.json                  TypeScript settings
├── package.json                   deps and scripts
└── .eslintrc / eslint.config.mjs  linting
```

Go in and open your editor:

```bash
cd notes-api
code .        # VS Code. Or: cursor . / nvim . / whatever you use
```

**Now actually read two files.** Don't skip this — it's five minutes and it's the foundation.

`src/main.ts` — this is `NestFactory.create(AppModule)` then `app.listen(3000)`. Same job as your `app.listen()` in Express. The difference: Express you built the app by calling `app.use()` over and over. Nest builds it from `AppModule` and everything that module pulls in.

`src/app.module.ts` — a class with an `@Module({})` decorator holding `imports`, `controllers`, `providers`. This is the piece Express has no equivalent for, and it's the thing to actually understand this week.

---

## Step 4 — Run it

```bash
npm run start:dev
```

`start:dev` is a script in `package.json` that runs Nest in watch mode — it restarts on file save, like nodemon.

Open http://localhost:3000 — you should see `Hello World!`.

Leave this terminal running. **Open a second terminal tab** for the rest of the commands. You'll want the server logs visible while you work.

---

## Step 5 — Turn on strict TypeScript

**Do this before your first commit.** The CLI ships with several strictness flags off. Turn them on in week two and you'll face a hundred errors at once and give up.

Open `tsconfig.json`. Inside `compilerOptions`, set/add:

```json
"strict": true,
"strictNullChecks": true,
"noImplicitAny": true,
"noUncheckedIndexedAccess": true,
"noImplicitReturns": true
```

**What each does:**

- `strict` — master switch turning on a family of checks
- `strictNullChecks` — `string` no longer silently includes `null`. You must handle the null case. Kills a whole class of `Cannot read property of undefined`.
- `noImplicitAny` — a parameter with no type annotation is an error instead of silently becoming `any`
- `noUncheckedIndexedAccess` — `arr[0]` is typed `T | undefined` instead of `T`, because index 0 might not exist. **This is the one people turn off when it gets annoying. Don't.** It's the flag that stops you from confidently using something that isn't there.
- `noImplicitReturns` — every code path in a function must return

Save. Your terminal may now show errors in the generated files. Fix them — that's the first TypeScript lesson of the week.

**Read:** https://www.typescriptlang.org/tsconfig/ — look up each flag you just set.

---

## Step 6 — Ban `any` in the linter

Find `eslint.config.mjs` (or `.eslintrc.js` in older setups). In the rules section:

```js
'@typescript-eslint/no-explicit-any': 'error',
```

You may find Nest ships with this set to `'off'` — change it.

Why: `any` turns off type checking for that value. Every time you're tempted to write it, that's a moment you're about to learn something about the type system. The linter makes you notice instead of doing it on reflex.

---

## Step 7 — Start Postgres and Redis with Docker

Install Docker Desktop if you haven't: https://docs.docker.com/get-docker/

In the project root, create `docker-compose.yml`:

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

**Line by line:**

- `services` — the containers to run
- `image: postgres:16` — download and run official Postgres v16
- `environment` — Postgres reads these on first boot to create the user, password, and database
- `ports: "5432:5432"` — `hostPort:containerPort`. Makes the container's Postgres reachable at `localhost:5432` on your machine.
- `volumes: pgdata:...` — stores data outside the container so it survives `docker compose down`. Without this, your database vanishes every restart.

Start them:

```bash
docker compose up -d
```

`up` starts the services, `-d` means detached (background, returns your prompt). Check:

```bash
docker compose ps
```

Both should say "running". Useful ones as you go:

```bash
docker compose logs db      # see Postgres output
docker compose down         # stop (data survives — you have the volume)
docker compose down -v      # stop AND delete data
```

---

## Step 8 — Confirm you can reach the database

Install a GUI: [TablePlus](https://tableplus.com/), [DBeaver](https://dbeaver.io/), or `psql`. Connect with:

```
host: localhost   port: 5432
user: notes       password: notes
database: notes
```

**Don't move on until this connects.** If it fails now it'll fail tomorrow, and tomorrow you'll be debugging Nest and Docker simultaneously.

---

## Step 9 — Git

```bash
git init
git add .
git commit -m "Nest scaffold with strict TS and docker compose"
```

Confirm `.gitignore` contains `node_modules` and `.env` (Nest generates a reasonable one — check anyway).

Commit at the end of every day. When you break something on day 4, `git diff` tells you what changed.

### Day 0 done when

- [ ] `nest --version` works
- [ ] `npm run start:dev` serves Hello World
- [ ] Strict flags on, `no-explicit-any` set to error
- [ ] Postgres and Redis running, and you've connected with a client
- [ ] First commit made

---

# DAY 1 — Config, database, first module

**Read before you start (45 min, in this order):**
1. https://docs.nestjs.com/modules — the most important page this week
2. https://docs.nestjs.com/providers — what `@Injectable()` means
3. https://docs.nestjs.com/techniques/configuration — env vars
4. https://docs.nestjs.com/fundamentals/custom-providers — just the `useFactory` section

---

## Step 1 — Config module

```bash
npm i @nestjs/config joi
```

No `-g` — these go into this project's `node_modules` because your code imports them.

Create `.env` in the project root:

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgres://notes:notes@localhost:5432/notes
JWT_ACCESS_SECRET=dev-only-change-me
JWT_REFRESH_SECRET=dev-only-change-me-too
```

Create `src/config/validation.schema.ts`:

```ts
import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'test', 'production').required(),
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
});
```

In `app.module.ts`, add to `imports`:

```ts
ConfigModule.forRoot({
  isGlobal: true,
  validationSchema,
}),
```

**Test that it works:** comment out `DATABASE_URL` in `.env` and restart. The app should refuse to boot with a clear error. Uncomment it.

That's the whole point. In your Express app, a missing env var became `undefined`, then a confusing crash somewhere deep in a request three hours later. Here it fails at boot with the variable's name.

**Rule for the rest of the project:** `process.env` appears nowhere except config files. Everywhere else, inject `ConfigService`.

---

## Step 2 — Understand modules before writing another line

This is the part with no Express equivalent, so read it properly.

Each `@Module({})` has four fields:

| Field | Means |
|---|---|
| `imports` | other modules whose exported providers I want to use |
| `controllers` | classes in this module that handle HTTP routes |
| `providers` | classes this module creates and can inject (services, repositories) |
| `exports` | which of my providers other modules are allowed to use |

The key idea: **a provider is private to its module unless exported.** If `NotesService` isn't in `NotesModule`'s `exports`, no other module can inject it — even if they import `NotesModule`.

The four-part mental model:

1. `@Injectable()` on a class = "Nest can construct and manage this"
2. Listing it in `providers` = "this module owns an instance of it"
3. Type-annotating a constructor parameter = "give me that instance"
4. `exports` = "other modules may ask for it too"

You never call `new NotesService()`. Nest builds the graph at boot and hands instances to whatever declared it needs them. That's dependency injection, and it's what makes testing easy — you swap the instance without touching the code that uses it.

---

## Step 3 — Database module with a custom provider

```bash
npm i drizzle-orm pg
npm i -D drizzle-kit @types/pg
```

`-D` means devDependency — build-time tools, not shipped to production.

**Read:** https://orm.drizzle.team/docs/get-started-postgresql

Create `src/database/schema.ts`:

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

Note `.references(() => users.id)` — a real foreign key. The database itself will now reject a note pointing at a user that doesn't exist. Mongo couldn't do that for you; this is a chunk of what you gain by moving to Postgres.

Create `src/database/database.module.ts`:

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

**What's happening here — this is your first real DI lesson:**

- Normally a provider is a class and Nest calls `new` on it. But `drizzle(...)` isn't a class — it's a function returning an object. So you use a **custom provider**.
- `provide: DB` — the lookup key. Since there's no class to name, you use a string token.
- `inject: [ConfigService]` — dependencies to pass into the factory
- `useFactory` — the function Nest calls to produce the value. Its arguments arrive in the order listed in `inject`.
- `@Global()` — every module can use the exports without importing `DatabaseModule`. Justified for a DB connection; **don't reach for it casually.** Global providers make the dependency graph invisible, which is exactly what you're trying to escape.

Add `DatabaseModule` to `app.module.ts`'s `imports`.

To inject it later:

```ts
constructor(@Inject(DB) private readonly db: NodePgDatabase<typeof schema>) {}
```

`@Inject(DB)` is needed because the token is a string — with a class, the type annotation alone is enough.

---

## Step 4 — First migration

Create `drizzle.config.ts` in the project root:

```ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/database/schema.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config;
```

Add to `package.json` scripts:

```json
"db:generate": "drizzle-kit generate",
"db:migrate": "drizzle-kit migrate"
```

Run:

```bash
npm run db:generate
npm run db:migrate
```

`generate` diffs your schema file against existing migrations and writes a new SQL file. `migrate` runs pending files against the database.

**Open `src/database/migrations/` and read the generated SQL.** Every week. This is how you learn what your ORM is actually doing, and it's the habit that separates people who use Postgres from people who use an ORM that happens to sit on Postgres.

Check your DB client — `users` and `notes` should exist.

**Never use `push` or auto-sync in a real project.** Migrations are versioned, reviewable, and reversible. Auto-sync silently drops columns.

---

## Step 5 — Generate the notes module

```bash
nest g module notes
nest g controller notes
nest g service notes
```

`g` is `generate`. Watch the output — it creates each file *and* wires it up. `nest g module notes` adds `NotesModule` to `app.module.ts`'s imports automatically. `nest g service notes` adds `NotesService` to `NotesModule`'s providers.

Open `notes.module.ts` and confirm you can see it. This is the module graph you read about in step 2, now with your name on it.

---

## Step 6 — Make one route work end to end

In `notes.service.ts`:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DB } from '../../database/database.module';
import * as schema from '../../database/schema';

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

In `notes.controller.ts`:

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

Visit http://localhost:3000/notes — you should get `[]`.

**Sit with that for a second.** You never wrote `new NotesService()`. You never imported the db connection into the controller. You declared what each class needs in its constructor, and Nest assembled it. That indirection is the thing that felt like magic in Express-land — and it's what will let you swap a real database for a fake one in tests without changing a line of `NotesService`.

Insert a row manually in your DB client and refresh. You should see it.

---

## Step 7 — Commit

```bash
git add .
git commit -m "Config validation, database module, notes module"
```

### Day 1 done when

- [ ] App refuses to boot when a required env var is missing
- [ ] `process.env` appears only in config files
- [ ] Migration ran; you read the generated SQL
- [ ] `GET /notes` returns real rows from Postgres
- [ ] You can explain `imports` vs `providers` vs `exports` in your own words

### Add to your confusion log

- Why did `NotesService` need `@Injectable()` but `NotesController` needed `@Controller()`?
- Why did the DB provider need `@Inject(DB)` when `NotesService` didn't need `@Inject()`?
- What would break if `DatabaseModule` weren't `@Global()`?