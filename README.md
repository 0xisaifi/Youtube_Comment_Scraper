# YouTube Scraper + Gemini AI

This project is a Node.js + Express server that:

- Scrapes YouTube comments from one or multiple videos.
- Provides an AI-powered chat endpoint using Google Gemini.

## Features

- **YouTube Comments API** → Fetch top-level comments from any video.
- **Gemini AI API** → Ask questions or build multi-turn chat conversations.
- **Express REST API** → Easy endpoints to integrate with frontend apps.

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/0xisaifi/Youtube_Comment_Scraper.git
cd <your-repo>

2. Install dependencies
npm install

3. Set up environment variables

Copy .env.example to .env:
cp .env.example .env


Open .env and add your actual API keys:

YT_API_KEY=your-youtube-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here

IF you encounter with any problems configure your .env file correctly. 

4. Run the server
npm start


By default, the server runs at:

server.js file: http://localhost:3000
index.html file: Live server http://localhost:5500

API Endpoints
POST /scrape-comments

Fetch comments from YouTube videos.
Look in the console for the results and in UI.

Request body:

{
  "videoIds": ["VIDEO_ID_1", "VIDEO_ID_2"],
  "commentCount": 10
}


Response:

{
  "success": true,
  "results": [
    {
      "videoId": "VIDEO_ID_1",
      "comments": ["comment 1", "comment 2"]
    }
  ]
}

Contributing

Contributions are welcome!

Fork the repo

Create a new branch (git checkout -b feature/awesome-feature)

Commit your changes (git commit -m "Add awesome feature")

Push to your branch (git push origin feature/awesome-feature)

Open a Pull Request

Feel free to open issues for bugs, suggestions, or questions.

License

This project is open-source. You are free to use, modify, and distribute it as long as proper credit is given.
```


