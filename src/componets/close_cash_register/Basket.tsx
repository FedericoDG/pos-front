import { Box, Heading, Stack, Text, Button, Divider } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { ArrowForwardIcon } from '@chakra-ui/icons';

import { formatCurrency } from '../../utils';

import { useDischargesContext } from './context';

export const Basket = () => {
  const { cart, removeItem, totalCart, totalCartItems, goToNext } = useDischargesContext();

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

  return (
    <Stack bg="white" p="4" rounded="md" shadow="md" w="35%">
      <Heading color="brand.500" fontSize="28" textAlign="center">
        Productos Faltantes
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
                <Text>precio: {formatCurrency(item.cost)}</Text>
                <Text textDecoration="underline">
                  subtotal: {formatCurrency(item.cost * item.quantity)}
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
      <Text fontFamily="mono" fontSize="xl" fontWeight="bold" textAlign="right">
        {formatCurrency(totalCart)}
      </Text>
      <Text fontFamily="mono" fontSize="xl" fontWeight="normal" textAlign="right">
        productos: ({totalCartItems})
      </Text>
      <Button
        colorScheme="brand"
        rightIcon={<ArrowForwardIcon />}
        size="lg"
        onClick={() => goToNext()}
      >
        SIGUIENTE
      </Button>
      {/*  <Button
        colorScheme="brand"
        rightIcon={<ArrowForwardIcon />}
        onClick={() => goToNext()}
      >
        SIGUIENTE
      </Button> */}
    </Stack>
  );
};
