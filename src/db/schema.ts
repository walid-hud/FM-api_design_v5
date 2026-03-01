import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'



export const users = pgTable("users" , 
    {
        /* 
        the field name is what drizzle uses and the arg is what's
        stored in the database (make sense to keep the same) 
        */
        id:uuid("id").primaryKey().defaultRandom(),
        email:varchar("email" , {length:255}).notNull().unique(),
        username:varchar("username" , {length:50}).notNull().unique(),
        password:varchar("password" , {length:255}).notNull(),
        first_name:varchar("first_name" , {length:50}).notNull(),
        last_name:varchar("last_name" , {length:50}).notNull(),
        createdAt:timestamp("created_at").notNull().defaultNow(),
        updatedAt:timestamp("updated_at").notNull().defaultNow(),
    }
)

export const habits = pgTable("habits" ,
    {
        id:uuid("id").primaryKey().defaultRandom(),
        user_id:uuid("user_id").notNull().references(() => users.id , {onDelete:"cascade" ,}),
        title:varchar("title" , {length:255}).notNull(),
        description:text("description"),
        frequency:varchar("frequency" , {length:50}).notNull(),
        is_archived:boolean("is_archived").notNull().default(false),
        targetCount:integer("target_count").notNull().default(1),
        isActive:boolean("is_active").notNull().default(true),
        createdAt:timestamp("created_at").notNull().defaultNow(),
        updatedAt:timestamp("updated_at").notNull().defaultNow(),
    }
)

export const entries = pgTable("entries" ,
    {
        id:uuid("id").primaryKey().defaultRandom(),
        habit_id:uuid("habit_id").notNull().references(() => habits.id , {onDelete:"cascade"}),
        completionDate:timestamp("completion_date").notNull().defaultNow(),
        createdAt:timestamp("created_at").notNull().defaultNow(),
        updatedAt:timestamp("updated_at").notNull().defaultNow(),
    }
)

export const tags = pgTable("tags" ,
    {
        id:uuid("id").primaryKey().defaultRandom(),
        name:varchar("name" , {length:50}).notNull().unique(),
        color:varchar("color" , {length:7}).notNull().default("#000000"), // default to black
        createdAt:timestamp("created_at").notNull().defaultNow(),
        updatedAt:timestamp("updated_at").notNull().defaultNow(),
    }
)

export const habitTags = pgTable("habit_tags" ,
    {
        id:uuid("id").primaryKey().defaultRandom(),
        habitId:uuid("habit_id").notNull().references(() => habits.id , {onDelete:"cascade"}),
        tagId:uuid("tag_id").notNull().references(() => tags.id , {onDelete:"cascade"}),
    }
)

export const userRelations = relations(users , ({many})=>({
    habits:many(habits)
}))

export const habitRelations = relations(habits , ({one , many})=>({
    user:one(users , {
        fields:[habits.user_id],
        references:[users.id]
    }),
    entries:many(entries)
}))

export const entryRelations = relations(entries , ({one})=>({
    habit:one(habits , {
        fields:[entries.habit_id],
        references:[habits.id]
    })
}))

export const tagRelations = relations(tags , ({many})=>({
    habitTags:many(habitTags)
}))

export const habitTagRelations = relations(habitTags , ({one})=>({
    habit:one(habits , {
        fields:[habitTags.habitId],
        references:[habits.id]
    }),
    tag:one(tags , {
        fields:[habitTags.tagId],
        references:[tags.id]
    })
}))
