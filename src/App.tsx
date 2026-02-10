import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "../convex/_generated/api";
import { useState, useEffect } from "react";
import { Id } from "../convex/_generated/dataModel";

const MUSCLE_GROUPS = [
  { id: "chest", label: "Chest", icon: "💪", color: "from-rose-500 to-pink-600" },
  { id: "back", label: "Back", icon: "🔙", color: "from-violet-500 to-purple-600" },
  { id: "lats", label: "Lats", icon: "🦅", color: "from-indigo-500 to-blue-600" },
  { id: "shoulders", label: "Shoulders", icon: "🎯", color: "from-amber-500 to-orange-600" },
  { id: "biceps", label: "Biceps", icon: "💪", color: "from-emerald-500 to-teal-600" },
  { id: "triceps", label: "Triceps", icon: "🔱", color: "from-cyan-500 to-sky-600" },
  { id: "legs", label: "Legs", icon: "🦵", color: "from-red-500 to-rose-600" },
  { id: "core", label: "Core", icon: "🎖️", color: "from-yellow-500 to-amber-600" },
];

function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("flow", flow);
      await signIn("password", formData);
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-rose-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl mb-6 shadow-2xl shadow-rose-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
            <span className="text-4xl">🏋️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            IRON<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">FORGE</span>
          </h1>
          <p className="text-zinc-400 mt-2 font-medium">Sculpt your perfect workout</p>
        </div>

        <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-2xl animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 bg-zinc-800/50 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold rounded-xl hover:from-rose-400 hover:to-violet-500 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : flow === "signIn" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="text-zinc-400 hover:text-white transition-colors text-sm"
            >
              {flow === "signIn" ? "Don't have an account? " : "Already have an account? "}
              <span className="text-rose-400 font-semibold">
                {flow === "signIn" ? "Sign up" : "Sign in"}
              </span>
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-zinc-900 px-4 text-xs text-zinc-500 uppercase tracking-wider">or</span>
            </div>
          </div>

          <button
            onClick={() => signIn("anonymous")}
            className="w-full py-3.5 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
}

function MuscleGroupSelector({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
      {MUSCLE_GROUPS.map((group, index) => (
        <button
          key={group.id}
          onClick={() => onToggle(group.id)}
          className={`relative group p-4 md:p-5 rounded-2xl border-2 transition-all duration-300 overflow-hidden animate-scale-in ${
            selected.includes(group.id)
              ? "border-rose-500 bg-rose-500/10"
              : "border-zinc-800 bg-zinc-900/50 hover:border-zinc-700"
          }`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-0 transition-opacity duration-300 ${
              selected.includes(group.id) ? "opacity-10" : "group-hover:opacity-5"
            }`}
          />
          <div className="relative">
            <span className="text-2xl md:text-3xl block mb-2">{group.icon}</span>
            <span
              className={`font-bold text-sm md:text-base ${
                selected.includes(group.id) ? "text-white" : "text-zinc-400"
              }`}
            >
              {group.label}
            </span>
          </div>
          {selected.includes(group.id) && (
            <div className="absolute top-2 right-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}

function ExerciseCard({
  exercise,
  sets,
  reps,
  restSeconds,
}: {
  exercise: any;
  sets: number;
  reps: string;
  restSeconds: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const muscleGroup = MUSCLE_GROUPS.find((g) => g.id === exercise.muscleGroup);

  return (
    <div
      className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-300"
    >
      <div
        className="p-4 md:p-5 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${
                  muscleGroup?.color || "from-zinc-600 to-zinc-700"
                } text-white uppercase tracking-wider`}
              >
                {exercise.muscleGroup}
              </span>
              <span className={`px-2 py-1 text-xs rounded-lg border ${
                exercise.difficulty === "Beginner"
                  ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  : exercise.difficulty === "Intermediate"
                  ? "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  : "border-red-500/30 text-red-400 bg-red-500/10"
              }`}>
                {exercise.difficulty}
              </span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-1 truncate">{exercise.name}</h3>
            <p className="text-zinc-500 text-sm">{exercise.equipment}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">
              {sets}×{reps}
            </div>
            <div className="text-xs text-zinc-500 mt-1">{restSeconds}s rest</div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0 border-t border-zinc-800 mt-0">
          <div className="pt-4">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Instructions</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">{exercise.instructions}</p>
            {exercise.secondaryMuscles.length > 0 && (
              <div className="mt-3">
                <span className="text-xs text-zinc-500">Also works: </span>
                <span className="text-xs text-zinc-400">
                  {exercise.secondaryMuscles.join(", ")}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkoutView({
  workout,
  exercises,
  onBack,
  onComplete,
  onDelete,
}: {
  workout: any;
  exercises: any[];
  onBack: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const exerciseMap = new Map(exercises.map((e) => [e._id, e]));

  return (
    <div className="animate-fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-6"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to workouts
      </button>

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{workout.name}</h2>
        <div className="flex items-center gap-3 flex-wrap">
          {workout.muscleGroups.map((mg: string) => {
            const group = MUSCLE_GROUPS.find((g) => g.id === mg);
            return (
              <span
                key={mg}
                className={`px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r ${
                  group?.color || "from-zinc-600 to-zinc-700"
                } text-white uppercase tracking-wider`}
              >
                {group?.icon} {mg}
              </span>
            );
          })}
        </div>
        {workout.completedAt && (
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Completed {new Date(workout.completedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        {workout.exercises.map((we: any, index: number) => {
          const exercise = exerciseMap.get(we.exerciseId);
          if (!exercise) return null;
          return (
            <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
              <ExerciseCard
                exercise={exercise}
                sets={we.sets}
                reps={we.reps}
                restSeconds={we.restSeconds}
              />
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {!workout.completedAt && (
          <button
            onClick={onComplete}
            className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40"
          >
            ✓ Mark Complete
          </button>
        )}
        <button
          onClick={onDelete}
          className="py-4 px-6 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all border border-zinc-700"
        >
          Delete Workout
        </button>
      </div>
    </div>
  );
}

function WorkoutGenerator({ onGenerated }: { onGenerated: (id: Id<"workouts">) => void }) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [exercisesPerGroup, setExercisesPerGroup] = useState(3);
  const [generating, setGenerating] = useState(false);
  const generateWorkout = useMutation(api.workouts.generateWorkout);

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedGroups.length === 0) return;
    setGenerating(true);
    try {
      const workoutId = await generateWorkout({
        muscleGroups: selectedGroups,
        exercisesPerGroup,
      });
      onGenerated(workoutId);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Generate Workout</h2>
        <p className="text-zinc-400">Select muscle groups to target</p>
      </div>

      <MuscleGroupSelector selected={selectedGroups} onToggle={toggleGroup} />

      <div className="mt-8 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-6">
        <label className="block text-sm font-bold text-zinc-300 mb-4">
          Exercises per muscle group
        </label>
        <div className="flex items-center gap-4">
          {[2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setExercisesPerGroup(num)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-xl font-bold text-lg transition-all ${
                exercisesPerGroup === num
                  ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-lg shadow-rose-500/25"
                  : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-zinc-800/50 border border-zinc-700 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-zinc-400 text-sm">Estimated exercises</div>
            <div className="text-3xl md:text-4xl font-black text-white">
              {selectedGroups.length * exercisesPerGroup}
            </div>
          </div>
          <div className="text-right">
            <div className="text-zinc-400 text-sm">Muscle groups</div>
            <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">
              {selectedGroups.length}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={selectedGroups.length === 0 || generating}
        className="w-full mt-6 py-4 bg-gradient-to-r from-rose-500 to-violet-600 text-white font-bold text-lg rounded-xl hover:from-rose-400 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        {generating ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          <>🎲 Generate Workout</>
        )}
      </button>
    </div>
  );
}

function WorkoutList({ onSelectWorkout }: { onSelectWorkout: (id: Id<"workouts">) => void }) {
  const workouts = useQuery(api.workouts.list);

  if (workouts === undefined) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <div className="text-6xl mb-4">🏋️</div>
        <h3 className="text-xl font-bold text-white mb-2">No workouts yet</h3>
        <p className="text-zinc-400">Generate your first workout to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout: typeof workouts[number], index: number) => (
        <button
          key={workout._id}
          onClick={() => onSelectWorkout(workout._id)}
          className="w-full text-left bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 md:p-5 hover:border-zinc-700 transition-all group animate-slide-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-rose-400 transition-colors truncate">
                {workout.name}
              </h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {workout.muscleGroups.slice(0, 3).map((mg: string) => {
                  const group = MUSCLE_GROUPS.find((g) => g.id === mg);
                  return (
                    <span key={mg} className="text-xs text-zinc-400">
                      {group?.icon} {mg}
                    </span>
                  );
                })}
                {workout.muscleGroups.length > 3 && (
                  <span className="text-xs text-zinc-500">+{workout.muscleGroups.length - 3} more</span>
                )}
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-sm text-zinc-500">
                {new Date(workout.createdAt).toLocaleDateString()}
              </div>
              {workout.completedAt ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400 mt-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Done
                </span>
              ) : (
                <span className="text-xs text-amber-400 mt-1">In progress</span>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}

function ExerciseDatabase() {
  const exercises = useQuery(api.exercises.list);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const filteredExercises = exercises?.filter(
    (e: typeof exercises[number]) => !selectedGroup || e.muscleGroup === selectedGroup
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Exercise Database</h2>
        <p className="text-zinc-400">Browse all available exercises</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedGroup(null)}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            !selectedGroup
              ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
          }`}
        >
          All
        </button>
        {MUSCLE_GROUPS.map((group) => (
          <button
            key={group.id}
            onClick={() => setSelectedGroup(group.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedGroup === group.id
                ? "bg-gradient-to-r from-rose-500 to-violet-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
            }`}
          >
            {group.icon} {group.label}
          </button>
        ))}
      </div>

      {exercises === undefined ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExercises?.map((exercise: typeof filteredExercises[number], index: number) => (
            <div key={exercise._id} className="animate-slide-up" style={{ animationDelay: `${index * 30}ms` }}>
              <ExerciseCard
                exercise={exercise}
                sets={3}
                reps="10-12"
                restSeconds={60}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MainApp() {
  const { signOut } = useAuthActions();
  const seedExercises = useMutation(api.exercises.seed);
  const exercises = useQuery(api.exercises.list);
  const markComplete = useMutation(api.workouts.markComplete);
  const deleteWorkout = useMutation(api.workouts.remove);
  const workouts = useQuery(api.workouts.list);
  const [activeTab, setActiveTab] = useState<"generate" | "workouts" | "exercises">("generate");
  const [selectedWorkout, setSelectedWorkout] = useState<Id<"workouts"> | null>(null);

  // Auto-seed exercises if database is empty
  useEffect(() => {
    if (exercises && exercises.length === 0) {
      seedExercises();
    }
  }, [exercises, seedExercises]);

  const selectedWorkoutData = workouts?.find((w: typeof workouts[number]) => w._id === selectedWorkout);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
              <span className="text-xl">🏋️</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              IRON<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-400">FORGE</span>
            </h1>
          </div>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="sticky top-[73px] z-40 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: "generate" as const, label: "Generate", icon: "🎲" },
              { id: "workouts" as const, label: "My Workouts", icon: "📋" },
              { id: "exercises" as const, label: "Exercises", icon: "💪" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedWorkout(null);
                }}
                className={`px-3 md:px-4 py-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-rose-500 text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 md:py-8">
        {selectedWorkoutData && exercises ? (
          <WorkoutView
            workout={selectedWorkoutData}
            exercises={exercises}
            onBack={() => setSelectedWorkout(null)}
            onComplete={() => {
              markComplete({ id: selectedWorkoutData._id });
            }}
            onDelete={() => {
              deleteWorkout({ id: selectedWorkoutData._id });
              setSelectedWorkout(null);
            }}
          />
        ) : activeTab === "generate" ? (
          <WorkoutGenerator
            onGenerated={(id) => {
              setSelectedWorkout(id);
              setActiveTab("workouts");
            }}
          />
        ) : activeTab === "workouts" ? (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2">My Workouts</h2>
              <p className="text-zinc-400">Your generated workout plans</p>
            </div>
            <WorkoutList onSelectWorkout={setSelectedWorkout} />
          </div>
        ) : (
          <ExerciseDatabase />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-4 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-zinc-600 text-xs">
            Requested by <span className="text-zinc-500">@nobody180bc</span> · Built by <span className="text-zinc-500">@clonkbot</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-violet-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl shadow-rose-500/25">
            <span className="text-3xl">🏋️</span>
          </div>
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return <MainApp />;
}
