# DocuHealth

A full-stack healthcare patient management system designed to digitize medical records in Guatemalan public hospitals. DocuHealth replaces paper-based patient files with a centralized digital platform where doctors can manage patient records, write visit notes, prescribe medications, track conditions, and schedule appointments — with facial recognition for fast patient identification.

Built during the **Meta University Engineering Internship** (Summer 2024).

## Demo

https://www.loom.com/share/e82636f1031540a0902c422036cd4ecf?sid=30f6bd22-4554-4066-9510-fbc43625936f

## Features

- **Doctor Authentication** — Secure registration and login with hashed passwords (bcrypt + Passport.js)
- **Patient Management** — Create, search, and view patient profiles with a tabbed dashboard interface
- **Facial Recognition** — Identify patients via webcam using AWS Rekognition for fast chart lookup
- **Visit Notes** — Create and edit visit summaries tied to each patient
- **Prescriptions** — Prescribe medications with dosage, instructions, and date tracking
- **Conditions** — Record and manage diagnosed medical conditions
- **Appointment Scheduling** — Calendar-based scheduling with day/week views and notification settings
- **Doctor Profile** — Manage specialties, education, biography, and profile photo

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Material UI, React Router |
| Backend | Node.js, Express (multi-server architecture) |
| Database | PostgreSQL, Prisma ORM |
| Auth | Passport.js, bcrypt, express-session |
| Facial Recognition | AWS Rekognition |
| Styling | Material UI, React Bootstrap, styled-components |

## Architecture

The backend runs as multiple Express servers, each responsible for a distinct domain:

| Server | Port | Responsibility |
|--------|------|---------------|
| Users | 3000 | Authentication, registration, doctor profiles |
| Patients | 3001 | Patient CRUD, search |
| Dashboard | 3002 | Visit notes, prescriptions, conditions |
| Rekognition | 3006 | AWS facial recognition integration |

## Database Schema

Managed with Prisma ORM and PostgreSQL. Core models:

- **User** / **user_data** — Doctor accounts with profile details, specialties, education
- **Patient** — Patient demographics linked to a doctor
- **Appointment** — Scheduled visits with notification settings
- **VisitNote** — Per-visit clinical notes
- **Prescription** — Medications with dosage and date ranges
- **Condition** — Diagnosed conditions with date tracking

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL (or Docker)

### 1. Clone the repository

```bash
git clone https://github.com/marcebd/DocuHealth.git
cd DocuHealth
```

### 2. Set up the database

**Option A — Docker (recommended):**

```bash
docker run -d \
  --name docuhealth-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=DocuHealth \
  -p 5432:5432 \
  postgres:16
```

**Option B — Local PostgreSQL:**

Create a database called `DocuHealth` on your local PostgreSQL instance.

### 3. Configure environment variables

```bash
cp Backend/.env.example Backend/.env
```

Edit `Backend/.env` with your database credentials:

```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/DocuHealth?schema=public"
```

### 4. Install dependencies

```bash
cd Backend && npm install
cd ../Frontend && npm install
```

### 5. Run database migrations

```bash
cd Backend
npx prisma migrate dev
```

### 6. Start the servers

In separate terminals (or use `&` to background them):

```bash
# Backend servers
cd Backend
node users_servers/users_servers.js &
node patients_servers/patients_servers.js &
node dashboard_server/dashboard_server.js &

# Frontend
cd Frontend
npm run dev
```

The app will be available at **http://localhost:5175**.

## Usage

1. **Register** at `/register` to create a doctor account
2. **Set up your profile** with your specialties, education, and photo
3. **Log in** at `/login`
4. **Add patients** from the dashboard using the search/create interface
5. **Manage records** — click on a patient tab to write visit notes, add prescriptions, and track conditions
6. **Schedule appointments** from the appointments view with the calendar interface

## Internship Context

This project was built as part of the **Meta University (MetaU) Engineering Internship** program at Meta.

- **Intern:** Marcela Billingslea Durini
- **Intern Manager:** Vidushi Seth
- **Intern Director:** Carl Taylor (AR Experiences)

## License

This project was created for educational purposes as part of the Meta University internship program.
