import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  exercises: defineTable({
    name: v.string(),
    muscleGroup: v.string(),
    secondaryMuscles: v.array(v.string()),
    equipment: v.string(),
    difficulty: v.string(),
    instructions: v.string(),
    imageUrl: v.optional(v.string()),
  }).index("by_muscle_group", ["muscleGroup"]),

  workouts: defineTable({
    userId: v.id("users"),
    name: v.string(),
    exercises: v.array(v.object({
      exerciseId: v.id("exercises"),
      sets: v.number(),
      reps: v.string(),
      restSeconds: v.number(),
    })),
    muscleGroups: v.array(v.string()),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user", ["userId"]).index("by_user_created", ["userId", "createdAt"]),

  workoutLogs: defineTable({
    userId: v.id("users"),
    workoutId: v.id("workouts"),
    completedAt: v.number(),
    duration: v.number(),
    notes: v.optional(v.string()),
  }).index("by_user", ["userId"]).index("by_workout", ["workoutId"]),
});
