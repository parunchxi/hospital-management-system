# 🏥 Hospital Management System

A full-stack hospital management platform that centralizes patient records, staff scheduling, room assignments, pharmacy tracking, and appointments — all in one place.

> 🎓 **Final Project** — CPE241 Database Systems · Department of Computer Engineering · KMUTT

## ✨ Features

| Feature | Description |
|---|---|
| 📅 Appointments | Book and manage patient appointments |
| 👨‍⚕️ Patient Records | Full visit history and medical records |
| 💊 Pharmacy | Prescription management and stock tracking |
| 🛏 Room & Bed | Room assignments and availability tracking |
| 👩‍⚕️ Staff Management | Roles, departments, and scheduling |
| 🔐 Authentication | Secure email-based login via Supabase Auth |

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | [Next.js](https://nextjs.org/), [Tailwind CSS v4](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/) |
| **Backend** | Next.js API Routes (Server Actions) |
| **Auth** | [Supabase Auth](https://supabase.com/docs/guides/auth) |
| **Database** | [Supabase](https://supabase.com/) (PostgreSQL) |
| **Deployment** | [Vercel](https://vercel.com/) + Supabase Hosting |
| **Forms** | React Hook Form + Zod |
| **Charts** | Recharts |

## 📁 Project Structure

```
hospital-management-system/
├── app/
│   ├── admin/          # Admin dashboard & management pages
│   ├── doctor/         # Doctor portal
│   ├── nurse/          # Nurse portal
│   ├── patient/        # Patient portal
│   ├── pharmacy/       # Pharmacy management
│   ├── api/            # API route handlers
│   └── (auth-pages)/   # Login, register, reset password
├── components/         # Reusable UI components
├── hooks/              # Custom React hooks
├── lib/                # Supabase client & shared utilities
├── utils/              # Helper functions
└── .env.example        # Environment variable template
```

## ⚙️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- A [Supabase](https://supabase.com/) project

### 1. Clone the repository

```bash
git clone https://github.com/parunchxi/hospital-management-system.git
cd hospital-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

> 🔑 Get these from your Supabase project → **Settings → API**

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Lint and auto-fix code with ESLint |
| `npm run format` | Format code with Prettier |

## 👥 User Roles

| Role | Access |
|---|---|
| 🛡️ **Admin** | Full system management — staff, rooms, departments |
| 👨‍⚕️ **Doctor** | View & manage patient records, appointments |
| 👩‍⚕️ **Nurse** | Patient care, room & bed assignments |
| 💊 **Pharmacist** | Prescription fulfillment, stock management |
| 🧑‍⚕️ **Patient** | View own records, appointments, prescriptions |

## 🌐 Deployment

This project is deployed using:

- **Frontend + Backend** → [Vercel](https://vercel.com/)
- **Database + Auth** → [Supabase](https://supabase.com/)

To deploy your own instance, push to your Vercel-connected GitHub repo and add the environment variables in the Vercel dashboard.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** this repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feat/your-feature`
5. **Open** a Pull Request

> 📌 Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

## 👨‍💻 Team Members

| Student ID | Name | Role |
|---|---|---|
| 66070503434 | Parunchai Kaewkhampa | Project Manager, Full-Stack Developer |
| 66070503446 | Pakkawat Kaolim | Backend Developer, Database Designer |
| 66070503451 | Veerathach Rattanarojt | Backend Developer, Tester |
| 66070503460 | Hein Min Thu | Backend Developer, Database Designer |
| 66070503462 | Kamil Pattanasakulloy | Frontend Developer, UX/UI Designer |
| 66070503470 | Thanatat Aunjatturaporn | Frontend Developer, Tester |

## 📄 License

This project is built for **educational purposes** as part of the CPE241 Database Systems course at KMUTT. Not intended for commercial use.
