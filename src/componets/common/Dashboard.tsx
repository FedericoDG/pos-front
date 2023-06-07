import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Progress,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { FaBell } from 'react-icons/fa';
import { FiChevronDown, FiMenu } from 'react-icons/fi';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { useMyContext } from '../../context';

import { SidebarContent } from '.';

interface Props {
  children: ReactNode;
  title: string;
  isIndeterminate: boolean;
}

export const DashBoard = ({ children, title, isIndeterminate }: Props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { dispatchLogout, top, user } = useMyContext();
  const navigate = useNavigate();

  const logout = () => {
    dispatchLogout();
    navigate('/');
  };

  return (
    <Box as="section" bg="gray.100" minH="100vh">
      <SidebarContent
        display={{
          base: 'none',
          md: 'unset',
        }}
      />
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent borderRight="none" w="full" />
        </DrawerContent>
      </Drawer>
      <Box
        ml={{
          base: 0,
          md: 60,
        }}
        transition=".3s ease"
      >
        <Flex alignItems="center" flexDir="column" minH="93vh">
          <Flex
            align="center"
            as="header"
            bg="white"
            //borderBottomWidth={3}
            borderColor="whatsapp.300"
            h="14"
            justify="space-between"
            px="4"
            w="full"
          >
            <IconButton
              aria-label="Menu"
              display={{
                base: 'inline-flex',
                md: 'none',
              }}
              icon={<FiMenu />}
              size="sm"
              onClick={onOpen}
            />
            <Box
              ref={top}
              display={{
                base: 'none',
                md: 'flex',
              }}
              style={{ scrollMarginTop: '2rem' }}
            >
              <Text fontSize="xl" fontWeight="semibold">
                {title}
              </Text>
            </Box>
            <Flex align="center" gap="4">
              <Icon as={FaBell} color="gray.500" cursor="pointer" fontSize="xl" />
              <Menu>
                <MenuButton _focus={{ boxShadow: 'none' }} py={2} transition="all 0.3s">
                  <HStack>
                    <VStack alignItems="flex-start" ml="2" spacing="1px">
                      <Text fontSize="x-small" fontWeight="bold">
                        {user.name.toLocaleUpperCase()} {user.lastname.toLocaleUpperCase()}
                      </Text>
                      <Text color="gray.600" fontSize="xx-small" fontWeight="semibold">
                        {user.role.name}
                      </Text>
                    </VStack>
                    <Box>
                      <FiChevronDown />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={useColorModeValue('white', 'gray.900')}
                  borderColor={useColorModeValue('gray.200', 'gray.700')}
                >
                  <MenuItem>Perfil</MenuItem>
                  <MenuItem>Configuración</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Salir</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          {isIndeterminate ? (
            <Progress isIndeterminate colorScheme="whatsapp" size="sm" w="full" />
          ) : (
            <Progress bg="whatsapp.500" size="sm" w="full" />
          )}
          <Flex
            alignItems="center"
            as="main"
            direction="column"
            display="flex"
            flex="1"
            p={3}
            pb={0}
            w="full"
          >
            {children}
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
