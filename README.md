# Weather Explorer - PM Accelerator Technical Assessment

Built by: Murray Watt

*Product Manager Accelerator is a premier program designed to help professionals transition into and accelerate their product management careers.*

## Project Overview
This project is a full-stack weather application built for the PM Accelerator AI Engineer Intern Technical Assessment (completing both Frontend Assessment #1 and Backend Assessment #2). 

It allows users to search for real-time weather data and a 5-day forecast by location. The backend handles data persistence (CRUD operations) using PostgreSQL, validating date ranges and locations. It also integrates with the YouTube API to provide contextual video content for the searched location and allows users to export weather records.

### Tech Stack
* **Frontend:** React.js, standard CSS (Responsive Design)
* **Backend:** Node.js, Express.js
* **Database:** SQLite (Zero-configuration, auto-generated local database)
* **External APIs:** OpenWeatherMap API, YouTube Data API v3

---

## Features Implemented
* **Current Weather & 5-Day Forecast:** Fetches and displays real-time weather and a 5-day forecast based on user input.
* **Error Handling:** Gracefully alerts the user if a city is not found or an API request fails.
* **Responsive UI:** Adapts seamlessly to desktop and mobile views.
* **CRUD Operations:**
  * **Create:** Automatically saves valid search queries, locations, and temperatures to the database.
  * **Read:** Retrieves all historical weather searches.
  * **Update:** Allows updating of specific weather records.
  * **Delete:** Allows removal of weather records.
* **External API Integration:** Pulls a relevant YouTube video tour of the searched city.
* **Data Export:** Provides an endpoint to export database records to a JSON file format.

---

## Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) installed
* API Keys for OpenWeatherMap and YouTube Data v3

### 1. Backend Setup
*Note: SQLite is used for this project, meaning no external database installation is required. The database file (`weather.db`) will generate automatically upon starting the server.*
1. Navigate to the backend directory:
   cd backend
Install the required dependencies:

npm install express cors pg
Open server.js and update the PostgreSQL connection pool with your local database credentials.

Update the YouTube API fetch URL in server.js with your actual API key.

Start the backend server:

node server.js
The backend will run on http://localhost:5000.

### 2. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

cd frontend
Install the required dependencies:

npm install
Open src/App.jsx and replace YOUR_OWM_API_KEY with your actual OpenWeatherMap API key.

Start the React development server:

npm start
The frontend will run on http://localhost:3000.

How to Use the App
Open http://localhost:3000 in your browser.

Enter a city name, zip code, or landmark in the search bar.

Click Get Weather & Info.

The app will display the current temperature, a weather icon, a 5-day forecast grid, and a YouTube video related to that location.

Behind the scenes, the search data is automatically logged to your local PostgreSQL database via the Express backend.

To test the export functionality, navigate to http://localhost:5000/api/export in your browser to download a JSON file of your database records.
