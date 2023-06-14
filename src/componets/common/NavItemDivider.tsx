import { Flex, Icon } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  icon: IconType;
  onClick: () => void;
}

export const NavItemDivider = ({ icon, children, ...rest }: Props) => {
  return (
    <Flex
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
      align="center"
      alignItems="center"
      color="inherit"
      cursor="pointer"
      fontWeight="semibold"
      pl="4"
      px="4"
      py="3"
      role="group"
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
    </Flex>
  );
};
