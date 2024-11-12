import * as React from 'react';
import { AppBar, Toolbar, Typography, InputBase, styled, alpha, Avatar, Stack } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


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

  return (
    <>
      <AppBar position="fixed" style={{backgroundColor: "ghostwhite"}}>
        <Toolbar>
          <Typography variant="h4" style={{color:"black", fontWeight: "bold",}}>
            Manager Reviewer
          </Typography>
          <Search sx={{flexGrow: .5,}}>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              sx={{flexGrow: 1,}}
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Avatar alt="szum" src="https://online.stanford.edu/sites/default/files/styles/cropped_square/public/instructors/T001798-Szumlanski-Sean.jpg"/>
        </Toolbar>
      </AppBar>
    </>
  )
}

export default Homepage
