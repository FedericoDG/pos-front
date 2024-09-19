import { DashBoard, Loading } from '../componets/common';
import { CurrentAccountProvider } from '../componets/current_account/context';
import { useGetCurrentAccountResume } from '../hooks';
import { SheetResume } from '../componets/current_account';

export const CurrentAccountResume = () => {
  const { data, isLoading } = useGetCurrentAccountResume();

  return (
    <CurrentAccountProvider>
      <DashBoard isIndeterminate={false} title="Cuenta Corriente - Resumen Clientes">
        {!data || isLoading ? <Loading /> : <SheetResume currentAccount={data.currentAccount} />}
      </DashBoard>
    </CurrentAccountProvider>
  );
};
