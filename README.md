## Approach & Process

### 1. Planning & Requirements
- Identified the need for a summarization dashboard with user authentication, summary management, and sharing features.
- Chose Next.js for its full-stack capabilities and easy API route integration.
- Decided on MongoDB for flexible, scalable storage of user summaries.

### 2. Authentication
- Implemented Google OAuth using NextAuth.js for secure and familiar user sign-in.
- Protected dashboard and summary routes to ensure only authenticated users can access their data.

### 3. Summarization Logic
- Integrated an external AI API (using `AI_API_KEY` in `.env.local`) to generate summaries from user input.
- Created an API route (`/api/summarize`) to handle requests and responses between the frontend and the AI service.

### 4. Data Management
- Used Mongoose models to define and interact with the `Summary` schema in MongoDB.
- Built API routes for saving, fetching, and deleting summaries, ensuring all actions are user-specific.

### 5. Email Integration
- Used Nodemailer to allow users to send summaries to any email address.
- Secured email credentials via environment variables.

### 6. UI/UX
- Built a clean, responsive dashboard using React and Tailwind CSS.
- Provided clear feedback for actions (saving, deleting, sending emails).

### 7. Security & Environment
- All sensitive keys and credentials are stored in `.env.local` and never committed to version control.
- Used Next.js API routes to keep backend logic secure and separated from the frontend.

### 8. Testing & Deployment
- Tested all flows locally using the development server.
- Ensured the app works with real Google, MongoDB, and email credentials.

---

# Assignment: Next.js Summarizer Dashboard

This project is a Next.js web application that allows users to generate, save, and manage text summaries. It features Google authentication, MongoDB integration, and email functionality for sharing summaries.

## Features

- **User Authentication:** Sign in with Google using NextAuth.js.
- **Summarization:** Generate summaries using an AI API.
- **Dashboard:** View, save, and delete your summaries.
- **Email:** Send summaries via email.
- **MongoDB Integration:** All summaries are stored in MongoDB.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Nodemailer](https://nodemailer.com/)
- [Tailwind CSS](https://tailwindcss.com/) (via PostCSS)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. **Clone the repository:**
	 ```powershell
	 git clone https://github.com/AadityaSharma1001/assignment6
	 cd assignment3
	 ```

2. **Install dependencies:**
	 ```powershell
	 npm install
	 ```

3. **Configure environment variables:**
	 - Copy `.env.local` and update the following values as needed:
		 - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (Google OAuth credentials)
		 - `MONGODB_URI` (MongoDB connection string)
		 - `NEXTAUTH_SECRET` (any random string)
		 - `EMAIL_USER` and `EMAIL_PASS` (for sending emails)
		 - `AI_API_KEY` (for the summarization API)

### Running the App

#### Development

```powershell
npm run dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

#### Production

```powershell
npm run build
npm start
```

## Project Structure

```
src/
	lib/
		mongodb.js         # MongoDB connection helper
	models/
		Summary.js         # Mongoose model for summaries
	pages/
		_app.js            # Next.js custom App
		_document.js       # Next.js custom Document
		dashboard.js       # User dashboard
		index.js           # Home page
		api/
			deleteSummary.js # API route to delete summaries
			saveSummary.js   # API route to save summaries
			sendMail.js      # API route to send emails
			summaries.js     # API route to fetch summaries
			summarize.js     # API route to generate summaries
			auth/
				[...nextauth].js # NextAuth.js configuration
	styles/
		globals.css        # Global styles (Tailwind CSS)
public/                # Static assets
```

## License

This project is for educational purposes.
