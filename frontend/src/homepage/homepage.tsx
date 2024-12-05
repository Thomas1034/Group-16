import * as React from 'react';
import { AppBar, Paper, Grid, Button, Rating, Box, Toolbar, Typography, InputBase, styled, alpha, Avatar, Stack, Container } from '@mui/material';
import Carousel from "react-carousel-mui";
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ReviewContainer from './ReviewContainer';
import {useNavigate} from "react-router-dom";
import NavBar from './NavBar.tsx';

interface Contact {
  _id: string;
  name: string;
  image: string;
  avgRating: number;
  totalReviews: number;
}


function Homepage() {
  const navigate = useNavigate();
  const [contactList, setContactList] = React.useState<Contact[]>([]);
  const [search, setSearch] = React.useState('');

  const fetchContactManagers = async (searchQuery = '') => {
    try {
      const response = await fetch(`http://localhost:5001/api/contact-managers?page=1&search=${searchQuery}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setContactList(data);
      } else {
        console.error('Failed to fetch contact managers');
      }
    } catch (error) {
      console.error('Error fetching contact managers:', error);
    }
  };

  React.useEffect(() => {
    fetchContactManagers(search);
  }, [search]);

  React.useEffect(() => {
    document.title = "Contact Crucible";
  }, []);

  return (
    <>
      <NavBar setSearch={setSearch} />
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
          <Stack direction="column" spacing={4} alignItems="center" justifyItems="center"  sx={{marginBottom: 10, marginTop: 10}}>
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', marginBottom: 2}}>
              Welcome to the Contact Crucible!
            </Typography>
            <Box sx={{ width: '100%', display: "flex", justifyContent: "center", border: '3px solid', borderColor: 'primary.main', background:"white", borderRadius: 2, padding: 2 }}>
              <Carousel
              items={contactList}
              itemsPerPage={{
                xs: 2,
                sm: 2,
                tablet: 2,
                md: 3,
                lg: 3,
                xl: 3,
              }}
              itemRenderer={(item) => <ReviewContainer  key ={item._id} reviewObject={item} />}
              itemGap={25}
              />
            </Box>
          </Stack>

          <KeyboardArrowDownIcon sx={{ fontSize: 40, marginTop: 2}} />

        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', marginTop: 10, marginBottom: 2 }}>
          Contact Managers
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {contactList.map((contact) => (
            <Box key={contact._id} sx={{ flex: '1 1 calc(25% - 32px)', maxWidth: 'calc(25% - 32px)' }}>
              <Paper elevation={3} sx={{ padding: 2, borderRadius: 2, textAlign: 'center' }}>
                <img src={`https://contactcrucible.xyz/uploads/${contact.image}`} alt={contact.name} style={{maxWidth: '150px', width: 'auto', maxHeight: '100px', borderRadius: '8px', marginBottom: '16px' }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {contact.name}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ marginBottom: 2 }}>
                  <Rating value={(Math.round(contact.avgRating * 10)/10)} precision={0.5} readOnly />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    ({contact.totalReviews})
                  </Typography>
                </Stack>
                
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button variant="contained" color="primary" onClick={() => navigate(`/reviews?id=${contact._id}`)}>
                    Go to Manager
                  </Button>
                </Stack>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </>
  );
}

export default Homepage;