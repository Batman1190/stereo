# Musika ni Rod - Music Streaming Platform

A modern, **Progressive Web App (PWA)** music streaming platform that combines YouTube music streaming with local file playback. Features an animated cassette tape player for a nostalgic music experience, full playlist management, and offline capabilities.

## Features

- 🎵 **Music Streaming**: Stream music videos from YouTube with category filtering (Music category ID: 10)
- 📁 **Local File Upload**: Upload and play your own music files (MP3, WAV, OGG, M4A) with drag-and-drop support
- 📱 **PWA Support**: Install as a Progressive Web App with offline functionality
- 🔌 **Offline Playback**: Play locally uploaded files without internet connection
- 🎧 **Background Playback**: Continue playing music on mobile devices even when app is in background
- 📋 **Playlist Management**: Create, edit, delete, and organize custom playlists
- 🔑 **API Key Rotation**: Add multiple YouTube API keys for automatic rotation and quota management
- 📊 **Quota Tracking**: Real-time monitoring of API usage across all keys
- 🔍 **Search**: Search for your favorite music tracks
- 📼 **Cassette Player**: Beautiful animated cassette tape visualization when playing music
- 💚 **Like Songs**: Save your favorite tracks to your library
- 📚 **Library**: Access your liked songs anytime
- 🔄 **Shuffle & Repeat**: Control playback with shuffle and repeat modes
- ⏮️ **Playback Controls**: Play, pause, skip, and seek through tracks
- 🔊 **Volume Control**: Adjust volume or mute audio
- 📱 **Responsive Design**: Works on desktop and mobile devices with touch-friendly controls
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

4. **Upload local files (optional)**:
   - Click "Local Files" in the sidebar
   - Drag & drop music files or click "Browse Files"
   - Supported formats: MP3, WAV, OGG, M4A
   - Files are stored locally for offline playback

5. **Install as PWA (optional)**:
   - Look for the install prompt in your browser's address bar
   - Or use browser menu: "Install app" / "Add to Home Screen"
   - Once installed, the app works offline and can be launched like a native app
   - Especially useful on mobile devices for background playback

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

### Local File Storage

The app uses IndexedDB to store your uploaded music files:
- **Client-Side Only**: Files never leave your device
- **Persistent Storage**: Files remain available even offline
- **Metadata Extraction**: Automatically extracts title, artist from file tags
- **Format Support**: MP3, WAV, OGG, and M4A audio files
- **Storage Quota**: Subject to browser storage limits (typically 50MB-1GB+)

### Playlist System

Create and manage your own playlists:
- **Local Storage**: Playlists saved in browser's localStorage
- **Mixed Sources**: Add tracks from YouTube or local files to the same playlist
- **Full Management**: Create, edit, delete, and reorder playlists
- **Quick Actions**: Play all tracks or shuffle playlist with one click
- **Track Organization**: Add/remove tracks easily from any playlist

### Progressive Web App (PWA)

The app is installable and works offline:
- **Service Worker**: Caches app files for offline access
- **Install Prompt**: Browser prompts to install as standalone app
- **Offline First**: Core app functionality works without internet
- **Background Playback**: Continue playing on mobile when app is in background
- **App Icon**: Appears on home screen like a native app

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
- View and play custom playlists
- Persistent storage using browser's localStorage

### Local Files View
- **Upload Music**: Drag & drop or browse to upload MP3, WAV, OGG, and M4A files
- **Offline Playback**: Play your local music files without internet connection
- **Persistent Storage**: Files stored in browser's IndexedDB for offline access
- **Full Playback Controls**: Same controls as YouTube tracks

### Playlist Management
- **Create Playlists**: Organize your music into custom collections
- **Edit & Delete**: Manage playlist names, descriptions, and tracks
- **Add Tracks**: Add tracks from YouTube or local files to any playlist
- **Play All/Shuffle**: Quick playback options for entire playlists
- **Track Management**: Remove individual tracks from playlists

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
- **YouTube IFrame Player API**: Streaming audio playback
- **Web Audio API**: Local file audio playback
- **IndexedDB**: Storing local music files for offline playback
- **LocalStorage**: Persisting user data (API keys, liked songs, playlists, history)
- **Service Worker**: PWA functionality and offline app caching
- **Web App Manifest**: Installable PWA configuration

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
├── app.js              # Application logic, API integration, playlist & local file management
├── utils.js            # Utility functions and helpers
├── service-worker.js   # PWA service worker for offline functionality
├── manifest.json       # PWA manifest for installability
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
- Audio-only playback for YouTube (video is hidden)
- YouTube streaming requires internet connection (local files work offline)
- API keys must be valid and have YouTube Data API v3 enabled
- Local files are stored in browser storage (limited by browser quota, typically 50MB-1GB+)
- Background playback on iOS Safari may require user interaction

## Privacy

- All data is stored locally in your browser (localStorage and IndexedDB)
- No data is sent to external servers except YouTube API calls
- Your API keys are stored in localStorage (keep them secure)
- Local music files remain on your device and are never uploaded
- No user tracking or analytics

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

### Local files not uploading
- Ensure files are in supported formats (MP3, WAV, OGG, M4A)
- Check browser storage quota hasn't been exceeded
- Try smaller files or clear browser data
- Some browsers may block file access - check permissions

### App not installing as PWA
- Ensure you're using HTTPS or localhost
- Check that service worker is registered (visible in browser DevTools)
- Look for install prompt in browser address bar or menu

## Future Enhancements

- [ ] Queue management and reordering
- [ ] Lyrics display integration
- [ ] Social sharing features
- [ ] User accounts and cloud sync
- [ ] Audio equalizer with presets
- [ ] Import/export playlists
- [ ] Crossfade between tracks
- [ ] Sleep timer

## License

This project is open source and available for personal and educational use.

## Credits

Created with ❤️ for music lovers everywhere.

---

**Note**: This application uses YouTube's API and is subject to YouTube's Terms of Service. Make sure to comply with all applicable terms and conditions.
