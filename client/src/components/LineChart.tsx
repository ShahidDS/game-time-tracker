import { Line } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";

interface DailyPlayTime {
  date: string;
  minutes: number;
}

interface AllUserDailyPlayTime {
  userId: number;
  username: string;
  dailyPlayTime: DailyPlayTime[];
}

interface LineChartProps {
  dailyPlayTime?: DailyPlayTime[]; //current user
  usersDailyPlayTime?: AllUserDailyPlayTime[];
  colors: string[];
  currentUserId?: number;
}

export default function LineChart({
  dailyPlayTime,
  usersDailyPlayTime,
  colors,
  currentUserId,
}: LineChartProps) {
  const useMulti =
    Array.isArray(usersDailyPlayTime) && usersDailyPlayTime.length > 0;
  const useSingle =
    !useMulti && Array.isArray(dailyPlayTime) && dailyPlayTime.length > 0;

  const toMinutes = (secs: number) => Math.round(secs / 60);

  let labels: string[] = [];
  const datasets = [];
  let maxValue = 0;

  const mutedGray = "rgba(120,120,120,0.55)";

  if (useMulti && usersDailyPlayTime) {
    labels = usersDailyPlayTime[0].dailyPlayTime.map((d) => d.date);

    usersDailyPlayTime.forEach((u) => {
      const mins = u.dailyPlayTime.map((d) => {
        const m = toMinutes(d.minutes);
        if (m > maxValue) maxValue = m;
        return m;
      });

      const isCurrent =
        typeof currentUserId === "number" && u.userId === currentUserId;
      const color = isCurrent ? colors[0] : mutedGray;

      datasets.push({
        label: "Minutes played by " + u.username.toUpperCase() + "",
        data: mins,
        fill: false,
        borderColor: color,
        backgroundColor: color,
        borderWidth: isCurrent ? 3 : 2,
        pointRadius: isCurrent ? 3.2 : 2.2,
        pointHoverRadius: isCurrent ? 8 : 6,
        pointBackgroundColor: isCurrent ? "#fff" : "#f7f7f7",
        pointBorderColor: color,
        pointBorderWidth: isCurrent ? 2 : 1,
        tension: 0.3,
      });
    });
  } else if (useSingle && dailyPlayTime) {
    labels = dailyPlayTime.map((d) => d.date);
    const mins = dailyPlayTime.map((d) => {
      const m = toMinutes(d.minutes);
      if (m > maxValue) maxValue = m;
      return m;
    });

    datasets.push({
      label: "Minutes played",
      data: mins,
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
    });
  }

  // fallback maxValue
  maxValue = maxValue || 0;

  const data = {
    labels,
    datasets,
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
          stepSize: Math.ceil(Math.max(1, maxValue) / 4), // divide range into ~4 steps
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
        suggestedMax: Math.max(1, maxValue) * 1.4, // add space above max
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={data} options={options} />
    </div>
  );
}
