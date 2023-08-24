import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Barcode from 'react-barcode';

import { DashBoard, Loading } from '../componets/common';
import { Drawer, DrawerCost, DrawerDischarge } from '../componets/product_details/';
import { formatDate } from '../utils';
import { Discharge, Price } from '../interfaces';
import { useGetProduct, useGetReasons, useGetWarehousesWOStock } from '../hooks';
import { useGetPriceLists } from '../hooks/';
import formatCurrency from '../utils/formatCurrency';

interface Cost {
  productId: number;
  cost: number;
}

export const ProductDetails = () => {
  const resetValues: Price = useMemo(
    () => ({
      productId: 1,
      pricelistId: 1,
      price: 0,
    }),
    []
  );

  const resetValues2: Discharge = useMemo(
    () => ({
      warehouseId: 1,
      productId: 1,
      reasonId: 1,
      quantity: 0,
      cost: 0,
      unit: 'Kg.',
      info: '',
    }),
    []
  );

  const resetValues3: Cost = useMemo(
    () => ({
      productId: 0,
      cost: 0,
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);
  const [initialValues2, setinitialValues2] = useState(resetValues2);
  const [initialValues3, setinitialValues3] = useState(resetValues3);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  const { isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();

  const barcodeRef = useRef<any | null>(null);

  const { id } = useParams();

  const { data: product, isFetching: isFetchingProduct } = useGetProduct(Number(id));
  const { data: priceList, isFetching: isFetchingPriceLists } = useGetPriceLists();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehousesWOStock();
  const { data: reasons, isFetching: isFetchingReasons } = useGetReasons();

  const isIndeterminate =
    isFetchingProduct || isFetchingPriceLists || isFetchingWarehouses || isFetchingReasons;

  const getBgColor = ({
    totalStock,
    alertNeg,
    alertStock,
  }: {
    totalStock: number;
    alertNeg: string;
    alertStock: number;
  }): string => {
    if (totalStock <= 0) return 'red.400';
    if (alertNeg === 'ENABLED' && totalStock <= alertStock) return 'orange.300';

    return 'whatsapp.300';
  };

  useEffect(() => {
    if (!product || !priceList) return;

    resetValues.productId = product.id!;
    resetValues.pricelistId = priceList[0].id!;
  }, [priceList, product, resetValues]);

  useEffect(() => {
    if (!product || !warehouses || !reasons) return;

    resetValues2.productId = product.id!;
    resetValues2.warehouseId = warehouses[0].id!;
    resetValues2.reasonId = reasons[0].id!;
    resetValues2.cost = product.costs![0].price;
  }, [product, reasons, resetValues2, warehouses]);

  useEffect(() => {
    if (!product) return;

    resetValues3.productId = product.id!;
    resetValues3.cost = product.costs![0].price;
  }, [product, resetValues3]);

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles del Producto">
      {!product || !priceList || !warehouses || !reasons ? (
        <Loading />
      ) : (
        <Flex
          alignItems="flex-start"
          flexDir={{ base: 'column', xl: 'row' }}
          gap="4"
          justifyContent="space-between"
          w="full"
        >
          <Stack w={{ base: 'full', xl: '50%' }}>
            <Card shadow="md">
              <CardHeader>
                <Box alignItems="center" display="flex" justifyContent="space-between">
                  <Stack>
                    <Heading size="md">{product.name.toUpperCase()}</Heading>
                    <Text fontSize="md">iva: {product.ivaCondition?.description!}</Text>
                  </Stack>
                  <Box h="92px" w="266px">
                    {product.barcode && (
                      <Barcode ref={barcodeRef} height={50} value={product.barcode} width={2} />
                    )}
                  </Box>
                </Box>
                <Stack direction={{ base: 'column', md: 'row' }} justifyContent="flex-end" mt="2">
                  <Badge colorScheme={product.status === 'ENABLED' ? 'green' : 'red'}>
                    {product.status === 'ENABLED' ? 'habilitado' : 'deshabilitado'}
                  </Badge>
                  <Badge colorScheme={product.allownegativestock === 'ENABLED' ? 'red' : 'green'}>
                    {product.allownegativestock === 'ENABLED'
                      ? 'permitir stock negativo'
                      : 'no permitir stock negativo'}
                  </Badge>
                  <Badge colorScheme={product.alertlowstock === 'ENABLED' ? 'green' : 'red'}>
                    {product.alertlowstock === 'ENABLED'
                      ? 'alertar ante bajo stock'
                      : 'no alertar ante bajo stock'}
                  </Badge>
                </Stack>
              </CardHeader>

              <CardBody pt="0">
                <Stack divider={<StackDivider />} spacing="4">
                  <Box display="flex" justifyContent="space-between">
                    <Stack>
                      <Text>Código Interno</Text>
                      <Text fontFamily="mono" fontSize="sm" pt="2">
                        {product.code}
                      </Text>
                    </Stack>
                    <Stack>
                      <Text textAlign="right">Descripción</Text>
                      <Text fontFamily="mono" fontSize="xs" pt="2">
                        {product.description}
                      </Text>
                    </Stack>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Stack>
                      <Text>Unidad</Text>
                      <Text fontFamily="mono" fontSize="sm" pt="2">
                        {product.unit?.name}
                      </Text>
                    </Stack>
                    <Stack>
                      <Text textAlign="right">Abreviatura Unidad</Text>
                      <Text fontFamily="mono" fontSize="sm" pt="2" textAlign="right">
                        {product.unit?.code}
                      </Text>
                    </Stack>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Stack>
                      <Text>Categoría</Text>
                      <Text fontFamily="mono" fontSize="sm" pt="2">
                        {product.category?.name}
                      </Text>
                    </Stack>
                    <Stack>
                      <Text textAlign="right">Desc. Categoría</Text>
                      <Text fontFamily="mono" fontSize="xs" pt="2" textAlign="right">
                        {product.category?.description}
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </Stack>

          <Stack bg="white" p="4" rounded="md" shadow="md" w={{ base: 'full', xl: '50%' }}>
            {product.stocks && (
              <Stack>
                <Stack
                  _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
                  direction="row"
                  gap="5"
                  mb="5"
                  w="full"
                >
                  <TableContainer w="full">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th isNumeric bg="gray.700" color="whitesmoke">
                            STOCK TOTAL
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td
                            isNumeric
                            bg={getBgColor({
                              totalStock: product.totalStock!,
                              alertNeg: product.alertlowstock,
                              alertStock: product.lowstock!,
                            })}
                          >
                            {product.totalStock} {product.unit?.code}
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                  <TableContainer w="full">
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th bg="gray.700" color="whitesmoke">
                            DEPÓSITO
                          </Th>
                          <Th isNumeric bg="gray.700" color="whitesmoke">
                            STOCK
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {product.stocks.map((item) => (
                          <Tr key={nanoid()}>
                            <Td>{item.warehouse.code}</Td>
                            <Td isNumeric>
                              {item.stock} {product.unit?.code}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
                <Button colorScheme="brand" mb="4" ml="auto" size="sm" w="210px" onClick={onOpen2}>
                  CARGAR PERDIDA
                </Button>
              </Stack>
            )}

            <Stack>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th bg="gray.700" color="whitesmoke">
                        LISTA DE PRECIO
                      </Th>
                      <Th bg="gray.700" color="whitesmoke">
                        FECHA
                      </Th>
                      <Th isNumeric bg="gray.700" color="whitesmoke">
                        PRECIO
                      </Th>
                      <Th isNumeric bg="gray.700" color="whitesmoke">
                        PRECIO CON IVA
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {product.prices!.map((item) => (
                      <Tr key={nanoid()}>
                        <Td>{item?.pricelists?.code}</Td>
                        <Td w="180px">{formatDate(item?.createdAt)}</Td>
                        <Td isNumeric fontWeight="semibold">
                          {formatCurrency(item?.price! || 0)}
                        </Td>
                        <Td isNumeric fontWeight="semibold">
                          {formatCurrency(
                            item?.price! + item?.price! * product.ivaCondition?.tax! || 0
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Button colorScheme="brand" mb="4" ml="auto" size="sm" w="210px" onClick={onOpen}>
                ACTUALIZAR PRECIOS
              </Button>

              {product.costs && (
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="whitesmoke">
                          FECHA
                        </Th>
                        <Th isNumeric bg="gray.700" color="whitesmoke">
                          COSTO
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr key={nanoid()}>
                        <Td w="180px">{formatDate(product.costs[0].createdAt)}</Td>
                        <Td isNumeric fontWeight="semibold">
                          {formatCurrency(product.costs[0].price)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
              )}
              <Button colorScheme="brand" ml="auto" size="sm" w="210px" onClick={onOpen3}>
                ACTUALIZAR COSTO
              </Button>
            </Stack>
          </Stack>

          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            priceList={priceList}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onClose}
          />
          <DrawerDischarge
            initialValues={initialValues2}
            isOpen={isOpen2}
            reasons={reasons}
            resetValues={resetValues2}
            setinitialValues={setinitialValues2}
            warehouses={warehouses}
            onClose={onClose2}
          />
          <DrawerCost
            initialValues={initialValues3}
            isOpen={isOpen3}
            resetValues={resetValues3}
            setinitialValues={setinitialValues3}
            onClose={onClose3}
          />
        </Flex>
      )}
    </DashBoard>
  );
};
