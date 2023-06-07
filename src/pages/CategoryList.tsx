import { Text } from '@chakra-ui/react';

import { DashBoard } from '../componets/common';
import { Loading } from '../componets/common/Loading';
import { useGetUnits } from '../hooks/useUnits';

export const CategoryList = () => {
  const { data: units, isFetching } = useGetUnits();

  return (
    <DashBoard isIndeterminate={isFetching} title="Categorías">
      {isFetching ? <Loading /> : <Text>Listar Categorías</Text>}
    </DashBoard>
  );
};
