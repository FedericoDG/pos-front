import { Flex, Icon, Link, Text } from '@chakra-ui/react';
import { NavLink as RouterLink } from 'react-router-dom';

import { Item } from '.';

export const SidebarItem = (props: Item) => {
  const { link, icon, title, subItems, ...rest } = props;

  return link ? (
    <Link
      _activeLink={{
        color: 'whitesmoke',
        bg: 'green.500',
      }}
      _hover={{
        color: 'whitesmoke',
        bg: 'green.600',
      }}
      alignItems="center"
      as={RouterLink}
      color="blackAlpha.700"
      cursor="pointer"
      display="flex"
      fontSize="md"
      fontWeight="bold"
      mx="2"
      my="1"
      px="4"
      py="2"
      role="group"
      rounded="md"
      to={link}
      transition=".15s ease"
      {...rest}
    >
      <Icon
        _groupHover={{
          color: 'whitesmoke',
        }}
        as={icon}
        boxSize="5"
        mr="2"
      />
      <Text>{title}</Text>
    </Link>
  ) : (
    <>
      <Flex
        align="center"
        alignItems="center"
        color="black"
        fontSize="md"
        fontWeight="bold"
        px="4"
        py="2"
        transition=".15s ease"
        {...rest}
      >
        <Icon
          _groupHover={{
            color: 'green.500',
          }}
          as={icon}
          boxSize="5"
          mr="2"
        />
        <Text>{title}</Text>
      </Flex>
      {subItems?.map(({ name, icon, link }) => (
        <Link
          key={name}
          _activeLink={{
            color: 'whatsapp.600',
            bg: 'gray.100',
          }}
          _hover={{
            color: 'whatsapp.600',
            bg: 'gray.100',
          }}
          alignItems="center"
          as={RouterLink}
          color="blackAlpha.900"
          cursor="pointer"
          display="flex"
          my="1"
          px="8"
          py="2"
          role="group"
          to={link}
          transition=".15s ease"
          {...rest}
        >
          <Icon
            _groupHover={{
              color: 'whatsapp.600',
            }}
            as={icon}
            boxSize="5"
            mr="2"
          />
          <Text>{name}</Text>
        </Link>
      ))}
    </>
  );
};
