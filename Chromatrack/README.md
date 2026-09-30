# Chromatrack

**Read your strip. Track your exposure.**

Chromatrack is a responsive frontend prototype for an H₂S exposure-dosimeter wristband with a paper-based electrochromic strip. It demonstrates a complete journey from demo access and strip photography to simulated analysis, saved readings, and exposure-session tracking.

> Prototype estimates; not a substitute for a certified H₂S safety alarm.

## Technology

| Part | Technology |
| --- | --- |
| UI | React 19 and TypeScript (`.tsx`) |
| Styling | Tailwind CSS 4 and custom CSS |
| Charts | Recharts |
| Components | Shadcn/Radix UI primitives |
| Icons | Lucide React |
| Framework and build | Vinext with Vite and an App Router-style structure |
| Included hosting scaffold | Cloudflare Workers |
| Demo persistence | IndexedDB, localStorage, and sessionStorage |

This is a multi-file React project, not a standalone HTML page. Keep the complete folder structure when uploading it to GitHub or running it locally.

## Features

- Responsive desktop sidebar and mobile bottom navigation.
- Login, account creation, and password-reset forms with validation, plus separate **Explore demo** access.
- JPEG/PNG strip uploads up to 5 MB, drag-and-drop upload, and camera capture with permission-error handling.
- Image preview, replacement, rotation, cropping, and selectable analysis region with keyboard-accessible sliders.
- Strip ID or pasted QR text, chemistry, session times, calibration profile, location, and notes.
- Explicitly simulated analysis with uncalibrated, saturated-strip, image-quality, and service-error scenarios.
- Colour measurements, calibration-dependent cumulative exposure, session duration, session-average concentration, and supplied demo uncertainty.
- Saved records, filters, search, sorting, pagination, detail views, CSV export, and confirmed deletion.
- Charts for final session totals, repeated cumulative readings within a session, and colour intensity over time.
- Profile editing, photo management, help, sign out, and demo reset.

## Important demo limitations

**All measurements and calibration profiles are synthetic and labelled “Demo data.”** The analysis adapter returns fixed demonstration values; it does not analyse the uploaded image's pixels or call a real AI service.

- Real account registration, sign-in, and password resets are not connected. The forms report this explicitly; use **Explore demo** to access the prototype.
- Passwords are never stored or transmitted by the provided adapter. “Remember me” stores a preference only.
- Real device connections are not implemented. Optional device values can be enabled as synthetic examples.
- QR values can be entered or pasted; automatic QR scanning is not implemented.
- Records are local to the current browser and do not sync between devices.
- A single photograph does not reveal instantaneous concentration, peak exposure, or a historical concentration curve.

## Run locally

### Requirements

- Node.js **22.13 or newer**, as specified in `package.json`.
- pnpm **11.25.0**, matching the project's package-manager declaration.
- An internet connection for the initial dependency installation.

Install the matching package manager if needed:

```bash
npm install --global pnpm@11.25.0
```

Extract the project ZIP, open a terminal in the folder containing `package.json`, and run:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open **http://localhost:5173** and select **Explore demo**.

If the terminal reports another URL, use that URL. Camera access requires a supported browser, camera permission, and a secure context such as HTTPS or localhost. Uploading an existing photo provides a fallback.

### Other commands

```bash
# Check TypeScript
pnpm exec tsc --noEmit

# Build the application
pnpm build

# Serve the built Cloudflare Worker locally
pnpm start
```

Use the address printed by `pnpm start`. The included production build targets the Worker scaffold; it is not a ready-made GitHub Pages static export.

## Upload to GitHub

### Option A: Git commands

1. Create a new empty repository on GitHub. Do not initialise it with a README, `.gitignore`, or licence, because the project already contains its files.
2. Extract this ZIP and open a terminal inside the **Chromatrack** folder, where `package.json` is located.
3. Run the following, replacing `YOUR_USERNAME` and `YOUR_REPOSITORY` with your GitHub values:

```bash
git init
git add .
git commit -m "Add Chromatrack frontend prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Authenticate with GitHub when prompted. If your repository already contains commits, clone it first and copy the project files into that checkout; do not force-push over existing work.

### Option B: GitHub website

Open your repository, choose **Add file → Upload files**, and upload the **contents of the extracted Chromatrack folder**. Preserve the directories. The repository root should contain `package.json`, `README.md`, `app/`, and the other project files—not just the ZIP.

Include the `.openai` directory because `vite.config.ts` imports its neutral configuration. This export contains no hosted project identifier in that file.

Do not upload `node_modules`, build outputs, local browser data, or credentials. The supplied `.gitignore` excludes the usual generated and local files. Uploading source to GitHub does not, by itself, deploy the application.

## Main source files

| File or directory | Purpose |
| --- | --- |
| `app/page.tsx` | Main React entry: login, navigation, home, profile, help, and record-detail flows |
| `app/analyser.tsx` | Photo upload, camera capture, region selection, image editing, and analysis workflow |
| `app/records.tsx` | Record filters, table/cards, charts, pagination, and CSV export |
| `app/ui.tsx` | Shared buttons, fields, branding, result panels, and notices |
| `app/globals.css` | Theme, styling, spacing, and responsive layouts |
| `app/layout.tsx` | Root layout and page metadata |
| `lib/chromatrack/api.ts` | API interfaces, demo adapters, seed data, and session calculations |
| `components/ui/` | Reusable UI primitives |
| `hooks/` | Shared React hooks |
| `public/` | Wristband illustration and icons |
| `build/`, `scripts/` | Framework and hosting support |
| `package.json`, `pnpm-lock.yaml` | Dependencies, scripts, and reproducible dependency versions |
| `.openai/hosting.json` | Neutral hosting configuration required by the included build setup |

The separate `page.tsx` download is the main React file for reference. It imports the other files above and cannot run on its own.

## API integration

The contracts and current adapters are in `lib/chromatrack/api.ts`:

| Interface | Methods | Current behaviour |
| --- | --- | --- |
| `AuthenticationAPI` | `login`, `createAccount`, `resetPassword`, `signOut` | Account operations report that services are not connected |
| `AnalysisAPI` | `analyse` | Returns deterministic synthetic results or a simulated error |
| `RecordsAPI` | `list`, `save`, `delete`, `reset` | Uses browser IndexedDB |
| `DeviceAPI` | `getMeasurements` | Returns no live measurement |

Replace these adapters with authenticated backend integrations when implementing production services. Keep credentials and secret API keys on the server. Connect the device adapter to the reading workflow if live device data is added.

## Calibration and session logic

- Exposure is reported in **ppm·h** only when the selected demo calibration matches the chemistry and the strip is not in the saturated scenario.
- Missing or incompatible calibration produces an unavailable exposure estimate while retaining colour measurements.
- Session-average concentration in **ppm** is calculated as calibrated cumulative exposure divided by a positive session duration in hours.
- New repeated readings are grouped using the same strip ID and session start time. Use a later session end time for each subsequent photograph.
- Final-session charts select the last reading per session and calibration profile. Repeated cumulative readings are never added together.
- Calibration profiles remain distinguishable and are not assumed interchangeable.
- Saturation, quality assessments, and uncertainty are demonstration fixtures, not validated measurements or confidence intervals.

## Local data

- **IndexedDB:** saved readings plus original and processed strip images.
- **localStorage:** demo profile, preferences, and initial-data marker.
- **sessionStorage:** active demo session.

Demo access initially adds example readings. **Profile → Reset demo** deletes saved records and resets profile preferences, leaving an empty history. Clearing browser storage also removes this local data. CSV export includes measurements and metadata, not the stored images.

## Validation

The original application passed TypeScript checking, a production build, and focused checks for calibration compatibility, unavailable/saturated estimates, session averages, final-session selection, simulated service errors, and the authentication boundary.

Interactive browser and camera QA was not completed. The exported project preserves the application code, with expanded documentation, neutral hosting identity, and Git-friendly exclusions.

Before using real measurements, integrate and independently validate the actual image-analysis service, chemistry-specific calibrations, operating conditions, uncertainty, saturation limits, authentication, and record storage.
