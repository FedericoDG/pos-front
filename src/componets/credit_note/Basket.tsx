import { Box, Heading, Stack, Text, Button, Divider, Icon } from '@chakra-ui/react';
import { nanoid } from 'nanoid';
import { useEffect } from 'react';
import { MdOutlineRemoveShoppingCart } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import { formatCurrency } from '../../utils';
import { CashMovement } from '../../interfaces/interfaces';
import { CreditNote, useCreateAfipCreditNote, useCreateAfipCreditNoteX } from '../../hooks';

import { usePosContext } from './context';

interface Props {
  cashMovement: CashMovement;
}

export const Basket = ({ cashMovement }: Props) => {
  const { cart, removeItem, totalCart, totalCartItems, goToNext, addItem } = usePosContext();

  const navigate = useNavigate();

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

  const onSuccessAfip = (res: any) => {
    if (cashMovement.iva) {
      navigate(`/panel/caja/detalles/venta/afip/${res.body.cashMovement.id}`, { replace: true });
      toast.success('Nota de Crédito Creada', {
        action: {
          label: 'Ver',
          onClick: () => navigate(`/panel/caja/detalles/${res.body.cashMovement.cashRegisterId}`),
        },
      });
    } else {
      navigate(`/panel/caja/detalles/venta/${res.body.cashMovement.id}`, { replace: true });
      toast.success('Nota de Crédito Creada', {
        action: {
          label: 'Ver',
          onClick: () => navigate(`/panel/caja/detalles/${res.body.cashMovement.cashRegisterId}`),
        },
      });
    }
  };

  const onErrorAfip = (error: any) => {
    toast.error(error.response.data.body.message);
  };

  const { mutateAsync, isLoading } = useCreateAfipCreditNote(onSuccessAfip, onErrorAfip);
  const { mutateAsync: mutateAsyncX } = useCreateAfipCreditNoteX(onSuccessAfip, onErrorAfip);

  function applyDiscount(cart: any, discount: number) {
    // Calcular el total actual del carrito sin descuento
    const totalOriginal = cart.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );

    // Asignar descuento prorrateado a cada producto
    const cartWithDiscount = cart.map((item: any) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = (itemTotal / totalOriginal) * discount;
      const priceAfterDiscount = item.price - itemDiscount / item.quantity;

      return {
        ...item,
        discountedPrice: parseFloat(priceAfterDiscount.toFixed(2)),
      };
    });

    return cartWithDiscount;
  }

  function applySurcharge(cart: any, surcharge: any) {
    // Calcular el total actual del carrito sin recargo
    const totalOriginal = cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);

    // Asignar recargo prorrateado a cada producto
    const cartWithSurcharge = cart.map((item: any) => {
      const itemTotal = item.price * item.quantity;
      const itemSurcharge = (itemTotal / totalOriginal) * surcharge;
      const priceAfterSurcharge = item.price + itemSurcharge / item.quantity;

      return {
        ...item,
        surchargedPrice: parseFloat(priceAfterSurcharge.toFixed(2)),
      };
    });

    return cartWithSurcharge;
  }

  const handleSubmit = () => {
    const sale = {} as CreditNote;

    const isCurrentAccount = cashMovement.paymentMethodDetails?.some(
      (el) => el.paymentMethod.code === 'Cuenta Corriente'
    );

    sale.cart = cart.map((item) => ({
      productId: item.productId!,
      quantity: Number(item.quantity),
      price: Number(item.price),
      tax: Number(item.tax),
      totalDiscount: Number(item.totalDiscount),
      totalIVA: Number(item.totalIVA),
    }));

    if (cashMovement.discount > 0) {
      console.log('TIENEDESCUENTO GENERAL');
      sale.cart = applyDiscount(sale.cart, cashMovement.discount);
    } else if (cashMovement.recharge > 0) {
      console.log('TIENE RECARGO GENERAL');
      sale.cart = applySurcharge(sale.cart, cashMovement.recharge);
    }

    sale.cashMovementId = cashMovement.id!;
    sale.clientId = cashMovement.clientId;
    sale.warehouseId = cashMovement.warehouseId;
    sale.discount = cashMovement.discount;
    sale.recharge = cashMovement.recharge;
    sale.payments = cashMovement.paymentMethodDetails!.map((item) => ({
      amount: item.amount,
      paymentMethodId: item.paymentMethodId,
    }));

    sale.info = '';
    sale.invoceTypeId = cashMovement.invoceIdAfip!;
    sale.invoceNumber = cashMovement.invoceNumberAfip!;
    sale.isCurrentAccount = isCurrentAccount!;

    if (cashMovement.iva) {
      mutateAsync(sale);
    } else {
      mutateAsyncX(sale);
    }
  };

  return (
    <Stack
      bg="white"
      border="1px solid whitesmoke"
      justifyContent="center"
      pb="4"
      px="4"
      rounded="md"
      w="35%"
    >
      {cart.length > 0 ? (
        <Stack w="full">
          <Heading color="brand.500" fontSize="28" pt="2" textAlign="center">
            LISTA DE PRODUCTOS
          </Heading>
          <Stack maxH="448px" overflowY="auto">
            {cart.map((item) => {
              return (
                <Stack key={nanoid()} fontFamily="mono" fontSize={14} position="relative" py="1">
                  <Box px="2">
                    <Stack
                      alignItems="center"
                      bg={'brand.700'}
                      direction="row"
                      justifyContent="space-between"
                      px="2"
                    />
                    <Text px="2">
                      cantidad: {item.quantity} {item.product?.unit?.code}
                    </Text>
                    <Text px="2">precio: {formatCurrency(item.price)}</Text>
                    <Text px="2">
                      iva: {formatCurrency(item.totalIVA)} ({item.tax * 100}
                      %)
                    </Text>
                    <Text px="2" textDecoration="underline">
                      subtotal:{' '}
                      {formatCurrency(
                        item.price * item.quantity - item.totalDiscount + item.totalIVA
                      )}
                    </Text>
                  </Box>
                  <Box position="absolute" right={0} top={'50%'}>
                    <Button
                      colorScheme="red"
                      fontSize={14}
                      leftIcon={<ImCancelCircle />}
                      pr="3"
                      size={'xs'}
                      variant="ghost"
                      onClick={() => removeItem(item.id!)}
                    >
                      QUITAR
                    </Button>
                  </Box>
                </Stack>
              );
            })}
          </Stack>
          <Divider />
          <Stack alignItems="center" direction="row" justifyContent="flex-end" w="full">
            <Text textAlign="right" w="60%">
              SubTotal:
            </Text>
            <Text fontFamily="mono" fontSize="xl" px="2" textAlign="right">
              {formatCurrency(totalCart)}
            </Text>
          </Stack>
          {Number(cashMovement.discount) > 0 && (
            <Stack alignItems="center" direction="row" justifyContent="flex-end" w="full">
              <Text textAlign="right" w="60%">
                Descuento:
              </Text>
              <Text fontFamily="mono" fontSize="xl" px="2" textAlign="right">
                {formatCurrency(cashMovement.discount * -1)}
              </Text>
            </Stack>
          )}
          {Number(cashMovement.recharge) > 0 && (
            <Stack alignItems="center" direction="row" justifyContent="flex-end" w="full">
              <Text textAlign="right" w="60%">
                Recargo:
              </Text>
              <Text fontFamily="mono" fontSize="xl" px="2" textAlign="right">
                {formatCurrency(cashMovement.recharge)}
              </Text>
            </Stack>
          )}
          <Divider />
          <Stack alignItems="center" direction="row" justifyContent="flex-end" w="full">
            <Text fontSize="xl" textAlign="right" w="60%">
              TOTAL:
            </Text>
            <Text fontFamily="mono" fontSize="xl" fontWeight="bold" px="2" textAlign="right">
              {formatCurrency(totalCart - cashMovement.discount + cashMovement.recharge)}
            </Text>
          </Stack>

          <Text fontFamily="mono" fontSize="xl" fontWeight="normal" px="2" textAlign="right">
            productos: ({totalCartItems})
          </Text>
          <Stack p="2">
            <Button
              colorScheme="brand"
              isDisabled={isLoading}
              isLoading={isLoading}
              loadingText="CREANDO NOTA DE CRÉDITO"
              size="lg"
              variant="solid"
              w="full"
              onClick={handleSubmit}
            >
              CREAR NOTA DE CRÉDITO
            </Button>
          </Stack>
        </Stack>
      ) : (
        <Stack alignItems={'center'} display={'flex'} justifyContent={'center'}>
          <Heading color="gray.300" fontSize="28" pt="2" textAlign="center">
            LISTA VACÍA
          </Heading>
          <Icon as={MdOutlineRemoveShoppingCart} boxSize={240} color="gray.300" />
          <Heading color="gray.300" fontSize="24" pt="2" textAlign="center">
            AGREGUE PRODUCTOS
          </Heading>
          <Button
            colorScheme="brand"
            onClick={() => {
              cashMovement.cashMovementDetails?.forEach((detail) =>
                addItem({
                  ...detail,
                  quantity: detail.quantity,
                  price: detail.price - detail.totalDiscount / detail.quantity,
                })
              );
            }}
          >
            AGREGAR TODOS
          </Button>
        </Stack>
      )}
    </Stack>
  );
};
