import { Settings } from '@mui/icons-material';
import { Avatar } from '@mui/material';

const ProfileAppBar = () => {
  return (
    <div className="bg-stone-50 shadow-md h-14">
      <div className="max-w-md mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="Profile"
            sx={{ width: 32, height: 32 }}
          />
          <span className="font-semibold text-lg">Patrick</span>
        </div>
        <Settings sx={{ fontSize: 28 }} className='!text-purple-dark'/>
      </div>
    </div>
  );
};

export default ProfileAppBar;
