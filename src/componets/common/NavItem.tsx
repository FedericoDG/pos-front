import { Icon, Link } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { NavLink as RouterLink } from 'react-router-dom';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  icon?: IconType;
  link: string;
}

export const NavItem = ({ icon, children, link, ...rest }: Props) => {
  return (
    <Link
      _activeLink={{
        bg: 'gray.100',
        color: 'gray.900',
        _dark: {
          color: 'gray.800',
        },
      }}
      _dark={{
        color: 'gray.200',
      }}
      _hover={{
        bg: 'gray.100',
        color: 'gray.900',
        _dark: {
          color: 'gray.800',
        },
      }}
      alignItems="center"
      as={RouterLink}
      color="inherit"
      cursor="pointer"
      display="flex"
      fontWeight="semibold"
      pl="4"
      px="4"
      py="3"
      role="group"
      to={link}
      transition=".15s ease"
      {...rest}
    >
      {icon && (
        <Icon
          _groupHover={{
            color: 'brand.500',
          }}
          as={icon}
          boxSize="4"
          mx="2"
        />
      )}
      {children}
    </Link>
  );
};
