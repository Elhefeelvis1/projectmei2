import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Box, Button, Container, Stack, IconButton, Typography, TextField, Avatar} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Link} from "react-router-dom";

export default function UserDetails(props){
    const [editStatus, setEdit] = useState(false)

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <Container sx={{mt:2}}>
            <IconButton onClick={handleGoBack}>
                <ArrowBackIcon sx={{color:"black"}}/>
            </IconButton>
            <Box display="flex" justifyContent="center" mb={3}>
                <Avatar
                    alt={props.username}
                    src="/static/images/avatar/1.jpg"
                    sx={{ width: 100, height: 100 }}
                />
            </Box>
            
            <Box maxWidth="sm" mx="auto">
                <Box component="form" autoComplete="off" mb={3} display="flex" flexDirection="column" gap={2}>
                    <TextField id="" label="Username" variant="filled" defaultValue={props.username} disabled={!editStatus}/>
                    <TextField id="" label="Full Name" variant="filled" defaultValue={props.fullName} disabled/>
                    <TextField id="" label="Email" variant="filled" defaultValue={props.email} disabled={!editStatus}/>
                    <TextField id="" label="Phone Number" variant="filled" defaultValue={props.phoneNumber} disabled={!editStatus}/>
                    <TextField id="" label="School" variant="filled" defaultValue={props.schoolName} disabled/>

                </Box>
                <Box mb={3}>
                    {editStatus ? 
                        <Button variant="contained" color="success" onClick={() => {
                            // form submission function
                            setEdit(false);
                        }}>
                            Save Changes
                        </Button> 
                    :
                        <Button variant="contained" color="success" onClick={() => {
                            setEdit(true);
                        }}>
                            Edit Profile
                        </Button>
                    }
                </Box>
            </Box>
        </Container>
    )
}