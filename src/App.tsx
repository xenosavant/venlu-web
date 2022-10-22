import { lazy, Suspense, useEffect, useState } from 'react';
import {
  Routes, Route, useNavigate, useLocation,
} from 'react-router-dom';
import {
  AppBar, Box, Container, Dialog, Drawer, IconButton,
  List, Menu, Modal, Popover, Toolbar, Typography, CircularProgress,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import Filter from './features/filter/Filter';
import Bookings from './routes/Bookings';
import Nav from './components/Nav';
import FilterModal from './components/modals/FilterModal';
import { useAppDispatch, useAppSelector } from './store/app';
import {
  filterModalClosed, filterModalOpened, selectUiState, UiState,
} from './store/reducers/uiReducer';
import useQuery from './hooks/query';
import { CreateListing } from './features/listings/CreateListing';
import { guid } from './utilities/rand';

const Home = lazy(() => import('./features/listings/routes/Listings'));
const Favorites = lazy(() => import('./routes/Favorites'));
const Account = lazy(() => import('./routes/Account'));
const Settings = lazy(() => import('./routes/Settings'));
const ListingDetail = lazy(() => import('./features/listings/routes/ListingDetail'));

function App() {
  const dispatch = useAppDispatch();

  const drawerWidth = 240;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const uiState = useAppSelector<UiState>(selectUiState);

  const query = useQuery();

  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMobileFilterClick = () => {
    dispatch(filterModalOpened());
  };

  const handleMobileFilterClose = () => {
    dispatch(filterModalClosed());
  };

  const handleDrawerToggle = () => {
    mobileOpen && unlockScroll();
    setMobileOpen(!mobileOpen);
    setAnchorEl(null);
    unlockScroll();
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    lockScroll();
  };

  const handleMenuClose = async () => {
    setAnchorEl(null);
    unlockScroll();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const nav = (
    <Nav handleRoute={handleDrawerToggle} />
  );

  const loading = <CircularProgress className="mt-24" size="24px" color="primary" />;

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

  useEffect(() => {
    console.log('uiState', uiState);
    if (uiState.createListingModalOpen) {
      lockScroll();
    } else {
      unlockScroll();
    }
  }, [uiState]);


  // MUI is buggy and doens't unlock the scroll on menu close
  // Do it manually here with timeout to ensure render cycle is complete
  function unlockScroll() {
    setTimeout(() => {
      document.body.style.removeProperty('overflow');
    }, 1);
  }

  function lockScroll() {
    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 1);
  }

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
        <Menu
          className="p-0"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}>
          {nav}
        </Menu>
        <Box sx={{ margin: { sm: '0 16px' } }} className="margin-auto h-full mt-56">
          <Container sx={{ padding: '0', maxWidth: '2000px !important' }}>
            <Box
              component="nav"
              sx={{ flexShrink: { sm: 0 } }}
            >
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
                  <Filter showFacets />
                </Box>
              )}
              {uiState.filterModalOpen && <FilterModal onClose={handleMobileFilterClose} />}
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
                <Route path="/" element={<Suspense fallback={loading}><Home /></Suspense>} />
                <Route path="/favorites" element={<Suspense fallback={loading}><Favorites /></Suspense>} />
                <Route path="/bookings" element={<Suspense fallback={loading}><Bookings /></Suspense>} />
                <Route path="/profile" element={<Suspense fallback={loading}><Account /></Suspense>} />
                <Route path="/settings" element={<Suspense fallback={loading}><Settings /></Suspense>} />
                <Route path="/listings/:id" element={<Suspense fallback={loading}><ListingDetail /></Suspense>} />
              </Routes>
            </Box>
          </Container>
          <Modal open={uiState.createListingModalOpen}>
            <>
              <CreateListing
                listing={{
                  id: guid(),
                  title: '',
                  description: '',
                  price: 0,
                  images: [],
                  primaryImageIndex: 0,
                  capacity: 0,
                  parkingCapacity: 0,
                  features: {
                    event: [],
                    amenities: [],
                    coverage: [],
                  }
                }}></CreateListing>
            </>
          </Modal>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
