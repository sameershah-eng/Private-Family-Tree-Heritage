# Heirloom — Private Family Tree & Heritage Archive

**Heirloom** is a private, elegant family tree and generational archive web application designed like a luxury heritage book or museum archive. It features an interactive React Flow family tree canvas, cinematic full-screen presentation mode for reunions and living room TV displays, a curated photographic gallery, GEDCOM 5.5 / 5.5.1 and CSV ledger importers, and role-based family governance.

---

## Key Features

1. **Interactive Family Tree Canvas (`/tree`)**:
   - Pan, pinch-to-zoom on mobile, zoom controls, fit-view, and minimap.
   - Generational hierarchical layout with spouse partnerships and curved gold ancestry lines.
   - Branch filtering (Paternal, Maternal, Direct Lineage) and ancestor/descendant focus mode.
   - Clickable nodes with responsive side drawers (desktop) and bottom sheets (mobile).

2. **Cinematic Presentation Mode (`/present`)**:
   - Fullscreen API support with autoplay and adjustable pacing.
   - Episodic slide progression: Grand Title Slide → Generational Chapters → Individual Member Spotlights with Ken Burns photographic effects → Legacy Finale.
   - Dark Heritage and Ivory Classic themes.
   - Touch swipe and keyboard arrow controls with auto-hiding interface controls.

3. **GEDCOM 5.5 / 5.5.1 & CSV Import / Export (`/manage`)**:
   - Custom parser supporting `INDI`, `FAM`, `NAME`, `BIRT`, `DEAT`, `DATE`, `PLAC`, `SEX`, `FAMS`, `FAMC`, `HUSB`, `WIFE`, and `CHIL` records.
   - Pre-import validation preview showing detected individuals, families, and linked relationships.
   - One-click merge or replace modes with celebratory confetti animation.
   - One-click GEDCOM and JSON backup export for Ancestry, MyHeritage, or RootsMagic.

4. **Curated Photographic Archive (`/gallery`)**:
   - Decade-based filtering and member tagging.
   - Keyboard-navigated lightbox modal with high-resolution portraits, captions, and direct relative profile chips.
   - Base64 local image upload with instant preview.

5. **Role-Based Access Control (`/manage`)**:
   - **Owner**: Full repository control, invitations, and record deletion.
   - **Editor**: Add/edit individuals, link relationships, and upload photographs.
   - **Viewer**: Read-only access for family gatherings.
   - Quick one-click demo role switcher to test each permission tier.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Launch Vite development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## Vercel Deployment Instructions

Heirloom is configured for zero-configuration, 1-click deployment on Vercel:

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [vercel.com/new](https://vercel.com/new) and click **Import** next to your repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**.
5. Deep link routing is already protected against 404s via the included `/vercel.json` SPA rewrite rule:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

---

## Architecture & Data Persistence

- All family records, media attachments, auth sessions, and activity logs are persisted client-side in `localStorage` via Zustand's `persist` middleware.
- The data service layer is centralized in `src/services/familyStorageService.ts` and can be switched to Firebase Firestore or Supabase by updating the persistence adapter.
