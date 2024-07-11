import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
        fontFamily: 'Poppins, Arial, sans-serif',
        h3: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 500,
        },
        body1: {
            fontWeight: 400,
        },
        body2: {
            fontWeight: 300,
        },
    },
    palette: {
        primary: {
            main: '#254D32',
        },
        secondary: {
            main: '#9CAFB7',
        },
    },
});

export default theme;
