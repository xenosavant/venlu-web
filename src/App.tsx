import { Routes, Route } from 'react-router-dom'
import { AppBar, Box, Container, Drawer, IconButton, List, Menu, Toolbar, Typography } from '@mui/material';
import { Home } from './pages/Home';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { ListingProvider } from './context/listing-context';
import { Filter } from './components/Filter';
import { Favorites } from './pages/Favorites';
import { Account } from './pages/Account';
import { Settings } from './pages/Settings';
import { Bookings } from './pages/Bookings';
import { Nav } from './components/Nav';
import React from 'react';


class App extends React.Component<{}, { mobileOpen: boolean, open: boolean, anchorEl: HTMLElement | null, filterOpen: boolean }> {

  constructor(props: any) {
    super(props);
    this.state = {
      mobileOpen: false,
      anchorEl: null,
      filterOpen: false,
      open: false
    };
  }

  menu = <></>;
  drawerWidth = 240;
  theme = createTheme({
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
      "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
    }
  });

  handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({ anchorEl: event.currentTarget, open: !this.state.open });
  };

  handleRoute = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen, open: false });
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {

  };

  componentDidMount() {
    this.setState({ open: Boolean(this.state.anchorEl) });
  }

  render() {
    return (
      <ThemeProvider theme={this.theme} >
        <ListingProvider>
          <Box className="w-full h-screen">
            <AppBar position="fixed" elevation={0} sx={{ borderBottom: "1px solid #e2e8f0" }}>
              <Container className="flex flex-row items-center h-64 m-auto"
                sx={{ display: 'flex', maxWidth: '2000px !important' }}>
                <IconButton className="h-48" onClick={this.handleDrawerToggle}
                  sx={{ mr: 2, display: { sm: 'none' } }}>
                  <MenuIcon sx={{ color: 'white' }} />
                </IconButton>
                <Box sx={{ mr: 2 }}>
                  <Typography sx={{ color: 'white', cursor: 'pointer' }} variant='h5'>
                    VENLU
                  </Typography>
                </Box>
                <Box className="flex-1">
                  {/* <SearchBar /> */}
                </Box>
                <IconButton onClick={this.handleMenuClick} className="aspect-square h-48 hidden sm:inline-flex">
                  <PersonOutlinedIcon sx={{ color: 'white' }} />
                </IconButton>
                <IconButton onClick={this.handleFilterClick} className="aspect-square h-48 sm:hidden">
                  <FilterListIcon sx={{ color: 'white' }} />
                </IconButton>
              </Container>
            </AppBar>
            <Menu
              className='hidden sm:inline-flex p-0'
              id="basic-menu"
              anchorEl={this.state.anchorEl}
              open={this.state.open}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <Nav handleRoute={this.handleRoute} />
            </Menu>
            <Box sx={{ margin: { sm: "0 16px" } }} className="margin-auto h-full mt-56">
              <Container sx={{ padding: '0', maxWidth: '2000px !important' }}>
                <Box
                  component="nav"
                  sx={{ width: { sm: this.drawerWidth }, flexShrink: { sm: 0 } }}
                >
                  {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                  <Drawer
                    variant="temporary"
                    open={this.state.mobileOpen}
                    anchor="left"
                    onClose={this.handleDrawerToggle}
                    ModalProps={{
                      keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                      display: { xs: 'block', sm: 'none' },
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: this.drawerWidth },
                    }}
                  >
                    <Toolbar />
                    <List className="bordered-box">
                      <Nav handleRoute={this.handleRoute} />
                    </List>
                  </Drawer>
                  <Box
                    sx={{
                      marginLeft: '16px',
                      width: this.drawerWidth,
                      marginTop: { sm: "114px" },
                      display: { xs: 'none', sm: 'block' },
                      position: 'fixed',
                      '& .MuiDrawer-paper': { boxSizing: 'border-box', width: this.drawerWidth },
                    }}
                  >
                    <Filter />
                  </Box>
                </Box>
                <Box
                  sx={{
                    padding: { xs: "0px", sm: "0px 16px" },
                    flexGrow: 1, p: 3, mt: { xs: '64px', sm: '100px' },
                    minHeight: 'calc(100vh - 128px)',
                    width: { xs: '100%', sm: `calc(100% - ${this.drawerWidth}px)`, float: 'right' }
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/profile" element={<Account />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Box>
              </Container>
            </Box>
          </Box>
        </ListingProvider>
      </ThemeProvider>
    )
  }
}

export default App;