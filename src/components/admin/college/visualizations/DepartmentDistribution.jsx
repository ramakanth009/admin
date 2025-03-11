// src/components/admin/college/visualizations/DepartmentDistribution.jsx
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import ChartCard from "../../../common/charts/ChartCard";

/**
 * Department distribution visualization component for college admin
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Department distribution data
 * @param {Object} props.colors - Theme colors
 */
const DepartmentDistribution = ({ data = [], colors }) => {
  // Custom label rendering function for the pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
    // Calculate outer position for the label (outside the pie)
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.3; // Position label outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Determine text anchor based on position in the circle
    const textAnchor = x > cx ? "start" : "end";

    // Add a line from the pie to the label
    const lineX1 = cx + outerRadius * Math.cos(-midAngle * RADIAN);
    const lineY1 = cy + outerRadius * Math.sin(-midAngle * RADIAN);
    const lineX2 = x - (textAnchor === "start" ? 10 : -10);
    const lineY2 = y;

    // Function to break long department names into multiple lines if needed
    const getWrappedText = (text, maxWidth = 15) => {
      if (!text || text.length <= maxWidth) return [text];

      const words = text.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        if ((currentLine + " " + word).length <= maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Break department name into lines if needed
    const nameLines = getWrappedText(name);

    return (
      <g>
        {/* Line connecting pie to label */}
        <line
          x1={lineX1}
          y1={lineY1}
          x2={lineX2}
          y2={lineY2}
          stroke="#999999"
          strokeWidth={1}
        />

        {/* Department name (potentially multi-line) */}
        {nameLines.map((line, i) => (
          <text
            key={`line-${i}`}
            x={x}
            y={y - 8 + i * 14} // Offset each line
            textAnchor={textAnchor}
            fill="#666666"
            fontSize={11}
            fontWeight="normal"
          >
            {line}
          </text>
        ))}

        {/* Percentage value - placed below the last line of text */}
        <text
          x={x}
          y={y - 8 + nameLines.length * 14} // Position below the name text
          textAnchor={textAnchor}
          fill="#333333"
          fontSize={12}
          fontWeight="bold"
        >
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  return (
    <ChartCard
      title="Student Distribution by Department"
      loading={false}
      hasData={data?.length > 0}
      noDataMessage={<div>No department data available</div>}
      role="college_admin"
      footer="Distribution of students across departments"
    >
      <ResponsiveContainer width="100%" height={350}>
        <PieChart margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={70}
            innerRadius={30}
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <RechartsTooltip
            formatter={(value, name) => [`${value} Students`, name]}
            contentStyle={{
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default DepartmentDistribution;