import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("workouts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const workout = await ctx.db.get(args.id);
    if (!workout || workout.userId !== userId) return null;
    return workout;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    exercises: v.array(v.object({
      exerciseId: v.id("exercises"),
      sets: v.number(),
      reps: v.string(),
      restSeconds: v.number(),
    })),
    muscleGroups: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("workouts", {
      userId,
      name: args.name,
      exercises: args.exercises,
      muscleGroups: args.muscleGroups,
      createdAt: Date.now(),
    });
  },
});

export const generateWorkout = mutation({
  args: {
    muscleGroups: v.array(v.string()),
    exercisesPerGroup: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const selectedExercises: Array<{
      exerciseId: any;
      sets: number;
      reps: string;
      restSeconds: number;
    }> = [];

    for (const muscleGroup of args.muscleGroups) {
      const exercises = await ctx.db
        .query("exercises")
        .withIndex("by_muscle_group", (q) => q.eq("muscleGroup", muscleGroup))
        .collect();

      // Shuffle and pick random exercises
      const shuffled = exercises.sort(() => Math.random() - 0.5);
      const picked = shuffled.slice(0, args.exercisesPerGroup);

      for (const exercise of picked) {
        const difficulty = exercise.difficulty;
        let sets = 3;
        let reps = "10-12";
        let rest = 60;

        if (difficulty === "Beginner") {
          sets = 3;
          reps = "12-15";
          rest = 45;
        } else if (difficulty === "Intermediate") {
          sets = 4;
          reps = "8-12";
          rest = 60;
        } else if (difficulty === "Advanced") {
          sets = 4;
          reps = "6-10";
          rest = 90;
        }

        selectedExercises.push({
          exerciseId: exercise._id,
          sets,
          reps,
          restSeconds: rest,
        });
      }
    }

    const workoutName = args.muscleGroups.length === 1
      ? `${args.muscleGroups[0].charAt(0).toUpperCase() + args.muscleGroups[0].slice(1)} Day`
      : args.muscleGroups.length <= 3
        ? args.muscleGroups.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(" & ") + " Workout"
        : "Full Body Workout";

    return await ctx.db.insert("workouts", {
      userId,
      name: workoutName,
      exercises: selectedExercises,
      muscleGroups: args.muscleGroups,
      createdAt: Date.now(),
    });
  },
});

export const markComplete = mutation({
  args: { id: v.id("workouts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const workout = await ctx.db.get(args.id);
    if (!workout || workout.userId !== userId) throw new Error("Not found");
    await ctx.db.patch(args.id, { completedAt: Date.now() });
  },
});

export const remove = mutation({
  args: { id: v.id("workouts") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const workout = await ctx.db.get(args.id);
    if (!workout || workout.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
