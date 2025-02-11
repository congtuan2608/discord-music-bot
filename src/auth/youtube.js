import { google } from "googleapis";
import ytStream from "yt-stream";
import dotenv from "dotenv";
dotenv.config();

const YoutubeGoogle = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// ytStream.setApiKey(process.env.YOUTUBE_API_KEY);

export { ytStream, YoutubeGoogle }
