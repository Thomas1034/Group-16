import * as React from 'react';
import { Typography, Stack, Rating } from '@mui/material';
import NavBar from '../homepage/NavBar.tsx';
import { useSearchParams } from "react-router-dom";

function ReviewPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const managerId = searchParams.get('id');

    // TODO: API Call with managerId
    const sampleReviews = {name: "Apple", reviewImage: "/apple.png", rating: {rating: 5, number: 200}, comments: [{name: 'Bob', rating: 5, comment: 'This site is awesome!'}, {name: 'Robert', rating: 2.5, comment: 'This site stinks!!!'}]}
  return (
    <>
      <NavBar/>
      <br/>
      <br/>
      <br/>
      <Stack direction="row" justifyContent="space-evenly">
        <Stack direction="column">
            <img src={sampleReviews.reviewImage} alt="alt" />
            <Stack direction="row">
                <Rating size="large" defaultValue={sampleReviews.rating.rating} precision={0.5} readOnly/>
                <Typography>{sampleReviews.rating.number} reviews</Typography>
            </Stack>
        </Stack>
        <Stack direction="column" justifyContent="space-evenly" style={{backgroundColor: "white"}}>
            {sampleReviews.comments.map((e) => 
            <Stack direction="column">
                <Stack direction="row">
                    <Typography>{e.name}</Typography>
                    <Rating size="large" defaultValue={e.rating} precision={0.5} readOnly/>
                </Stack>
                <Typography>{e.comment}</Typography>
            </Stack>)}
        </Stack>
      </Stack>
    </>
  )
}

export default ReviewPage
