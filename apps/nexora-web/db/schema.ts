import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";


// =========================
// USERS
// =========================

export const users = pgTable("users", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  username: varchar("username", {
    length: 32,
  })
    .notNull()
    .unique(),

  email: varchar("email", {
    length: 255,
  })
    .notNull()
    .unique(),

  passwordHash: text("password_hash")
    .notNull(),

  avatar: text("avatar"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});


// =========================
// SERVERS
// =========================

export const servers = pgTable("servers", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  name: varchar("name", {
    length: 100,
  })
    .notNull(),

  icon: text("icon"),

  ownerId: uuid("owner_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});


// =========================
// SERVER MEMBERS
// =========================

export const serverMembers = pgTable(
  "server_members",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),

    serverId: uuid("server_id")
      .notNull()
      .references(() => servers.id, {
        onDelete: "cascade",
      }),

    joinedAt: timestamp("joined_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
  },

  (table) => ({
    pk: primaryKey({
      columns: [
        table.userId,
        table.serverId,
      ],
    }),
  })
);


// =========================
// CHANNELS
// =========================

export const channels = pgTable("channels", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  serverId: uuid("server_id")
    .notNull()
    .references(() => servers.id, {
      onDelete: "cascade",
    }),

  name: varchar("name", {
    length: 100,
  })
    .notNull(),

  type: varchar("type", {
    length: 20,
  })
    .default("text")
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});


// =========================
// MESSAGES
// =========================

export const messages = pgTable("messages", {
  id: uuid("id")
    .defaultRandom()
    .primaryKey(),

  channelId: uuid("channel_id")
    .notNull()
    .references(() => channels.id, {
      onDelete: "cascade",
    }),

  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  content: text("content")
    .notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
