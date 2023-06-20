import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { AppProvider } from './context';
import { AppRouter } from './router';
import theme from './theme';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <AppProvider>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider resetCSS theme={theme}>
          <AppRouter />
        </ChakraProvider>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-left" />
      </QueryClientProvider>
      <ToastContainer />
    </AppProvider>
  );
};

export default App;
