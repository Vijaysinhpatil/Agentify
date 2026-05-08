# Agentify AI Project Brief

Paste the prompt below into any AI tool when you want a fast, accurate explanation of this project.

## Copy This Prompt

```md
You are reviewing a software project called **Agentify**. I want you to explain this project in a way that is easy to understand for a developer, product builder, or technical reviewer.

Please analyze the project using the information below and give me:

1. A plain-English summary of what the product does
2. The main user flow from sign-in to agent creation
3. The current frontend architecture
4. The current backend/data architecture
5. The role of each major technology used
6. What is already implemented
7. What looks incomplete, placeholder, or risky
8. The likely next steps to make this production-ready
9. Any code quality or architecture concerns you notice
10. A short final verdict on the current maturity of the project

Keep your answer structured, practical, and easy to skim.

---

# Project Overview

This project is named **Agentify**.

It is a visual AI agent builder web app where users can:
- sign in
- create AI agents
- view a list of their agents
- open an agent builder canvas
- eventually design agent workflows using visual nodes
- later preview, publish, and embed those agents

The product positioning shown in the UI is:
- "Build AI agents like workflows. Ship them like products."
- drag, build, preview, publish
- visual flow builder
- hosted agent execution
- publishable SDK/embed snippet

At the moment, the app is part real implementation and part early-stage scaffold.

---

# Tech Stack

- **Next.js 16.2.3** using the App Router
- **React 19.2.4**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** and related UI primitives
- **Clerk** for authentication
- **Convex** for backend database and server functions
- **React Flow (@xyflow/react)** for the visual workflow builder canvas
- **Arcjet** for rate limiting / request protection
- **uuid** for generating agent IDs
- **moment** for displaying relative times

---

# Main App Structure

## Main routes

- `/` = landing page
- `/dashboard` = dashboard home
- `/agent-builder/[agentId]` = visual builder page for a specific agent
- `/sign-in/...` and `/sign-up/...` = Clerk auth pages
- `/api/arcjet` = sample/protected API route

## Important frontend files

- `app/page.tsx`
  Landing page with product marketing and calls to action

- `app/layout.tsx`
  Root app layout with:
  - ClerkProvider
  - ConvexClientProvider
  - custom Provider for loading user data into context
  - ThemeProvider

- `app/provider.tsx`
  After Clerk user is available, it calls a Convex mutation to create or fetch the user record, then stores that result in React context

- `app/context/userDetailContext.tsx`
  Stores the current app-level user details

- `app/dashboard/page.tsx`
  Dashboard page combining:
  - create agent section
  - AI agents tab

- `app/dashboard/_components/createAgentSection.tsx`
  Lets a user create a new agent using a dialog and then redirects to the builder page

- `app/dashboard/_components/MyAgents.tsx`
  Loads and displays the current user's agents from Convex

- `app/dashboard/_components/AiAgentsTab.tsx`
  Shows tabs for "My Agents" and "Templates"

- `app/agent-builder/[agentId]/page.tsx`
  React Flow canvas with starter nodes and a tools panel

---

# Current User Flow

1. User visits the site
2. Clerk handles authentication
3. In `app/provider.tsx`, the app calls a Convex mutation to create or fetch the user in the database
4. The dashboard allows the user to create an agent
5. Creating an agent:
   - generates a UUID
   - stores an agent record in Convex
   - redirects the user to `/agent-builder/[agentId]`
6. The builder page currently opens a visual canvas with pre-seeded nodes and edges
7. The user can move/connect nodes visually, but persistence and runtime execution are not yet fully implemented

---

# Convex Backend

## Current schema

### `users`
Fields:
- `name: string`
- `email: string`
- `imageUrl?: string`
- `subscription?: string`
- `token: number`

### `agentTable`
Fields:
- `agentId: string`
- `name: string`
- `published: boolean`
- `config?: string`
- `userId: Id<"users">`

## Current Convex functions

### `convex/user.ts`
- `CreateNewUser`
  - input: `name`, `email`
  - checks whether a user with that email exists
  - if not, inserts a new user with `token: 5000`
  - returns the existing or created user

### `convex/agent.ts`
- `CrateAgent` (note the typo in the function name)
  - input: `name`, `agentId`, `userId`
  - inserts a new agent into `agentTable`

- `getUserAgents`
  - input: `userId`
  - returns all agents for that user in descending order

---

# Builder Experience

The builder page currently uses React Flow and starts with two nodes:

- `StartNode`
- `AgentNode`

There is also:
- a header
- an `AgentToolsPanel`
- a placeholder "Settings" panel
- draggable canvas behavior
- connectable edges
- grid snapping
- controls and background styling

This means the visual builder experience exists at a UI level, but it does not yet appear to be fully wired to a saved workflow model.

---

# Authentication and App State

- Clerk handles auth
- The app uses a React context named `UserDetailContext`
- After login, the app creates or fetches a user in Convex and stores that result in context
- Agent creation depends on that Convex user record because the agent stores `userId`

---

# Arcjet / Rate Limiting

There is an Arcjet config with a token bucket:

- capacity: 5000
- refill rate: 5000
- interval: 30 days
- characteristic: `userId`

There is also a sample API route at `/api/arcjet`.

Important detail:
- the route currently uses a hardcoded `userId = "user123"` instead of a real authenticated user identity

So this looks like an early test/prototype integration rather than finished production logic.

---

# What Appears Implemented

- marketing landing page
- auth pages via Clerk
- root providers and app wiring
- user creation in Convex
- dashboard shell
- create-agent dialog
- persistence of basic agent records in Convex
- agent listing for a user
- route-based navigation into an agent builder page
- visual flow canvas with starter nodes and connectable edges

---

# What Appears Incomplete or Placeholder

- default README is still the generic Next.js starter README
- builder state does not appear to persist nodes/edges to the database
- no real agent execution engine is visible yet
- no publish flow is implemented yet
- no SDK/embed generation is visible yet
- templates tab is placeholder content
- settings panel on builder page is placeholder text
- Arcjet route uses a hardcoded user ID
- some route links referenced in the landing page may not exist yet, such as dashboard subpages like pricing or agents
- there is a typo in `CrateAgent`
- some typing is loose, for example React context uses `any`

---

# Architecture / Code Quality Concerns

Please pay attention to these:

1. Convex query style
   - The project uses `.filter(...)` in Convex queries
   - Modern Convex guidance usually prefers indexed queries with `withIndex(...)`
   - This may become a performance or correctness issue later

2. Missing indexes in schema
   - `users` should likely index `email`
   - `agentTable` should likely index `userId` or combinations like `userId + createdAt`

3. Convex auth alignment
   - The project uses Clerk on the frontend
   - But it is not obvious that Convex auth is fully configured with `auth.config.ts`
   - The app currently appears to pass `userId` directly into mutations instead of deriving identity server-side

4. Builder persistence gap
   - The visual workflow editor currently seems UI-only
   - No saved node graph model is obvious from the current schema

5. Type safety
   - Some files use `any`
   - context typing is weak

6. Naming / polish issues
   - `CrateAgent` typo
   - starter README still present
   - placeholder tabs/panels

7. Production-readiness gap
   - landing page promises preview, publish, hosted runtime, and SDK embedding
   - current implementation seems earlier than that promise

---

# Suggested Production Roadmap

Based on the current codebase, likely next steps are:

1. Add proper Convex indexes and improve queries
2. Add Convex auth integration and server-side ownership checks
3. Add workflow persistence for nodes, edges, and per-node configuration
4. Define a formal agent schema, including versioning and publish state
5. Build preview/runtime execution for the workflow
6. Implement publish/deploy/embed flows
7. Replace placeholders in dashboard tabs and builder settings
8. Tighten TypeScript types and remove `any`
9. Replace the default README with real project documentation
10. Add testing for Convex mutations/queries and builder behavior

---

# Summary Request

Using all the information above, explain:
- what Agentify is
- how it works today
- what is missing
- what should be improved first

Also tell me whether this looks like:
- idea stage
- prototype
- MVP in progress
- near-production

End with a short, honest assessment.
```

## Notes

- This brief is based on the current codebase, not just the marketing copy.
- It is designed to help another AI quickly understand the product, stack, architecture, and current maturity.
- If you want, this can later be turned into:
  - a `README.md`
  - a technical architecture doc
  - an investor/product summary
  - a handoff doc for developers
