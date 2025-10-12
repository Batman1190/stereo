// YouTube API Key Rotation System
class YouTubeAPIKeyRotator {
    constructor() {
        this.apiKeys = [];
        this.currentKeyIndex = 0;
        this.keyUsage = new Map(); // Track API calls per key
        this.quotaLimit = 10000; // Default daily quota limit per key
        this.loadFromStorage();
    }

    // Load API keys from localStorage
    loadFromStorage() {
        const stored = localStorage.getItem('youtube_api_keys');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.apiKeys = data.keys || [];
                this.currentKeyIndex = data.currentIndex || 0;
                // Load usage data
                if (data.usage) {
                    this.keyUsage = new Map(Object.entries(data.usage));
                }
                // Check if we need to reset daily usage
                const lastReset = data.lastReset;
                const today = new Date().toDateString();
                if (lastReset !== today) {
                    this.resetUsage();
                }
            } catch (e) {
                console.error('Error loading API keys:', e);
            }
        }
    }

    // Save API keys to localStorage
    saveToStorage() {
        const data = {
            keys: this.apiKeys,
            currentIndex: this.currentKeyIndex,
            usage: Object.fromEntries(this.keyUsage),
            lastReset: new Date().toDateString()
        };
        localStorage.setItem('youtube_api_keys', JSON.stringify(data));
    }

    // Add a new API key to the rotation
    addAPIKey(key) {
        if (typeof key !== 'string' || !key.trim()) {
            throw new Error('Invalid API key');
        }
        if (this.apiKeys.includes(key)) {
            throw new Error('API key already exists');
        }
        this.apiKeys.push(key);
        this.keyUsage.set(key, 0);
        this.saveToStorage();
    }

    // Get the current active API key
    getCurrentKey() {
        if (this.apiKeys.length === 0) {
            throw new Error('No API keys available');
        }
        return this.apiKeys[this.currentKeyIndex];
    }

    // Rotate to the next available API key
    rotateKey() {
        if (this.apiKeys.length === 0) {
            throw new Error('No API keys available');
        }
        this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
        this.saveToStorage();
        console.log(`Rotated to API key ${this.currentKeyIndex + 1}/${this.apiKeys.length}`);
        return this.getCurrentKey();
    }

    // Track API call for the current key
    trackAPICall(quotaCost = 1) {
        const currentKey = this.getCurrentKey();
        const currentUsage = this.keyUsage.get(currentKey) || 0;
        this.keyUsage.set(currentKey, currentUsage + quotaCost);
        this.saveToStorage();

        // Rotate key if current key is approaching quota limit (90% threshold)
        if (currentUsage + quotaCost >= this.quotaLimit * 0.9) {
            console.warn(`API key approaching quota limit. Rotating...`);
            return this.rotateKey();
        }
        return currentKey;
    }

    // Reset usage counts (should be called daily)
    resetUsage() {
        this.keyUsage.clear();
        this.apiKeys.forEach(key => this.keyUsage.set(key, 0));
        this.saveToStorage();
        console.log('API usage reset for new day');
    }

    // Get an API key for use, automatically handling rotation
    getKey(quotaCost = 1) {
        try {
            return this.trackAPICall(quotaCost);
        } catch (error) {
            throw new Error('No available API keys');
        }
    }

    // Remove an API key from rotation
    removeKey(key) {
        const index = this.apiKeys.indexOf(key);
        if (index > -1) {
            this.apiKeys.splice(index, 1);
            this.keyUsage.delete(key);
            if (this.currentKeyIndex >= this.apiKeys.length) {
                this.currentKeyIndex = 0;
            }
            this.saveToStorage();
        }
    }

    // Get all keys with their usage
    getAllKeysWithUsage() {
        return this.apiKeys.map((key, index) => ({
            key,
            usage: this.keyUsage.get(key) || 0,
            isActive: index === this.currentKeyIndex,
            percentage: ((this.keyUsage.get(key) || 0) / this.quotaLimit) * 100
        }));
    }

    // Get total usage across all keys
    getTotalUsage() {
        let total = 0;
        this.keyUsage.forEach(usage => total += usage);
        return total;
    }
}

// YouTube API Quota Costs
const YouTubeAPIQuotaCost = {
    SEARCH: 100,
    VIDEO_DETAILS: 1,
    CHANNEL_DETAILS: 1
};

// Create singleton instance
const apiKeyRotator = new YouTubeAPIKeyRotator();

// Pre-load API keys if none exist
if (apiKeyRotator.apiKeys.length === 0) {
    const preloadedKeys = [
        'AIzaSyBRB8bXp-UFdoNFhTqh9n2hWdthpm--gXk',
        'AIzaSyBi9XME_hKIdmFyKT2sX9Qzq-YW4uwaPGc',
        'AIzaSyAaT_fn6jzNLUjee7n7hQIJAdjvQiKHSTU',
        'AIzaSyD0ZhRR292c95yMkSx-ZPWtsGL-FkwEH2Y',
        'AIzaSyB0z2xXRZX5dh8tMw3PZh9oqfSGgwiWx-U',
        'AIzaSyByQDjEkBdrbJqi3O35UUyOEgGrEqImoXU',
        'AIzaSyA4iPnRBOkNcVnG6i2Osdplr-6KOOidJso',
        'AIzaSyBp1KT6xYFkP5pkq5vldiS5M-275Jyhk1o',
        'AIzaSyBSUK5rvC9NUIfGg7Ol-c5fByZDLxkV4MA',
        'AIzaSyBBN1oCDauSMk_QdRMKfriv3KsP--jGgIE',
        'AIzaSyBzD1zDrYqVl-RH3vTwfmXDkGqjdH3Zlr0',
        'AIzaSyDzoPLaJUFjAB0kSSPRGQfUwiMlywWIO4I',
        'AIzaSyCSMlS_3EpigNZYoyxU7L6mnLPfpFbJ6vA',
        'AIzaSyAvw2xoR4eaQOzsyEBjthCQSFo5x60jNV8',
        'AIzaSyDOd-fwjmHblCWYZWFtu6V0QNGHNBMb0Tw',
        'AIzaSyDKye_UeYzygyeo7H35-bKrM3wgCXb3wPs',
        'AIzaSyBg_4VpFdldAYh4eyEOdJKibMS1HeM7wZQ',
        'AIzaSyDIhTB0yw5Qkbdp3Wpu1n0djdJQXvELGlc',
        'AIzaSyCCgPxoUbeo3yiKo-2i8FTDyMO2MEhVS5Q',
        'AIzaSyDc-OSidO2qU5QAiXi7Ad1qASH3rPGZB3w',
        'AIzaSyA1KrCE-nCrnw_6lCrm0WK3n5iE5LlOpoQ',
        'AIzaSyCHby00rzviTneGRsYoaXPDSTNZ5mByYRs',
        'AIzaSyANh88_Ut5RXlGkw8TgbpgCcHHXTPqgN74',
        'AIzaSyCjgMk3Q_D-545I-slLdpOkcsi5rhUbwLg',
        'AIzaSyBRGmaiOgS9Ma0d6X6GqDxLbfJLFolkgCs',
        'AIzaSyBwQVmWudUVfBSA-Xd0Py3dWaBdubjEKDk',
        'AIzaSyAohDXe4nuKALD07eQGXG7WiCPC9u4j-No',
        'AIzaSyDEDWKHYGpjRJHM_xvgwzqUgCUgTI4BP24'
    ];
    
    preloadedKeys.forEach(key => {
        try {
            apiKeyRotator.addAPIKey(key);
        } catch (e) {
            console.error('Error adding preloaded key:', e);
        }
    });
    
    console.log(`Pre-loaded ${apiKeyRotator.apiKeys.length} API keys`);
}

// YouTube API Configuration
const MUSIC_CATEGORY_ID = '10'; // Music category

// Player State
let player;
let currentPlaylist = [];
let currentTrackIndex = 0;
let isPlaying = false;
let isShuffle = false;
let repeatMode = 0; // 0: off, 1: all, 2: one
let recentlyPlayed = JSON.parse(localStorage.getItem('recently_played')) || [];
let likedSongs = JSON.parse(localStorage.getItem('liked_songs')) || [];

// Playlist Management System
class PlaylistManager {
    constructor() {
        this.playlists = this.loadPlaylists();
        this.currentPlaylistId = null;
        this.pendingTrack = null; // Track to add when creating new playlist
    }

    loadPlaylists() {
        const stored = localStorage.getItem('user_playlists');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Error loading playlists:', e);
                return [];
            }
        }
        return [];
    }

    savePlaylists() {
        localStorage.setItem('user_playlists', JSON.stringify(this.playlists));
        this.updatePlaylistDisplay();
    }

    createPlaylist(name, description = '') {
        const playlist = {
            id: Date.now().toString(),
            name: name.trim(),
            description: description.trim(),
            tracks: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.playlists.push(playlist);
        this.savePlaylists();
        return playlist;
    }

    getPlaylist(id) {
        return this.playlists.find(p => p.id === id);
    }

    updatePlaylist(id, updates) {
        const playlist = this.getPlaylist(id);
        if (playlist) {
            Object.assign(playlist, updates);
            playlist.updatedAt = new Date().toISOString();
            this.savePlaylists();
            return true;
        }
        return false;
    }

    deletePlaylist(id) {
        const index = this.playlists.findIndex(p => p.id === id);
        if (index > -1) {
            this.playlists.splice(index, 1);
            this.savePlaylists();
            return true;
        }
        return false;
    }

    addTrackToPlaylist(playlistId, track) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            // Check if track already exists
            const exists = playlist.tracks.some(t => t.id === track.id);
            if (!exists) {
                playlist.tracks.push({
                    id: track.id,
                    title: track.title,
                    artist: track.artist,
                    thumbnail: track.thumbnail,
                    addedAt: new Date().toISOString()
                });
                playlist.updatedAt = new Date().toISOString();
                this.savePlaylists();
                return true;
            }
        }
        return false;
    }

    removeTrackFromPlaylist(playlistId, trackId) {
        const playlist = this.getPlaylist(playlistId);
        if (playlist) {
            const index = playlist.tracks.findIndex(t => t.id === trackId);
            if (index > -1) {
                playlist.tracks.splice(index, 1);
                playlist.updatedAt = new Date().toISOString();
                this.savePlaylists();
                return true;
            }
        }
        return false;
    }

    updatePlaylistDisplay() {
        const container = document.getElementById('playlistContainer');
        if (this.playlists.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 12px; font-size: 12px;">No playlists yet. Create one!</p>';
            return;
        }

        container.innerHTML = '';
        this.playlists.forEach(playlist => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            if (this.currentPlaylistId === playlist.id) {
                item.classList.add('active');
            }
            
            item.innerHTML = `
                <div class="playlist-item-info">
                    <div class="playlist-item-name">${playlist.name}</div>
                    <div class="playlist-item-count">${playlist.tracks.length} song${playlist.tracks.length !== 1 ? 's' : ''}</div>
                </div>
                <div class="playlist-item-actions">
                    <button class="btn-icon" onclick="playlistManager.editPlaylist('${playlist.id}')" title="Edit">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon" onclick="playlistManager.confirmDeletePlaylist('${playlist.id}')" title="Delete">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.playlist-item-actions')) {
                    this.loadPlaylistView(playlist.id);
                }
            });

            container.appendChild(item);
        });
    }

    loadPlaylistView(playlistId) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist) return;

        this.currentPlaylistId = playlistId;
        this.updatePlaylistDisplay();

        // Switch to library view and show playlist
        switchView('library');
        const container = document.getElementById('libraryContent');
        
        if (playlist.tracks.length === 0) {
            container.innerHTML = `
                <div style="padding: 20px;">
                    <h2 style="margin-bottom: 8px;">${playlist.name}</h2>
                    <p style="color: var(--text-secondary); margin-bottom: 20px;">${playlist.description || 'No description'}</p>
                    <p style="color: var(--text-secondary);">This playlist is empty. Add some songs!</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div style="padding-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
                        <div style="flex: 1; min-width: 200px;">
                            <h2 style="margin-bottom: 8px;">${playlist.name}</h2>
                            <p style="color: var(--text-secondary); margin-bottom: 8px;">${playlist.description || 'No description'}</p>
                            <p style="color: var(--text-secondary); font-size: 14px;">${playlist.tracks.length} song${playlist.tracks.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div style="display: flex; gap: 12px; align-items: center;">
                            <button class="btn-primary" id="playAllBtn" style="display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <polygon points="5 3 19 12 5 21 5 3"/>
                                </svg>
                                Play All
                            </button>
                            <button class="btn-secondary" id="shufflePlaylistBtn" style="display: flex; align-items: center; gap: 8px;">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="16 3 21 3 21 8"/>
                                    <line x1="4" y1="20" x2="21" y2="3"/>
                                    <polyline points="21 16 21 21 16 21"/>
                                    <line x1="15" y1="15" x2="21" y2="21"/>
                                    <line x1="4" y1="4" x2="9" y2="9"/>
                                </svg>
                                Shuffle
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            const gridContainer = document.createElement('div');
            gridContainer.className = 'music-grid';
            displayMusicCards(playlist.tracks, gridContainer, playlistId);
            container.appendChild(gridContainer);

            // Add event listeners for play buttons
            document.getElementById('playAllBtn').addEventListener('click', () => {
                this.playPlaylist(playlistId, false);
            });

            document.getElementById('shufflePlaylistBtn').addEventListener('click', () => {
                this.playPlaylist(playlistId, true);
            });
        }
    }

    playPlaylist(playlistId, shuffle = false) {
        const playlist = this.getPlaylist(playlistId);
        if (!playlist || playlist.tracks.length === 0) return;

        currentPlaylist = [...playlist.tracks];
        
        if (shuffle) {
            // Shuffle the playlist
            currentPlaylist = this.shuffleArray(currentPlaylist);
            isShuffle = true;
            document.getElementById('shuffleButton').classList.add('active');
        } else {
            isShuffle = false;
            document.getElementById('shuffleButton').classList.remove('active');
        }

        currentTrackIndex = 0;
        playTrack(currentPlaylist[0]);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    editPlaylist(id) {
        const playlist = this.getPlaylist(id);
        if (!playlist) return;

        document.getElementById('playlistModalTitle').textContent = 'Edit Playlist';
        document.getElementById('playlistNameInput').value = playlist.name;
        document.getElementById('playlistDescInput').value = playlist.description;
        document.getElementById('playlistModal').classList.add('active');
        document.getElementById('playlistModal').dataset.editId = id;
    }

    confirmDeletePlaylist(id) {
        const playlist = this.getPlaylist(id);
        if (playlist && confirm(`Delete playlist "${playlist.name}"?`)) {
            this.deletePlaylist(id);
            if (this.currentPlaylistId === id) {
                this.currentPlaylistId = null;
                updateLibrary();
            }
        }
    }

    showAddToPlaylistModal(track) {
        this.pendingTrack = track;
        const modal = document.getElementById('addToPlaylistModal');
        const list = document.getElementById('playlistSelectionList');

        if (this.playlists.length === 0) {
            list.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No playlists yet. Create one below!</p>';
        } else {
            list.innerHTML = '';
            this.playlists.forEach(playlist => {
                const item = document.createElement('div');
                item.className = 'playlist-selection-item';
                
                const trackExists = playlist.tracks.some(t => t.id === track.id);
                
                item.innerHTML = `
                    <div class="playlist-selection-item-info">
                        <div class="playlist-selection-item-name">${playlist.name}</div>
                        <div class="playlist-selection-item-count">${playlist.tracks.length} songs</div>
                    </div>
                    ${trackExists ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
                `;

                if (!trackExists) {
                    item.addEventListener('click', () => {
                        if (this.addTrackToPlaylist(playlist.id, track)) {
                            modal.classList.remove('active');
                            alert(`Added to "${playlist.name}"`);
                        }
                    });
                } else {
                    item.style.opacity = '0.5';
                    item.style.cursor = 'default';
                }

                list.appendChild(item);
            });
        }

        modal.classList.add('active');
    }
}

// Create global playlist manager instance
const playlistManager = new PlaylistManager();
window.playlistManager = playlistManager;

// Local File Management with IndexedDB
class LocalFileManager {
    constructor() {
        this.db = null;
        this.audioElement = null;
        this.currentLocalTrack = null;
        this.initDB();
        this.initAudioElement();
    }

    initDB() {
        const request = indexedDB.open('MusikaLocalFiles', 1);

        request.onerror = () => {
            console.error('IndexedDB failed to open');
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            console.log('IndexedDB opened successfully');
            this.loadLocalFiles();
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            
            if (!db.objectStoreNames.contains('audioFiles')) {
                const objectStore = db.createObjectStore('audioFiles', { keyPath: 'id' });
                objectStore.createIndex('title', 'title', { unique: false });
                objectStore.createIndex('artist', 'artist', { unique: false });
                objectStore.createIndex('addedAt', 'addedAt', { unique: false });
            }
        };
    }

    initAudioElement() {
        this.audioElement = new Audio();
        this.audioElement.addEventListener('ended', () => {
            playNext();
        });
        this.audioElement.addEventListener('timeupdate', () => {
            if (this.currentLocalTrack) {
                this.updateLocalProgress();
            }
        });
        this.audioElement.addEventListener('loadedmetadata', () => {
            if (this.currentLocalTrack) {
                updateVolumeDisplay();
            }
        });
    }

    async addFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const audioData = e.target.result;
                
                // Extract metadata
                const fileData = {
                    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
                    title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
                    artist: 'Unknown Artist',
                    fileName: file.name,
                    fileType: file.type,
                    fileSize: file.size,
                    audioData: audioData,
                    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23282828" width="200" height="200"/%3E%3Cpath fill="%231db954" d="M100 50c-27.6 0-50 22.4-50 50s22.4 50 50 50 50-22.4 50-50-22.4-50-50-50zm0 80c-16.5 0-30-13.5-30-30s13.5-30 30-30 30 13.5 30 30-13.5 30-30 30z"/%3E%3Ccircle fill="%231db954" cx="100" cy="100" r="10"/%3E%3C/svg%3E',
                    addedAt: new Date().toISOString(),
                    duration: 0
                };

                const transaction = this.db.transaction(['audioFiles'], 'readwrite');
                const objectStore = transaction.objectStore('audioFiles');
                const request = objectStore.add(fileData);

                request.onsuccess = () => {
                    console.log('File added to IndexedDB:', fileData.title);
                    resolve(fileData);
                };

                request.onerror = () => {
                    console.error('Error adding file to IndexedDB');
                    reject(request.error);
                };
            };

            reader.onerror = () => {
                reject(reader.error);
            };

            reader.readAsDataURL(file);
        });
    }

    async getAllFiles() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                resolve([]);
                return;
            }

            const transaction = this.db.transaction(['audioFiles'], 'readonly');
            const objectStore = transaction.objectStore('audioFiles');
            const request = objectStore.getAll();

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async deleteFile(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['audioFiles'], 'readwrite');
            const objectStore = transaction.objectStore('audioFiles');
            const request = objectStore.delete(id);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    }

    async loadLocalFiles() {
        const files = await this.getAllFiles();
        this.displayLocalFiles(files);
    }

    displayLocalFiles(files) {
        const container = document.getElementById('localMusicContent');
        
        if (files.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">No local files yet. Upload some music to play offline!</p>';
            return;
        }

        container.innerHTML = '';
        files.forEach((file, index) => {
            const card = document.createElement('div');
            card.className = 'music-card';
            card.innerHTML = `
                <div class="music-card-menu">
                    <button class="music-card-menu-btn remove-btn" title="Delete file" aria-label="Delete ${sanitizeHTML(file.title)}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
                <div class="music-card-image">
                    <img src="${file.thumbnail}" alt="${sanitizeHTML(file.title)}" loading="lazy">
                    <div class="play-overlay">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3"/>
                        </svg>
                    </div>
                </div>
                <div class="music-card-title">${sanitizeHTML(file.title)}</div>
                <div class="music-card-artist">${sanitizeHTML(file.artist)}</div>
                <div class="music-card-artist" style="font-size: 11px;">📁 ${(file.fileSize / 1024 / 1024).toFixed(2)} MB</div>
            `;

            // Delete button
            const deleteBtn = card.querySelector('.music-card-menu-btn');
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (confirm(`Delete "${file.title}"?`)) {
                    await this.deleteFile(file.id);
                    await this.loadLocalFiles();
                }
            });

            // Play file
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.music-card-menu')) {
                    currentPlaylist = files;
                    currentTrackIndex = index;
                    this.playLocalFile(file);
                }
            });

            container.appendChild(card);
        });
    }

    playLocalFile(file) {
        // Stop YouTube player if playing
        if (player && player.pauseVideo) {
            player.pauseVideo();
        }

        this.currentLocalTrack = file;
        this.audioElement.src = file.audioData;
        
        // Handle autoplay restrictions (especially on iOS)
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                updatePlayButton();
            }).catch(error => {
                console.warn('Autoplay prevented:', error);
                if (typeof showNotification === 'function') {
                    showNotification('Click play to start audio', 'info', 2000);
                }
                isPlaying = false;
                updatePlayButton();
            });
        }
        
        updateTrackInfo(file);
        addToRecentlyPlayed(file);
    }

    updateLocalProgress() {
        const currentTime = this.audioElement.currentTime;
        const duration = this.audioElement.duration;

        if (duration > 0) {
            const progress = (currentTime / duration) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            document.getElementById('progressSlider').value = progress;
            document.getElementById('currentTime').textContent = formatTime(currentTime);
            document.getElementById('duration').textContent = formatTime(duration);
        }
    }

    togglePlay() {
        if (this.audioElement.paused) {
            this.audioElement.play();
            isPlaying = true;
        } else {
            this.audioElement.pause();
            isPlaying = false;
        }
        updatePlayButton();
    }

    setVolume(volume) {
        this.audioElement.volume = volume / 100;
    }

    seek(percentage) {
        const duration = this.audioElement.duration;
        if (duration > 0) {
            this.audioElement.currentTime = (percentage / 100) * duration;
        }
    }
}

// Create global local file manager instance
const localFileManager = new LocalFileManager();
window.localFileManager = localFileManager;

// Initialize YouTube Player API
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        playerVars: {
            'playsinline': 1,
            'controls': 0,
            'modestbranding': 1
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    console.log('YouTube Player Ready');
    updateVolumeDisplay();
}

function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
        playNext();
    } else if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        updatePlayButton();
        startProgressUpdate();
        startCassetteAnimation();
    } else if (event.data === YT.PlayerState.PAUSED) {
        isPlaying = false;
        updatePlayButton();
        stopCassetteAnimation();
    }
}

// API Key Management
document.getElementById('saveApiKey').addEventListener('click', () => {
    const apiKeyInput = document.getElementById('apiKeyInput').value.trim();
    if (apiKeyInput) {
        // Support comma-separated keys
        const keys = apiKeyInput.split(',').map(k => k.trim()).filter(k => k);
        let addedCount = 0;
        let errorCount = 0;
        
        keys.forEach(key => {
            try {
                apiKeyRotator.addAPIKey(key);
                addedCount++;
            } catch (e) {
                errorCount++;
                console.error('Error adding key:', e.message);
            }
        });
        
        if (addedCount > 0) {
            alert(`Successfully added ${addedCount} API key(s)!${errorCount > 0 ? ` (${errorCount} duplicate(s) skipped)` : ''}`);
            document.getElementById('apiKeyInput').value = '';
            loadTrendingMusic();
            updateAPIKeyDisplay();
        } else {
            alert('No new API keys were added. They may already exist.');
        }
    } else {
        alert('Please enter at least one valid API key');
    }
});

// Manage API Keys Button
document.getElementById('manageApiKeys').addEventListener('click', () => {
    document.getElementById('apiModal').classList.add('active');
    updateAPIKeyManagementModal();
});

document.getElementById('closeApiModal').addEventListener('click', () => {
    document.getElementById('apiModal').classList.remove('active');
});

document.getElementById('apiModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('apiModal').classList.remove('active');
    }
});

// Update API Key Display
function updateAPIKeyDisplay() {
    const keys = apiKeyRotator.getAllKeysWithUsage();
    const input = document.getElementById('apiKeyInput');
    if (keys.length > 0) {
        input.placeholder = `${keys.length} API key(s) configured - Add more (comma-separated)`;
    } else {
        input.placeholder = 'Enter YouTube API Key(s) - separate with commas';
    }
}

// Update API Key Management Modal
function updateAPIKeyManagementModal() {
    const keysList = document.getElementById('apiKeysList');
    const keys = apiKeyRotator.getAllKeysWithUsage();
    
    if (keys.length === 0) {
        keysList.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No API keys configured. Add keys using the input above.</p>';
    } else {
        keysList.innerHTML = keys.map((keyData, index) => {
            const maskedKey = keyData.key.substring(0, 8) + '...' + keyData.key.substring(keyData.key.length - 4);
            const usageClass = keyData.percentage > 90 ? 'danger' : keyData.percentage > 70 ? 'warning' : '';
            
            return `
                <div class="api-key-item">
                    <div class="api-key-info">
                        <div class="api-key-value">
                            ${keyData.isActive ? '🟢 ' : ''}Key ${index + 1}: ${maskedKey}
                        </div>
                        <div class="api-key-usage">
                            Usage: ${keyData.usage.toLocaleString()} / ${apiKeyRotator.quotaLimit.toLocaleString()} (${keyData.percentage.toFixed(1)}%)
                        </div>
                        <div class="api-key-usage-bar">
                            <div class="api-key-usage-fill ${usageClass}" style="width: ${Math.min(keyData.percentage, 100)}%"></div>
                        </div>
                    </div>
                    <div class="api-key-actions">
                        <button class="btn-icon-small delete" onclick="removeAPIKey('${keyData.key}')" title="Remove key">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Update stats
    const stats = document.getElementById('apiStats');
    const totalUsage = apiKeyRotator.getTotalUsage();
    const totalQuota = apiKeyRotator.apiKeys.length * apiKeyRotator.quotaLimit;
    
    stats.innerHTML = `
        <div class="stat-item">
            <span class="stat-label">Total API Keys:</span>
            <span class="stat-value">${apiKeyRotator.apiKeys.length}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Active Key:</span>
            <span class="stat-value">Key ${apiKeyRotator.currentKeyIndex + 1}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Usage Today:</span>
            <span class="stat-value">${totalUsage.toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Total Quota Available:</span>
            <span class="stat-value">${totalQuota.toLocaleString()}</span>
        </div>
        <div class="stat-item">
            <span class="stat-label">Remaining Quota:</span>
            <span class="stat-value">${(totalQuota - totalUsage).toLocaleString()}</span>
        </div>
    `;
}

// Remove API Key
function removeAPIKey(key) {
    if (confirm('Are you sure you want to remove this API key?')) {
        apiKeyRotator.removeKey(key);
        updateAPIKeyManagementModal();
        updateAPIKeyDisplay();
    }
}

// Make removeAPIKey global
window.removeAPIKey = removeAPIKey;

// Load API keys on startup
updateAPIKeyDisplay();

// Fetch Music from YouTube
async function fetchMusicVideos(query = '', maxResults = 20) {
    try {
        // Get API key with quota tracking
        const quotaCost = query ? YouTubeAPIQuotaCost.SEARCH : YouTubeAPIQuotaCost.VIDEO_DETAILS;
        const apiKey = apiKeyRotator.getKey(quotaCost);
        
        let url;
        if (query) {
            // Search with query
            url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&videoCategoryId=${MUSIC_CATEGORY_ID}&maxResults=${maxResults}&key=${apiKey}`;
        } else {
            // Get trending music videos
            url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&chart=mostPopular&videoCategoryId=${MUSIC_CATEGORY_ID}&maxResults=${maxResults}&regionCode=US&key=${apiKey}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('YouTube API Error:', data.error);
            
            // If quota exceeded, try rotating to next key
            if (data.error.code === 403 && data.error.message.includes('quota')) {
                console.warn('Quota exceeded, rotating to next key...');
                apiKeyRotator.rotateKey();
                // Retry with new key
                return fetchMusicVideos(query, maxResults);
            }
            
            alert('Error fetching music: ' + data.error.message);
            return [];
        }

        return data.items.map(item => ({
            id: item.id.videoId || item.id,
            title: item.snippet.title,
            artist: item.snippet.channelTitle,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
            description: item.snippet.description
        }));
    } catch (error) {
        if (error.message === 'No available API keys') {
            alert('Please add at least one YouTube API key to start using the app.');
        } else {
            console.error('Error fetching music:', error);
            alert('Error fetching music. Please check your API keys and internet connection.');
        }
        return [];
    }
}

// Load Trending Music
async function loadTrendingMusic() {
    const container = document.getElementById('trendingMusic');
    container.innerHTML = '<div class="loading">Loading trending music</div>';

    const music = await fetchMusicVideos('', 20);
    displayMusicCards(music, container);
}

// Search Music
let searchTimeout;
document.getElementById('searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length > 2) {
        searchTimeout = setTimeout(async () => {
            const container = document.getElementById('searchResults');
            container.innerHTML = '<div class="loading">Searching</div>';

            const music = await fetchMusicVideos(query + ' music', 30);
            displayMusicCards(music, container);

            // Switch to search view
            switchView('search');
        }, 500);
    }
});

// Display Music Cards
function displayMusicCards(musicList, container, playlistId = null) {
    if (musicList.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">No music found. Try a different search or check your API key.</p>';
        return;
    }

    container.innerHTML = '';
    musicList.forEach((music, index) => {
        const card = document.createElement('div');
        card.className = 'music-card';
        
        // Different button for playlist context vs general context
        const menuButton = playlistId 
            ? `<button class="music-card-menu-btn remove-btn" title="Remove from playlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>`
            : `<button class="music-card-menu-btn add-btn" title="Add to playlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                </button>`;
        
        card.innerHTML = `
            <div class="music-card-menu">
                ${menuButton}
            </div>
            <div class="music-card-image">
                <img src="${music.thumbnail}" alt="${sanitizeHTML(music.title)}" loading="lazy">
                <div class="play-overlay">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                </div>
            </div>
            <div class="music-card-title">${sanitizeHTML(music.title)}</div>
            <div class="music-card-artist">${sanitizeHTML(music.artist)}</div>
        `;

        // Menu button functionality
        const menuBtn = card.querySelector('.music-card-menu-btn');
        if (playlistId) {
            // Remove from playlist
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Remove this song from the playlist?')) {
                    if (playlistManager.removeTrackFromPlaylist(playlistId, music.id)) {
                        playlistManager.loadPlaylistView(playlistId);
                    }
                }
            });
        } else {
            // Add to playlist
            menuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                playlistManager.showAddToPlaylistModal(music);
            });
        }

        // Play track on card click
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.music-card-menu')) {
                currentPlaylist = musicList;
                currentTrackIndex = index;
                playTrack(music);
            }
        });

        container.appendChild(card);
    });
}

// Play Track
function playTrack(track) {
    if (!player || !player.loadVideoById) {
        alert('Player not ready. Please wait a moment and try again.');
        return;
    }

    player.loadVideoById(track.id);
    updateTrackInfo(track);
    addToRecentlyPlayed(track);
    isPlaying = true;
    updatePlayButton();
}

// Update Track Info
function updateTrackInfo(track) {
    document.getElementById('trackTitle').textContent = track.title;
    document.getElementById('trackArtist').textContent = track.artist;
    document.getElementById('trackImage').src = track.thumbnail;
    document.getElementById('cassetteTitle').textContent = track.title;

    // Update like button
    const likeButton = document.getElementById('likeButton');
    const isLiked = likedSongs.some(song => song.id === track.id);
    if (isLiked) {
        likeButton.classList.add('active');
        likeButton.querySelector('svg').setAttribute('fill', 'currentColor');
    } else {
        likeButton.classList.remove('active');
        likeButton.querySelector('svg').setAttribute('fill', 'none');
    }
}

// Player Controls
document.getElementById('playButton').addEventListener('click', togglePlay);

function togglePlay() {
    // Check if playing local file
    if (localFileManager.currentLocalTrack) {
        localFileManager.togglePlay();
        return;
    }

    if (!player || !player.getPlayerState) return;

    if (isPlaying) {
        player.pauseVideo();
    } else {
        if (player.getPlayerState() === -1 && currentPlaylist.length > 0) {
            playTrack(currentPlaylist[currentTrackIndex]);
        } else {
            player.playVideo();
        }
    }
}

function updatePlayButton() {
    const playButton = document.getElementById('playButton');
    const svg = playButton.querySelector('svg');

    if (isPlaying) {
        svg.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    } else {
        svg.innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    }
}

// Previous/Next Track
document.getElementById('prevButton').addEventListener('click', playPrevious);
document.getElementById('nextButton').addEventListener('click', playNext);

function playPrevious() {
    if (currentPlaylist.length === 0) return;

    currentTrackIndex = (currentTrackIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
    playTrack(currentPlaylist[currentTrackIndex]);
}

function playNext() {
    if (currentPlaylist.length === 0) return;

    if (repeatMode === 2) {
        // Repeat one
        playTrack(currentPlaylist[currentTrackIndex]);
    } else if (isShuffle) {
        currentTrackIndex = Math.floor(Math.random() * currentPlaylist.length);
        playTrack(currentPlaylist[currentTrackIndex]);
    } else {
        currentTrackIndex = (currentTrackIndex + 1) % currentPlaylist.length;
        playTrack(currentPlaylist[currentTrackIndex]);
    }
}

// Shuffle
document.getElementById('shuffleButton').addEventListener('click', () => {
    isShuffle = !isShuffle;
    const shuffleBtn = document.getElementById('shuffleButton');
    shuffleBtn.classList.toggle('active', isShuffle);
    shuffleBtn.setAttribute('aria-pressed', isShuffle);
});

// Repeat
document.getElementById('repeatButton').addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    const button = document.getElementById('repeatButton');
    button.setAttribute('aria-pressed', repeatMode > 0);

    if (repeatMode === 0) {
        button.classList.remove('active');
        button.querySelector('svg').innerHTML = `
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        `;
    } else if (repeatMode === 1) {
        button.classList.add('active');
        button.querySelector('svg').innerHTML = `
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
        `;
    } else {
        button.classList.add('active');
        button.querySelector('svg').innerHTML = `
            <polyline points="17 1 21 5 17 9"/>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
            <polyline points="7 23 3 19 7 15"/>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            <text x="12" y="14" font-size="8" fill="currentColor" text-anchor="middle">1</text>
        `;
    }
});

// Like Button
document.getElementById('likeButton').addEventListener('click', () => {
    if (currentPlaylist.length === 0) return;

    const currentTrack = currentPlaylist[currentTrackIndex];
    const isLiked = likedSongs.some(song => song.id === currentTrack.id);

    if (isLiked) {
        likedSongs = likedSongs.filter(song => song.id !== currentTrack.id);
    } else {
        likedSongs.push(currentTrack);
    }

    localStorage.setItem('liked_songs', JSON.stringify(likedSongs));
    updateTrackInfo(currentTrack);
    updateLibrary();
});

// Progress Bar
let progressInterval;

function startProgressUpdate() {
    stopProgressUpdate();
    progressInterval = setInterval(updateProgress, 250);
}

function stopProgressUpdate() {
    if (progressInterval) {
        clearInterval(progressInterval);
    }
}

function updateProgress() {
    if (!player || !player.getCurrentTime) return;

    const currentTime = player.getCurrentTime();
    const duration = player.getDuration();

    if (duration > 0) {
        const progress = (currentTime / duration) * 100;
        document.getElementById('progressFill').style.width = progress + '%';
        document.getElementById('progressSlider').value = progress;
        document.getElementById('currentTime').textContent = formatTime(currentTime);
        document.getElementById('duration').textContent = formatTime(duration);
    }
}

document.getElementById('progressSlider').addEventListener('input', (e) => {
    const percentage = e.target.value;
    
    // Seek local file if playing
    if (localFileManager.currentLocalTrack) {
        localFileManager.seek(percentage);
        return;
    }
    
    // Seek YouTube player
    if (!player || !player.getDuration) return;
    const duration = player.getDuration();
    const seekTime = (percentage / 100) * duration;
    player.seekTo(seekTime, true);
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Volume Control
document.getElementById('volumeSlider').addEventListener('input', (e) => {
    const volume = e.target.value;
    
    // Set volume for local file if playing
    if (localFileManager.currentLocalTrack) {
        localFileManager.setVolume(volume);
    }
    
    // Set volume for YouTube player
    if (player && player.setVolume) {
        player.setVolume(volume);
    }
    
    updateVolumeIcon(volume);
});

document.getElementById('volumeButton').addEventListener('click', () => {
    if (!player) return;

    const currentVolume = player.getVolume();
    if (currentVolume > 0) {
        player.setVolume(0);
        document.getElementById('volumeSlider').value = 0;
        updateVolumeIcon(0);
    } else {
        player.setVolume(70);
        document.getElementById('volumeSlider').value = 70;
        updateVolumeIcon(70);
    }
});

function updateVolumeDisplay() {
    if (!player || !player.getVolume) return;
    const volume = player.getVolume();
    document.getElementById('volumeSlider').value = volume;
    updateVolumeIcon(volume);
}

function updateVolumeIcon(volume) {
    const button = document.getElementById('volumeButton');
    const svg = button.querySelector('svg');

    if (volume === 0) {
        svg.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <line x1="23" y1="9" x2="17" y2="15"/>
            <line x1="17" y1="9" x2="23" y2="15"/>
        `;
    } else if (volume < 50) {
        svg.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
        `;
    } else {
        svg.innerHTML = `
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
        `;
    }
}

// Cassette Player Modal
document.getElementById('cassetteButton').addEventListener('click', () => {
    document.getElementById('cassetteModal').classList.add('active');
    if (isPlaying) {
        startCassetteAnimation();
    }
});

document.getElementById('closeCassette').addEventListener('click', () => {
    document.getElementById('cassetteModal').classList.remove('active');
});

document.getElementById('cassetteModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('cassetteModal').classList.remove('active');
    }
});

function startCassetteAnimation() {
    document.getElementById('leftReel').classList.add('playing');
    document.getElementById('rightReel').classList.add('playing');
}

function stopCassetteAnimation() {
    document.getElementById('leftReel').classList.remove('playing');
    document.getElementById('rightReel').classList.remove('playing');
}

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        const view = item.dataset.view;
        switchView(view);
    });
});

function switchView(viewName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });

    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewName + 'View').classList.add('active');

    // Load content if needed
    if (viewName === 'library') {
        updateLibrary();
    }
}

// Recently Played
function addToRecentlyPlayed(track) {
    // Remove if already exists
    recentlyPlayed = recentlyPlayed.filter(t => t.id !== track.id);

    // Add to beginning
    recentlyPlayed.unshift(track);

    // Keep only last 20
    recentlyPlayed = recentlyPlayed.slice(0, 20);

    localStorage.setItem('recently_played', JSON.stringify(recentlyPlayed));
    updateRecentlyPlayed();
}

function updateRecentlyPlayed() {
    const container = document.getElementById('recentlyPlayed');
    displayMusicCards(recentlyPlayed, container);
}

// Library
function updateLibrary() {
    const container = document.getElementById('libraryContent');
    if (likedSongs.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px;">No liked songs yet. Like some songs to see them here!</p>';
    } else {
        displayMusicCards(likedSongs, container);
    }
}

// Playlist Modal Event Listeners
document.getElementById('createPlaylistBtn').addEventListener('click', () => {
    document.getElementById('playlistModalTitle').textContent = 'Create Playlist';
    document.getElementById('playlistNameInput').value = '';
    document.getElementById('playlistDescInput').value = '';
    document.getElementById('playlistModal').classList.add('active');
    delete document.getElementById('playlistModal').dataset.editId;
    document.getElementById('playlistNameInput').focus();
});

document.getElementById('closePlaylistModal').addEventListener('click', () => {
    document.getElementById('playlistModal').classList.remove('active');
});

document.getElementById('cancelPlaylistBtn').addEventListener('click', () => {
    document.getElementById('playlistModal').classList.remove('active');
});

document.getElementById('savePlaylistBtn').addEventListener('click', () => {
    const name = document.getElementById('playlistNameInput').value.trim();
    const description = document.getElementById('playlistDescInput').value.trim();
    const modal = document.getElementById('playlistModal');
    const editId = modal.dataset.editId;

    if (!name) {
        alert('Please enter a playlist name');
        return;
    }

    if (editId) {
        // Update existing playlist
        playlistManager.updatePlaylist(editId, { name, description });
        alert('Playlist updated!');
    } else {
        // Create new playlist
        const playlist = playlistManager.createPlaylist(name, description);
        
        // If there's a pending track, add it
        if (playlistManager.pendingTrack) {
            playlistManager.addTrackToPlaylist(playlist.id, playlistManager.pendingTrack);
            playlistManager.pendingTrack = null;
        }
        
        alert('Playlist created!');
    }

    modal.classList.remove('active');
    delete modal.dataset.editId;
});

document.getElementById('closeAddToPlaylistModal').addEventListener('click', () => {
    document.getElementById('addToPlaylistModal').classList.remove('active');
    playlistManager.pendingTrack = null;
});

document.getElementById('createNewPlaylistFromAdd').addEventListener('click', () => {
    document.getElementById('addToPlaylistModal').classList.remove('active');
    document.getElementById('createPlaylistBtn').click();
});

// Close modals on background click
document.getElementById('playlistModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('playlistModal').classList.remove('active');
    }
});

document.getElementById('addToPlaylistModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('addToPlaylistModal').classList.remove('active');
        playlistManager.pendingTrack = null;
    }
});

// Local File Upload Event Listeners
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const browseFilesBtn = document.getElementById('browseFilesBtn');

browseFilesBtn.addEventListener('click', () => {
    fileInput.click();
});

uploadArea.addEventListener('click', (e) => {
    if (e.target.id !== 'browseFilesBtn') {
        fileInput.click();
    }
});

fileInput.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    await handleFileUpload(files);
    fileInput.value = ''; // Reset input
});

// Drag and drop
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('audio/')
    );
    
    await handleFileUpload(files);
});

async function handleFileUpload(files) {
    if (files.length === 0) {
        alert('Please select audio files');
        return;
    }

    const uploadStatus = document.createElement('div');
    uploadStatus.style.cssText = 'position: fixed; top: 20px; right: 20px; background: var(--bg-secondary); padding: 16px 24px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); z-index: 2000;';
    uploadStatus.innerHTML = `<p style="color: var(--text-primary);">Uploading ${files.length} file(s)...</p>`;
    document.body.appendChild(uploadStatus);

    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
        try {
            await localFileManager.addFile(file);
            successCount++;
        } catch (error) {
            console.error('Error uploading file:', error);
            errorCount++;
        }
    }

    await localFileManager.loadLocalFiles();
    
    uploadStatus.innerHTML = `
        <p style="color: var(--accent-primary);">✓ ${successCount} file(s) uploaded successfully!</p>
        ${errorCount > 0 ? `<p style="color: #ff4444;">✗ ${errorCount} file(s) failed</p>` : ''}
    `;
    
    setTimeout(() => {
        uploadStatus.remove();
    }, 3000);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Initialize App
window.addEventListener('load', () => {
    if (apiKeyRotator.apiKeys.length > 0) {
        loadTrendingMusic();
    }
    updateRecentlyPlayed();
    updateLibrary();
    updateAPIKeyDisplay();
    playlistManager.updatePlaylistDisplay();
});

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Don't trigger shortcuts when typing in inputs or textareas
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Space bar to play/pause
    if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
    }

    // Arrow keys for seek
    if (e.code === 'ArrowRight' && player && player.getCurrentTime) {
        e.preventDefault();
        player.seekTo(player.getCurrentTime() + 5, true);
    }

    if (e.code === 'ArrowLeft' && player && player.getCurrentTime) {
        e.preventDefault();
        player.seekTo(player.getCurrentTime() - 5, true);
    }
    
    // Arrow Up/Down for volume
    if (e.code === 'ArrowUp') {
        e.preventDefault();
        const volumeSlider = document.getElementById('volumeSlider');
        const newVolume = Math.min(100, parseInt(volumeSlider.value) + 5);
        volumeSlider.value = newVolume;
        if (player && player.setVolume) player.setVolume(newVolume);
        if (localFileManager.currentLocalTrack) localFileManager.setVolume(newVolume);
        updateVolumeIcon(newVolume);
    }
    
    if (e.code === 'ArrowDown') {
        e.preventDefault();
        const volumeSlider = document.getElementById('volumeSlider');
        const newVolume = Math.max(0, parseInt(volumeSlider.value) - 5);
        volumeSlider.value = newVolume;
        if (player && player.setVolume) player.setVolume(newVolume);
        if (localFileManager.currentLocalTrack) localFileManager.setVolume(newVolume);
        updateVolumeIcon(newVolume);
    }
    
    // M for mute
    if (e.code === 'KeyM') {
        e.preventDefault();
        document.getElementById('volumeButton').click();
    }
    
    // N for next track
    if (e.code === 'KeyN') {
        e.preventDefault();
        playNext();
    }
    
    // P for previous track
    if (e.code === 'KeyP') {
        e.preventDefault();
        playPrevious();
    }
    
    // Escape to close modals
    if (e.code === 'Escape') {
        const modals = ['cassetteModal', 'playlistModal', 'addToPlaylistModal', 'apiModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
                if (modalId === 'addToPlaylistModal') {
                    playlistManager.pendingTrack = null;
                }
            }
        });
    }
});
