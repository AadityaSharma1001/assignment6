
# Assignment 3: Next.js Summarizer Dashboard

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
	 git clone <your-repo-url>
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
