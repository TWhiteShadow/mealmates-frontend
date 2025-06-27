import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface User {
  first_name?: string | null;
  last_name?: string | null;
}

interface UserAvatarProps {
  user?: User | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  alt?: string;
}

const sizeClasses = {
  sm: 'size-10',
  md: 'size-12',  
  lg: 'size-16',
  xl: 'size-24',
};

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = 'md',
  className,
  alt
}) => {
  const firstName = user?.first_name || '';
  const lastName = user?.last_name || '';

  const avatarUrl = `https://api.dicebear.com/9.x/thumbs/svg?seed=${firstName || 'default'}&backgroundColor=5e1969&shapeColor=c19ee0`;

  const getFallbackText = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      return firstName.charAt(0);
    }
    return '?';
  };

  const getAltText = () => {
    if (alt) return alt;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    }
    return 'Profile';
  };

  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      <AvatarImage
        src={avatarUrl}
        alt={getAltText()}
      />
      <AvatarFallback>
        {getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
