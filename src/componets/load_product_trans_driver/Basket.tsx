import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useQueryClient } from 'react-query';
import { useCallback, useEffect } from 'react';
import { toast } from 'sonner';

import { useCreateTransfer } from '../../hooks';

import { useProductTransContext } from './context';

export const Basket = () => {
  const {
    cart,
    emptyCart,
    removeItem,
    setActiveStep,
    setWarehouse,
    setWarehouse2,
    totalCartItems,
    warehouse,
    warehouse2,
  } = useProductTransContext();
  const queryClient = useQueryClient();

  const onSuccess = () => {
    toast.success('Transferencia de stock realizada');
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['stocks'] });
    setWarehouse(null);
    setWarehouse2(null);
    setActiveStep(1);
  };

  const { mutate, isLoading } = useCreateTransfer(onSuccess);

  const handleSubmit = useCallback(() => {
    const transfers = {
      warehouseOriginId: warehouse?.id!,
      warehouseDestinationId: warehouse2?.id!,
      cart: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    mutate(transfers);
  }, [cart, mutate, warehouse?.id, warehouse2?.id]);

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
    <Stack bg="white" p="4" rounded="md" shadow="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Lista de Productos
      </Heading>
      <Stack maxH="410px" overflowY="auto">
        {cart.map((item) => {
          return (
            <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
              <Box>
                <Text fontWeight="bold">{item.products.name}</Text>
                <Text>
                  cantidad: {item.quantity} {item.products.unit?.code}
                </Text>
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
      <Button
        colorScheme="brand"
        isDisabled={isLoading}
        isLoading={isLoading}
        loadingText="TRANSFIRIENDO STOCK"
        variant="solid"
        w="full"
        onClick={handleSubmit}
      >
        TRANSFERIR STOCK
      </Button>
    </Stack>
  );
};
