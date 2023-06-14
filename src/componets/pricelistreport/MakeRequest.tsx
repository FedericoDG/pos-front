import { Stack, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { usePriceListContext } from '.';

export const MakeRequest = () => {
  const { productList, priceListsList, warehousesList } = usePriceListContext();

  const navigate = useNavigate();

  return (
    <Stack
      _dark={{ bg: 'gray.700', color: 'whitesmoke' }}
      bg="white"
      justifyContent="center"
      p="5"
      rounded="md"
      shadow="md"
      w="full"
    >
      <Button
        colorScheme="brand"
        mx="auto"
        size="lg"
        variant="solid"
        onClick={() =>
          navigate(
            `/panel/lista-de-precios/reporte?products=${JSON.stringify(
              productList
            )}&pricelists=${JSON.stringify(priceListsList)}&warehouses=${JSON.stringify(
              warehousesList
            )}`
          )
        }
      >
        Generar Reporte / Imprimir
      </Button>
    </Stack>
  );
};
