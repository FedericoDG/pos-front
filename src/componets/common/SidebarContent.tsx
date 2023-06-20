import { BiCategoryAlt } from 'react-icons/bi';
import { Box, Collapse, Flex, Icon, Text } from '@chakra-ui/react';
import { BsPersonVcard, BsPersonVcardFill } from 'react-icons/bs';
import { FaBalanceScale, FaCubes, FaFileInvoiceDollar, FaHome, FaWarehouse } from 'react-icons/fa';
import { AiOutlineStock } from 'react-icons/ai';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { useMyContext } from '../../context';

import { NavItem, NavItemDivider } from '.';

interface Props {
  borderRight?: string;
  w?: string;
  display?: {
    base: string;
    md: string;
  };
}

export const SidebarContent = (props: Props) => {
  const { isOpenPriceList, onTogglePriceList, isOpenStock, onToggleStock } = useMyContext();

  return (
    <Box
      _dark={{
        bg: 'gray.800',
      }}
      as="nav"
      bg="white"
      borderRightWidth="1px"
      color="inherit"
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
      <Flex align="center" px="4" py="5">
        <Text
          _dark={{
            color: 'white',
          }}
          color="brand.500"
          fontSize="2xl"
          fontWeight="bold"
          ml="2"
        >
          Sistema
        </Text>
      </Flex>
      <Flex aria-label="Main Navigation" as="nav" color="gray.600" direction="column" fontSize="sm">
        <NavItem icon={FaHome} link="/panel/">
          Inicio
        </NavItem>
        <NavItem icon={FaCubes} link="/panel/productos">
          Productos
        </NavItem>
        <NavItem icon={BiCategoryAlt} link="/panel/categorias">
          Categorías
        </NavItem>
        <NavItem icon={FaBalanceScale} link="/panel/unidades">
          Unidades
        </NavItem>
        <NavItemDivider icon={FaFileInvoiceDollar} onClick={onTogglePriceList}>
          Listas de Precios
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={isOpenPriceList ? 'rotate(90deg)' : ''}
          />
        </NavItemDivider>
        <Collapse in={isOpenPriceList}>
          <NavItem link="/panel/lista-de-precios/">
            <Box pl="8" py="0">
              Crear / Editar
            </Box>
          </NavItem>
          <NavItem link="/panel/lista-de-precios/generar-reporte">
            <Box pl="8" py="0">
              Generar Reporte
            </Box>
          </NavItem>
        </Collapse>
        <NavItem icon={BsPersonVcard} link="/panel/clientes">
          Clientes
        </NavItem>
        <NavItem icon={BsPersonVcardFill} link="/panel/proveedores">
          Proveedores
        </NavItem>
        {/*  */}
        <NavItemDivider icon={AiOutlineStock} onClick={onToggleStock}>
          Stock
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={isOpenStock ? 'rotate(90deg)' : ''}
          />
        </NavItemDivider>
        <Collapse in={isOpenStock}>
          <NavItem link="/panel/stock/">
            <Box pl="8" py="0">
              Detalles
            </Box>
          </NavItem>
          <NavItem link="/panel/compras">
            <Box pl="8" py="0">
              Cargar Compra
            </Box>
          </NavItem>
          <NavItem link="/panel/depositos">
            <Box pl="8" py="0">
              Depósitos
            </Box>
          </NavItem>
        </Collapse>
      </Flex>
    </Box>
  );
};
