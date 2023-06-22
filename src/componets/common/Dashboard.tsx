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
    <Box as="section" minH="100vh" position="relative">
      <Box position="absolute" top={0} w={'full'} zIndex={-1}>
        <svg
          className="transition duration-300 ease-in-out delay-150"
          height="100%"
          id="svg"
          viewBox="0 0 1440 590"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="1%" x2="99%" y1="60%" y2="40%">
              <stop offset="5%" stopColor="#abb8c3" />
              <stop offset="95%" stopColor="#abb8c3" />
            </linearGradient>
          </defs>
          <path
            className="transition-all duration-300 ease-in-out delay-150 path-0"
            d="M 0,600 C 0,600 0,150 0,150 C 40.64893225331369,126.58652430044182 81.29786450662738,103.17304860088363 153,110 C 224.70213549337262,116.82695139911637 327.45747422680415,153.89432989690724 390,148 C 452.54252577319585,142.10567010309276 474.8722385861561,93.24963181148748 529,106 C 583.1277614138439,118.75036818851252 669.0535714285714,193.10714285714286 731,205 C 792.9464285714286,216.89285714285714 830.9134756995581,166.3217967599411 889,143 C 947.0865243004419,119.6782032400589 1025.2925257731958,123.60567010309279 1082,136 C 1138.7074742268042,148.3943298969072 1173.9164212076585,169.2555228276878 1230,173 C 1286.0835787923415,176.7444771723122 1363.0417893961708,163.3722385861561 1440,150 C 1440,150 1440,600 1440,600 Z"
            fill="url(#gradient)"
            fillOpacity="0.4"
            stroke="none"
            strokeWidth="0"
            transform="rotate(-180 720 300)"
          />
          <defs>
            <linearGradient id="gradient" x1="1%" x2="99%" y1="60%" y2="40%">
              <stop offset="5%" stopColor="#abb8c3" />
              <stop offset="95%" stopColor="#abb8c3" />
            </linearGradient>
          </defs>
          <path
            className="transition-all duration-300 ease-in-out delay-150 path-1"
            d="M 0,600 C 0,600 0,300 0,300 C 59.10787923416788,288.42544182621504 118.21575846833576,276.85088365243007 184,292 C 249.78424153166424,307.14911634756993 322.2448453608248,349.0219072164948 388,352 C 453.7551546391752,354.9780927835052 512.8048600883652,319.06148748159063 559,313 C 605.1951399116348,306.93851251840937 638.5357142857143,330.73214285714283 692,324 C 745.4642857142857,317.26785714285717 819.0522827687776,280.009941089838 889,287 C 958.9477172312224,293.990058910162 1025.2551546391753,345.22809278350513 1089,340 C 1152.7448453608247,334.77190721649487 1213.9270986745214,273.0776877761414 1272,257 C 1330.0729013254786,240.9223122238586 1385.0364506627393,270.4611561119293 1440,300 C 1440,300 1440,600 1440,600 Z"
            fill="url(#gradient)"
            fillOpacity="0.53"
            stroke="none"
            strokeWidth="0"
            transform="rotate(-180 720 300)"
          />
          <defs>
            <linearGradient id="gradient" x1="1%" x2="99%" y1="60%" y2="40%">
              <stop offset="5%" stopColor="#abb8c3" />
              <stop offset="95%" stopColor="#abb8c3" />
            </linearGradient>
          </defs>
          <path
            className="transition-all duration-300 ease-in-out delay-150 path-2"
            d="M 0,600 C 0,600 0,450 0,450 C 49.0162002945508,468.16513254786446 98.0324005891016,486.330265095729 165,491 C 231.9675994108984,495.669734904271 316.88659793814435,486.8440721649485 375,486 C 433.11340206185565,485.1559278350515 464.421207658321,492.29344624447714 517,497 C 569.578792341679,501.70655375552286 643.4285714285714,503.98214285714283 717,487 C 790.5714285714286,470.01785714285717 863.8645066273932,433.7779823269515 921,434 C 978.1354933726068,434.2220176730485 1019.1134020618556,470.90592783505156 1072,466 C 1124.8865979381444,461.09407216494844 1189.6818851251842,414.59830633284236 1253,405 C 1316.3181148748158,395.40169366715764 1378.159057437408,422.7008468335788 1440,450 C 1440,450 1440,600 1440,600 Z"
            fill="url(#gradient)"
            fillOpacity="1"
            stroke="none"
            strokeWidth="0"
            transform="rotate(-180 720 300)"
          />
        </svg>
      </Box>
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
        <Flex alignItems="center" flexDir="column" minH="calc(100vh - 62px)">
          <Flex
            _dark={{
              bg: 'gray.800',
            }}
            align="center"
            as="header"
            bg="white"
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
              <Text fontSize="xl" fontWeight="semibold">
                {title}
              </Text>
            </Box>
            <Flex align="center" gap="4" zIndex={999}>
              <Icon as={FaBell} color="gray.500" cursor="pointer" fontSize="xl" />
              <Menu>
                <MenuButton _focus={{ boxShadow: 'none' }} py={2} transition="all 0.3s">
                  <HStack>
                    <VStack alignItems="flex-start" ml="2" spacing="1px">
                      <Text fontSize="x-small" fontWeight="bold">
                        {user.name.toLocaleUpperCase()} {user.lastname.toLocaleUpperCase()}
                      </Text>
                      <Text color="brand.400" fontSize="xx-small" fontWeight="semibold">
                        {user.role.name}
                      </Text>
                    </VStack>
                    <Box>
                      <FiChevronDown />
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
          {isIndeterminate ? (
            <Progress isIndeterminate colorScheme="brand" size="sm" w="full" />
          ) : (
            <Progress bg="brand.500" size="sm" w="full" />
          )}
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
