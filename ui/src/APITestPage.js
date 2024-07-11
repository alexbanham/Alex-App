import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';

const APITestPage = () => {
    const [prompt, setPrompt] = useState('');
    const [maxTokens, setMaxTokens] = useState(100);
    const [temperature, setTemperature] = useState(0.7);
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setResponse('');

        try {
            const res = await axios.post('http://localhost:3001/api/openai', { prompt, max_tokens: maxTokens, temperature });
            setResponse(res.data.result);
        } catch (err) {
            setError('Error interacting with the OpenAI API');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" gutterBottom>
                    OpenAI API Tester
                </Typography>
                <TextField
                    label="Enter your prompt"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <TextField
                    label="Max Tokens"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    value={maxTokens}
                    onChange={(e) => setMaxTokens(Number(e.target.value))}
                />
                <TextField
                    label="Temperature"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    type="number"
                    inputProps={{ step: "0.1", min: "0", max: "1" }}
                    value={temperature}
                    onChange={(e) => setTemperature(Number(e.target.value))}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={loading || !prompt}
                >
                    Submit
                </Button>
                {loading && (
                    <Box mt={2} display="flex" justifyContent="center">
                        <CircularProgress />
                    </Box>
                )}
                {response && (
                    <Box mt={2} p={2} border={1} borderColor="grey.300">
                        <Typography variant="h6">Response:</Typography>
                        <Typography>{response}</Typography>
                    </Box>
                )}
                {error && (
                    <Box mt={2} p={2} border={1} borderColor="red">
                        <Typography color="error">{error}</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
};

export default APITestPage;
