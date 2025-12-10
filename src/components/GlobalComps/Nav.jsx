import Logo from "./Logo";
import {Box, Button, Container, Stack, IconButton, Typography} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import {Link} from "react-router-dom";

export default function Nav(props){
    return (
        <Box boxShadow={2} py={1} px={4} mx={2} sx={{borderRadius: 30, backgroundColor: "rgba(255, 255, 255, 0.4)", backdropFilter: "blur(10px)", webkitBackdropFilter: "blur(8px)"}} position="sticky" top={10} zIndex={100}>
            <Stack direction="row" alignItems="center" justifyContent='space-between'>
                <Box display="flex" alignItems="center">
                    <Link to="/">
                        <Logo width='50px' height='50px' />
                    </Link>
                    <Box textAlign='center'>
                        <Link to="/">
                            <Typography variant="body1" component="p" color="success" sx={{fontFamily: '"Nunito"', fontWeight: '800'}}>Campus</Typography>
                            <Typography variant="body1" component="p" color="success" sx={{fontFamily: '"Nunito"', fontWeight: '800'}}>Mart</Typography>
                        </Link>
                    </Box>
                </Box>
                <Box>
                    <Link to="/makePost">
                        <Button variant="contained" 
                            color="success" 
                            sx={{ mr: 2, borderRadius: 5 }} 
                        >
                            <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }}>
                                Sell Now
                            </Box>

                            <AddBusinessIcon />
                        </Button>
                    </Link>
                    <Link to="/messages">
                        <IconButton aria-label="message" color="success">
                            <EmailIcon />
                        </IconButton>
                    </Link>
                    {/* <Link to="/userDetails">
                        <IconButton aria-label="profile" color="success">
                            <PersonIcon />
                        </IconButton>
                    </Link> */}
                    <Link to="">
                        <IconButton aria-label="menu" sx={{color: 'black'}}>
                            <MenuIcon />
                        </IconButton>
                    </Link>
                </Box>
            </Stack>
        </Box>
    )
}
