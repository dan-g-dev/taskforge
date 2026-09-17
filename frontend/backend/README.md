This folder only contains `types.ts` — shared TypeScript type
definitions kept here so the frontend's existing relative imports
(`../../backend/types`) resolve correctly.

The real, running backend lives in the sibling `../../backend`
folder (Express + MySQL) and is a completely separate Node project.
