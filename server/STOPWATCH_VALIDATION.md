# POST /api/stopwatch/custom-preset - Validation Implementation

## ✅ Complete Validation Implementation

### Endpoint
`POST /api/stopwatch/custom-preset`

### Authentication
**Required**: JWT Bearer token via existing auth middleware

### Request Body Schema

```typescript
{
  name: string;              // Required, non-empty
  workDuration: number;      // Required, positive (1-3600)
  restDuration: number;      // Required, non-negative (0-3600)
  warmupDuration?: number;   // Optional, non-negative (0-3600), default: 0
  cooldownDuration?: number; // Optional, non-negative (0-3600), default: 0
  rounds: number;            // Required, positive integer (1-100)
}
```

### Validation Rules

| Field | Required | Type | Constraint | Limit |
|-------|----------|------|------------|-------|
| `name` | ✅ Yes | string | Non-empty string | - |
| `workDuration` | ✅ Yes | number | Positive (> 0) | ≤ 3600 seconds |
| `restDuration` | ✅ Yes | number | Non-negative (≥ 0) | ≤ 3600 seconds |
| `warmupDuration` | ❌ No | number | Non-negative (≥ 0) | ≤ 3600 seconds |
| `cooldownDuration` | ❌ No | number | Non-negative (≥ 0) | ≤ 3600 seconds |
| `rounds` | ✅ Yes | number | Positive integer (> 0) | ≤ 100 |

### Success Response (201)

```json
{
  "success": true,
  "message": "Custom preset created successfully",
  "data": {
    "id": "custom-1725018822199-abc123xyz",
    "name": "My HIIT",
    "type": "Custom",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10,
    "warmupDuration": 60,
    "cooldownDuration": 120
  }
}
```

### Error Responses

#### 401 Unauthorized - Missing Authentication
```json
{
  "success": false,
  "message": "Authentication required to create custom preset"
}
```

#### 400 Bad Request - Validation Errors

**Missing name:**
```json
{
  "success": false,
  "message": "name is required"
}
```

**Invalid name (empty string):**
```json
{
  "success": false,
  "message": "name must be a non-empty string"
}
```

**Invalid name (not a string):**
```json
{
  "success": false,
  "message": "name must be a non-empty string"
}
```

**Missing workDuration:**
```json
{
  "success": false,
  "message": "workDuration is required"
}
```

**Invalid workDuration (zero or negative):**
```json
{
  "success": false,
  "message": "workDuration must be a positive number"
}
```

**workDuration exceeds limit:**
```json
{
  "success": false,
  "message": "workDuration must not exceed 3600 seconds"
}
```

**Missing restDuration:**
```json
{
  "success": false,
  "message": "restDuration is required"
}
```

**Invalid restDuration (negative):**
```json
{
  "success": false,
  "message": "restDuration must be a non-negative number"
}
```

**restDuration exceeds limit:**
```json
{
  "success": false,
  "message": "restDuration must not exceed 3600 seconds"
}
```

**Invalid warmupDuration (negative):**
```json
{
  "success": false,
  "message": "warmupDuration must be a non-negative number"
}
```

**warmupDuration exceeds limit:**
```json
{
  "success": false,
  "message": "warmupDuration must not exceed 3600 seconds"
}
```

**Invalid cooldownDuration (negative):**
```json
{
  "success": false,
  "message": "cooldownDuration must be a non-negative number"
}
```

**cooldownDuration exceeds limit:**
```json
{
  "success": false,
  "message": "cooldownDuration must not exceed 3600 seconds"
}
```

**Missing rounds:**
```json
{
  "success": false,
  "message": "rounds is required"
}
```

**Invalid rounds (not a positive integer):**
```json
{
  "success": false,
  "message": "rounds must be a positive integer"
}
```

**rounds exceeds limit:**
```json
{
  "success": false,
  "message": "rounds must not exceed 100"
}
```

#### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Failed to create custom preset",
  "error": "Specific error message"
}
```

---

## Test Cases

### Valid Requests

**1. Minimal valid request (no optional fields):**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ✅ 201 Created with warmupDuration=0, cooldownDuration=0

**2. Full valid request (with optional fields):**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "warmupDuration": 60,
    "cooldownDuration": 120,
    "rounds": 10
  }'
```

**Expected**: ✅ 201 Created

**3. Zero restDuration (valid):**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Pure Work",
    "workDuration": 60,
    "restDuration": 0,
    "rounds": 5
  }'
```

**Expected**: ✅ 201 Created

**4. Maximum allowed values:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maximum Workout",
    "workDuration": 3600,
    "restDuration": 3600,
    "warmupDuration": 3600,
    "cooldownDuration": 3600,
    "rounds": 100
  }'
```

**Expected**: ✅ 201 Created

---

### Invalid Requests

**1. Missing authentication:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 401 Unauthorized

**2. Missing name:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "name is required"

**3. Empty name:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "name must be a non-empty string"

**4. Invalid name type:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": 123,
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "name must be a non-empty string"

**5. Missing workDuration:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "workDuration is required"

**6. Zero workDuration:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 0,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "workDuration must be a positive number"

**7. Negative workDuration:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": -10,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "workDuration must be a positive number"

**8. workDuration exceeds limit:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 3601,
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "workDuration must not exceed 3600 seconds"

**9. Negative restDuration:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": -5,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "restDuration must be a non-negative number"

**10. Negative warmupDuration:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "warmupDuration": -10,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 "warmupDuration must be a non-negative number"

**11. Zero rounds:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 0
  }'
```

**Expected**: ❌ 400 "rounds must be a positive integer"

**12. Negative rounds:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": -5
  }'
```

**Expected**: ❌ 400 "rounds must be a positive integer"

**13. Decimal rounds:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 5.5
  }'
```

**Expected**: ❌ 400 "rounds must be a positive integer"

**14. rounds exceeds limit:**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": 30,
    "restDuration": 15,
    "rounds": 101
  }'
```

**Expected**: ❌ 400 "rounds must not exceed 100"

**15. Malicious payload (string instead of number):**
```bash
curl -X POST http://localhost:5001/api/stopwatch/custom-preset \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My HIIT",
    "workDuration": "30",
    "restDuration": 15,
    "rounds": 10
  }'
```

**Expected**: ❌ 400 (type validation)

---

## Security Features

✅ **Authentication Required**: JWT token validated by existing middleware  
✅ **Input Type Validation**: Strict type checking (number, string, integer)  
✅ **Range Validation**: All numeric fields have reasonable upper limits  
✅ **Non-negative Constraints**: Prevents negative duration values  
✅ **Positive Constraints**: workDuration and rounds must be > 0  
✅ **Integer Validation**: rounds must be a whole number  
✅ **String Trimming**: name is trimmed before storage  
✅ **Empty String Prevention**: name cannot be empty or whitespace only  
✅ **Malicious Payload Prevention**: Type mismatches rejected  

---

## Implementation Details

- **Auth**: Uses existing `AuthRequest` interface from `auth.middleware.ts`
- **User ID**: Obtained from `req.user.userId` (set by JWT middleware)
- **Auto-generated ID**: Unique preset ID created using timestamp + random string
- **Type**: Always set to "Custom" for user-created presets
- **Defaults**: warmupDuration and cooldownDuration default to 0 if not provided
- **Database**: Saved to MongoDB with `createdBy` reference to user
- **Response**: Returns only necessary fields, excludes MongoDB internals

---

## Build Status

✅ **TypeScript Compilation**: Successful  
✅ **No Type Errors**: All validations properly typed  
✅ **Strict Mode**: Full TypeScript strict mode compliance  

---

**Last Updated**: 2026-08-30  
**Status**: ✅ Complete and Production-Ready
