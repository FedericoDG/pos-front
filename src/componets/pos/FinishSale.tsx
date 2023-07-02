import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { usePosContext } from '.';

export const FinishSale = () => {
  const {
    cart,
    client,
    emptyCart,
    setActiveStep,
    setClient,
    setWarehouse,
    warehouse,
    setPriceList,
  } = usePosContext();

  const queryClient = useQueryClient();

  const handleSubmit = () => {
    const sale = {
      clientId: client?.id!,
      warehouseId: warehouse?.id!,
      cart: cart.map((item) => ({
        productId: item.id!,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    //mutate(sale);
  };

  const onSuccess = () => {
    toast.info('Compra cargada', {
      theme: 'colored',
      position: toast.POSITION.BOTTOM_CENTER,
      autoClose: 3000,
      closeOnClick: true,
    });
    emptyCart();
    queryClient.invalidateQueries({ queryKey: ['products'] });
    setPriceList(null);
    setWarehouse(null);
    setClient(null);
    setActiveStep(1);
  };

  // const { mutate } = useCreatePurchase(onSuccess);

  return (
    <div>
      <p>CLIENTE: {client?.id}</p>
      <p>DEPÓSITO: {warehouse?.id}</p>
      <p>CARRITO:</p>
      <pre>{JSON.stringify(cart, null, 2)}</pre>
    </div>
  );
};
