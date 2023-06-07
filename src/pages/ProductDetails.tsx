import { useParams } from 'react-router-dom';

import { DashBoard } from '../componets/common';
import { useGetProduct } from '../hooks';

export const ProductDetails = () => {
  const isIndeterminate = true;

  const { id } = useParams();

  const { data: product, isFetching } = useGetProduct(Number(id));

  return (
    <DashBoard isIndeterminate={isFetching} title="Detalles del Producto">
      <div>ProductDetails: {id}</div>
    </DashBoard>
  );
};
