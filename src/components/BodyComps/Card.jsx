import { Card as MUICard, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

function CardLink(props) {
    return (
        <MUICard sx={{ width: { xs: 200, md: 250 }, flexShrink: 0, mx: 1 }}>
            <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffffff" }}>
                <CardMedia
                    component="img"
                    sx={{ maxHeight: 120, objectFit: 'contain' }}
                    image={props.imgUrl}
                    alt={props.title}
                />
            </Box>
            <CardContent>
                <Typography variant="h6" component="div" gutterBottom>
                    {props.title}
                </Typography>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="success"
                        href={props.href}
                        size="small"
                    >
                        {props.linkName}
                    </Button>
                </Box>
            </CardContent>
        </MUICard>
    );
}

function Card(props) {
    return (
        <MUICard sx={{ width: { xs: 300, sm:'30%', md: 250 }, boxShadow: 3 }}>
            <Box sx={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: "#ffffffff" }}>
                <CardMedia
                    component="img"
                    sx={{ maxHeight: 120, objectFit: 'contain' }}
                    image={props.imgUrl}
                    alt={props.title}
                />
            </Box>
            <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" component="div" gutterBottom>
                    {props.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {props.content}
                </Typography>
            </CardContent>
        </MUICard>
    );
}

export { CardLink, Card };