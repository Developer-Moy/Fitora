# StopwatchPreset Model - Implementation Documentation

## ✅ Model Implementation Complete

### Model Overview

**Model Name**: `StopwatchPreset`  
**Collection**: `stopwatchpresets`  
**Location**: `src/models/StopwatchPreset.model.ts`

---

## Schema Structure

```typescript
interface IStopwatchPreset extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  workDuration: number;
  restDuration: number;
  warmupDuration: number;
  cooldownDuration: number;
  rounds: number;
  type?: PresetType;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

type PresetType = "HIIT" | "Boxing" | "Rest" | "Custom";
```

---

## Fields

| Field | Type | Required | Default | Validation | Description |
|-------|------|----------|---------|------------|-------------|
| `_id` | ObjectId | Auto | - | - | MongoDB document ID |
| `userId` | ObjectId | ✅ Yes | - | References User | Owner of the preset |
| `name` | string | ✅ Yes | - | Trimmed | Preset name |
| `workDuration` | number | ✅ Yes | - | >= 0 | Work duration in seconds |
| `restDuration` | number | ✅ Yes | - | >= 0 | Rest duration in seconds |
| `warmupDuration` | number | ✅ Yes | 0 | >= 0 | Warmup duration in seconds |
| `cooldownDuration` | number | ✅ Yes | 0 | >= 0 | Cooldown duration in seconds |
| `rounds` | number | ✅ Yes | - | >= 1 | Number of rounds |
| `type` | PresetType | ❌ No | "Custom" | Enum | Preset category |
| `isPublic` | boolean | ❌ No | false | - | Public/private flag |
| `createdAt` | Date | Auto | - | - | Created timestamp |
| `updatedAt` | Date | Auto | - | - | Updated timestamp |

---

## Indexes

### 1. Primary Index
- **Field**: `_id`
- **Type**: Unique
- **Auto-generated**: Yes

### 2. User Query Index
- **Fields**: `{ userId: 1, createdAt: -1 }`
- **Type**: Compound index
- **Purpose**: Efficiently fetch user's presets sorted by creation date

### 3. User ID Index
- **Field**: `userId`
- **Type**: Single field index
- **Purpose**: Fast lookups by user

---

## Features

### ✅ User Isolation
- Each preset is owned by a specific user via `userId`
- Users can only retrieve their own custom presets
- Enforced at the controller level with authentication

### ✅ Timestamps
- Automatically tracks `createdAt` and `updatedAt`
- Enabled via Mongoose `timestamps: true` option

### ✅ TypeScript Typing
- Fully typed interface `IStopwatchPreset`
- No `any` types used
- Type-safe `PresetType` enum

### ✅ Validation
- All numeric fields have minimum constraints
- String fields are trimmed
- Enum validation for `type` field

### ✅ References
- `userId` references the `User` model
- Proper ObjectId reference setup

---

## Query Examples

### Create User Preset
```typescript
const preset = await StopwatchPreset.create({
  userId: req.user.userId,
  name: "My HIIT",
  workDuration: 30,
  restDuration: 15,
  warmupDuration: 60,
  cooldownDuration: 120,
  rounds: 10,
  type: "Custom",
  isPublic: false,
});
```

### Get User's Presets (Isolated)
```typescript
const userPresets = await StopwatchPreset.find({
  userId: req.user.userId,
  isPublic: false,
})
  .sort({ createdAt: -1 })
  .lean();
```

### Get Public Presets
```typescript
const publicPresets = await StopwatchPreset.find({
  isPublic: true,
})
  .select("-userId -__v -isPublic")
  .sort({ createdAt: 1 })
  .lean();
```

---

## Security Features

### ✅ User Isolation Enforced
**Requirement**: "A user must only be able to retrieve their own custom presets."

**Implementation**:
1. **Database Level**: Each preset has `userId` field (required, indexed)
2. **Controller Level**: Queries filter by `req.user.userId`
3. **Authentication**: JWT middleware validates user before any preset access

**GET /api/stopwatch/user-presets**:
```typescript
// Only fetch presets belonging to the authenticated user
const userPresets = await StopwatchPreset.find({
  userId: req.user.userId,  // ✅ User isolation enforced
  isPublic: false,
});
```

**POST /api/stopwatch/custom-preset**:
```typescript
// New presets are automatically assigned to the authenticated user
const newPreset = await StopwatchPreset.create({
  userId: req.user.userId,  // ✅ Owner automatically set
  // ... other fields
});
```

### ✅ No Cross-User Access
- Users cannot see other users' custom presets
- Users cannot modify other users' presets
- Public presets are system-wide (owned by system user)

---

## Public vs Custom Presets

### Public Presets
- `isPublic: true`
- `userId: "000000000000000000000000"` (system user)
- Available to all users via GET /api/stopwatch/presets
- Seeded on server startup (Tabata, Boxing, Rest timers)

### Custom Presets
- `isPublic: false`
- `userId: <authenticated_user_id>`
- Only visible to the owner
- Created via POST /api/stopwatch/custom-preset

---

## Seed Data

**Location**: `src/data/stopwatch.seed.ts`

**5 Default Public Presets**:
1. Tabata - 20s work / 10s rest / 8 rounds (HIIT)
2. Boxing - 180s work / 60s rest / 5 rounds (Boxing)
3. Rest 60s - 60s / 1 round (Rest)
4. Rest 90s - 90s / 1 round (Rest)
5. Rest 120s - 120s / 1 round (Rest)

All seeded with system userId: `"000000000000000000000000"`

---

## Migration Notes

If you have existing data with the old schema, you'll need to:

1. **Drop old collection** (development only):
   ```javascript
   db.stopwatchpresets.drop()
   ```

2. **Or migrate data** (production):
   ```javascript
   db.stopwatchpresets.updateMany(
     { createdBy: { $exists: true } },
     { 
       $rename: { "createdBy": "userId" },
       $unset: { "id": "", "description": "" }
     }
   )
   ```

---

## Controller Integration

### Files Using This Model

1. **src/controllers/stopwatch.controller.ts**
   - `getPresets()` - Fetch public presets
   - `createCustomPreset()` - Create user preset
   - `getUserPresets()` - Fetch user's own presets

2. **src/data/stopwatch.seed.ts**
   - Seeds default public presets on startup

---

## Example Document

```json
{
  "_id": "66d1234567890abcdef12345",
  "userId": "66d0987654321fedcba09876",
  "name": "My HIIT Workout",
  "workDuration": 30,
  "restDuration": 15,
  "warmupDuration": 60,
  "cooldownDuration": 120,
  "rounds": 10,
  "type": "Custom",
  "isPublic": false,
  "createdAt": "2026-08-30T10:30:00.000Z",
  "updatedAt": "2026-08-30T10:30:00.000Z"
}
```

---

## Build Status

✅ **TypeScript Compilation**: Successful  
✅ **No Type Errors**: All types properly defined  
✅ **Strict Mode**: Full compliance  
✅ **Indexes**: Properly configured  
✅ **Timestamps**: Enabled  
✅ **User Isolation**: Enforced  

---

## Summary

The `StopwatchPreset` model is production-ready with:

- ✅ All required fields (`userId`, `name`, `workDuration`, `restDuration`, `warmupDuration`, `cooldownDuration`, `rounds`)
- ✅ Proper TypeScript typing (no `any`)
- ✅ User reference via `userId`
- ✅ Automatic timestamps (`createdAt`, `updatedAt`)
- ✅ Efficient indexing for user queries
- ✅ **User isolation enforced** - users can only access their own presets
- ✅ Validation constraints on all fields
- ✅ Public/private preset support

**Last Updated**: 2026-08-30  
**Status**: ✅ Complete and Production-Ready
