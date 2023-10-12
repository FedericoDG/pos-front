import {
  Button,
  HStack,
  Stack,
  TableContainer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useCallback, useEffect } from 'react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { formatCurrency } from '../../utils';
import { useCreatePriceManyPercentage } from '../../hooks';

import { useUpdatePriceContext } from '.';

export const FinishSale = () => {
  const { cart, goToPrevious, priceList, setPriceList, emptyCart, setActiveStep } =
    useUpdatePriceContext();

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const onSucces = () => {
    toast.success('Precios actualizados');
    queryClient.invalidateQueries({ queryKey: ['products', 'pricelists'] });
    setPriceList(null);
    emptyCart();
    setActiveStep(1);
    navigate('/panel/lista-de-precios/actualizar-porcentaje/');
  };

  const { mutateAsync } = useCreatePriceManyPercentage(onSucces);

  const handleSubmit = useCallback(() => {
    const mappedCart = cart.map((product) => ({
      pricelistId: priceList?.id!,
      productId: product.id!,
      price: Number(product.newPrice.toFixed(2)),
    }));

    mutateAsync({ cart: mappedCart });
  }, [cart, mutateAsync, priceList?.id]);

  const onReset = () => {
    setPriceList(null);
    emptyCart();
    navigate('/panel/lista-de-precios/actualizar-porcentaje/');
    setActiveStep(1);
  };

  useEffect(() => {
    const handleUserKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F9') {
        return handleSubmit();
      }
    };

    window.addEventListener('keydown', handleUserKeyPress);

    return () => {
      window.removeEventListener('keydown', handleUserKeyPress);
    };
  }, [handleSubmit]);

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md">
      <Button
        colorScheme="brand"
        leftIcon={<ArrowBackIcon />}
        mb={2}
        minW="150px"
        mr="auto"
        size="lg"
        onClick={() => goToPrevious()}
      >
        VOLVER
      </Button>
      <TableContainer borderWidth={1} padding={2} rounded="md">
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Producto</Th>
              <Th isNumeric>Precio Anterior</Th>
              <Th isNumeric>Precio Actualizado</Th>
            </Tr>
          </Thead>
          <Tbody>
            {cart.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td isNumeric color="gray.600">
                  {formatCurrency(product.price)}
                </Td>
                <Td isNumeric fontWeight={600}>
                  {formatCurrency(product.newPrice)}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <HStack mt={4}>
        <Button w="full" onClick={onReset}>
          CANCELAR
        </Button>
        <Button colorScheme="brand" w="full" onClick={handleSubmit}>
          ACTUALIZAR PRECIOS
        </Button>
      </HStack>
    </Stack>
  );
};
