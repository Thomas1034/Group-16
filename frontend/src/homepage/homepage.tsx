import * as React from 'react';
import { AppBar, Toolbar, Typography, InputBase, styled, alpha, Avatar, Stack, Container } from '@mui/material';
import Carousel from "react-carousel-mui";
import SearchIcon from '@mui/icons-material/Search';
import ReviewContainer from './ReviewContainer';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  border: "solid",
  borderColor: "black",
  backgroundColor: alpha('#808080', 0.15),
  '&:hover': {
    backgroundColor: alpha('#222222', 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'black',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

function Homepage() {
  var contactList = [{id: 0, imgSrc: "/apple.png"}, {id: 1, imgSrc: "/google.png"}, {id: 2, imgSrc: "/samsung.png"}, {id: 3, imgSrc: "/apple.png"}, {id: 4, imgSrc: "/google.png"}, {id: 5, imgSrc: "/samsung.png"}]

  return (
    <>
      <AppBar position="fixed" style={{backgroundColor: "white"}}>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" style={{width: "100%", paddingLeft: "1%", paddingRight: "1%"}}>
            <Typography variant="h4" style={{color:"black", fontWeight: "bold",}}>
              Manager Reviewer
            </Typography>
            <Search sx={{flexGrow: .45, marginRight: "15%"}}>
              <SearchIconWrapper>
                <SearchIcon/>
              </SearchIconWrapper>
              <StyledInputBase
                sx={{flexGrow: 1,}}
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
            <Avatar style={{position:"relative", justifyContent: "right"}} alt="szum" src="https://online.stanford.edu/sites/default/files/styles/cropped_square/public/instructors/T001798-Szumlanski-Sean.jpg"/>
          </Stack>
        </Toolbar>
      </AppBar>
      <Stack direction="row" style={{marginTop: "50px", backgroundColor: "white"}} alignItems="center" justifyContent="center">
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
          itemRenderer={(item) => <ReviewContainer reviewObject={item}/>}
          itemGap={25}
          // maxContainerWidth={theme.breakpoints.values["md"]}
          />
      </Stack>
    </>
  )
}

export default Homepage
