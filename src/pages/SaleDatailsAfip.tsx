import { useParams } from 'react-router-dom';

import { DashBoard, Loading } from '../componets/common';
import { useGetCashMovement, useGetSettings } from '../hooks';
import { A, B } from '../componets/afip';

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
      ) : cashMovement.cbteTipo === 1 ? (
        <A cashMovement={cashMovement} settings={settings} />
      ) : (
        <B cashMovement={cashMovement} settings={settings} />
      )}
    </DashBoard>
  );
};
