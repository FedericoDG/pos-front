import { Button } from '@chakra-ui/react';

import { usePurchasesContext } from '.';

export const Pantalla = ({ text }: { text: string; }) => {
  const { goToNext } = usePurchasesContext();

  return (
    <div>
      <Button onClick={() => goToNext()}>Goto Next</Button>
      <p>{text}</p>
    </div>
  );
};
