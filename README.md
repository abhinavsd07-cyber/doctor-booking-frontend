🩺 Prescripto - Full Stack Doctor Appointment System
A comprehensive MERN Stack (MongoDB, Express, React, Node.js) application designed to streamline the process of booking medical appointments. The platform features three distinct user roles: Patient, Doctor, and Admin.

🚀 Key Features
For Patients
Browse Doctors: Filter by specialty and view detailed profiles.

Dynamic Booking: Real-time slot selection with automatic "already booked" checks.

Secure Payments: Integrated Stripe for online payment processing.

Appointment History: Track completed, upcoming, and cancelled appointments.

Email Alerts: Instant notifications via Nodemailer for bookings and status changes.

For Doctors
Earnings Dashboard: Track total earnings, total patients, and upcoming appointments.

Slot Management: Mark appointments as "Completed" or "Cancelled".

Dynamic Profile: Update fees, experience, and availability.

For Admins
Doctor Management: Add, update, and remove medical staff.

Centralized Stats: View global statistics across the entire platform.

Total Oversight: Monitor and manage every appointment booked on the system.

🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, React Toastify (Notifications)

Backend: Node.js, Express.js, JWT (Authentication)

Database: MongoDB

Cloud Storage: Cloudinary (Doctor/User Images)

Payment Gateway: Stripe

Email Service: Nodemailer (Gmail SMTP)


⚙️ Installation & Setup
Clone the repo:

Bash
git clone https://github.com/your-username/doctor-booking-system.git
Backend Setup:

Create a .env file in the backend folder.

Add MONGO_URI, JWT_SECRET, CLOUDINARY_NAME, CLOUDINARY_KEY, STRIPE_SECRET_KEY, and Email credentials.

Run npm install then npm run server.

Frontend Setup:

Run npm install then npm run dev.