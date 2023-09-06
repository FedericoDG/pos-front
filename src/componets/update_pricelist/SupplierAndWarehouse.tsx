import { ArrowForwardIcon } from '@chakra-ui/icons';
import { Box, Stack, Alert, AlertIcon, FormLabel, Button } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useGetPriceLists } from '../../hooks';
import { Loading } from '../common';

import { SelectedPriceList, useUpdatePriceContext } from '.';

export const SupplierAndWarehouse = () => {
  const { data: priceLists } = useGetPriceLists();

  const [mappedPriceLists, setMappedPriceLists] = useState<SelectedPriceList[]>([]);

  const { goToNext, priceList, setPriceList, setActiveStep } = useUpdatePriceContext();

  let [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!priceLists) return;

    const mappedPriceLists = priceLists.map((el) => ({ ...el, value: el.id, label: el.code }));

    setMappedPriceLists(mappedPriceLists);
  }, [priceLists]);

  useEffect(() => {
    if (!id || mappedPriceLists.length < 1) return;

    const pl = mappedPriceLists.find((el) => el.id === Number(id));

    setPriceList(pl!);

    setActiveStep(2);

    setMappedPriceLists(mappedPriceLists);
  }, [goToNext, id, mappedPriceLists, priceList, searchParams, setActiveStep, setPriceList]);

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return goToNext();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [goToNext]);

  if (!priceLists) return <Loading />;

  return (
    <Stack bg="white" mb="4" p="4" rounded="md" shadow="md" w="full">
      <Stack direction="row" justify="flex-end">
        <Button
          colorScheme="brand"
          isDisabled={!priceList?.value}
          minW="150px"
          ml="auto"
          rightIcon={<ArrowForwardIcon />}
          size="lg"
          tabIndex={5}
          onClick={() => goToNext()}
        >
          SIGUIENTE
        </Button>
      </Stack>
      <Box w="full">
        <Alert status="info">
          <AlertIcon />
          Seleccione la Lista de Precio.
        </Alert>
      </Box>
      <Stack direction="row" flexWrap="wrap" justifyContent="space-between">
        <Box w="49%">
          <FormLabel htmlFor="priceList">Lista de Precio:</FormLabel>
          <Select
            autoFocus
            isClearable
            isSearchable
            colorScheme="brand"
            id="priceList"
            options={mappedPriceLists}
            placeholder="Seleccionar Lista de Precio"
            selectedOptionColorScheme="brand"
            tabIndex={1}
            // value={priceList}
            onChange={(e) => setPriceList(e)}
          />
        </Box>
      </Stack>
    </Stack>
  );
};
