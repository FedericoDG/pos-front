import { Box, FormControl, FormLabel, Switch, Button, Text } from '@chakra-ui/react';
import { Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { ImPrinter } from 'react-icons/im';
import { nanoid } from 'nanoid';
import { useEffect, useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSearchParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { formatDate } from '../utils';
import { PriceList } from '../interfaces';
import { useGetPriceListsReport } from '../hooks';
import formatCurrency from '../utils/formatCurrency';

export const PriceListReport = () => {
  const [searchParams] = useSearchParams();
  const products = searchParams.get('products');
  const pricelists = searchParams.get('pricelists');
  const warehouses = searchParams.get('warehouses');

  const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);
  const [uniqueWarehouses, setUniqueWarehouses] = useState<string[]>([]);

  const [filteredProducts, setFilteredProducts] = useState<PriceList[][]>([]);
  const [enabledFilter, setEnabledFilter] = useState(true);
  const [stockFilter, setStockFilter] = useState(false);
  const [stockFilterPosta, setStockFilterPosta] = useState(false);
  const [priceFilter, setPriceFilter] = useState(true);

  const [showBarCode, setShowBarCode] = useState(true);
  const [showPrice, setShowPrice] = useState(true);
  const [showPriceDate, setShowPriceDate] = useState(false);
  const [showWarehouses, setShowWarehouses] = useState(true);

  const listPricesRef = useRef<HTMLDivElement | null>(null);

  const { data, isFetching } = useGetPriceListsReport(products, pricelists, warehouses);

  const isIndeterminate = isFetching;

  useEffect(() => {
    if (!data) return;

    const applyFilters = () => {
      let filteredData = data;

      if (enabledFilter) {
        filteredData = filteredData.map((pricelist) =>
          pricelist.filter((item) => item.products.status === 'ENABLED')
        );
      }

      if (stockFilter) {
        filteredData = filteredData.map((pricelist) =>
          pricelist.filter((item) => item.totalStock > 0)
        );
      }

      if (stockFilterPosta) {
        filteredData = filteredData.map((pricelist) =>
          pricelist.filter((item) => item.totalStockPosta > 0)
        );
      }

      setFilteredProducts(filteredData);
    };

    applyFilters();
  }, [data, enabledFilter, stockFilter, stockFilterPosta]);

  useEffect(() => {
    if (!filteredProducts) return;

    const uniqueCategoriesArray: string[] = filteredProducts.reduce(
      (categories: string[], priceList) => {
        priceList.forEach((item) => {
          const categoryName = item.products?.category?.name;

          if (categoryName && !categories.includes(categoryName)) {
            categories.push(categoryName);
          }
        });

        return categories;
      },
      []
    );

    setUniqueCategories(uniqueCategoriesArray);
  }, [filteredProducts]);

  useEffect(() => {
    if (!filteredProducts) return;

    const uniqueWarehousesArray: string[] = filteredProducts.reduce(
      (warehouses: string[], priceList) => {
        priceList.forEach((item) => {
          const stocks = item.products?.stocks;

          if (stocks) {
            stocks.forEach((stock) => {
              const warehouseCode = stock.warehouse?.code;

              if (warehouseCode && !warehouses.includes(warehouseCode)) {
                warehouses.push(warehouseCode);
              }
            });
          }
        });

        return warehouses;
      },
      []
    );

    setUniqueWarehouses(uniqueWarehousesArray);
  }, [filteredProducts]);

  useEffect(() => {
    if (uniqueWarehouses.length === 0) {
      return setShowPriceDate(true);
    } else {
      return setShowPriceDate(false);
    }
  }, [uniqueWarehouses.length, data]);

  const handlePrint = useReactToPrint({
    content: () => listPricesRef.current,
  });

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Detalles del Producto">
      {!data ? (
        <Loading />
      ) : (
        <Stack
          _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
          alignItems="flex-start"
          bg="white"
          justifyContent="flex-start"
          p="4"
          w="full"
        >
          <Stack
            _dark={{ bg: 'gray.600', color: 'whitesmoke' }}
            bg="blackAlpha.50"
            direction="row"
            justify="space-between"
            mb="2"
            p="2"
            rounded="md"
            shadow="xs"
            w="full"
          >
            <Stack direction="row" gap="10">
              <Box>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    colorScheme="brand"
                    defaultChecked={true}
                    id="email-alerts"
                    onChange={(e) => setEnabledFilter(e.target.checked)}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                    Mostar sólo productos habilitados
                  </FormLabel>
                </FormControl>
                {uniqueWarehouses.length > 0 && (
                  <FormControl alignItems="center" display="flex">
                    <Switch
                      colorScheme="brand"
                      defaultChecked={false}
                      id="email-alerts"
                      onChange={(e) => setStockFilter(e.target.checked)}
                    />
                    <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                      Mostar sólo stock positivo
                    </FormLabel>
                  </FormControl>
                )}
                {uniqueWarehouses.length === 0 && (
                  <FormControl alignItems="center" display="flex">
                    <Switch
                      colorScheme="brand"
                      defaultChecked={false}
                      id="email-alerts"
                      onChange={(e) => setStockFilterPosta(e.target.checked)}
                    />
                    <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                      Mostar sólo stock positivo
                    </FormLabel>
                  </FormControl>
                )}
                <FormControl alignItems="center" display="flex">
                  <Switch
                    colorScheme="brand"
                    defaultChecked={true}
                    id="email-alerts"
                    onChange={(e) => setPriceFilter(e.target.checked)}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                    Mostar sólo productos con precio
                  </FormLabel>
                </FormControl>
              </Box>
              <Box>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    colorScheme="brand"
                    defaultChecked={true}
                    id="email-alerts"
                    onChange={(e) => setShowBarCode(e.target.checked)}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                    Mostar Columna Código de Barra
                  </FormLabel>
                </FormControl>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    colorScheme="brand"
                    defaultChecked={true}
                    id="email-alerts"
                    onChange={(e) => setShowPrice(e.target.checked)}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                    Mostar Columna Precio
                  </FormLabel>
                </FormControl>
                <FormControl alignItems="center" display="flex">
                  <Switch
                    colorScheme="brand"
                    id="email-alerts"
                    isChecked={showPriceDate}
                    isDisabled={!showPrice}
                    onChange={(e) => setShowPriceDate(e.target.checked)}
                  />
                  <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                    Mostar Columna Fecha últ. precio
                  </FormLabel>
                </FormControl>
                {uniqueWarehouses.length > 0 && (
                  <FormControl alignItems="center" display="flex">
                    <Switch
                      colorScheme="brand"
                      defaultChecked={true}
                      id="email-alerts"
                      onChange={(e) => setShowWarehouses(e.target.checked)}
                    />
                    <FormLabel htmlFor="email-alerts" mb="0" ml="2">
                      Mostar Columnas Depósitos
                    </FormLabel>
                  </FormControl>
                )}
              </Box>
            </Stack>

            <Box>
              <Button
                colorScheme="linkedin"
                leftIcon={<ImPrinter />}
                size="sm"
                onClick={handlePrint}
              >
                Imprimir
              </Button>
            </Box>
          </Stack>
          <Stack
            ref={listPricesRef}
            _dark={{ bg: 'gray.600', color: 'whitesmoke' }}
            bg="white"
            mt="6"
            mx="auto"
            p="1"
            w="210mm"
          >
            <Text>Acá iría el membrete con las datos de la empresa, fecha, etc.</Text>
            {filteredProducts.map((priceList) => {
              const fede = priceList.filter((el) => el.price > 0);

              if (fede.length === 0 && priceFilter) return null;

              return (
                <Box key={nanoid()} mb="30mm">
                  <Heading size="lg" textAlign="center">
                    {priceList[0].pricelists.code}
                  </Heading>
                  <Heading mb="1" mx="1" size="sm" textAlign="center">
                    ({priceList[0].pricelists.description})
                  </Heading>

                  {uniqueCategories.map((cat) => {
                    const fede = priceList.filter((el) => el.products.category?.name === cat);
                    const fede2 = fede.filter((el) => el.price > 0);

                    if (fede.length === 0) return null;
                    if (fede2.length === 0 && priceFilter) return null;

                    return (
                      <Box key={nanoid()} mb="">
                        <Heading
                          _dark={{ color: 'whitesmoke' }}
                          color="black"
                          display="inline-block"
                          mb="1"
                          p="1"
                          size="xs"
                        >
                          {cat.toLocaleUpperCase()}
                        </Heading>
                        <TableContainer key={nanoid()} mb="4">
                          <Table colorScheme="gray" fontWeight="normal" size="sm">
                            <Thead bg="gray.700">
                              <Tr>
                                <Th color="whitesmoke" maxW="180px" minW="180px" p="1" w="180px">
                                  Nombre
                                </Th>
                                {showBarCode && (
                                  <Th color="whitesmoke" maxW="120px" minW="120px" p="1" w="120px">
                                    Cód. Barra
                                  </Th>
                                )}
                                {showPrice && (
                                  <Th color="whitesmoke" maxW="110px" minW="110px" p="1" w="110px">
                                    Precio
                                  </Th>
                                )}
                                <Th color="whitesmoke" maxW="75px" minW="75px" p="1" w="75px">
                                  Unidad
                                </Th>
                                {uniqueWarehouses.length > 0 && showWarehouses && (
                                  <>
                                    {uniqueWarehouses.map((el) => (
                                      <Th
                                        key={nanoid()}
                                        color="whitesmoke"
                                        maxW="100px"
                                        minW="100px"
                                        px="1"
                                        py="1"
                                        w="100px"
                                      >
                                        {el}
                                      </Th>
                                    ))}
                                    <Th
                                      key={nanoid()}
                                      color="whitesmoke"
                                      maxW="100px"
                                      minW="100px"
                                      px="1"
                                      py="1"
                                      w="100px"
                                    >
                                      Stock Total
                                    </Th>
                                  </>
                                )}
                                {showPriceDate && showPrice && (
                                  <Th color="whitesmoke" maxW="100px" minW="100px" p="1" w="100px">
                                    Últ. precio
                                  </Th>
                                )}
                              </Tr>
                            </Thead>
                            <Tbody>
                              {priceList.map((el) => {
                                if (
                                  (cat === el.products.category?.name && el.price > 0) ||
                                  (cat === el.products.category?.name && !priceFilter)
                                )
                                  return (
                                    <Tr key={nanoid()}>
                                      <Td px="1">{el.products.name}</Td>
                                      {showBarCode && <Td px="1">{el.products.barcode}</Td>}
                                      {showPrice && <Td px="1">{formatCurrency(el.price)}</Td>}
                                      <Td px="1">{el.products.unit?.code}</Td>
                                      {el.products.stocks?.length! > 0 && showWarehouses && (
                                        <>
                                          {el.products.stocks?.map((elx) => (
                                            <Td key={nanoid()} px="1">
                                              {elx.stock} {el.products.unit?.code}
                                            </Td>
                                          ))}
                                          <Td key={nanoid()} px="1">
                                            {el.totalStock} {el.products.unit?.code}
                                          </Td>
                                        </>
                                      )}
                                      {showPriceDate && showPrice && (
                                        <Td px="1">{formatDate(el.createdAt)}</Td>
                                      )}
                                    </Tr>
                                  );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      </Box>
                    );
                  })}
                </Box>
              );
            })}
          </Stack>
        </Stack>
      )}
    </DashBoard>
  );
};
