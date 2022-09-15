import { AppBar, Toolbar, IconButton } from '@mui/material';
import { Container } from '@mui/system';
import MenuIcon from '@mui/icons-material/Menu';

export function Navbar() {
  return (
    <AppBar position="fixed">
      <Container maxWidth="xl" className="flex items-center h-64">
        <div>
          <IconButton className="h-48">
            <MenuIcon />
          </IconButton>
        </div>
      </Container>
    </AppBar>
  );
}
