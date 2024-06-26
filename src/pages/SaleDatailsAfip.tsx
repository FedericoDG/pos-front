import { useParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { useGetCashMovement, useGetSettings } from '../hooks';
import { A, B, C } from '../componets/afip';

export const SaleDetailsAfip = () => {
  const { id } = useParams();

  const { data: cashMovement, isLoading: isLoadingCashMovement } = useGetCashMovement(Number(id!));
  const { data: settings, isLoading: isLoadingSettings } = useGetSettings(1);

  return (
    <DashBoard
      isIndeterminate={isLoadingCashMovement || isLoadingSettings}
      title="Comprobante AFIP"
    >
      {!cashMovement || !settings ? (
        <Loading />
      ) : cashMovement.cbteTipo === 1 ||
        cashMovement.cbteTipo === 3 ||
        cashMovement.cbteTipo === 51 ||
        cashMovement.cbteTipo === 53 ? (
        <A cashMovement={cashMovement} settings={settings} />
      ) : cashMovement.cbteTipo === 6 || cashMovement.cbteTipo === 8 ? (
        <B cashMovement={cashMovement} settings={settings} />
      ) : (
        <C cashMovement={cashMovement} settings={settings} />
      )}
    </DashBoard>
  );
};
