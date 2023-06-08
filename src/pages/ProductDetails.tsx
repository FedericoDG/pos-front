import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Flex,
  Heading,
  Stack,
  StackDivider,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import Barcode from 'react-barcode';
import { LegacyRef, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import { DashBoard } from '../componets/common';
import { useGetProduct } from '../hooks';
import formatCurrency from '../utils/formatCurrency';

export const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isFetching } = useGetProduct(Number(id));

  const isIndeterminate = isFetching;

  const barcodeRef = useRef<HTMLDivElement | null>(null);

  const handlePrint = useReactToPrint({
    content: () => barcodeRef.current,
  });

  if (!product) return <h1>Cargando...</h1>;

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles del Producto">
      <Flex
        alignItems="flex-start"
        flexDir={{ base: 'column', xl: 'row' }}
        gap="4"
        justifyContent="space-between"
        w="full"
      >
        <Card maxW="600px" minW="420px" w="full">
          <CardHeader alignItems="center" display="flex" justifyContent="space-between">
            <Heading size="md">{product.name.toUpperCase()}</Heading>
            <Box ref={barcodeRef} as={Barcode} value={product.barcode} width={2} />
          </CardHeader>

          <CardBody>
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

        <Stack bg="white" borderRadius="md" p="4" shadow="md" w="full">
          {product.prices ? (
            <>
              <Heading mx="3" size="md">
                PRECIOS ACTUALES
              </Heading>
              <StatGroup
                alignItems="center"
                justifyContent="flex-start"
                mb="4"
                textAlign="center"
                w="full"
              >
                {product.prices.map((item) => (
                  <Stat
                    key={item?.id}
                    bg="gray.700"
                    borderRadius="md"
                    color="whitesmoke"
                    maxW="200px"
                    mx="3"
                    p="2"
                    w="200px"
                  >
                    <StatNumber>{formatCurrency(item?.price! || 0)}</StatNumber>
                    <StatLabel textAlign="left">{item?.pricelists.code}</StatLabel>
                    <StatLabel fontSize="xs" textAlign="left">
                      {item?.pricelists.description}
                    </StatLabel>
                  </Stat>
                ))}
              </StatGroup>
            </>
          ) : null}

          {product.stocks ? (
            <>
              <Divider orientation="horizontal" />
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
                    bg="whatsapp.100"
                    borderRadius="md"
                    maxW="200px"
                    mr="3"
                    p="2"
                    w="200px"
                  >
                    <StatNumber fontSize="4xl">
                      {product.totalStock} {product.unit?.code}
                    </StatNumber>
                    <StatLabel>Stock Total</StatLabel>
                  </Stat>
                  {product.stocks.map((item) => (
                    <Stat
                      key={item.id}
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
                      <StatLabel textAlign="left">{item.warehouses.code}</StatLabel>
                      <StatLabel textAlign="left">{item.warehouses.address}</StatLabel>
                    </Stat>
                  ))}
                </StatGroup>
              </Stack>
            </>
          ) : null}
        </Stack>
      </Flex>
      <Button mt="5" onClick={handlePrint}>
        Imprimir código de barra
      </Button>
    </DashBoard>
  );
};
