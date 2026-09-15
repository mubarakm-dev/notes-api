import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";




export const users = pgTable("users", {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role", {enum: ["user", "admin"]}).notNull().default('user'),
    createdAt:timestamp('created_at').notNull().defaultNow(),
})

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});