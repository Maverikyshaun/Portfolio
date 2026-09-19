# Shantanu Soni — Portfolio

Employer-facing full-stack portfolio. The backend follows the same FastAPI shape as the other projects in `pythonProjects`, with two extra layers this app is meant to demonstrate: **enums** and **DTOs**.

## Stack

- FastAPI, SQLAlchemy 2.0, Pydantic v2, SQLite
- Vanilla HTML, CSS, and JavaScript (same frontend approach as the coffee shop and job board apps)
- Seeded from the CV: experience, education, skills, projects, headshot, and PDF

## Layering

```
API schema  →  DTO  →  service  →  repository  →  SQLAlchemy model
     ↑                                                    |
     +---- enums constrain both the API and the database -+
```

| Layer | Role |
|---|---|
| `app/enums` | `StrEnum` domain values (sector, proficiency, project kind, inquiry type, …) |
| `app/models` | Persistence, including child highlight tables |
| `app/dtos` | Frozen application objects plus mappers (`tenure_label`, grouped skills) |
| `app/schemas` | HTTP contract: `Field` bounds, `EmailStr`, slug pattern, extra=forbid |
| `app/repositories` | Query access only |
| `app/services` | Orchestration and domain exceptions |

Routes never return ORM rows. They validate **DTO → schema**.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Deploy on Render

This follows the same Blueprint as the other FastAPI apps: one Python web service that installs from the root `requirements.txt` and starts uvicorn with `--app-dir backend`.

1. Put this project on GitHub (`main` branch). Render deploys from git.
2. In the [Render Dashboard](https://dashboard.render.com), choose **New → Blueprint**.
3. Connect the GitHub repo. Render reads `render.yaml`.
4. Apply the Blueprint. The public URL will look like `https://shantanu-soni-portfolio.onrender.com`.

If you create a **Web Service** by hand instead of a Blueprint:

| Setting | Value |
|---|---|
| Runtime | Python |
| Build command | `pip install -r requirements.txt` |
| Start command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT --app-dir backend` |
| Health check path | `/health` |
| Python version | `3.12.8` (`runtime.txt` / `PYTHON_VERSION`) |

Free instances sleep when idle and use an ephemeral disk. The CV seed runs again on a fresh filesystem. Recruiter messages stored in SQLite are not kept across deploys or machine replacement.

## Useful endpoints

- `GET /api/portfolio` — composed snapshot for the home page
- `GET /api/experience`, `/education`, `/skills/groups`, `/projects`
- `GET /api/projects?kind=ai` — enum-filtered
- `GET /api/meta/enums` — catalog used by the project filters and contact form
- `POST /api/inquiries` — recruiter contact form
