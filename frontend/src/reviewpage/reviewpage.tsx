import * as React from 'react';
import { Typography, Stack, Rating, Snackbar, Box, Container, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import NavBar from '../homepage/NavBar.tsx';
import { useSearchParams } from "react-router-dom";

function ReviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const managerId = searchParams.get('id');

  const [formOpen, setFormOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState<number | null>(null);
  const [newReview, setNewReview] = React.useState('');
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');


  // TODO: Check on load if already reviewed and set flag accordingly and make flag logic for edit button and load fields 


  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };

  const handleSubmit = () => {
    if (newRating === null) {
      setSnackbarMessage('Please input a star rating.');
      setSnackbarOpen(true);
      return;
    }
    // TODO: Handle form submission
    console.log('New Rating:', newRating);
    console.log('New Comment:', newReview);
    setFormOpen(false);
    setSnackbarMessage('Review submitted!');
    setSnackbarOpen(true);
  };

  // TODO: API Call with managerId
  const sampleReviews = {
      name: "Apple",
      reviewImage: "/apple.png",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      rating: { rating: 5, number: 200 },
      comments: [
          { name: 'Bob', rating: 5, comment: 'This site is awesome!' },
          { name: 'Robert', rating: 1.5, comment: 'This site stinks!!!' }
      ]
  };


  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  return (
      <>
          <NavBar />
          <Container maxWidth="lg" sx={{ padding: 3 }}>
              <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop:3}}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} alignItems="center">
                      <Box>
                          <img src={sampleReviews.reviewImage} alt="Review" style={{ width: "100%", maxWidth: "400px", height: "auto"}} />
                      </Box>
                      <Stack sx={{width:'100%', alignItems:"center"}}>
                        <Stack direction="column" spacing={2} sx={{flexGrow: 1, maxWidth: 500, alignItems: "center"}}>
                            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>{sampleReviews.name}</Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>{sampleReviews.description}</Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Rating size="large" value={sampleReviews.rating.rating} precision={0.5} readOnly />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{sampleReviews.rating.number} reviews</Typography>
                            </Stack>
                            <Button variant="contained" color="primary" onClick={handleFormOpen}>
                                  Add Review
                              </Button>
                        </Stack>
                      </Stack>
                  </Stack>
              </Paper>
              <Paper elevation={3} sx={{ marginTop: 4, padding: 3, borderRadius: 2 }}>
                  <Typography variant="h5">Reviews</Typography>
                  {sampleReviews.comments.map((e, index) => (
                      <Box key={index} sx={{ marginBottom: 2, padding: 2, borderBottom: '1px solid #e0e0e0' }}>
                          <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography
                                  sx={{
                                      padding: "5px 10px",
                                      borderRadius: "50px",
                                      fontWeight: "bold",
                                      backgroundColor: "#f5f5f5",
                                      minWidth: "70px",
                                  }}
                              >
                                  {e.name}
                              </Typography>
                              <Rating size="small" value={e.rating} precision={0.5} readOnly />
                          </Stack>
                          <Typography variant="body2" sx={{ marginTop: 1, color: 'text.secondary' }}>{e.comment}</Typography>
                      </Box>
                  ))}
              </Paper>
          </Container>

          <Dialog open={formOpen} onClose={handleFormClose} maxWidth="lg" fullWidth>
                <DialogTitle>Add a Review</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        <Rating
                            precision={0.5}
                            value={newRating} // for editing later
                            onChange={(event, newValue) => {
                                setNewRating(newValue);
                            }}
                        />
                        <TextField
                            label="Write your review here..."
                            multiline
                            rows={4}
                            value={newReview}
                            onChange={(e) => setNewReview(e.target.value)}
                            fullWidth
                        />
                    </Stack>
                <br/>
                <DialogActions>
                    <Button onClick={handleFormClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" variant="contained">
                        Submit
                    </Button>
                </DialogActions>
                </DialogContent>

            </Dialog>
            <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
      </>
  );
}

export default ReviewPage;
