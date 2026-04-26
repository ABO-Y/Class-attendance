# NUST Class Attendance System

A simple browser-based attendance tracking prototype for students, lecturers, and administrators.

## Overview

This project is a static web application built with HTML, CSS, and JavaScript. It demonstrates a basic attendance workflow with role-based dashboards:

- **Student portal**: view module attendance, recent session history, and risk alerts.
- **Lecturer portal**: mark attendance for assigned modules and view session summaries.
- **Admin portal**: view high-level module and system statistics.

Data is stored in the browser using `sessionStorage` for login state and `localStorage` for attendance history.

## Features

- Role-based login and redirects
- Student attendance summaries and module progress
- Lecturer attendance submission and history logging
- Admin statistics overview and export placeholder
- Responsive layout and reusable components
- Simple client-side authentication using demo credentials

## Quick Start

1. Open `index.html` in your browser.
2. Log in with one of the demo accounts below.
3. Use the appropriate dashboard for the selected role.

## Demo Credentials

### Students

- `222028866` / `gowaseb123`
- `223045756` / `ebuke456`
- `223052574` / `kahiiko789`
- `221019855` / `naomi321`

### Lecturers

- `L001` / `ebuke123`
- `L002` / `smith456`
- `L003` / `kamenye789`
- `L004` / `fiavana321`

### Admin

- `ADMIN` / `admin123`

## Project Structure

- `index.html` — login page
- `student.html` — student dashboard
- `lecturer.html` — lecturer attendance page
- `admin.html` — admin dashboard
- `styles.css` — shared app styling
- `auth.js` — authentication, role checks, and attendance data logic

