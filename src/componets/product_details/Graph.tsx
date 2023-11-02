import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { FormControl, FormLabel, Stack, Switch } from '@chakra-ui/react';
import { useState } from 'react';

import { Product } from '../../interfaces';
import { formatDateShortYear } from '../../utils';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const Graph = ({ stock, product }: { stock: any; product: Product; }) => {
  const [showChart, setShowChart] = useState(false);

  const options = {
    elements: {
      line: {
        tension: 0.2,
      },
    },
    radius: 2,
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
          text: product.unit?.name,
        },
      },
      x: {
        title: {
          display: false,
          text: 'fecha',
        },
        ticks: {
          font: {
            size: 9,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${product.name.toUpperCase()} (últimos 90 movimientos)`,
      },
    },
  };

  /* const ran = () => {
    const stock: number[] = [];

    for (let i = 0; i < 500; i++) {
      const r = Math.floor(Math.random() * 100);

      stock.push(r);
    }

    return stock;
  };

  let labels: string[] = new Array(500).fill('29/08/23');
  let dataSet = ran();

  if (labels.length > 90) {
    labels = new Array(90).fill('29/08/23');
    dataSet = ran().slice(0, 90);
  } */

  let labels = stock.toReversed().map((el: any) => formatDateShortYear(el.createdAt));
  let dataSet = stock.toReversed().map((el: any) => el.stock);

  if (labels.length > 100) {
    labels = stock
      .map((el: any) => formatDateShortYear(el.createdAt))
      .slice(0, 5)
      .toReversed();

    dataSet = stock
      .map((el: any) => el.stock)
      .slice(0, 5)
      .toReversed();
  }

  const data = {
    labels,
    datasets: [
      {
        label: product.unit?.code,
        data: dataSet,
        borderColor: '#6b6b6b',
        backgroundColor: '#000000',
        fill: true,
      },
    ],
  };

  return (
    <Stack>
      <FormControl
        alignItems="center"
        className="no-print"
        display="flex"
        justifyContent="flex-end"
      >
        <FormLabel htmlFor="filter" mb="0" ml="2">
          Mostrar gráfico
        </FormLabel>
        <Switch
          id="filter"
          isChecked={showChart}
          onChange={(e) => setShowChart(e.target.checked)}
        />
      </FormControl>
      {showChart && <Line data={data} options={options} />}
    </Stack>
  );
};
