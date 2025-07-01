import { Link } from 'react-router';
import UserAvatar from './UserAvatar';

type User = {
  id: number;
  first_name: string | null;
  last_name: string | null;
  averageRating?: number | null;
};

const UserProfileLink = ({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={`/app/user/${user.id}`}
      className='text-gray-600 flex items-center w-fit hover:bg-gray-100 p-2 rounded'
    >
      <UserAvatar user={user} size='sm' className='inline-block mr-2' />
      {children}
    </Link>
  );
};

export default UserProfileLink;
