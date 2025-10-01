import Logo from "./Logo";
import {Box, Button, Container, Stack, IconButton, Typography} from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import {Link} from "react-router-dom";

export default function Nav(props){
    return (
        <Box boxShadow={2} py={1} px={2} position="sticky" top={0} bgcolor="white" zIndex={100}>
            <Stack direction="row" alignItems="center" justifyContent='space-between'>
                <Box display="flex" alignItems="center" gap={1}>
                    <Logo width='50px' height='50px' />
                    <Box textAlign='center'>
                        <Typography variant="body1" component="p" color="success" sx={{fontWeight: 'bold'}}>Campus</Typography>
                        <Typography variant="body1" component="p" color="success" sx={{fontWeight: 'bold'}}>Mart</Typography>
                    </Box>
                </Box>
                <Box>
                    <Link to="">
                        <IconButton aria-label="message" color="success">
                            <EmailIcon />
                        </IconButton>
                    </Link>
                    <Link to="">
                        <IconButton aria-label="profile" color="success">
                            <PersonIcon />
                        </IconButton>
                    </Link>
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
