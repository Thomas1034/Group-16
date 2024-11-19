import * as React from 'react';
import { AppBar, Toolbar, Typography, InputBase, styled, alpha, Avatar, Stack, Container } from '@mui/material';
import Carousel from "react-carousel-mui";
import SearchIcon from '@mui/icons-material/Search';
import ReviewContainer from './ReviewContainer';
import NavBar from './NavBar.tsx';

function Homepage() {
  var contactList = [{id: 0, imgSrc: "/apple.png"}, {id: 1, imgSrc: "/google.png"}, {id: 2, imgSrc: "/samsung.png"}, {id: 3, imgSrc: "/apple.png"}, {id: 4, imgSrc: "/google.png"}, {id: 5, imgSrc: "/samsung.png"}]
  

  return (
    <>
      <NavBar/>
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
