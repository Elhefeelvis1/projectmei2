import { Card, CardLink } from "../BodyComps/Card";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {Link} from 'react-router-dom';

export default function Body(props){
    return (
        <main>
            <Container>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center" alignItems="center" my={5} flexWrap="wrap">
                    {/* Replace Card with MUI Card if desired */}
                    <Card title="Buy & Sell Easily" imgUrl="/images/landingpage/cart.svg" content="Market place tailored for students" />
                    <Card title="Affordable Services" imgUrl="/images/landingpage/handshake.svg" content="Tutoring, printing, room cleaning and more..." />
                    <Card title="Smart Campus Shopping" imgUrl="/images/landingpage/phonewithstand.svg" content="Cashless, Fast and Efficient" />
                </Stack>
                <Box textAlign="center" my={5}>
                    <Typography variant="h4" mb={3}>Popular Categories</Typography>
                    <Stack direction="row" spacing={4} justifyContent="flex-start" sx={{overflowX: "auto", whiteSpace: "nowrap", width: "100%", pb: 2}}>
                        <CardLink title="Room Essentials" imgUrl="/images/landingpage/wardrobe.svg" href="" linkName="Explore" />
                        <CardLink title="Electronics" imgUrl="/images/landingpage/computer.svg" href="" linkName="Explore" />
                        <CardLink title="Personal Services" imgUrl="/images/landingpage/person.svg" href="" linkName="Explore" />
                        <CardLink title="Groceries" imgUrl="/images/landingpage/fruit.png" href="" linkName="Explore" />
                        <CardLink title="Toiletries" imgUrl="/images/landingpage/toiletries.png" href="" linkName="Explore" />
                        <CardLink title="Tutoring" imgUrl="/images/landingpage/tutoring.png" href="" linkName="Explore" />
                    </Stack>
                </Box>
                <Box textAlign="center" my={5}>
                    <Typography variant="h5">Ready to simplify your Campus life?</Typography>
                    <Link to="/login">
                        <Button variant="contained" color="success" sx={{ mt: 2 }}>Sign Up Today</Button>
                    </Link>
                </Box>
            </Container>
        </main>
    )
}