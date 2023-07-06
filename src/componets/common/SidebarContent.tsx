import { AiOutlineStock } from 'react-icons/ai';
import { Box, Collapse, Flex, Icon, Text } from '@chakra-ui/react';
import { BsPersonVcard, BsPersonVcardFill } from 'react-icons/bs';
import { MdPointOfSale } from 'react-icons/md';
import { FaDollarSign, FaCubes, FaFileInvoiceDollar, FaHome } from 'react-icons/fa';
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
  const {
    isOpenCashRegister,
    isOpenPriceList,
    isOpenProducts,
    isOpenStock,
    onCloseCashRegister,
    onClosePriceList,
    onCloseProducts,
    onCloseStock,
    onToggleCashRegister,
    onTogglePriceList,
    onToggleProducts,
    onToggleStock,
  } = useMyContext();

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
      <Flex align="center" px="4" py="12px">
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

        {/* POS */}
        <NavItem icon={MdPointOfSale} link="/panel/pos">
          Punto de Venta
        </NavItem>

        {/* CASH REGISTER */}
        <NavItemDivider
          icon={FaDollarSign}
          onClick={() => {
            onToggleCashRegister();
            onCloseStock();
            onCloseProducts();
            onClosePriceList();
          }}
        >
          Caja
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={isOpenCashRegister ? 'rotate(90deg)' : ''}
          />
        </NavItemDivider>
        <Collapse in={isOpenCashRegister}>
          <NavItem link="/panel/caja">
            <Box pl="8" py="0">
              Listar
            </Box>
          </NavItem>
          <NavItem link="/panel/caja/estado">
            <Box pl="8" py="0">
              Estado
            </Box>
          </NavItem>
        </Collapse>

        {/* PRODUCTS */}
        <NavItemDivider
          icon={FaCubes}
          onClick={() => {
            onToggleProducts();
            onCloseCashRegister();
            onClosePriceList();
            onCloseStock();
          }}
        >
          Productos
          <Icon
            as={MdKeyboardArrowRight}
            ml="auto"
            transform={isOpenProducts ? 'rotate(90deg)' : ''}
          />
        </NavItemDivider>
        <Collapse in={isOpenProducts}>
          <NavItem link="/panel/productos/">
            <Box pl="8" py="0">
              Listar
            </Box>
          </NavItem>
          <NavItem link="/panel/productos/costos">
            <Box pl="8" py="0">
              Actualizar Costos
            </Box>
          </NavItem>
          <NavItem link="/panel/productos/categorias">
            <Box pl="8" py="0">
              Categorías
            </Box>
          </NavItem>
          <NavItem link="/panel/productos/unidades">
            <Box pl="8" py="0">
              Unidades
            </Box>
          </NavItem>
        </Collapse>

        {/* STOCK */}
        <NavItemDivider
          icon={AiOutlineStock}
          onClick={() => {
            onToggleStock();
            onCloseCashRegister();
            onCloseProducts();
            onClosePriceList();
          }}
        >
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
              Listar
            </Box>
          </NavItem>
          <NavItem link="/panel/stock/compras">
            <Box pl="8" py="0">
              Compras
            </Box>
          </NavItem>
          <NavItem link="/panel/stock/transferencias">
            <Box pl="8" py="0">
              Transferencias
            </Box>
          </NavItem>
          <NavItem link="/panel/stock/bajas">
            <Box pl="8" py="0">
              Bajas
            </Box>
          </NavItem>
          <NavItem link="/panel/stock/depositos">
            <Box pl="8" py="0">
              Depósitos
            </Box>
          </NavItem>
        </Collapse>

        {/* PRICELISTS */}
        <NavItemDivider
          icon={FaFileInvoiceDollar}
          onClick={() => {
            onTogglePriceList();
            onCloseCashRegister();
            onCloseProducts();
            onCloseStock();
          }}
        >
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
              Listar
            </Box>
          </NavItem>
          <NavItem link="/panel/lista-de-precios/generar-reporte">
            <Box pl="8" py="0">
              Generar Reporte
            </Box>
          </NavItem>
        </Collapse>

        {/* CLIENTS */}
        <NavItem icon={BsPersonVcard} link="/panel/clientes">
          Clientes
        </NavItem>

        {/* SUPPLIERS */}
        <NavItem icon={BsPersonVcardFill} link="/panel/proveedores">
          Proveedores
        </NavItem>
      </Flex>
    </Box>
  );
};
