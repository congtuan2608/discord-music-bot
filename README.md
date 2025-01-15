# Discord Music Bot 🎵
## Overview
A simple and efficient Discord bot for playing music from YouTube in your Discord server. This bot is built using Node.js and managed with Yarn.

## Features
🎶 Play music directly from YouTube links.
🔍 Support for search queries and playlists.
⏯️ Pause, resume, skip, and stop commands for full playback control.
📜 Queue management for seamless music playback.
✅ Easy-to-use and responsive commands.

## Prerequisites
Before you begin, ensure you have met the following requirements:

✅ Node.js (v20 or higher) installed.
✅ Yarn package manager installed.
✅ A Discord account and bot token.

## Installation
### Install dependencies using Yarn:
```bash
yarn install 
```

### Set up environment variables:
Create a .env file in the root directory with the following details:
```bash
CLIENT_ID = your-discord-bot-client-id
TOKEN = your-discord-bot-token
PORT = your-port | 4000
```
### Start the bot:
```bash
yarn start 
```
## Usage
Invite the bot to your Discord server using the generated OAuth2 URL.
Use the specified prefix (default: !) followed by commands such as:

* /play <YouTube URL or search query> - Play a song.
* /pause - Pause the current playback.
* /resume - Resume the paused song.
* /skip - Skip to the next song in the queue.
* /stop - Stop playback and clear the queue.
* /queue - Display the current queue.


