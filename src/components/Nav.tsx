import {
  ListItem, ListItemButton, ListItemIcon, ListItemText,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TurnedInNotOutlinedIcon from '@mui/icons-material/TurnedInNotOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { useNavigate } from 'react-router-dom';
import { createListingModalOpened } from '../state/reducers/uiReducer';
import { useAppDispatch } from '../hooks/context';
import sleep from '../utilities/sleep';

export default function Nav(props: { handleRoute: () => void }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { handleRoute } = props;
  interface MenuMap { icon: JSX.Element, route?: string, action?: () => void }

  const openCreateListingModal = async () => {
    dispatch(createListingModalOpened());
  }

  const menuMap = new Map<string, MenuMap>([
    ['Home', { route: '/', icon: (<HomeOutlinedIcon />) }],
    ['Create Listing', { action: openCreateListingModal, icon: (<AddOutlinedIcon />) }],
    ['Favorites', { route: '/favorites', icon: (<TurnedInNotOutlinedIcon />) }],
    ['Bookings', { route: '/bookings', icon: (<EventNoteIcon />) }],
    ['Profile', { route: '/profile', icon: (<PersonOutlinedIcon />) }],
    ['Settings', { route: '/settings', icon: (<SettingsOutlinedIcon />) }],
  ]);

  function onNavigate(key: string) {
    const selection = menuMap.get(key);
    if (selection?.action) {
      selection.action();
    } else {
      navigate(menuMap.get(key)?.route as string);
    }
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
