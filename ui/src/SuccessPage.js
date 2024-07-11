import React, { useEffect, useState } from 'react';
import './App.css';
import {Box, Button, CircularProgress, Container, Grid, Paper, Typography} from "@mui/material";

function SuccessPage() {
    const [track, setTrack] = useState({
        name: '',
        artist: '',
        imageUrl: '',
        progress: 0,
        duration: 0,
        startTime: Date.now(),
        isPlaying: false,
        isrc: ''
    });
    const [generatedAlbumCover, setGeneratedAlbumCover] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [translatedLyrics, setTranslatedLyrics] = useState('');
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const lyricsLines = lyrics.split('\n'); // Split the lyrics into lines

    useEffect(() => {
        const fetchGeneratedAlbumCover = async () => {
            if (track.name && track.artist) {
                try {
                    const response = await fetch(`http://localhost:3001/api/spotify/album-cover?track=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setGeneratedAlbumCover(data.albumCover);
                } catch (error) {
                    console.error('Error fetching generated album cover:', error);
                    setGeneratedAlbumCover('');
                }
            }
        };

        fetchGeneratedAlbumCover();
    }, [track.name, track.artist]);

    useEffect(() => {
        const fetchCurrentlyPlaying = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/spotify/currently-playing', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data) {
                    setTrack({
                        name: data.name,
                        artist: data.artist,
                        imageUrl: data.imageUrl,
                        progress: data.progress_ms,
                        duration: data.duration_ms,
                        startTime: Date.now() - data.progress_ms,
                        isPlaying: data.is_playing,
                        isrc: data.isrc,
                    });
                } else {
                    setTrack((prevTrack) => ({
                        ...prevTrack,
                        isPlaying: false
                    }));
                }
            } catch (error) {
                console.error('Error fetching currently playing:', error);
                setTrack((prevTrack) => ({
                    ...prevTrack,
                    isPlaying: false
                }));
            }
        };

        fetchCurrentlyPlaying();
        const interval = setInterval(fetchCurrentlyPlaying, 3 * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTrack((prevTrack) => {
                const newProgress = Date.now() - prevTrack.startTime;
                const updatedProgress = newProgress > prevTrack.duration ? prevTrack.duration : newProgress;
                return { ...prevTrack, progress: updatedProgress };
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchLyrics = async () => {
            if (track.name && track.artist) {
                try {
                    const response = await fetch(`http://localhost:3001/api/spotify/lyrics?track=${encodeURIComponent(track.name)}&artist=${encodeURIComponent(track.artist)}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setLyrics(data.lyrics);
                } catch (error) {
                    console.error('Error fetching lyrics:', error);
                    setLyrics('Lyrics not found.');
                }
            }
        };

        fetchLyrics();
    }, [track.name, track.artist]);

    useEffect(() => {
        const fetchLyricsTranslation = async () => {
            if (track.isrc) {
                try {
                    const response = await fetch(`http://localhost:3001/api/spotify/lyrics/translation?track_isrc=${encodeURIComponent(track.isrc)}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    setTranslatedLyrics(data.lyricsTranslation); // Ensure you use the correct property from the response
                } catch (error) {
                    console.error('Error fetching translated lyrics:', error);
                    setTranslatedLyrics('Translated lyrics not found.');
                }
            }
        };

        fetchLyricsTranslation();
    }, [track.isrc]);

    const progressPercentage = (track.duration > 0) ? (track.progress / track.duration) * 100 : 0;

    const togglePlayback = () => {
        if (track.isPlaying) {
            pausePlayback();
        } else {
            resumePlayback();
        }
    };

    const pausePlayback = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/spotify/pause', {
                method: 'PUT',
                credentials: 'include', // to ensure cookies are sent with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Optionally, update UI to reflect the playback has been paused
            setTrack((prevTrack) => ({
                ...prevTrack,
                isPlaying: false,
            }));
        } catch (error) {
            console.error('Error pausing playback:', error);
        }
    };

    const resumePlayback = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/spotify/play', {
                method: 'PUT',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Update UI to reflect the playback has been resumed
            setTrack((prevTrack) => ({
                ...prevTrack,
                isPlaying: true,
            }));
        } catch (error) {
            console.error('Error resuming playback:', error);
        }
    };

    const skipToNext = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/spotify/next', {
                method: 'POST',
                credentials: 'include', // to ensure cookies are sent with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Optionally, fetch the new currently playing track to update the UI
        } catch (error) {
            console.error('Error skipping to next track:', error);
        }
    };

    const skipToPrevious = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/spotify/previous', {
                method: 'POST',
                credentials: 'include', // to ensure cookies are sent with the request
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Optionally, fetch the new currently playing track to update the UI
        } catch (error) {
            console.error('Error skipping to previous track:', error);
        }
    };

    useEffect(() => {
        // Function to calculate the current line index based on the song's progress
        const calculateCurrentLine = () => {
            const timePerLine = track.duration / lyricsLines.length / 3;
            const currentLine = Math.floor(track.progress / timePerLine);
            setCurrentLineIndex(currentLine);
        };

        // Call the function immediately to set the initial line and also set an interval to update it
        calculateCurrentLine();
        const interval = setInterval(calculateCurrentLine, 1000); // Update every second

        // Clear the interval when the component is unmounted or the track changes
        return () => clearInterval(interval);
    }, [track.progress, track.duration, lyricsLines.length]);

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" p={2} bgcolor="#1DB954" color="white">
                <Button href="/about" color="inherit">About</Button>
                <Button href="/" color="inherit">Logout</Button>
            </Box>
            <Grid container spacing={2} mt={2}>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        {track.imageUrl && (
                            <img src={track.imageUrl} alt="Album cover" style={{ width: '100%', borderRadius: '8px' }} />
                        )}
                        <Typography variant="h4" mt={2}>{track.name}</Typography>
                        <Typography variant="h6" color="textSecondary">{track.artist}</Typography>
                        <Box mt={2} position="relative">
                            <CircularProgress variant="determinate" value={progressPercentage} size={100} thickness={4} />
                            <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                                <Typography variant="caption" component="div" color="textSecondary">
                                    {`${Math.round(progressPercentage)}%`}
                                </Typography>
                            </Box>
                        </Box>
                        <Box mt={2}>
                            <Button onClick={skipToPrevious}>
                                <i className="fas fa-backward"></i>
                            </Button>
                            <Button onClick={togglePlayback}>
                                {track.isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i>}
                            </Button>
                            <Button onClick={skipToNext}>
                                <i className="fas fa-forward"></i>
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        {lyrics && (
                            <>
                                <Typography variant="h5">Lyrics</Typography>
                                <Typography component="div" sx={{ whiteSpace: 'pre-wrap', textAlign: 'center', fontSize: '1rem', mt: 2 }}>
                                    {lyricsLines.map((line, index) => (
                                        <Typography key={index} style={{ fontWeight: index === currentLineIndex ? 'bold' : 'normal' }}>
                                            {line}
                                        </Typography>
                                    ))}
                                </Typography>
                            </>
                        )}
                        {translatedLyrics && (
                            <>
                                <Typography variant="h5" mt={4}>Translated Lyrics</Typography>
                                <Typography component="div" sx={{ whiteSpace: 'pre-wrap', textAlign: 'center', fontSize: '1rem', mt: 2 }}>
                                    {translatedLyrics.split('\n').map((line, index) => (
                                        <Typography key={index} style={{ fontWeight: index === currentLineIndex ? 'bold' : 'normal' }}>
                                            {line}
                                        </Typography>
                                    ))}
                                </Typography>
                            </>
                        )}
                        {generatedAlbumCover && (
                            <>
                                <Typography variant="h5" mt={4}>Generated Album Cover</Typography>
                                <Box mt={2} display="flex" justifyContent="center">
                                    <img src={generatedAlbumCover} alt="Generated Album Cover" style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} />
                                </Box>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );


}

export default SuccessPage;
