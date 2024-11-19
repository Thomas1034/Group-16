import * as React from 'react';
import { Typography, Stack, Rating, Container } from '@mui/material';
import { useNavigate } from "react-router-dom";

// TODO: Change to object Id
const ReviewContainer = ({ reviewObject }: { reviewObject: any }) =>
{
    const navigate = useNavigate();
    var id = reviewObject.id;
    // Get the contactManager info with API
    return (
        <Stack  onClick={() => navigate(`/reviews?id=${id}`)} direction = "column" alignItems="center" style={{border: "3px solid grey", backgroundColor: "ghostwhite", margin: "15px"}}>
            <Typography variant="h4" style={{color:"black", fontWeight: "bold", justifyContent:"left"}}>
                Contact Manager
            </Typography>
            <img src = {reviewObject.imgSrc} alt="alt" style={{height:"200px", width:"200px"}}/>
            <Rating name="half-rating" size="large" defaultValue={0.5 + id} precision={0.5} readOnly/>
        </Stack>
    );
}

export default ReviewContainer;
