import { AiOutlineStock } from 'react-icons/ai';
import { Box, Collapse, Flex, Icon, Text } from '@chakra-ui/react';
import { BsPersonVcard, BsPersonVcardFill } from 'react-icons/bs';
import {
  FaDollarSign,
  FaCubes,
  FaFileInvoiceDollar,
  FaUserFriends,
  FaChartLine,
  FaBook,
} from 'react-icons/fa';
import { GiCarWheel } from 'react-icons/gi';
import { MdKeyboardArrowRight, MdOutlineAccountBalanceWallet } from 'react-icons/md';
import { MdPointOfSale } from 'react-icons/md';
import { Link } from 'react-router-dom';

import { useMyContext } from '../../context';
import { roles } from '../../interfaces';
import { responsables } from '../../utils/responsable';

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
    isOpenCurrentAccount,
    onToggleCurrentAccount,
    onCloseCurrentAccount,
  } = useMyContext();

  const {
    user: { role },
    responsableInscripto,
    posEnabled,
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
      <Flex align="flex-start" flexDirection={'column'} ml="2" px="4" py="12px">
        <Text
          _dark={{
            color: 'white',
          }}
          color="brand.500"
          fontSize="2xl"
          fontWeight="bold"
        >
          <Link to="/panel/">Sistema POS</Link>
        </Text>
        {responsableInscripto !== null ? (
          <Text bg={'green.200'} color={'green.800'} fontSize={'smaller'} px={'4px'} py={'2px'}>
            {`${responsables[responsableInscripto].name}`}
          </Text>
        ) : (
          <Text
            align={'center'}
            bg={'red.600'}
            color={'white'}
            fontSize={'sm'}
            px={'4px'}
            py={'2px'}
          >
            {`ALERTA: Diríjase a 'Parámetros del Sitio' y guarde la configuración.`}
          </Text>
        )}
      </Flex>
      <Flex aria-label="Main Navigation" as="nav" color="gray.600" direction="column" fontSize="sm">
        {/* POS */}

        {posEnabled && role?.id && role.id <= roles.DRIVER && responsableInscripto === 0 ? (
          <NavItem icon={MdPointOfSale} link="/panel/pos">
            Punto de Venta
          </NavItem>
        ) : (
          posEnabled && (
            <NavItem icon={MdPointOfSale} link="/panel/pos-c">
              Punto de Venta
            </NavItem>
          )
        )}
        <NavItem icon={MdPointOfSale} link="/panel/presupuesto">
          Remito
        </NavItem>

        {/* CASH REGISTER */}
        {role?.id && role?.id <= roles.DRIVER && (
          <>
            <NavItemDivider
              icon={FaDollarSign}
              onClick={() => {
                onToggleCashRegister();
                onCloseStock();
                onCloseProducts();
                onClosePriceList();
                onCloseCurrentAccount();
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
              {role?.id && role?.id <= roles.ADMIN && (
                <NavItem link="/panel/caja/">
                  <Box pl="8" py="0">
                    Listar
                  </Box>
                </NavItem>
              )}
              <NavItem link="/panel/caja/estado">
                <Box pl="8" py="0">
                  Estado
                </Box>
              </NavItem>
            </Collapse>
          </>
        )}

        {/* PRODUCTS */}
        <NavItemDivider
          icon={FaCubes}
          onClick={() => {
            onToggleProducts();
            onCloseCashRegister();
            onClosePriceList();
            onCloseStock();
            onCloseCurrentAccount();
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
          {role?.id && role?.id <= roles.ADMIN && (
            <>
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
            </>
          )}
        </Collapse>

        {/* STOCK */}
        {role?.id && role?.id <= roles.ADMIN && (
          <>
            <NavItemDivider
              icon={AiOutlineStock}
              onClick={() => {
                onToggleStock();
                onCloseCashRegister();
                onCloseProducts();
                onClosePriceList();
                onCloseCurrentAccount();
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
              <>
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
                <NavItem link="/panel/stock/transferencias-choferes">
                  <Box pl="8" py="0">
                    Transferencias Choferes
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
              </>
            </Collapse>
          </>
        )}

        {/* PRICELISTS */}
        <NavItemDivider
          icon={FaFileInvoiceDollar}
          onClick={() => {
            onTogglePriceList();
            onCloseCashRegister();
            onCloseProducts();
            onCloseStock();
            onCloseCurrentAccount();
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
          {role?.id && role?.id <= roles.ADMIN && (
            <NavItem link="/panel/lista-de-precios/">
              <Box pl="8" py="0">
                Listar
              </Box>
            </NavItem>
          )}
          <NavItem link="/panel/lista-de-precios/generar-reporte">
            <Box pl="8" py="0">
              Generar Reporte
            </Box>
          </NavItem>
        </Collapse>

        {role?.id && role?.id <= roles.SELLER && (
          <>
            <NavItemDivider
              icon={MdOutlineAccountBalanceWallet}
              onClick={() => {
                onToggleCurrentAccount();
                onClosePriceList();
                onCloseCashRegister();
                onCloseProducts();
                onCloseStock();
              }}
            >
              Cuenta Corriente
              <Icon
                as={MdKeyboardArrowRight}
                ml="auto"
                transform={isOpenCurrentAccount ? 'rotate(90deg)' : ''}
              />
            </NavItemDivider>
            <Collapse in={isOpenCurrentAccount}>
              <NavItem link="/panel/cuenta-corriente-resumen">
                <Box pl="8" py="0">
                  Resumen
                </Box>
              </NavItem>
              <NavItem link="/panel/cuenta-corriente">
                <Box pl="8" py="0">
                  Detalles
                </Box>
              </NavItem>
            </Collapse>
          </>
        )}
        {/* PRICELISTS */}

        {/* CURRENT ACCOUNT */}

        {/* DRIVERS */}
        {role?.id && role?.id <= roles.ADMIN && (
          <NavItem icon={GiCarWheel} link="/panel/choferes">
            Choferes
          </NavItem>
        )}

        {/* CLIENTS */}
        {role?.id && role?.id <= roles.SELLER && (
          <NavItem icon={BsPersonVcard} link="/panel/clientes">
            Clientes
          </NavItem>
        )}

        {/* SUPPLIERS */}
        {role?.id && role?.id <= roles.ADMIN && (
          <NavItem icon={BsPersonVcardFill} link="/panel/proveedores">
            Proveedores
          </NavItem>
        )}

        {/* BALANCE */}
        {role?.id && role?.id <= roles.ADMIN && (
          <NavItem icon={FaChartLine} link="/panel/balance">
            Ingresos
          </NavItem>
        )}

        {/* LIBRO IVA */}
        {role?.id && role?.id <= roles.ADMIN && responsableInscripto === 0 && (
          <NavItem icon={FaBook} link="/panel/libro-iva">
            Libro IVA
          </NavItem>
        )}

        {/* USERS */}
        {role?.id && role?.id <= roles.SUPERAMIN && (
          <NavItem icon={FaUserFriends} link="/panel/usuarios">
            Usuarios
          </NavItem>
        )}
      </Flex>
    </Box>
  );
};
