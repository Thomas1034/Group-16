import * as React from "react";
import {
  Typography,
  Stack,
  Rating,
  Snackbar,
  Box,
  Container,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import NavBar from "../homepage/NavBar.tsx";
import { useSearchParams } from "react-router-dom";

let manager = {
  _id: "temp",
  name: "test",
  image: "test",
  url: "test",
  author: "test",
  avgRating: 0,
  totalReviews: 0,
};

async function getContact(managerId: string) {
  const url = `http://localhost:5001/api/contact-managers/${managerId}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      manager = {
        ...data,
        avgRating: data.avgRating || 0,
        totalReviews: data.totalReviews || 0,
      };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching contact:", error);
  }
}

async function fetchReviews(managerId: string) {
  const url = `http://localhost:5001/api/reviews/contact-manager/${managerId}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      const reviews = await response.json();
      return reviews;
    } else {
      console.error("Failed to fetch reviews:", response.status);
      return [];
    }
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

function ReviewPage() {
  const [searchParams] = useSearchParams();
  const managerId = searchParams.get("id");
  const userId = localStorage.getItem('realUserId');
  console.log(userId);
  const [formOpen, setFormOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState<number | null>(null);
  const [newReview, setNewReview] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState([]);
  const [update, setUpdate] = React.useState(false);
  const [updateForm, setUpdateForm] = React.useState(false);
  const [reviewId, setReviewId] = React.useState("");

  React.useEffect(() => {
    if (managerId) {
      getContact(managerId).then(() => {
        fetchReviews(managerId).then((data) => {
          setReviews(data);
          setLoading(false);
        });
      });
    }
  }, [managerId]);

  React.useEffect(() => {
    reviews.forEach((r) => {
        if (r.userId._id === userId)
        {
            setNewRating(r.rating);
            setNewReview(r.body);
            setUpdate(true);
            setReviewId(r._id);
        }
    })
  }, [reviews]);

  const handleFormOpen = () => {
    setFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
  };


  const handleSubmit = async () => {
    if (newRating === null) {
      setSnackbarMessage("Please input a star rating.");
      setSnackbarOpen(true);
      return;
    }

    const reviewData = {
      contactManagerId: managerId,
      rating: newRating,
      body: newReview,
    };

    const token = localStorage.getItem("userID");
    try {
      const response = await fetch("http://localhost:5001/api/reviews", {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSnackbarMessage("Review submitted!");
        fetchReviews(managerId!).then((data) => setReviews(data)); // Reload reviews
      } else {
        setSnackbarMessage("Failed to submit review.");
      }
    } catch (error) {
      setSnackbarMessage("Error submitting review.");
    }
    setFormOpen(false);
    setSnackbarOpen(true);
    setUpdateForm(false);
  };

  const handleUpdate = async () => {
    if (newRating === null) {
      setSnackbarMessage("Please input a star rating.");
      setSnackbarOpen(true);
      return;
    }

    const reviewData = {
      rating: newRating,
      body: newReview,
    };

    const token = localStorage.getItem("userID");
    try {
      const response = await fetch(`http://localhost:5001/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setSnackbarMessage("Review submitted!");
        fetchReviews(managerId!).then((data) => setReviews(data)); // Reload reviews
      } else {
        setSnackbarMessage("Failed to submit review.");
      }
    } catch (error) {
      setSnackbarMessage("Error submitting review.");
    }
    setUpdateForm(false);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };


  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "25%",
        }}
      >
        <CircularProgress color="success" />
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Box>
              <img
                src={manager.image}
                alt="Review"
                style={{ width: "100%", maxWidth: "400px", height: "auto" }}
              />
            </Box>
            <Stack sx={{ width: "100%", alignItems: "center" }}>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                {manager.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {manager.author}
              </Typography>
              <Rating size="large" value={manager.avgRating} precision={0.5} readOnly />
              { (!update) ? 
              <Button variant="contained" color="primary" onClick={handleFormOpen}>
                Add Review
              </Button> : <Button variant="contained" color="primary" onClick={() => setUpdateForm(true)}>
                Update Review
              </Button>
                }
            </Stack>
          </Stack>
        </Paper>
        <Typography variant="h5" component="h2" sx={{ marginTop: 4, marginBottom: 2 }}>
          Reviews
        </Typography>
        <Stack spacing={2}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Paper key={review.id} elevation={3} sx={{ padding: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Paper style={{backgroundColor: "lightgray"}}><Typography>{review.userId.username}</Typography></Paper>
                  <Rating value={review.rating} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {review.body}
                  </Typography>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary">
              No reviews yet.
            </Typography>
          )}
        </Stack>
      </Container>
      <Dialog open={updateForm} onClose={() => setUpdateForm(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Update Your Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Rating
              precision={0.5}
              value={newRating}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="lg" fullWidth>
        <DialogTitle>Add a Review</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Rating
              precision={0.5}
              value={newRating}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Submit
          </Button>
        </DialogActions>
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
