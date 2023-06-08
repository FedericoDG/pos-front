import { Box, Flex, Text } from '@chakra-ui/react';
import { BiCategoryAlt } from 'react-icons/bi';
import { FaCubes, FaHome, FaBalanceScale, FaFileInvoiceDollar, FaWarehouse } from 'react-icons/fa';
import { BsPersonVcard } from 'react-icons/bs';
//import { AiOutlineUnorderedList, AiOutlinePlusCircle } from 'react-icons/ai';
import { IconType } from 'react-icons';

import { Footer, SidebarItem } from '.';

interface Props {
  borderRight?: string;
  w?: string;
  display?: {
    base: string;
    md: string;
  };
}

interface SubItem {
  name: string;
  icon: IconType;
  link: string;
}

export interface Item {
  title: string;
  link?: string;
  icon?: IconType;
  subItems?: SubItem[];
}

const items: Item[] = [
  {
    title: 'Inicio',
    link: '/panel/',
    icon: FaHome,
  },
  {
    title: 'Productos',
    link: '/panel/productos',
    icon: FaCubes,
  },
  {
    title: 'Categorías',
    link: '/panel/categorias',
    icon: BiCategoryAlt,
  },
  {
    title: 'Unidades',
    link: '/panel/unidades',
    icon: FaBalanceScale,
  },
  {
    title: 'Clientes',
    link: '/panel/clientes',
    icon: BsPersonVcard,
  },
  {
    title: 'Depósitos',
    link: '/panel/depositos',
    icon: FaWarehouse,
  },
  {
    title: 'Lista de precios',
    link: '/panel/lista-precios',
    icon: FaFileInvoiceDollar,
  },
  /*  {
    title: 'CATEGORIAS',
    icon: BiCategoryAlt,
    subItems: [
      {
        name: 'Ver Categorías',
        icon: AiOutlineUnorderedList,
        link: '/panel/categorias',
      },
      {
        name: 'Cargar Categoría',
        icon: AiOutlinePlusCircle,
        link: '/panel/categorias/crear',
      },
    ],
  }, */
];

export const SidebarContent = (props: Props) => (
  <Box
    as="nav"
    bg="white"
    borderColor="blackAlpha.300"
    borderRightWidth="1px"
    h="full"
    left="0"
    overflowX="hidden"
    overflowY="auto"
    pb="10"
    pos="fixed"
    top="0"
    w="60"
    zIndex="sticky"
    {...props}
  >
    <Flex align="center" px="4" py="3">
      <Text color="green.500" fontSize="2xl" fontWeight="bold" ml="2">
        Sistema
      </Text>
    </Flex>
    <Flex aria-label="Main Navigation" as="nav" color="gray.600" direction="column" fontSize="sm">
      {items.map(({ title, link, subItems, icon }) => (
        <SidebarItem
          key={title}
          icon={icon}
          link={link ? link : ''}
          subItems={subItems}
          title={title}
        />
      ))}
    </Flex>
  </Box>
);
