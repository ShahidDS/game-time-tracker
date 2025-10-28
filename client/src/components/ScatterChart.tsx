import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(PointElement, LinearScale, Title, Tooltip, Legend);

interface ScatterChartProps {
  weeklyStats: {
    numOfSessionsPerWeek: number;
    averageSessionLengthPerWeek: number;
  }[];
}

export default function ScatterChart({ weeklyStats }: ScatterChartProps) {
  const data = {
    datasets: [
      {
        label: "Weekly Play Stats",
        data: weeklyStats.map((stat) => ({
          x: stat.numOfSessionsPerWeek,
          y: stat.averageSessionLengthPerWeek,
        })),
        backgroundColor: "#8457F6",
        borderColor: "#8457F6",
        pointRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Average Session Length vs. Sessions per Week",
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Sessions per Week" },
        beginAtZero: true,

        ticks: {
          stepSize: 1,
          callback: (value: number | string) => Number(value).toFixed(0),
        },

        suggestedMin: 0,
        suggestedMax:
          Math.max(...weeklyStats.map((d) => d.numOfSessionsPerWeek)) + 2,
        grid: {
          drawBorder: false,
          color: "rgba(200,200,200,0.2)",
        },
      },
      y: {
        title: { display: true, text: "Average Session Length (minutes)" },
        beginAtZero: true,
        offset: true,

        ticks: {
          stepSize: 30,
          callback: (value: number | string) => Number(value).toFixed(0),
        },

        suggestedMax:
          Math.max(...weeklyStats.map((d) => d.averageSessionLengthPerWeek)) +
          50,
        grid: {
          drawBorder: false,
          color: "rgba(200,200,200,0.2)",
        },
      },
    },
  };

  return (
    <div className="h-[340px]">
      <Scatter data={data} options={options} />
    </div>
  );
}
