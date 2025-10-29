import { Scatter } from "react-chartjs-2";
import "chart.js/auto";

interface UserWeeklyStat {
  userId: number;
  username: string;
  numOfSessionsPerWeek: number;
  averageSessionLengthPerWeek: number;
  isCurrentUser: boolean;
}

interface Props {
  weeklyStats: UserWeeklyStat[];
  color?: string;
  height?: number | string;
}

export default function ScatterChart({
  weeklyStats,
  color = "#f15bb5",
  height = 360,
}: Props) {
  const labels = weeklyStats.map((s) => s.username);
  const dataPoints = weeklyStats.map((s) => ({
    x: s.numOfSessionsPerWeek,
    y: Math.ceil(s.averageSessionLengthPerWeek / 60), // convert seconds → minutes and round up
    label: s.username,
  }));

  const backgroundColors = weeklyStats.map((s) =>
    s.isCurrentUser ? color : "rgba(255,255,255,0)"
  );
  const borderColors = weeklyStats.map(() => color);
  const radii = weeklyStats.map((s) => (s.isCurrentUser ? 10 : 7));
  const borderWidths = weeklyStats.map((s) => (s.isCurrentUser ? 2.5 : 2));

  const data = {
    labels,
    datasets: [
      {
        label: "(numOfSessions, avgSessionLength)",
        data: dataPoints,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        pointRadius: radii.map((r) => r / 2),
        pointBorderWidth: borderWidths,
        pointHoverRadius: radii.map((r) => r / 2 + 1),
        pointStyle: "circle" as const,
      },
    ],
  };

  // dynamic axis ranges with padding
  const maxX =
    Math.max(...weeklyStats.map((d) => d.numOfSessionsPerWeek || 0), 0) + 2;
  const maxY =
    Math.max(
      ...weeklyStats.map(
        (d) => Math.ceil(d.averageSessionLengthPerWeek / 60) || 0
      ),
      0
    ) + 2;

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        title: { display: true, text: "Number of Sessions" },
        beginAtZero: true,
        offset: true,
        min: 0,
        suggestedMax: maxX,
        ticks: {
          stepSize: 1,
          callback: (value: number | string) => Number(value).toFixed(0),
        },
        grid: {
          drawBorder: false,
          color: "rgba(200,200,200,0.2)",
        },
      },
      y: {
        title: { display: true, text: "Average session time (minutes)" },
        beginAtZero: true,
        suggestedMax: maxY,
        ticks: {
          stepSize: Math.ceil(maxY / 5), // keeps ~5 grid lines max
          callback: (value: number | string) => Number(value).toFixed(0),
        },
        grid: {
          drawBorder: false,
          color: "rgba(200,200,200,0.2)",
        },
      },
    },
  };

  return (
    <div style={{ height }}>
      <Scatter data={data} options={options} />
    </div>
  );
}
