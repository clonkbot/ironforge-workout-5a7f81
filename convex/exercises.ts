import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("exercises").collect();
  },
});

export const getByMuscleGroup = query({
  args: { muscleGroup: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exercises")
      .withIndex("by_muscle_group", (q) => q.eq("muscleGroup", args.muscleGroup))
      .collect();
  },
});

export const getByMuscleGroups = query({
  args: { muscleGroups: v.array(v.string()) },
  handler: async (ctx, args) => {
    const exercises = await ctx.db.query("exercises").collect();
    return exercises.filter((e) => args.muscleGroups.includes(e.muscleGroup));
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("exercises").first();
    if (existing) return "Already seeded";

    const exercises = [
      // Chest
      { name: "Barbell Bench Press", muscleGroup: "chest", secondaryMuscles: ["triceps", "shoulders"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Lie on bench, grip bar slightly wider than shoulder width, lower to chest, press up." },
      { name: "Incline Dumbbell Press", muscleGroup: "chest", secondaryMuscles: ["shoulders", "triceps"], equipment: "Dumbbells", difficulty: "Intermediate", instructions: "Set bench to 30-45 degrees, press dumbbells up from chest level." },
      { name: "Push-Ups", muscleGroup: "chest", secondaryMuscles: ["triceps", "core"], equipment: "Bodyweight", difficulty: "Beginner", instructions: "Hands shoulder-width apart, lower body until chest nearly touches ground, push back up." },
      { name: "Cable Flyes", muscleGroup: "chest", secondaryMuscles: [], equipment: "Cable Machine", difficulty: "Intermediate", instructions: "Stand between cables, bring handles together in front of chest with slight bend in elbows." },
      { name: "Dips (Chest)", muscleGroup: "chest", secondaryMuscles: ["triceps", "shoulders"], equipment: "Parallel Bars", difficulty: "Intermediate", instructions: "Lean forward, lower body until upper arms parallel to ground, press up." },

      // Back
      { name: "Deadlift", muscleGroup: "back", secondaryMuscles: ["legs", "core"], equipment: "Barbell", difficulty: "Advanced", instructions: "Stand with feet hip-width, grip bar, keep back straight, lift by extending hips and knees." },
      { name: "Barbell Rows", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Bend over at hips, pull bar to lower chest, squeeze shoulder blades together." },
      { name: "T-Bar Rows", muscleGroup: "back", secondaryMuscles: ["biceps", "core"], equipment: "T-Bar Machine", difficulty: "Intermediate", instructions: "Straddle bar, grip handle, pull towards chest while keeping back flat." },
      { name: "Seated Cable Rows", muscleGroup: "back", secondaryMuscles: ["biceps"], equipment: "Cable Machine", difficulty: "Beginner", instructions: "Sit with feet on platform, pull handle to torso, squeeze back muscles." },

      // Lats
      { name: "Pull-Ups", muscleGroup: "lats", secondaryMuscles: ["biceps", "back"], equipment: "Pull-Up Bar", difficulty: "Intermediate", instructions: "Grip bar overhand, pull body up until chin over bar, lower with control." },
      { name: "Lat Pulldowns", muscleGroup: "lats", secondaryMuscles: ["biceps"], equipment: "Cable Machine", difficulty: "Beginner", instructions: "Grip bar wide, pull down to upper chest, squeeze lats at bottom." },
      { name: "Chin-Ups", muscleGroup: "lats", secondaryMuscles: ["biceps"], equipment: "Pull-Up Bar", difficulty: "Intermediate", instructions: "Grip bar underhand, pull body up, focus on squeezing lats." },
      { name: "Single-Arm Dumbbell Row", muscleGroup: "lats", secondaryMuscles: ["biceps", "back"], equipment: "Dumbbell", difficulty: "Beginner", instructions: "One knee on bench, pull dumbbell to hip, keep elbow close to body." },
      { name: "Straight-Arm Pulldown", muscleGroup: "lats", secondaryMuscles: [], equipment: "Cable Machine", difficulty: "Intermediate", instructions: "Stand facing cable, keep arms straight, pull bar down to thighs." },

      // Shoulders
      { name: "Overhead Press", muscleGroup: "shoulders", secondaryMuscles: ["triceps"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Press bar overhead from shoulder height, fully extend arms, lower with control." },
      { name: "Lateral Raises", muscleGroup: "shoulders", secondaryMuscles: [], equipment: "Dumbbells", difficulty: "Beginner", instructions: "Arms at sides, raise dumbbells out to shoulder height, lower slowly." },
      { name: "Front Raises", muscleGroup: "shoulders", secondaryMuscles: [], equipment: "Dumbbells", difficulty: "Beginner", instructions: "Raise dumbbells in front to shoulder height, one at a time or together." },
      { name: "Face Pulls", muscleGroup: "shoulders", secondaryMuscles: ["back"], equipment: "Cable Machine", difficulty: "Beginner", instructions: "Pull rope to face level, spread rope apart at peak, squeeze rear delts." },
      { name: "Arnold Press", muscleGroup: "shoulders", secondaryMuscles: ["triceps"], equipment: "Dumbbells", difficulty: "Intermediate", instructions: "Start with palms facing you, rotate outward as you press overhead." },

      // Biceps
      { name: "Barbell Curls", muscleGroup: "biceps", secondaryMuscles: [], equipment: "Barbell", difficulty: "Beginner", instructions: "Stand with bar at thighs, curl up to shoulders, lower with control." },
      { name: "Dumbbell Hammer Curls", muscleGroup: "biceps", secondaryMuscles: ["forearms"], equipment: "Dumbbells", difficulty: "Beginner", instructions: "Hold dumbbells with neutral grip, curl up, squeeze at top." },
      { name: "Preacher Curls", muscleGroup: "biceps", secondaryMuscles: [], equipment: "EZ Bar", difficulty: "Intermediate", instructions: "Rest arms on preacher bench, curl bar up, lower fully." },
      { name: "Incline Dumbbell Curls", muscleGroup: "biceps", secondaryMuscles: [], equipment: "Dumbbells", difficulty: "Intermediate", instructions: "Sit on incline bench, let arms hang, curl up without swinging." },
      { name: "Concentration Curls", muscleGroup: "biceps", secondaryMuscles: [], equipment: "Dumbbell", difficulty: "Beginner", instructions: "Sit with elbow on inner thigh, curl dumbbell to shoulder, squeeze at top." },

      // Triceps
      { name: "Close-Grip Bench Press", muscleGroup: "triceps", secondaryMuscles: ["chest"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Grip bar shoulder-width, lower to chest, press up focusing on triceps." },
      { name: "Tricep Pushdowns", muscleGroup: "triceps", secondaryMuscles: [], equipment: "Cable Machine", difficulty: "Beginner", instructions: "Push bar down until arms straight, squeeze triceps, return with control." },
      { name: "Skull Crushers", muscleGroup: "triceps", secondaryMuscles: [], equipment: "EZ Bar", difficulty: "Intermediate", instructions: "Lie on bench, lower bar to forehead, extend arms back up." },
      { name: "Overhead Tricep Extension", muscleGroup: "triceps", secondaryMuscles: [], equipment: "Dumbbell", difficulty: "Beginner", instructions: "Hold dumbbell overhead with both hands, lower behind head, extend up." },
      { name: "Diamond Push-Ups", muscleGroup: "triceps", secondaryMuscles: ["chest"], equipment: "Bodyweight", difficulty: "Intermediate", instructions: "Hands together forming diamond shape, perform push-up keeping elbows close." },

      // Legs
      { name: "Barbell Squats", muscleGroup: "legs", secondaryMuscles: ["core"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Bar on upper back, squat until thighs parallel, drive up through heels." },
      { name: "Romanian Deadlifts", muscleGroup: "legs", secondaryMuscles: ["back"], equipment: "Barbell", difficulty: "Intermediate", instructions: "Slight knee bend, hinge at hips, lower bar along legs, squeeze hamstrings up." },
      { name: "Leg Press", muscleGroup: "legs", secondaryMuscles: [], equipment: "Leg Press Machine", difficulty: "Beginner", instructions: "Feet shoulder-width on platform, lower weight by bending knees, press back up." },
      { name: "Lunges", muscleGroup: "legs", secondaryMuscles: ["core"], equipment: "Bodyweight", difficulty: "Beginner", instructions: "Step forward, lower back knee toward ground, push back to start." },
      { name: "Leg Curls", muscleGroup: "legs", secondaryMuscles: [], equipment: "Machine", difficulty: "Beginner", instructions: "Lie face down, curl weight up by bending knees, squeeze hamstrings." },
      { name: "Calf Raises", muscleGroup: "legs", secondaryMuscles: [], equipment: "Machine", difficulty: "Beginner", instructions: "Rise up on balls of feet, squeeze calves at top, lower with control." },
      { name: "Bulgarian Split Squats", muscleGroup: "legs", secondaryMuscles: ["core"], equipment: "Dumbbells", difficulty: "Intermediate", instructions: "Rear foot elevated on bench, lower into lunge position, drive up through front heel." },

      // Core
      { name: "Planks", muscleGroup: "core", secondaryMuscles: ["shoulders"], equipment: "Bodyweight", difficulty: "Beginner", instructions: "Hold push-up position on forearms, keep body straight, engage core." },
      { name: "Hanging Leg Raises", muscleGroup: "core", secondaryMuscles: [], equipment: "Pull-Up Bar", difficulty: "Advanced", instructions: "Hang from bar, raise legs to parallel or higher, lower with control." },
      { name: "Cable Woodchops", muscleGroup: "core", secondaryMuscles: [], equipment: "Cable Machine", difficulty: "Intermediate", instructions: "Rotate torso pulling cable diagonally across body, control the return." },
      { name: "Ab Wheel Rollouts", muscleGroup: "core", secondaryMuscles: ["shoulders"], equipment: "Ab Wheel", difficulty: "Advanced", instructions: "Kneel with wheel, roll forward extending body, use core to pull back." },
      { name: "Russian Twists", muscleGroup: "core", secondaryMuscles: [], equipment: "Bodyweight", difficulty: "Beginner", instructions: "Sit with feet off ground, rotate torso side to side, keep core tight." },
      { name: "Dead Bug", muscleGroup: "core", secondaryMuscles: [], equipment: "Bodyweight", difficulty: "Beginner", instructions: "Lie on back, extend opposite arm and leg, keep lower back pressed to floor." },
    ];

    for (const exercise of exercises) {
      await ctx.db.insert("exercises", exercise);
    }

    return "Seeded " + exercises.length + " exercises";
  },
});
