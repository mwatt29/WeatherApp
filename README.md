# Weather Explorer - PM Accelerator Technical Assessment

Built by: Murray Watt

*Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their product management careers.*

## Project Overview
This project is a full-stack weather application built for the PM Accelerator AI Engineer Intern Technical Assessment (completing both Frontend Assessment #1 and Backend Assessment #2). 

It allows users to search for real-time weather data and a 5-day forecast by location. The backend handles data persistence (CRUD operations) using SQLite, validating date ranges and locations. It integrates with the YouTube API to provide contextual video content for the searched location and allows users to export weather records.

### Tech Stack
* **Frontend:** React.js, Framer Motion (Decrypted text animations), CSS (Premium Glassmorphism UI)
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Zero-configuration, auto-generated local database)
* **External APIs:** OpenStreetMap (Nominatim Geocoding), Open-Meteo API (Keyless live weather data), YouTube Data API v3

---

## Features Implemented
* **Robust Geocoding:** Utilizes OpenStreetMap to distinguish between complex inputs (e.g., "Victoria, British Columbia" vs. "Victoria, Australia").
* **Premium UI/UX:** Features a fully responsive glassmorphism aesthetic with cascading forecast cards and Matrix-style text decryption animations.
* **Current Weather & 5-Day Forecast:** Fetches and displays real-time temperatures, highs/lows, and weather icons based on user input.
* **Error Handling:** Gracefully alerts the user if a city is not found or an API request fails without crashing the UI.
* **CRUD Operations:**
  * **Create:** Automatically saves valid search queries, localized names, and temperatures to the database.
  * **Read:** Retrieves all historical weather searches.
  * **Update:** Allows updating of specific weather records.
  * **Delete:** Allows removal of weather records.
* **External API Integration:** Pulls a relevant YouTube video tour of the searched city.
* **Data Export:** Provides an endpoint to export database records to a JSON file format.

---

## Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* API Key for YouTube Data v3

### 1. Backend Setup
*Note: SQLite is used for this project, meaning no external database installation is required. The database file (`weather.db`) will generate automatically upon starting the server.*

1. Navigate to the backend directory:
   cd backend
Install the required dependencies:

npm install 
Open server.js and replace YOUR_YOUTUBE_API_KEY with your actual API key.

Start the backend server:

node server.js
The backend will run on http://localhost:5000.

2. Frontend Setup
Note: Open-Meteo and OpenStreetMap are used for weather and geocoding, which do not require API keys to run locally.

Open a new terminal window and navigate to the frontend directory:

cd frontend
Install the required dependencies (including Framer Motion for UI animations):

npm install
Start the React development server:

npm start
The frontend will run on http://localhost:3000
