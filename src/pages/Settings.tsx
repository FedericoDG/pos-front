import { Flex, Box } from '@chakra-ui/react';

import { DashBoard, Loading } from '../componets/common';
import { useGetSettings } from '../hooks';
import { Form } from '../componets/settings';
import { useMyContext } from '../context';

export const Settings = () => {
  const {
    user: { id },
  } = useMyContext();

  const { data: settings, isFetching: isFetchingSettings } = useGetSettings(Number(id));

  const isIndeterminate = isFetchingSettings;

  return (
    <DashBoard isIndeterminate={isIndeterminate} title="Parámetros del sitio">
      {!settings ? (
        <Loading />
      ) : (
        <Flex bg="white" maxW="1024px" py="4" rounded="md" shadow="md" w="full">
          <Box w="full">
            <Form settings={settings} />
          </Box>
        </Flex>
      )}
    </DashBoard>
  );
};
