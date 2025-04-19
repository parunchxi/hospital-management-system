# 🏥 Hospital Management System

A full-stack hospital management platform designed to improve healthcare operations through centralized patient records, staff scheduling, room assignments, pharmacy tracking, and appointment management.

This project is developed as the **Final Project for CPE241 - Database Systems**,
Department of Computer Engineering, King Mongkut's University of Technology Thonburi (KMUTT).

## ✨ Features

- 📅 Appointment system
- 💊 Pharmacy stock and prescriptions
- 👨‍⚕️ Patient record management and visit history
- 🛏 Room and bed assignment tracking
- 👩‍⚕️ Staff roles and scheduling
- 🔐 Secure email-based authentication

## 👥 Team Members

| Student ID  | Name                    | Role                                  |
| ----------- | ----------------------- | ------------------------------------- |
| 66070503434 | Parunchai Kaewkhampa    | Project Manager, Full-Stack Developer |
| 66070503446 | Pakkawat Kaolim         | Backend Developer, Database Designer  |
| 66070503451 | Veerathach Rattanarojt  | Backend Developer, Tester             |
| 66070503460 | Hein Min Thu            | Backend Developer, Database Designer  |
| 66070503462 | Kamil Pattanasakulloy   | Frontend Developer, UX/UI Designer    |
| 66070503470 | Thanatat Aunjatturaporn | Frontend Developer, Tester            |

## 🚀 Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend**: Next.js API Routes
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with Supabase Auth
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Deployment**: [Vercel](https://vercel.com/) + Supabase Hosting

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/parunchxi/hospital-management-system.git
cd hospital-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the development server

```bash
npm run dev
```

## 🌐 Deployment

This project is deployed using:

- **Frontend + Backend**: [Vercel](https://ve rcel.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)

## 📌 License

This project is developed for educational purposes and does not currently include a commercial license. For academic and demonstration use only.
