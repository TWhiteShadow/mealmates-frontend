import { ReactNode } from 'react';

const ProfileAppBar = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-stone-50 shadow-md h-16">
      <div className="max-w-md mx-auto px-4 h-full flex items-center justify-between">
        {children}
      </div>
    </div>
  );
};

export default ProfileAppBar;
