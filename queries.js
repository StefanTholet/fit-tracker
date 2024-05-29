// -- users table (already created)
// CREATE TABLE users (
//     user_id SERIAL PRIMARY KEY,
//     email TEXT NOT NULL UNIQUE,
//     password TEXT NOT NULL,
//     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- workouts table
// CREATE TABLE workouts (
//     workout_id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
//     name TEXT NOT NULL,
//     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- exercises table
// CREATE TABLE exercises (
//     exercise_id UUID PRIMARY KEY,
//     workout_id INTEGER NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,
//     name TEXT NOT NULL
// );

// -- sets table
// CREATE TABLE sets (
//     set_id UUID PRIMARY KEY,
//     exercise_id UUID NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE,
//     reps INTEGER NOT NULL,
//     weight INTEGER NOT NULL
// );

// -- workout_sessions table
// CREATE TABLE workout_sessions (
//     session_id SERIAL PRIMARY KEY,
//     workout_id INTEGER NOT NULL REFERENCES workouts(workout_id) ON DELETE CASCADE,
//     created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     name TEXT NOT NULL
// );

// -- session_exercises table
// CREATE TABLE session_exercises (
//     session_exercise_id UUID PRIMARY KEY,
//     session_id INTEGER NOT NULL REFERENCES workout_sessions(session_id) ON DELETE CASCADE,
//     name TEXT NOT NULL
// );

// -- session_sets table
// CREATE TABLE session_sets (
//     session_set_id UUID PRIMARY KEY,
//     session_exercise_id UUID NOT NULL REFERENCES session_exercises(session_exercise_id) ON DELETE CASCADE,
//     reps INTEGER NOT NULL,
//     weight INTEGER NOT NULL,
//     matched BOOLEAN DEFAULT FALSE
// );
