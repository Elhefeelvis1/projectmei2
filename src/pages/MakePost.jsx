import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {Alert, Box, Button, Container, Stack, IconButton, Typography, TextField, Avatar} from "@mui/material";
import {ArrowBack, Home, SportsEsports, Luggage, EmojiPeople, PhoneIphone, SportsTennis, TravelExplore} from '@mui/icons-material';
import { FormControl, InputLabel, Select, MenuItem, ListSubheader } from '@mui/material';
import {Link} from "react-router-dom";
import MultiImageUploader from "../components/GlobalComps/MultiImageUploader";

export default function UserDetails(props){
    const [editStatus, setEdit] = useState(false)

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    }

    return (
        <Container sx={{mt:2}}>
            <IconButton onClick={handleGoBack}>
                <ArrowBack sx={{color:"black"}}/>
            </IconButton>
            <Box maxWidth="sm" mx="auto">
                <MultiImageUploader />
                <Box component="form" autoComplete="off" mb={3} display="flex" flexDirection="column" gap={2}>
                    <TextField id="" label="Title" variant="outlined" sx={{backgroundColor: "white"}} required/>
                    <TextField id="" label="Price" variant="outlined" sx={{backgroundColor: "white"}} required/>
                    <FormControl fullWidth required>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="categorySelect"
                            label="Category"
                            sx={{backgroundColor: "white"}}
                            required
                        >
                            {/* Section 1 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <Home sx={{color:"grey"}} />Home
                            </ListSubheader>
                            <MenuItem value="app">Appliances</MenuItem>
                            <MenuItem value="furniture">Furniture</MenuItem>
                            <MenuItem value="household">Household</MenuItem>
                            <MenuItem value="tools">Tools</MenuItem>
                            
                            {/* Section 2 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <SportsEsports sx={{color:"grey"}} />Entertainment</ListSubheader>
                            <MenuItem value="video-games">Video Games</MenuItem>
                            <MenuItem value="books-films-music">Books, Films, Music</MenuItem>
                            
                            {/* Section 3 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <Luggage sx={{color:"grey"}} />Clothing and accessories</ListSubheader>
                            <MenuItem value="jewellery-accessories">Jewellery & accessories</MenuItem>
                            <MenuItem value="bags-luggage">Bags & luggage</MenuItem>
                            <MenuItem value="mens-clothing-shoes">Men's clothing and shoes</MenuItem>
                            <MenuItem value="womens-clothing-shoes">Women's clothing and shoes</MenuItem>

                            {/* Section 4 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <EmojiPeople sx={{color:"grey"}} />Personal</ListSubheader>
                            <MenuItem value="health-beauty">Health & beauty</MenuItem>
                            <MenuItem value="pet-supplies">Pet supplies</MenuItem>
                            <MenuItem value="toys-games">Toys and games</MenuItem>

                            {/* Section 5 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <PhoneIphone sx={{color:"grey"}} />Electronics</ListSubheader>
                            <MenuItem value="mobile-phones">Mobile Phones</MenuItem>
                            <MenuItem value="electronics-computers">Electronics & computers</MenuItem>

                            {/* Section 6 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <SportsTennis sx={{color:"grey"}} />Hobbies</ListSubheader>
                            <MenuItem value="sport-outdoors">Sport & outdoors</MenuItem>
                            <MenuItem value="musical-instruments">Musical instruments</MenuItem>
                            <MenuItem value="arts-crafts">Arts & crafts</MenuItem>
                            <MenuItem value="antiques-collectibles">Antiques & collectibles</MenuItem>
                            <MenuItem value="car-parts">Car parts</MenuItem>
                            <MenuItem value="bicycles">Bicycles</MenuItem>

                            {/* Section 7 Header */}
                            <ListSubheader sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                fontWeight: 'bold',
                                color: 'primary'
                                }}
                            >
                            <TravelExplore sx={{color:"grey"}} />Classifieds</ListSubheader>
                            <MenuItem value="garage-sales">Garage Sales</MenuItem>
                            <MenuItem value="miscellaneous">Miscellaneous</MenuItem>

                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel id="condition">Condition</InputLabel>
                        <Select
                            labelId="condition"
                            id="conditionSelect"
                            label="Condition"
                            sx={{backgroundColor: "white"}}
                            required
                        >
                            <MenuItem value="new">New</MenuItem>
                            <MenuItem value="used-like-new">Used - like new</MenuItem>
                            <MenuItem value="used-good">Used - good</MenuItem>
                            <MenuItem value="used-fair">Used - fair</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField id="" label="Description (optional)" variant="outlined" sx={{backgroundColor: "white"}}/>
                </Box>
                <Box mb={3} textAlign="center">
                    <Button variant="contained" color="success">
                        Post Item
                    </Button>
                </Box>
            </Box>
        </Container>
    )
}