# 🧩 AAC Platform

AI-Assisted Augmentative & Alternative Communication System

## 📌 Project Purpose

The AAC Platform is a full-stack, multilingual Augmentative & Alternative Communication system designed to support:

- Children with speech or communication disorders
- Adult AAC users
- Parents and caregivers
- Speech therapists and professionals

The platform combines pictographic communication, text-to-speech, and AI-assisted sentence building, while collecting structured data for clinical insights and statistics.

## 🏗️ Technical Architecture

### Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **State:** React Context
- **i18n:** react-i18next
- **Accessibility:** High-contrast mode, big buttons, mobile-first
- **Speech:** Web Speech API (TTS)

### Backend

- **Framework:** NestJS
- **ORM:** TypeORM
- **Database:** PostgreSQL (planned)
- **Auth:** JWT + Role-Based Access Control (RBAC)
- **i18n:** Backend-ready, frontend-driven (Option B)
- **Static Assets:** Image service for pictograms

## 👥 User Roles (RBAC)

| Role | Description |
|------|-------------|
| ADMIN | Platform administration |
| PROFESSIONAL | Therapist / Speech specialist |
| PARENT | Manages children profiles |
| PATIENT_ADULT | Adult AAC user |
| CHILD | Child AAC user |

Roles are enforced server-side and reflected client-side for UX.

## 🌍 Internationalization Strategy

### Current Strategy — Option B

- Backend stores semantic keys only
- Frontend owns translation files (JSON)
- All keys are English-based and stable
- No localized text in database

**Example (DB / API):**
```
translateKey: "tile.food.egg"
```

**Frontend:**
```json
{
    "tile": {
        "food": {
            "egg": "Egg"
        }
    }
}
```

### Future Migration — Option A

- Backend serves translations dynamically
- Frontend consumes translations via API
- No breaking change due to stable keys

## 🧠 Semantic System (AI-Ready)

Each tile can optionally include a semantic token:

```
semantic: "semantic.feeling.happy"
```

Used by:
- Sentence builder
- Grammar engine
- AI rules
- Analytics & statistics

Semantics are language-independent, stable, and never localized.

## 🗂️ Data Model (Frontend)

### Tile
```typescript
interface TileData {
    id: string;
    translateKey: string;
    categoryKey: string;
    groupKey?: string;
    semantic?: SemanticToken;
    imageUrl?: string;
    order?: number;
}
```

### Category
```typescript
interface Category {
    id: string;
    translateKey: string;
    icon: string;
    order?: number;
}
```

### Group
```typescript
interface Group {
    id: string;
    translateKey: string;
    categoryKey: string;
    order?: number;
}
```

## 🧪 Environments

| Environment | Branch |
|-------------|--------|
| Development | dev |
| Feature branches | feature/* |
| Testing / Staging | test (planned) |
| Production | main |

## 🌿 Git Workflow

```
main
 └── dev
            ├── feature/auth-user-roles
            ├── feature/auth-dtos
            ├── feature/children-profiles
            └── ...
```

**Rules:**
- `dev` is always stable
- One task = one feature branch
- One logical commit per task
- Merge via PR (even solo)

## 🧩 Scrum Methodology

- Scrum framework
- Short, focused sprints
- Each sprint produces deployable progress
- Bugs tracked as sprint tasks

## 📦 Sprint Overview

### ✅ Sprint 0 — Foundation (Completed)

- Project setup (Frontend + Backend)
- AAC board UI
- Tile system (local data)
- i18n system
- Initial sentence builder
- Git workflow & tooling

### 🚧 Sprint 1 — Authentication & Roles (Current)

**Epic:** User & Access Management

**Planned tasks:**
- User roles definition
- Auth entities & DTOs
- JWT authentication
- Role-based guards
- Child / Adult profiles
- Statistics-ready attributes (age, sex)

## 🚀 Development Rules

- English only for keys and identifiers
- Never store translated text in DB
- Prefer composition over duplication
- Accessibility is not optional
- Mobile first, always

## 📊 Future Roadmap

- AI sentence suggestions
- Usage analytics & reports
- Therapist dashboard
- Offline sync
- PWA support
- Machine-learning personalization

## 🧠 Long-Term Vision

AAC Platform aims to become:

- A clinical-grade AAC tool
- A data-driven support platform
- A scalable multilingual system
- A bridge between families and professionals

## 📄 License

Private – All rights reserved.

## ✍️ Author

**Mohammed EL-IDRISSI**  
Full-Stack JavaScript Developer  
AAC Platform – 2026