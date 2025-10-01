import {Container, Stack, Button, Typography} from "@mui/material";
import FacebookIcon from '@mui/icons-material/Facebook';
import XIcon from '@mui/icons-material/X';
import InstagramIcon from '@mui/icons-material/Instagram';

export default function Footer() {
    return (
        <footer>
            <Container maxWidth="xlg" sx={{ pt: 3, pb: 1, mt: 3, backgroundColor: "#2e7d32", color: "white" }}>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                    <Button component="a" variant="text" sx={{color: "white"}} href="">FAQs</Button>
                    <Button component="a" variant="text" sx={{color: "white"}} href="">Privacy Policy</Button>
                    <Button component="a" variant="text" sx={{color: "white"}} href="">Terms of Service</Button>
                    <Button component="a" variant="text" sx={{color: "white"}} href="">Contact Us</Button>
                </Stack>
                <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
                    <Button component="a" variant="text" sx={{color: "white"}} href=""><FacebookIcon /></Button>
                    <Button component="a" variant="text" sx={{color: "white"}} href=""><XIcon /></Button>
                    <Button component="a" variant="text" sx={{color: "white"}} href=""><InstagramIcon /></Button>
                </Stack>
                <Typography component="p" sx={{textAlign: "center"}}>&copy; 2023 Campus Mart. All rights reserved.</Typography>
            </Container>
        </footer>
    );
}