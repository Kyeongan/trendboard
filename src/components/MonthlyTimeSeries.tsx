import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { useLayoffData } from "../hooks/useLayoffData";

type AggregatedData = {
  month: string; // Format: YYYY-MM
  totalLayoffs: number;
};

type MonthlyTimeSeriesProps = {
  rawData: Array<{
    date: Date;
    laidOff: number;
  }>;
};

const MonthlyTimeSeries: React.FC<MonthlyTimeSeriesProps> = ({ rawData }) => {
  // Function to group data by month
  const aggregatedData: AggregatedData[] = React.useMemo(() => {
    const monthlyData: { [key: string]: number } = {};

    rawData.forEach(({ date, laidOff }) => {
      const month = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`; // Format: YYYY-MM
      monthlyData[month] = (monthlyData[month] || 0) + laidOff;
    });

    // Convert the aggregated object into an array and sort by month (oldest to newest)
    return Object.entries(monthlyData)
      .map(([month, totalLayoffs]) => ({ month, totalLayoffs }))
      .sort(
        (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [rawData]);

  if (aggregatedData.length === 0) {
    return <div>Loading chart...</div>;
  }

  return (
    <div style={{ width: "100%", height: 500 }}>
      <h2 className="text-center text-xl mb-4">Monthly Layoffs (2020 - Present)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={aggregatedData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="totalLayoffs" fill="#8884d8">
            <LabelList
              dataKey="totalLayoffs"
              position="top"
              formatter={(value: number) => value.toLocaleString()} // Format numbers with commas
              style={{ fontSize: 10, fill: "#333" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const LayoffLineChart = () => {
  const rawData = useLayoffData();

  return <MonthlyTimeSeries rawData={rawData} />;
};

export default LayoffLineChart;
