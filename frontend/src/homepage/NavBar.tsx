import * as React from 'react';
import { AppBar, Toolbar, Typography, InputBase, styled, alpha, Avatar, Stack, Container, Menu, MenuItem } from '@mui/material';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';

const settings = ['Profile', 'Logout'];

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


// will need id later
function NavBar()
{
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const PerformSearch = (e: any) => 
  {
    const url = `tbd/?q=${e.target.value}`;
    return fetch(url, {
      method: "GET"
      }).then((res) => {
          if (res.status === 200) return res.json();
          else if (res.status === 404) return "";
          else throw new Error(`Got unexpected reponse status ${res.status} from search endpoint`);
      });
  }
    return (
        <AppBar position="fixed" style={{backgroundColor: "white"}}>
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" style={{width: "100%", paddingLeft: "1%", paddingRight: "1%"}}>
            <Typography variant="h4" style={{color:"black", fontWeight: "bold",}} onClick={() => navigate(`/`)}>
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
                onChange = {(e) => PerformSearch(e)}

              />
            </Search>
            <Avatar style={{position:"relative", justifyContent: "right"}} alt="szum" src="https://online.stanford.edu/sites/default/files/styles/cropped_square/public/instructors/T001798-Szumlanski-Sean.jpg" onClick={handleOpenUserMenu}/>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>
    )
}

export default NavBar;