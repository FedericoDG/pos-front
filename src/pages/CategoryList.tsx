import { Text } from '@chakra-ui/react';

import { DashBoard } from '../componets';
import { useGetUnits } from '../hooks/useUnits';
import { Loading } from '../componets/Loading';

export const CategoryList = () => {
  const { data: units, isFetching } = useGetUnits();

  return (
    <DashBoard isIndeterminate={isFetching} title="Categorías">
      {isFetching ? <Loading /> : <Text>Listar Categorías</Text>}
    </DashBoard>
  );
};
