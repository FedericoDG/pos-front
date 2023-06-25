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

import { Footer, SidebarContent } from '.';

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
    <Box as="section" bg="gray.50" minH="100vh" position="relative">
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
        <Flex alignItems="center" flexDir="column" minH="calc(100vh - 54px)">
          <Flex
            _dark={{
              bg: 'gray.800',
            }}
            align="center"
            as="header"
            bg="brand.500"
            borderColor="brand.300"
            h="56px"
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
              <Text color="whitesmoke" fontSize="xl" fontWeight="semibold">
                {title}
              </Text>
            </Box>
            <Flex align="center" gap="4" zIndex={999}>
              <Icon as={FaBell} color="whitesmoke" cursor="pointer" fontSize="xl" />
              <Menu>
                <MenuButton _focus={{ boxShadow: 'none' }} py={2} transition="all 0.3s">
                  <HStack>
                    <VStack alignItems="flex-start" ml="2" spacing="1px">
                      <Text color="whitesmoke" fontSize="x-small" fontWeight="bold">
                        {user.name.toLocaleUpperCase()} {user.lastname.toLocaleUpperCase()}
                      </Text>
                      <Text color="whitesmoke" fontSize="xx-small" fontWeight="semibold">
                        {user.role.name}
                      </Text>
                    </VStack>
                    <Box>
                      <FiChevronDown color="whitesmoke" />
                    </Box>
                  </HStack>
                </MenuButton>
                <MenuList
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                >
                  <MenuItem>Perfil</MenuItem>
                  <MenuItem>Configuración</MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={logout}>Salir</MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
          <Box h="5px" w="full">
            <Progress bg="blue.500" size="xs" w="full" />
          </Box>
          {/*  <Box h="5px" w="full">
            {isIndeterminate ? (
              <Progress isIndeterminate colorScheme="brand" size="xs" w="full" />
            ) : (
              <Progress bg="brand" size="xs" w="full" />
            )}
          </Box> */}
          <Flex
            _dark={{ color: 'black' }}
            alignItems="center"
            as="main"
            direction="column"
            display="flex"
            mb={4}
            p={4}
            pb={0}
            w="full"
            zIndex={1}
          >
            {children}
          </Flex>
        </Flex>
        <Footer />
      </Box>
    </Box>
  );
};
