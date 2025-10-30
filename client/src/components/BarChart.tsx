import { Bar } from 'react-chartjs-2';
import type { ChartOptions } from 'chart.js';

type BarChartProps = {
  sessions: { game: string; totalMinutes: number }[];
  colors: string[];
};

export default function BarChart({ sessions, colors }: BarChartProps) {
  const data = {
    labels: sessions.map((s) => s.game),
    datasets: [
      {
        label: 'Total Minutes Played',
        data: sessions.map((s) => s.totalMinutes),
        backgroundColor: sessions.map((_, idx) => colors[idx % colors.length]),
        borderRadius: 8,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Total Playtime per Game',
        color: '#f15bb5',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#888' },
      },
      y: {
        ticks: { color: '#888' },
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
}
