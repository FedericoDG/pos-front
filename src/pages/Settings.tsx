import { Flex, Box } from '@chakra-ui/react';

import { DashBoard, Loading } from '../componets/common';
import { useGetAfip, useGetSettings } from '../hooks';
import { Form } from '../componets/settings';
import { useMyContext } from '../context';

export const Settings = () => {
  const {
    user: { id },
  } = useMyContext();

  const { data: afip, isFetching: isFetchingAfip } = useGetAfip();
  const { data: settings, isFetching: isFetchingSettings } = useGetSettings(Number(id));

  const isIndeterminate = isFetchingAfip || isFetchingSettings;

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Parámetros del sitio">
      {!afip || !settings ? (
        <Loading />
      ) : (
        <Flex bg="white" maxW="1024px" py="4" rounded="md" shadow="md" w="full">
          <Box w="full">
            <Form afip={afip} settings={settings} />
          </Box>
        </Flex>
      )}
    </DashBoard>
  );
};
