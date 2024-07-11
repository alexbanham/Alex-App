import React from 'react';
import { Container, Typography, Box, Avatar, Grid, Button, AppBar, Toolbar, Link as MuiLink, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const PortfolioPage = () => {
    return (
        <div>
            <AppBar position="static" sx={{ backgroundColor: '#254D32' }}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Alex Banham
                    </Typography>
                    <MuiLink href="#about" color="inherit" underline="none" sx={{ margin: 2 }}>
                        <Typography variant="body1">
                            About
                        </Typography>
                    </MuiLink>
                    <MuiLink href="#projects" color="inherit" underline="none" sx={{ margin: 2 }}>
                        <Typography variant="body1">
                            Projects
                        </Typography>
                    </MuiLink>
                    <MuiLink href="#contact" color="inherit" underline="none" sx={{ margin: 2 }}>
                        <Typography variant="body1">
                            Contact
                        </Typography>
                    </MuiLink>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ backgroundColor: '#F5F5F5', padding: '2rem', borderRadius: '8px', mt: 2 }}>
                <Box textAlign="center" mb={5}>
                    <Avatar
                        alt="Profile Picture"
                        src={require('./Assets/Ellipse 1.png')}
                        sx={{ width: 150, height: 150, margin: '0 auto', border: '4px solid #254D32' }}
                    />
                    <Typography variant="h3" gutterBottom sx={{ color: '#254D32' }}>
                        Hello! I'm Alex, aspiring full-stack developer
                    </Typography>
                    <Typography variant="body1" gutterBottom sx={{ color: '#9CAFB7', maxWidth: '800px', margin: '0 auto' }}>
                        Passionate about building responsive and user-friendly web applications. Skilled in JavaScript, HTML, CSS, and modern frameworks such as React and Node.js. Currently a third-year computer science student with hands-on experience in developing full-stack projects and collaborating in agile teams. Always eager to learn new technologies and enhance my coding skills.
                    </Typography>
                    <Button variant="contained" sx={{ backgroundColor: '#254D32', color: '#FFFFFF', mt: 2 }} component="a" href="/path/to/resume.pdf" target="_blank">
                        Download Resume
                    </Button>
                </Box>

                <Box textAlign="center">
                    <Typography variant="h6" gutterBottom sx={{ color: '#254D32' }}>
                        Connect with me
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <IconButton component="a" href="https://github.com/alexbanham" target="_blank" sx={{ color: '#254D32' }}>
                            <GitHubIcon style={{ fontSize: 40 }} />
                        </IconButton>
                        <IconButton component="a" href="https://linkedin.com/in/alexbanham" target="_blank" sx={{ color: '#254D32' }}>
                            <LinkedInIcon style={{ fontSize: 40 }} />
                        </IconButton>
                        <IconButton component="a" href="https://twitter.com/username" target="_blank" sx={{ color: '#254D32' }}>
                            <TwitterIcon style={{ fontSize: 40 }} />
                        </IconButton>
                    </Box>
                </Box>
            </Container>
        </div>
    );
};

export default PortfolioPage;
