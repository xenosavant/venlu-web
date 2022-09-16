import { useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import {
  AppBar, Box, Container, Drawer, IconButton,
  List, Menu, Toolbar, Typography,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import Home from './pages/Home';
import Filter from './components/Filter';
import { Favorites } from './pages/Favorites';
import { Account } from './pages/Account';
import { Settings } from './pages/Settings';
import { Bookings } from './pages/Bookings';
import Nav from './components/Nav';
import ListingDetail from './pages/ListingDetail';
import FilterModal from './components/modals/FilterModal';

function App() {
  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMobileFilterClick = () => {
    setMobileFilterOpen(true);
  };

  const handleMobileFilterClose = () => {
    setMobileFilterOpen(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleRoute = () => {
    setMobileOpen(!mobileOpen);
    setAnchorEl(null);
  };

  const nav = (
    <Nav handleRoute={handleRoute} />
  );

  const menu = (
    <Menu
      className="p-0"
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      {nav}
    </Menu>
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: '#4C4C4C',
      },
      secondary: {
        main: '#fefefe',
      },
    },
    typography: {
      h6: {
        lineHeight: 1.5,
      },
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      fontSize: 14,
      fontWeightLight: 300,
      fontWeightRegular: 400,
      fontWeightMedium: 500,
    },
  });

  useEffect(() => {
    setShowSidebar(location.pathname === '/');
  }, [location]);

  return (
    <ThemeProvider theme={theme}>
      <Box className="w-full h-screen">
        <AppBar position="fixed" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
          <Container
            className="flex flex-row items-center h-64 m-auto"
            sx={{ display: 'flex', maxWidth: '2000px !important' }}
          >
            <IconButton
              className="h-48"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon sx={{ color: 'white' }} />
            </IconButton>
            <Box onClick={() => handleGoHome()} sx={{ mr: 2 }}>
              <Typography sx={{ color: 'white', cursor: 'pointer' }} variant="h5">
                VENLU
              </Typography>
            </Box>
            <Box className="flex-1">
              {/* <SearchBar /> */}
            </Box>
            <IconButton onClick={handleMenuClick} className="aspect-square h-48 hidden sm:inline-flex">
              <PersonOutlinedIcon sx={{ color: 'white' }} />
            </IconButton>
            <IconButton onClick={handleMobileFilterClick} className="aspect-square h-48 sm:hidden">
              <FilterListIcon sx={{ color: 'white' }} />
            </IconButton>
          </Container>
        </AppBar>
        {menu}
        <Box sx={{ margin: { sm: '0 16px' } }} className="margin-auto h-full mt-56">
          <Container sx={{ padding: '0', maxWidth: '2000px !important' }}>
            <Box
              component="nav"
              sx={{ flexShrink: { sm: 0 } }}
            >
              {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
              <Drawer
                variant="temporary"
                open={mobileOpen}
                anchor="left"
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
              >
                <Toolbar />
                <List className="bordered-box">
                  {nav}
                </List>
              </Drawer>
              {showSidebar && (
              <Box
                sx={{
                  marginLeft: '16px',
                  width: drawerWidth,
                  marginTop: { sm: '114px' },
                  display: { xs: 'none', sm: 'block' },
                  position: 'fixed',
                  '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
              >
                <Filter />
                {mobileFilterOpen && <FilterModal onClose={handleMobileFilterClose} />}
              </Box>
              )}
            </Box>
            <Box
              sx={{
                padding: { xs: '0px', sm: '0px 16px' },
                flexGrow: 1,
                p: 3,
                mt: { xs: '64px', sm: '100px' },
                minHeight: 'calc(100vh - 128px)',
                width: showSidebar ? { xs: '100%', sm: `calc(100% - ${drawerWidth}px)`, float: 'right' } : '100%',
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/profile" element={<Account />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/listings/:id" element={<ListingDetail />} />
              </Routes>
            </Box>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
