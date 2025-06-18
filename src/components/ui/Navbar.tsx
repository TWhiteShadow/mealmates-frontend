import * as React from 'react';
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import ExploreIcon from '@mui/icons-material/Explore';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import MessageIcon from '@mui/icons-material/Message';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { Badge } from '@mui/material';
import { useNavigate } from 'react-router';
import { useAtom, useSetAtom } from 'jotai';
import { unreadCountAtom, unreadMessagesCountAtom } from '@/atoms/messages';
import { getUnreadMessagesCount } from '@/api/Message';
import { getUnreadNotificationsCount } from '@/api/Notification';
import { unreadNotificationsCountAtom } from '@/atoms/notifications';

const getValueFromPath = (path: string) => {
  switch (path) {
    case '/app/discover':
      return 0;
    case '/app/browse':
      return 1;
    case '/app/sell':
      return 2;
    case '/app/messages':
      return 3;
    case '/app/profile':
      return 4;
    default:
      return 0;
  }
};

const SimpleBottomNavigation = () => {
  const [value, setValue] = React.useState(getValueFromPath(window.location.pathname));
  const [unreadCount, setUnreadCount] = useAtom(unreadCountAtom);
  const setUnreadNotificationsCount = useSetAtom(unreadNotificationsCountAtom);
  const setUnreadMessagesCount = useSetAtom(unreadMessagesCountAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const countMessages = await getUnreadMessagesCount();
        const countNotifications = await getUnreadNotificationsCount();
        setUnreadMessagesCount(countMessages);
        setUnreadNotificationsCount(countNotifications);
        setUnreadCount(countMessages + countNotifications);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();

    const intervalId = setInterval(fetchUnreadCount, Number(import.meta.env.VITE_MESSAGES_POLL_INTERVAL) || 10000);

    return () => clearInterval(intervalId);
  }, [setUnreadCount]);

  return (
    <Box
      component={'nav'}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        '& .MuiBottomNavigationAction-root': {
          color: 'var(--color-purple)',
        },
        '& .MuiBottomNavigationAction-root.Mui-selected': {
          color: 'var(--color-purple-dark)',
        },
      }}
      className='z-10'
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          event.preventDefault();
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label='Découvrir'
          icon={value === 0 ? <ExploreIcon /> : <ExploreOutlinedIcon />}
          onClick={() => {
            navigate('/app/discover', { replace: true });
          }}
        />
        <BottomNavigationAction
          label='Parcourir'
          icon={
            value === 1 ? <ManageSearchIcon /> : <ManageSearchOutlinedIcon />
          }
          onClick={() => {
            navigate('/app/browse', { replace: true });
          }}
        />
        <BottomNavigationAction
          label='Vendre'
          icon={
            value === 2 ? <AddCircleIcon /> : <AddCircleOutlineOutlinedIcon />
          }
          onClick={() => {
            navigate('/app/sell', { replace: true });
          }}
        />
        <BottomNavigationAction
          label='Messages'
          icon={
            value === 3 ? (
              <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
                <MessageIcon />
              </Badge>
            ) : (
              <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
                <MessageOutlinedIcon />
              </Badge>
            )
          }
          onClick={() => {
            navigate('/app/messages', { replace: true });
          }}
        />
        <BottomNavigationAction
          label='Profil'
          icon={
            value === 4 ? <AccountCircleIcon /> : <AccountCircleOutlinedIcon />
          }
          onClick={() => {
            navigate('/app/profile', { replace: true });
          }}
        />
      </BottomNavigation>
    </Box>
  );
}

export default SimpleBottomNavigation;