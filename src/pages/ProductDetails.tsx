import { useParams } from 'react-router-dom';
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
import { FaDollarSign } from 'react-icons/fa';
import { GoAlert } from 'react-icons/go';
import { nanoid } from 'nanoid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

import { DashBoard, Loading } from '../componets/common';
import { Drawer } from '../componets/productdetails/';
import { formatDate } from '../utils';
import { Price } from '../interfaces';
import { useDeletePrice, useGetProduct } from '../hooks';
import { useGetPriceLists } from '../hooks/';
import formatCurrency from '../utils/formatCurrency';

export const ProductDetails = () => {
  const resetValues: Price = useMemo(
    () => ({
      productId: 1,
      pricelistId: 1,
      price: 0,
    }),
    []
  );

  const [initialValues, setinitialValues] = useState(resetValues);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const barcodeRef = useRef<any | null>(null);

  const { id } = useParams();

  const { data: product, isFetching: isFetchingProduct } = useGetProduct(Number(id));
  const { data: priceList, isFetching: isFetchingPriceLists } = useGetPriceLists();
  //const { mutate: deletePrice } = useDeletePrice();

  const isIndeterminate = isFetchingProduct || isFetchingPriceLists;

  /* const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  }); */

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

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles del Producto">
      {!product || !priceList ? (
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
                  <Heading size="md">{product.name.toUpperCase()}</Heading>
                  <Barcode ref={barcodeRef} height={50} value={product.barcode} width={2} />
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
                          <Th bg="gray.700" color="whitesmoke">
                            STOCK TOTAL
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td
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
                          <Th bg="gray.700" color="whitesmoke">
                            STOCK
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {product.stocks.map((item) => (
                          <Tr key={nanoid()}>
                            <Td>{item.warehouse.code}</Td>
                            <Td>
                              {item.stock} {product.unit?.code}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
                <Button
                  colorScheme="brand"
                  leftIcon={<GoAlert style={{ color: 'white' }} />}
                  mb="5"
                  minH="50px"
                  ml="auto"
                  p="2"
                  w="210px"
                  onClick={onOpen}
                >
                  CARGAR PERDIDA
                </Button>
              </Stack>
            )}

            {product.prices?.length! > 0 && (
              <Stack mb="5">
                <TableContainer>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th bg="gray.700" color="whitesmoke">
                          PRECIO
                        </Th>
                        <Th bg="gray.700" color="whitesmoke">
                          LISTA DE PRECIO
                        </Th>
                        <Th bg="gray.700" color="whitesmoke">
                          FECHA
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {product.prices!.map((item) => (
                        <Tr key={nanoid()}>
                          <Td fontWeight="semibold">{formatCurrency(item?.price! || 0)}</Td>
                          <Td>{item?.pricelists?.code}</Td>
                          <Td w="180px">{formatDate(item?.createdAt)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Button
                  colorScheme="brand"
                  leftIcon={<FaDollarSign style={{ color: 'white' }} />}
                  mb="5"
                  minH="50px"
                  ml="auto"
                  p="2"
                  w="210px"
                  onClick={onOpen}
                >
                  ACTUALIZAR PRECIOS
                </Button>

                {product.costs && (
                  <TableContainer>
                    <Table size="sm">
                      <Thead>
                        <Tr>
                          <Th bg="gray.700" color="whitesmoke">
                            COSTO
                          </Th>
                          <Th bg="gray.700" color="whitesmoke">
                            FECHA
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr key={nanoid()}>
                          <Td fontWeight="semibold">{formatCurrency(product.costs[0].price)}</Td>
                          <Td w="180px">{formatDate(product.costs[0].createdAt)}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TableContainer>
                )}
                <Button
                  colorScheme="brand"
                  leftIcon={<FaDollarSign style={{ color: 'white' }} />}
                  minH="50px"
                  ml="auto"
                  p="2"
                  w="210px"
                  onClick={onOpen}
                >
                  ACTUALIZAR COSTO
                </Button>
              </Stack>
            )}
          </Stack>

          <Drawer
            initialValues={initialValues}
            isOpen={isOpen}
            priceList={priceList}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onClose}
          />
        </Flex>
      )}
    </DashBoard>
  );
};
