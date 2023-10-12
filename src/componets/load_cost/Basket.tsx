import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useQueryClient } from 'react-query';
import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { formatCurrency } from '../../utils';
import { useCreateCost } from '../../hooks';

import { useCostsContext } from './context';

export const Basket = () => {
  const { cart, emptyCart, removeItem, totalCartItems } = useCostsContext();

  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Costos actualizaos');
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['stocks', 'costs', 'discharges', 'transfers'] });
  };

  const { mutate } = useCreateCost(onSuccess);
  const handleSubmit = useCallback(() => {
    const newCosts = {
      cart: cart.map((item) => ({
        productId: item.productId,
        price: item.cost,
      })),
    };

    mutate(newCosts);
  }, [cart, mutate]);

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

  if (cart.length === 0) return null;

  return (
    <Stack bg="white" border="1px solid whitesmoke" mt="4" p="4" rounded="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="410px" overflowY="auto">
        {cart.map((item) => {
          return (
            <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
              <Box>
                <Text fontWeight="bold">{item.products.name}</Text>
                <Text>Nuevo Costo: {formatCurrency(item.cost)}</Text>
                <Text textDecoration="underline" />
              </Box>
              <Box position="absolute" right={0} top={'50%'}>
                <Button
                  colorScheme="red"
                  fontSize={14}
                  pr="2"
                  variant="link"
                  onClick={() => removeItem(item.productId)}
                >
                  Quitar
                </Button>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Divider />
      <Text fontFamily="mono" fontSize="xl" fontWeight="normal" textAlign="right">
        productos: ({totalCartItems})
      </Text>
      <Button colorScheme="brand" variant="solid" w="full" onClick={handleSubmit}>
        ACTUALIZAR COSTOS
      </Button>
    </Stack>
  );
};
