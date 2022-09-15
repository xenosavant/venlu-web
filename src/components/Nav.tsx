import {
  ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';

export default function Nav(props: { handleRoute: () => void }) {
  const navigate = useNavigate();
  const { handleRoute } = props;
  interface MenuMap { icon: JSX.Element, route: string }
  const menuMap = new Map<string, MenuMap>([
    ['Home', { route: '/', icon: (<HomeOutlinedIcon />) }],
    ['Favorites', { route: '/favorites', icon: (<TurnedInNotOutlinedIcon />) }],
    ['Bookings', { route: '/bookings', icon: (<EventNoteIcon />) }],
    ['Profile', { route: '/profile', icon: (<PersonOutlinedIcon />) }],
    ['Settings', { route: '/settings', icon: (<SettingsOutlinedIcon />) }],
  ]);

  function onNavigate(key: string) {
    navigate(menuMap.get(key)?.route as string);
    handleRoute();
  }

  return (
    <>
      {Array.from(menuMap.keys()).map((key) => (
        <ListItem className="pl-0 pr-0" key={key}>
          <ListItemButton className="pl-24 pr-56" key={key} onClick={() => onNavigate(key)}>
            <ListItemIcon>
              {menuMap.get(key)?.icon}
            </ListItemIcon>
            <ListItemText primary={key} />
          </ListItemButton>
        </ListItem>
      ))}
    </>
  );
}
