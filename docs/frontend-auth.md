# Frontend Authentication Architecture

## 1. Goal of AP-49
Define frontend authentication design and decisions before implementation. Establish rules for all future frontend auth tasks.

**Success Criteria:**
- Clear authentication flow documentation
- Defined routes (public vs protected)
- Role-based redirect logic
- Token handling standards
- No ambiguity for development team

---

## 2. High-Level Architecture

**Stack:** Next.js + React Context + NestJS JWT

**Token Storage:** localStorage (Option B) → migrate to HttpOnly cookies later (Option A)

**Backend:** NestJS JWT endpoints already implemented

---

## 3. Auth API Layer

**Responsibility:** Communicate with NestJS `/auth/*` endpoints

**Endpoints:**
- `POST /auth/register` → Returns `{ access_token }`
- `POST /auth/login` → Returns `{ access_token }`

---

## 4. AuthContext (Single Source of Truth)

**State:**
```typescript
AuthState {
    isAuthenticated: boolean
    token: string | null
    user: {
        id: string
        email: string
        role: UserRole
    } | null
    activeChildId?: string
}
```

**Exposed Methods:**
- `login(email, password)`
- `register(data)`
- `logout()`
- `setActiveChild(childId)`

---

## 5. Route Types

| Type | Routes | Auth Required |
|------|--------|---|
| **Public** | `/`, `/about`, `/login`, `/register` | No |
| **Protected** | `/dashboard`, `/board`, `/children`, `/settings` | Yes → redirect to `/login` |

---

## 6. Role-Based Redirect Logic

| Role | Redirect | Special Rules |
|------|----------|---|
| **ADMIN** | `/admin` (future) | — |
| **PROFESSIONAL** | `/dashboard/professional` | Can view multiple children (future) |
| **PATIENT_ADULT** | `/board` | No child selection |
| **PARENT** | See flow below | activeChildId required |

### Parent Flow
- **No active child:** → `/dashboard/parent` (show "Create or select child")
- **With active child:** → `/board` (all actions scoped to activeChildId)
- **Rule:** Parent cannot access board without activeChildId

---

## 7. Login Flow

1. User submits login form
2. Frontend `POST /auth/login` → receive `access_token`
3. Frontend:
     - Saves token to localStorage
     - Decodes JWT (extract role, userId)
     - Updates AuthContext
     - Redirects based on role (see §6)

---

## 8. Token Handling Rules

- **Storage:** localStorage
- **Attachment:** Every API request includes `Authorization: Bearer <token>`
- **On 401 Unauthorized:** Auto logout → redirect to `/login`

---

## 9. Active Child Rules (Parent Only)

- **Storage:** AuthContext + localStorage (persistence on refresh)
- **Change:** Immediately updates context
- **Logout:** Clears activeChildId

---

## 10. UX & Security Decisions

| Action | Behavior |
|--------|----------|
| **Logout** | Clears: token, user, activeChildId |
| **Page refresh** | Restores auth state from localStorage |
| **No token** | No silent login; redirect to `/login` |
| **No activeChildId** | Parent cannot access `/board` |
