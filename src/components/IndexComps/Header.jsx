import Logo from "../GlobalComps/Logo"
import { Container, Box, Typography, Button, Stack } from "@mui/material";

export default function Header(){
    return (
        <header>
            <Container sx={{py: {xs:2, md:5}, px: {xs:2, md:5} }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2 }} alignItems="center" justifyContent="space-between">
                    <Box>
                        <Box>
                            <Stack direction="row" spacing={2} alignItems="center" mb>
                                <Logo width='150px' height='150px'/>
                                <Typography variant="h3" component="h1" sx={{ fontSize: { xs: '1.8rem', sm: '3rem', md: '4rem' } }}>One-time Solution for Campus Needs</Typography>
                            </Stack>
                            <Typography variant="body1" mb={2}>Buy and sell goods, find services and connect with fellow students.</Typography>
                        </Box>
                        <Box>
                            <Stack direction="row" spacing={2} justifyContent="start">
                                <Button variant="contained" color="success" href="/login">Get Started</Button>
                                <Button variant="outlined" color="success" href="">Browse Products</Button>
                            </Stack>
                        </Box>
                    </Box>
                    <Box className="header-image">
                        <img src="/images/landingpage/womanpushingcart.svg" alt="" />
                    </Box>
                </Stack>
            </Container>
        </header>
    )
}