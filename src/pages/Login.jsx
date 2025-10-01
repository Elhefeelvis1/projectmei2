import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, IconButton, Box, Typography, Paper, Stack, FormHelperText, Icon } from "@mui/material";
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function Login() {
    const [input, setInput] = useState({
        email: "",
        password: "",
        passwordRepeat: "",
    });

    const [newAccount, setNewAccount] = useState(false);
    const [showHelper, setShowHelper] = useState(false);


    const handleChange = (e) => {
        const [name, value] = e.target;

        setInput({
            ...input,
            [name]: value
        });

        setShowHelper(true)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login or signup logic here
        // For navigation after login/signup, use useNavigate()
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                p:"1"
            }}
        >
            <Box width="100%" display="flex" justifyContent="flex-start">
                <IconButton href="/">
                    <ArrowBackIcon sx={{ color: "black" }} />
                </IconButton>
            </Box>
            <Box maxWidth="450px" px={3}>
                <Box sx={{display: "flex", alignItems: "center", mb: 3}}>
                    <Typography variant="h3" sx={{ align: { xs: 'right', sm: 'center' }, fontSize: {xs: "2rem", sm: "3rem"} }}>
                        {newAccount ? "Create Account" : "Welcome Back!"}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", height: { xs: '150px'}, width: { xs: '200px', sm: '250px' } }}>
                        <img src="/images/other/loginHeader.svg" alt="login header" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
                    </Box>
                </Box>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <TextField
                            label="Email Address"
                            variant="outlined"
                            type="email"
                            name="email"
                            value={input.email}
                            onChange={handleChange}
                            required
                            fullWidth
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={input.password}
                            onChange={handleChange}
                            required
                            fullWidth
                            helperText={showHelper && "Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji."}
                        />
                        {newAccount && 
                            <TextField
                            label="Repeat Password"
                            variant="outlined"
                            type="password"
                            name="passwordRepeat"
                            value={input.passwordRepeat}
                            onChange={handleChange}
                            required
                            fullWidth
                            />
                        }
                        <Button
                            type="submit"
                            variant="contained"
                            color="success"
                            fullWidth
                            endIcon={<ArrowCircleRightIcon />}
                        >
                            {newAccount ? "Sign Up" : "Log In"}
                        </Button>
                        <Button
                            color="primary"
                            fullWidth
                            onClick={() => setNewAccount(!newAccount)}
                        >
                            {newAccount ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}