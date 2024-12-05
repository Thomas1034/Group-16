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
  description: "test",
  url: null,
  author: {
    _id: "string",
    username: "temp"
  },
  avgRating: 0,
  totalReviews: 0,
};

interface Review {
    _id: string;
    userId: {
      _id: string;
      username: string;
    };
    rating: number;
    body: string;
  }


async function getContact(managerId: string) {
  const url = `https://contactcrucible.xyz/api/contact-managers/${managerId}`;
  try {
    const response = await fetch(url, { method: "GET" });
    if (response.ok) {
      const data = await response.json();
      manager = {
        ...data,
        avgRating: data.avgRating || 0,
        totalReviews: data.totalReviews || 0,
      };
    }
    else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching contact:", error);
  }
}

async function fetchReviews(managerId: string) {
  const url = `https://contactcrucible.xyz/api/reviews/contact-manager/${managerId}`;
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
  const [formOpen, setFormOpen] = React.useState(false);
  const [newRating, setNewRating] = React.useState<number | null>(null);
  const [newReview, setNewReview] = React.useState("");
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [reviews, setReviews] = React.useState<Review[]>([]);
  const [update, setUpdate] = React.useState(false);
  const [updateForm, setUpdateForm] = React.useState(false);
  const [reviewId, setReviewId] = React.useState("");

  React.useEffect(() => {
    if (managerId) {
      getContact(managerId).then(() => {
        fetchReviews(managerId).then((data) => {
          const filteredReviews = data.filter((r: any) => {
            try {
              if (r.userId && r.userId._id && typeof r.rating === "number" && r.body) {
                return true; 
              }
              throw new Error("Format");
            } catch (error) {
              console.error("Null in review: ", error, r);
              return false;
            }
          });
  
          setReviews(filteredReviews);
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
    const response = await fetch("https://contactcrucible.xyz/api/reviews", {
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
        fetchReviews(managerId!).then((data) => {
            const filteredReviews = data.filter((r: any) => {
            try {
                if (r.userId && r.userId._id && typeof r.rating === "number" && r.body) {
                return true; 
                }
                throw new Error("Invalid format");
            } catch (error) {
                return false;
            }
            });
            setReviews(filteredReviews);
        });
        
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
      const response = await fetch(`https://contactcrucible.xyz/api/reviews/${reviewId}`, {
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
        fetchReviews(managerId!).then((data) => {
            const filteredReviews = data.filter((r: any) => {
              try {
                if (r.userId && r.userId._id && typeof r.rating === "number" && r.body) {
                  return true; 
                }
                throw new Error("Invalid format");
              } catch (error) {
                return false;
              }
            });
            setReviews(filteredReviews);
          });
          
      }
      else if (response.status == 403)
      {
        localStorage.clear();
        window.location.reload();
      }  
      else {
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

  const handleDelete = async () => {
    const token = localStorage.getItem("userID");
    try {
      const response = await fetch(
        `https://contactcrucible.xyz/api/reviews/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setSnackbarMessage("Review deleted!");
        setReviews((prev) => prev.filter((review) => review._id !== reviewId));
        setUpdate(false); // Reset update state
        setReviewId(""); // Clear review ID
      }
      else if (response.status == 403)
      {
        localStorage.clear();
        window.location.reload();
      }  
      else {
        setSnackbarMessage("Failed to delete review.");
      }
    } catch (error) {
      setSnackbarMessage("Error deleting review.");
    }
    setSnackbarOpen(true);
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
      <NavBar setSearch={() => {}} showSearchBar={false}/>
      <Container maxWidth="lg" sx={{ padding: 3 }}>
        <Paper elevation={3} sx={{ padding: 3, borderRadius: 2, marginTop: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={4}
            alignItems="center"
          >
            <Box>
              <img
                src={`https://contactcrucible.xyz/uploads/${manager.image}`}
                alt="Review"
                style={{ width: "100%", maxWidth: "400px", height: "auto" }}
              />
            </Box>
            <Stack sx={{ width: "100%", alignItems: "center" }}>
              <Typography variant="h2" component="h1" sx={{ fontWeight: "bold", marginBottom:"30px"}}>
                {manager.name}
              </Typography>
              <Typography variant="body1" sx={{ color: "text.secondary", marginBottom:"30px"}}>
                By: {manager.author.username}
              </Typography>
              <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", marginBottom:"30px"}}>
                {manager.description}
              </Typography>
              <Rating size="large" sx={{marginBottom:"20px"}} value={(Math.round(manager.avgRating * 10)/10)} precision={0.1} readOnly />
              <Stack direction="row" sx={{marginTop: "10px"}}>
              {manager.url && (
                <Button variant="contained" sx={{marginRight: "100px"}}color="primary" onClick={() => window.open(`http://${manager.url}`, '_blank')}>
                  Visit Site
                </Button>
              )}
              { (!update) ? 
              <Button variant="contained" color="primary" onClick={handleFormOpen}>
                Add Review
              </Button> : <><Button variant="contained" color="primary" onClick={() => setUpdateForm(true)}>
                Update Review
              </Button>
              <Button
              variant="outlined"
              color="error"
              sx={{ marginLeft: "10px" }}
              onClick={handleDelete}
            >
              Delete Review
            </Button></>
                }
            </Stack>
            </Stack>
          </Stack>
        </Paper>
        <Typography variant="h5" component="h2" sx={{ marginTop: 4, marginBottom: 2 }}>
          Reviews
        </Typography>
        <Stack spacing={2}>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <Paper key={review._id} elevation={3} sx={{ padding: 2 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Paper style={{backgroundColor: "lightgray"}}><Typography sx={{paddingLeft:"10px", paddingRight:"10px", fontWeight:"bold"}}>{review.userId.username}</Typography></Paper>
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
