import express from 'express';
import fetch from 'node-fetch';
import passport from "passport";
const router = express.Router();
const MUSIXMATCH_API_KEY = process.env.MUSIXMATCH_API_KEY;

// Middleware to check authentication
const checkAuth = (req, res, next) => {
    if (!req.session.spotifyAccessToken) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

router.get('/currently-playing', checkAuth, async (req, res) => {
    const spotifyUrl = 'https://api.spotify.com/v1/me/player/currently-playing';

    try {
        const spotifyResponse = await fetch(spotifyUrl, {
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (spotifyResponse.status === 204) {
            return res.status(204).send(); // No content, nothing is playing right now.
        }

        if (spotifyResponse.status >= 400) {
            return res.status(spotifyResponse.status).json({ message: 'Failed to fetch currently playing track' });
        }

        const trackData = await spotifyResponse.json();

        if (!trackData.item) {
            return res.status(200).json({ message: 'No track is currently playing' });
        }

        const trackDetails = {
            name: trackData.item.name,
            artist: trackData.item.artists.map(artist => artist.name).join(', '),
            album: trackData.item.album.name,
            imageUrl: trackData.item.album.images[0].url,
            progress_ms: trackData.progress_ms,
            duration_ms: trackData.item.duration_ms,
            is_playing: trackData.is_playing,
            isrc: trackData.item.external_ids.isrc
        };

        res.json(trackDetails);
    } catch (error) {
        console.error('Error fetching currently playing:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/pause', checkAuth, async (req, res) => {
    try {
        const spotifyResponse = await fetch(`https://api.spotify.com/v1/me/player/pause`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`,
            },
        });

        if (!spotifyResponse.ok) {
            return res.status(spotifyResponse.status).json({ message: 'Failed to pause playback' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error pausing playback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.put('/play', checkAuth, async (req, res) => {
    try {
        const spotifyResponse = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`,
                'Content-Type': 'application/json'
            },
        });

        if (!spotifyResponse.ok) {
            return res.status(spotifyResponse.status).json({ message: 'Failed to resume playback' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error resuming playback:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/next', checkAuth, async (req, res) => {
    const nextUrl = 'https://api.spotify.com/v1/me/player/next';

    try {
        const spotifyResponse = await fetch(nextUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`
            },
        });

        if (!spotifyResponse.ok) {
            return res.status(spotifyResponse.status).json({ message: 'Failed to skip to next track' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error skipping to next track:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/previous', checkAuth, async (req, res) => {
    const previousUrl = 'https://api.spotify.com/v1/me/player/previous';

    try {
        const spotifyResponse = await fetch(previousUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${req.session.spotifyAccessToken}`
            },
        });

        if (!spotifyResponse.ok) {
            return res.status(spotifyResponse.status).json({ message: 'Failed to skip to previous track' });
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Error skipping to previous track:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/lyrics', async (req, res) => {
    const { track, artist } = req.query;

    if (!track || !artist) {
        return res.status(400).json({ message: 'Track and artist query parameters are required' });
    }

    const musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1/';
    const matcherLyricsGetEndpoint = `${musixmatchBaseUrl}matcher.lyrics.get`;
    const queryParams = `q_track=${encodeURIComponent(track)}&q_artist=${encodeURIComponent(artist)}&apikey=${MUSIXMATCH_API_KEY}`;

    try {
        const musixmatchResponse = await fetch(`${matcherLyricsGetEndpoint}?${queryParams}`, {
            method: 'GET'
        });

        const data = await musixmatchResponse.json();

        if (data.message.header.status_code !== 200) {
            return res.status(404).json({ message: 'Lyrics not found' });
        }

        const lyrics = data.message.body.lyrics.lyrics_body;

        res.json({ lyrics });
    } catch (error) {
        console.error('Error fetching lyrics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/lyrics/translation', async (req, res) => {
    const { track_isrc } = req.query;

    if (!track_isrc) {
        return res.status(400).json({ message: 'Track ID query parameter is required' });
    }

    const musixmatchBaseUrl = 'https://api.musixmatch.com/ws/1.1/';
    const translationGetEndpoint = `${musixmatchBaseUrl}track.lyrics.translation.get`;
    const queryParams = `track_isrc=${encodeURIComponent(track_isrc)}&selected_language=en&apikey=${MUSIXMATCH_API_KEY}`;
    try {
        const musixmatchResponse = await fetch(`${translationGetEndpoint}?${queryParams}`, {
            method: 'GET'
        });

        const data = await musixmatchResponse.json();

        if (data.message.header.status_code !== 200) {
            return res.status(data.message.header.status_code).json({ message: 'Failed to fetch translated lyrics' });
        }

        const lyricsTranslation = data.message.body.lyrics.lyrics_translation;

        res.json({ lyricsTranslation });
    } catch (error) {
        console.error('Error fetching translated lyrics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/album-cover', async (req, res) => {
    const { track, artist } = req.query;

    if (!track || !artist) {
        return res.status(400).json({ message: 'Track and artist query parameters are required' });
    }

    try {
        const lyricsResponse = await fetch(`http://localhost:3001/api/spotify/lyrics?track=${encodeURIComponent(track)}&artist=${encodeURIComponent(artist)}`);
        const lyricsData = await lyricsResponse.json();

        if (!lyricsData.lyrics) {
            return res.status(404).json({ message: 'Lyrics not found' });
        }

        const lyrics = lyricsData.lyrics;

        const engineId = 'stable-diffusion-v1-6';
        const apiHost = process.env.API_HOST ?? 'https://api.stability.ai';
        const apiKey = process.env.STABILITY_API_KEY;

        if (!apiKey) throw new Error('Missing Stability API key.');

        const stabilityResponse = await fetch(
            `${apiHost}/v1/generation/${engineId}/text-to-image`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    text_prompts: [{ text: lyrics }],
                    cfg_scale: 7,
                    height: 1024,
                    width: 1024,
                    steps: 30,
                    samples: 1,
                }),
            }
        );

        if (!stabilityResponse.ok) {
            throw new Error(`Non-200 response: ${await stabilityResponse.text()}`);
        }

        const responseJSON = await stabilityResponse.json();
        const imageBase64 = responseJSON.artifacts[0].base64;

        res.json({
            albumCover: `data:image/png;base64,${imageBase64}`
        });

    } catch (error) {
        console.error('Error fetching generated album cover:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/auth', passport.authenticate('spotify', {
    scope: ['user-read-playback-state', 'user-read-currently-playing', 'user-modify-playback-state'],
    showDialog: true,
}));

router.get('/auth/callback',
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function (req, res) {
        if (req.user) {
            req.session.spotifyAccessToken = req.user.accessToken;
            req.session.spotifyRefreshToken = req.user.refreshToken;
        }
        res.redirect(`${process.env.FRONTEND_URL}/success`);
    }
);

export default router;
