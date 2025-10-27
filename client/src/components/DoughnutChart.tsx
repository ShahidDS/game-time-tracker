import { Doughnut } from 'react-chartjs-2';

type DoughnutChartProps = {
  sessions: { game: { name: string }; minutesPlayed: number }[];
  colors: string[];
};

export default function DoughnutChart({
  sessions,
  colors,
}: DoughnutChartProps) {

  const data = {
    labels: sessions.map((s) => s.game.name),
    datasets: [
      {
        label: 'Minutes Played',
        data: sessions.map((s) => s.minutesPlayed),
        backgroundColor: sessions.map((_, idx) => colors[idx % colors.length]),
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    cutout: '45%',
    plugins: {
      legend: { position: 'bottom' as const, labels: { color: '#888' } },
      title: {
        display: true,
        text: 'Minutes Played per Session',
        color: '#f15bb5',
        font: { size: 16, weight: 'bold' as const },
      },
      tooltip: {
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `${context.label}: ${context.raw} min`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}
