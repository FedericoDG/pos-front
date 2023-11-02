import { Flex, Tab, TabList, TabPanel, TabPanels, Tabs, useDisclosure } from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { Drawer, DrawerCost, DrawerDischarge, General, Stock } from '../componets/product_details/';
import { Discharge, Price } from '../interfaces';
import { useGetProduct, useGetReasons, useGetWarehousesWOStock } from '../hooks';
import { useGetPriceLists } from '../hooks/';

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

  const { id } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();

  const { data: product, isFetching: isFetchingProduct } = useGetProduct(Number(id));
  const { data: priceList, isFetching: isFetchingPriceLists } = useGetPriceLists();
  const { data: warehouses, isFetching: isFetchingWarehouses } = useGetWarehousesWOStock();
  const { data: reasons, isFetching: isFetchingReasons } = useGetReasons();

  const isIndeterminate =
    isFetchingProduct || isFetchingPriceLists || isFetchingWarehouses || isFetchingReasons;

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
          <Tabs bg="white" defaultIndex={Number(searchParams.get('tab'))} variant="line" w="full">
            <TabList>
              <Tab onClick={() => setSearchParams('tab=0')}>General</Tab>
              <Tab onClick={() => setSearchParams('tab=1')}>
                Evolución del Stock - {product.name}
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <General product={product} onOpen={onOpen} onOpen2={onOpen2} onOpen3={onOpen3} />
              </TabPanel>
              <TabPanel>
                <Stock product={product} warehouses={warehouses} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          <DrawerDischarge
            initialValues={initialValues2}
            isOpen={isOpen2 || !!searchParams.get('discharge')}
            reasons={reasons}
            resetValues={resetValues2}
            setinitialValues={setinitialValues2}
            warehouses={warehouses}
            onClose={onClose2}
          />
          <Drawer
            initialValues={initialValues}
            isOpen={isOpen || !!searchParams.get('price')}
            priceList={priceList}
            prices={product?.prices!}
            resetValues={resetValues}
            setinitialValues={setinitialValues}
            onClose={onClose}
          />
          <DrawerCost
            initialValues={initialValues3}
            isOpen={isOpen3 || !!searchParams.get('cost')}
            resetValues={resetValues3}
            setinitialValues={setinitialValues3}
            onClose={onClose3}
          />
        </Flex>
      )}
    </DashBoard>
  );
};
