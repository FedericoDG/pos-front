import { useParams } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Icon,
  Stack,
  StackDivider,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { FaDollarSign } from 'react-icons/fa';
import { GrRevert } from 'react-icons/gr';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import Barcode from 'react-barcode';

import { DashBoard, Loading } from '../componets/common';
import { Drawer } from '../componets/productdetails/';
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
  const { mutate: deletePrice } = useDeletePrice();

  const isIndeterminate = isFetchingProduct || isFetchingPriceLists;

  const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  });

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
          <Card shadow="md" w={{ base: 'full', xl: '50%' }}>
            <CardHeader>
              <Box alignItems="center" display="flex" justifyContent="space-between">
                <Heading size="md">{product.name.toUpperCase()}</Heading>
                <Barcode ref={barcodeRef} height={50} value={product.barcode} width={2} />
              </Box>
              <Stack direction="row" justifyContent="flex-end" mt="2">
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

          <Stack
            gap="4"
            justifyContent="space-between"
            minH="427px"
            w={{ base: 'full', xl: '50%' }}
          >
            <Stack
              _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
              bg="white"
              borderRadius="md"
              p="4"
              shadow="md"
              w="full"
            >
              {product.prices?.length! > 0 ? (
                <>
                  <Heading mx="3" size="md">
                    PRECIOS ACTUALES
                  </Heading>
                  <StatGroup
                    alignItems="center"
                    flexWrap="wrap"
                    justifyContent="flex-start"
                    mb="4"
                    textAlign="center"
                  >
                    {product.prices!.map((item) => (
                      <Stat
                        key={item?.id}
                        _dark={{ bg: 'gray.500', color: 'whitesmoke' }}
                        bg="gray.700"
                        borderRadius="md"
                        color="whitesmoke"
                        h="91px"
                        maxW="200px"
                        mx="3"
                        p="2"
                        w="200px"
                      >
                        <Tooltip bg="gray.300" color="black" label="Volver al precio anterior">
                          <Button
                            pos="absolute"
                            right={0}
                            top={0}
                            variant="unstyled"
                            onClick={() => deletePrice(item?.id!)}
                          >
                            <Icon
                              as={GrRevert}
                              bg="white"
                              h={5}
                              p="2px"
                              pos="absolute"
                              right={1}
                              rounded="3xl"
                              top={1}
                              w={5}
                            />
                          </Button>
                        </Tooltip>
                        <StatNumber>{formatCurrency(item?.price! || 0)}</StatNumber>
                        <StatLabel textAlign="left">{item?.pricelists?.code}</StatLabel>
                        <StatLabel fontSize="xs" textAlign="left">
                          {item?.pricelists?.description}
                        </StatLabel>
                      </Stat>
                    ))}
                  </StatGroup>
                  <Divider orientation="horizontal" />
                </>
              ) : null}

              <Button
                colorScheme="brand"
                leftIcon={<FaDollarSign style={{ color: 'white' }} />}
                m="0 auto"
                minH="50px"
                minW="360px"
                p="2"
                onClick={onOpen}
              >
                ACTUALIZAR PRECIO
              </Button>
            </Stack>

            {product.stocks ? (
              <Stack
                _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
                bg="white"
                borderRadius="md"
                p="4"
                shadow="md"
                w="full"
              >
                <Stack mx="3">
                  <Heading size="md">STOCK</Heading>
                  <StatGroup
                    alignItems="center"
                    justifyContent="flex-start"
                    textAlign="center"
                    w="full"
                  >
                    <Stat
                      alignSelf="stretch"
                      bg={getBgColor({
                        totalStock: product.totalStock!,
                        alertNeg: product.alertlowstock,
                        alertStock: product.lowstock!,
                      })}
                      borderRadius="md"
                      color="blackAlpha.600"
                      maxW="200px"
                      mr="3"
                      p="2"
                      w="200px"
                    >
                      <StatNumber fontSize="3xl">
                        {product.totalStock} {product.unit?.code}
                      </StatNumber>
                      <StatLabel>Stock Total</StatLabel>
                    </Stat>
                    {product.stocks.map((item) => (
                      <Stat
                        key={item.id}
                        _dark={{ bg: 'gray.500', color: 'whitesmoke' }}
                        bg="blackAlpha.100"
                        borderRadius="md"
                        maxW="200px"
                        mx="3"
                        p="2"
                        w="200px"
                      >
                        <StatNumber>
                          {item.stock} {product.unit?.code}
                        </StatNumber>
                        <StatLabel textAlign="left">{item.warehouse?.code}</StatLabel>
                        <StatLabel textAlign="left">{item.warehouse?.description}</StatLabel>
                      </Stat>
                    ))}
                  </StatGroup>
                </Stack>
              </Stack>
            ) : null}
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
