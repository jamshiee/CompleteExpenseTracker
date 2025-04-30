// import "./styles.css";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import api from "../libs/apiCall";



const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export const ChartPie = ({ chartData }) => {

  
  const data = [
    { name: "Income", value: chartData.totalIncome },
    { name: "Expense", value: chartData.totalExpense },
  ];

  const [activeIndex, setActiveIndex] = useState(null);

  const renderLabel = ({ percent }) =>
    `${(percent * 100).toFixed(0)}%`;

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <ResponsiveContainer height={400} className="bg-white md:max-w-[29%]">
      <h4 className="text-gray-600 text-center text-2xl pt-5">Summary</h4>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={100}
          outerRadius={140}
          activeIndex={activeIndex}
          activeOuterRadius={150} // Popped-out radius
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave}
          dataKey="value"
          paddingAngle={3}
          label={renderLabel}
          isAnimationActive={true}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            borderRadius: "5px",
            fontSize: "14px",
          }}
          formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
        />
        <Legend
          verticalAlign="bottom"
          align="center"
          iconType="circle"
          formatter={(value) => (
            <span style={{ color: "#555", fontSize: 14 }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const ChartLine = ({ chartData }) => {
  return (
    <ResponsiveContainer height={440} className={"md:max-w-[71%] p-2"}>
      <LineChart
        data={chartData.chartData}
        margin={{ top: 20 }}
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        ></Line>
        <Line type="monotone" dataKey="expense" stroke="#82ca9d"></Line>
      </LineChart>
    </ResponsiveContainer>
  );
};
