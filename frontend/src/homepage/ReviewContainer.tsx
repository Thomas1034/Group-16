import * as React from 'react';
import { Typography, Stack, Box, Rating, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

// TODO: Change to object Id
const ReviewContainer = ({ reviewObject }: { reviewObject: any }) =>
{
    const navigate = useNavigate();
    var id = reviewObject._id;
    var name = reviewObject.name;
    var avgRating = reviewObject.avgRating;
    // Get the contactManager info with API
    return (
        <Stack  onClick={() => navigate(`/reviews?id=${id}`)} direction = "column" alignItems="center" style={{border: "3px solid grey", backgroundColor: "ghostwhite", margin: "15px", borderRadius:"10px", minWidth:"250px", minHeight:"200px"}}>
            <Typography variant="h4" style={{color:"black", fontWeight: "bold", justifyContent:"left"}}>
                {name}
            </Typography>
            <img src = {`https://contactcrucible.xyz/uploads/${reviewObject.image}`} alt="alt" style={{height:"200px", width:"200px", marginTop:"20px", marginBottom:"20px",}}/>
            <Box sx={{ flexGrow: 1, justifyContent:"center", }} />
            <Rating
                size="large"
                value={Math.round(avgRating * 10) / 10}
                precision={0.5}
                readOnly
                sx={{ alignSelf: "center" }}
            />
        </Stack>
    );
}

export default ReviewContainer;
