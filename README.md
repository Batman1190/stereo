# Musika ni Rod - Music Streaming Platform

A modern, Spotify-like music streaming web application that uses YouTube's API to fetch and play music videos. Features an animated cassette tape player for a nostalgic music experience.

## Features

- 🎵 **Music Streaming**: Stream music videos from YouTube with category filtering (Music category ID: 10)
- 🔑 **API Key Rotation**: Add multiple YouTube API keys for automatic rotation and quota management
- 📊 **Quota Tracking**: Real-time monitoring of API usage across all keys
- 🔍 **Search**: Search for your favorite music tracks
- 📼 **Cassette Player**: Beautiful animated cassette tape visualization when playing music
- 💚 **Like Songs**: Save your favorite tracks to your library
- 📚 **Library**: Access your liked songs anytime
- 🔄 **Shuffle & Repeat**: Control playback with shuffle and repeat modes
- ⏮️ **Playback Controls**: Play, pause, skip, and seek through tracks
- 🔊 **Volume Control**: Adjust volume or mute audio
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, dark-themed interface inspired by Spotify

## Setup Instructions

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- YouTube Data API v3 Key

### Getting Your YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **YouTube Data API v3**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. (Optional) Restrict your API key:
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "YouTube Data API v3"
   - Save changes

### Running the Application

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     ```

2. **Enter your API Key(s)**:
   - In the top-right corner, enter one or more YouTube API keys
   - **Multiple keys**: Separate them with commas (e.g., `key1, key2, key3`)
   - Click "Save Keys"
   - Keys will be stored in your browser's local storage
   - Click "Manage Keys" to view usage statistics and manage your keys

3. **Start listening**:
   - Browse trending music on the home page
   - Search for specific songs or artists
   - Click on any track to start playing
   - Click the cassette icon in the player bar to view the animated cassette tape

## How It Works

### Music Category Filtering

The application uses YouTube's category ID system to fetch only music content:
- **Category ID 10** = Music
- All API requests filter videos by this category to ensure only music videos are displayed

### API Key Rotation System

The app features an intelligent API key rotation system:
- **Automatic Rotation**: Keys automatically rotate when approaching quota limits (90% threshold)
- **Quota Tracking**: Each API call's quota cost is tracked in real-time
- **Daily Reset**: Usage counters reset automatically each day
- **Smart Retry**: If a key hits quota, the system automatically tries the next key
- **Visual Management**: View all keys, their usage, and remaining quota in the management modal

**Quota Costs:**
- Search queries: 100 units per request
- Video details: 1 unit per request
- Default daily limit: 10,000 units per key

### Cassette Tape Animation

When you play a song, you can view an animated cassette tape:
- Click the cassette icon (📼) in the bottom-right of the player bar
- The reels spin while music is playing
- The cassette displays the current track name
- Close the modal by clicking the X or clicking outside

## Features Breakdown

### Home View
- **Trending Music**: Displays popular music videos from YouTube
- **Recently Played**: Shows your listening history (stored locally)

### Search View
- Real-time search as you type
- Searches specifically for music content
- Results update automatically

### Library View
- Access all your liked songs
- Persistent storage using browser's localStorage

### Player Controls
- **Play/Pause**: Toggle playback
- **Previous/Next**: Navigate through playlist
- **Shuffle**: Random playback order
- **Repeat**: Off / Repeat All / Repeat One
- **Progress Bar**: Seek to any position in the track
- **Volume**: Adjust or mute audio
- **Like**: Save tracks to your library

### Keyboard Shortcuts
- `Space`: Play/Pause
- `→`: Skip forward 5 seconds
- `←`: Skip backward 5 seconds

## Technical Details

### Technologies Used
- **HTML5**: Structure and YouTube iframe API
- **CSS3**: Modern styling with animations and gradients
- **Vanilla JavaScript**: No frameworks, pure JS for performance
- **YouTube Data API v3**: Fetching music videos
- **YouTube IFrame Player API**: Audio playback
- **LocalStorage**: Persisting user data (API key, liked songs, history)

### API Endpoints Used

1. **Search Videos**:
   ```
   GET https://www.googleapis.com/youtube/v3/search
   Parameters: q, type=video, videoCategoryId=10
   ```

2. **Get Popular Videos**:
   ```
   GET https://www.googleapis.com/youtube/v3/videos
   Parameters: chart=mostPopular, videoCategoryId=10
   ```

### File Structure
```
Musika ni Rod/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── app.js              # Application logic and API integration
└── README.md           # This file
```

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Limitations

- YouTube API has a daily quota limit (10,000 units per day by default per key)
- Each search costs ~100 units, each video list costs ~1 unit
- Use multiple API keys to increase your total daily quota
- Audio-only playback (video is hidden)
- Requires internet connection
- API keys must be valid and have YouTube Data API v3 enabled

## Privacy

- All data is stored locally in your browser
- No data is sent to external servers except YouTube API calls
- Your API key is stored in localStorage (keep it secure)

## Troubleshooting

### "Please add at least one YouTube API key"
- Make sure you've entered at least one valid API key in the top-right input
- Click "Save Keys" after entering it
- You can add multiple keys separated by commas

### "Error fetching music"
- Check that your API keys are valid
- Ensure YouTube Data API v3 is enabled in Google Cloud Console
- Check your daily quota hasn't been exceeded (view in "Manage Keys")
- If one key is exhausted, the system will automatically rotate to the next
- Verify your internet connection

### Quota exceeded on all keys
- Click "Manage Keys" to view usage statistics
- Add more API keys to increase your total quota
- Wait until the next day for automatic quota reset

### No music playing
- Check browser console for errors
- Ensure the YouTube IFrame API has loaded
- Try refreshing the page

### Cassette not animating
- Make sure a track is currently playing
- Click the cassette icon in the player bar
- Check that CSS animations are enabled in your browser

## Future Enhancements

- [ ] Playlists creation and management
- [ ] Queue management
- [ ] Lyrics display
- [ ] Social sharing
- [ ] User accounts and cloud sync
- [ ] Equalizer visualization
- [ ] Download for offline listening (where permitted)

## License

This project is open source and available for personal and educational use.

## Credits

Created with ❤️ for music lovers everywhere.

---

**Note**: This application uses YouTube's API and is subject to YouTube's Terms of Service. Make sure to comply with all applicable terms and conditions.
