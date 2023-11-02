/* eslint-disable prettier/prettier */
import { MinusIcon, TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';

export const EvoIcon = ({ el }: { el: any; }) => {
  return (
    <div style={{ marginLeft: '8px' }}>
      {el.movement.concept === 'Compra' ||
        el.movement.concept === 'N. de Crédito' ||
        el.movement.type === 'TRANSFER_IN' ? (
        <TriangleUpIcon color="green" />
      ) : el.movement.concept !== 'Creación' ? (
        <TriangleDownIcon color="red" />
      ) : (
        <MinusIcon />
      )}
    </div>
  );
};
