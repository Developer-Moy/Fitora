Files Created:

server/src/data/workout.data.ts
Local database — 18 exercises across 8 categories


server/src/controllers/workout.controller.ts
All controller logic with MongoDB + in-memory fallback


server/src/routes/workout.routes.ts
Route definitions


server/src/routes/index.ts
Central API router


---------------------------------------------------------------
Active API Endpoints:

Method	Route	What it does
GET	/api/workouts	Browse exercise catalog (18 exercises, filterable)
GET	/api/workouts/:id	Get single exercise by ID
GET	/api/workouts/log	Get logged workouts + summary stats
POST	/api/workouts/log	Log a new workout session
DELETE	/api/workouts/log/:id	Delete a log entry
