import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

interface DailyPlayTime {
  date: string;
  minutes: number;
}

interface LineChartProps {
  dailyPlayTime: DailyPlayTime[];
  colors: string[];
}

export default function LineChart({ dailyPlayTime, colors }: LineChartProps) {
  if (!dailyPlayTime || dailyPlayTime.length === 0) {
    return <div>No play time data available</div>;
  }

  const sortedData = [...dailyPlayTime].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const displayData = [...sortedData];

  // Backup display data if less than 2 data points
  if (sortedData.length < 2) {
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    for (let i = 1; i < 4; i++) {
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + i);
      displayData.push({
        date: newDate.toISOString().split("T")[0],
        minutes: Math.floor(
          sortedData[sortedData.length - 1].minutes *
            (0.8 + Math.random() * 0.4)
        ),
      });
    }
  }

  //

  const maxValue = Math.max(...sortedData.map((d) => d.minutes)) || 0;
  const data = {
    labels: displayData.map((entry) => entry.date),
    datasets: [
      {
        label: "Playtime (minutes per day)",
        data: displayData.map((entry) => entry.minutes),
        fill: false,
        borderColor: colors[0],
        backgroundColor: colors[0],
        borderWidth: 3,
        pointRadius: 3.2,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fff",
        pointBorderColor: colors[0],
        pointBorderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        position: "bottom",
        text: "Amount of minutes played per day",
        color: "#f15bb5",
        font: { size: 16 },
      },
    },
    scales: {
      x: {
        ticks: { color: "#888" },
        grid: { color: "rgba(255,255,255,0.1)" },
        offset: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#888",
          stepSize: Math.ceil(maxValue / 4), // divide range into ~4 steps
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        suggestedMax: maxValue * 1.4, //add 20% space above max
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}
