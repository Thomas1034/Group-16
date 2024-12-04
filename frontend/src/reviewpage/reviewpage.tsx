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
    if (response.status === 201) {
      const data = await response.json();
      manager._id = data._id;
      manager.url = data.url;
      manager.name = data.name;
      manager.image = data.image;
      manager.author = data.author;
      manager.avgRating = data.avgRating || 0;
      manager.totalReviews = data.totalReviews || 0;
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching contact:", error);
  }
}

function ReviewPage() {
  const [searchParams] = useSearchParams();
  const managerId = searchParams.get("id");

  const [formOpen, setFormOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState<number | null>(null);
  const [newReview, setNewReview] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (managerId) {
      getContact(managerId).then(() => {
        if (manager.name != "test") {
          setLoading(false);
        }
      });
    }
  }, [managerId]);

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
    console.log(token)
    try {
      const response = await fetch('http://localhost:5001/api/reviews', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(reviewData)
      });

      if (response.ok) {
        setSnackbarMessage("Review submitted!");
      } else {
        setSnackbarMessage("Failed to submit review.");
      }
    } catch (error) {
      setSnackbarMessage("Error submitting review.");
    }
    setFormOpen(false);
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
              <Stack
                direction="column"
                spacing={2}
                sx={{ flexGrow: 1, maxWidth: 500, alignItems: "center" }}
              >
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{ fontWeight: "bold" }}
                >
                  {manager.name}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {manager.author}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Rating
                    size="large"
                    value={manager.avgRating}
                    precision={0.5}
                    readOnly
                  />
                </Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleFormOpen}
                >
                  Add Review
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Paper>
        {/* Reviews section can be added here */}
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
          <br />
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
