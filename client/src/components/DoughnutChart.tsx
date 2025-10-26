import { Doughnut } from 'react-chartjs-2';

type DoughnutChartProps = {
  sessions: { game: string; totalMinutes: number }[];
  colors: string[];
};

export default function DoughnutChart({
  sessions,
  colors,
}: DoughnutChartProps) {
  const total = sessions.reduce((sum, s) => sum + s.totalMinutes, 0);

  const data = {
    labels: sessions.map((s) => s.game),
    datasets: [
      {
        label: 'Percentage of Total Minutes Played',
        data: sessions.map((s) =>
          Number(((s.totalMinutes / total) * 100).toFixed(2))
        ),
        backgroundColor: sessions.map((_, idx) => colors[idx % colors.length]),
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    cutout: '45%', 
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#888',
        },
      },
      title: {
        display: true,
        text: 'Percentage of Total Playtime per Game',
        color: '#f15bb5',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `${context.label}: ${context.raw}%`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
