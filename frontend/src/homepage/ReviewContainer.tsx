import * as React from 'react';
import { Typography, Stack, Rating, Container } from '@mui/material';



const ReviewContainer = ({ reviewObject }: { reviewObject: any }) =>
{
    
    var id = reviewObject.id;
    // Get the contactManager info with API
    return (
        <Stack direction = "column" alignItems="center" style={{border: "3px solid grey", backgroundColor: "ghostwhite", margin: "15px"}}>
            <Typography variant="h4" style={{color:"black", fontWeight: "bold", justifyContent:"left"}}>
            Contact Manager
            </Typography>
            <img src = {reviewObject.imgSrc} alt="alt" style={{height:"200px", width:"200px"}}/>
            <Rating name="half-rating" size="large" defaultValue={0.5 + id} precision={0.5} readOnly/>
        </Stack>
    );
}

export default ReviewContainer;
