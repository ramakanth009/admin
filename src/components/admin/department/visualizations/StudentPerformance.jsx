// src/components/admin/department/visualizations/StudentPerformance.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import ChartCard from "../../../common/charts/ChartCard";

/**
 * Student performance visualization component for department admin
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Student performance data
 * @param {Object} props.colors - Theme colors
 */
const StudentPerformance = ({ data = [], colors }) => {
  // Format data for the chart
  const formatData = (rawData) => {
    if (!rawData || rawData.length === 0) return [];
    
    return rawData.map((item) => ({
      category: item.name,
      score: item.value,
      fill: item.color || colors.main,
    }));
  };

  const formattedData = formatData(data);

  // Format Y-axis ticks to show percentages
  const formatYAxisTick = (value) => {
    return `${value}%`;
  };

  return (
    <ChartCard
      title="Student Performance by Category"
      loading={false}
      hasData={formattedData?.length > 0}
      noDataMessage={<div>No performance data available</div>}
      role="department_admin"
      footer="Average student performance across different assessment categories"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={formattedData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: "#666" }}
            tickLine={{ stroke: "#ccc" }}
            axisLine={{ stroke: "#ccc" }}
            angle={-45}
            textAnchor="end"
            height={70}
          />
          <YAxis
            tickFormatter={formatYAxisTick}
            domain={[0, 100]}
            tick={{ fill: "#666" }}
            tickLine={{ stroke: "#ccc" }}
            axisLine={{ stroke: "#ccc" }}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, "Score"]}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
            }}
          />
          <Legend
            verticalAlign="top"
            height={36}
            wrapperStyle={{ paddingTop: "10px" }}
          />
          <Bar
            dataKey="score"
            name="Performance Score"
            fill={colors.main}
            radius={[4, 4, 0, 0]}
            barSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default StudentPerformance;