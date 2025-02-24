"use client";

import { Pie, PieChart, Cell, Sector } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  {
    browser: "Hazard and Risk Assesment",
    visitors: 20,
    fill: "rgba(254, 108, 108, 1)",
  },
  {
    browser: "Resource Inventory",
    visitors: 87,
    fill: "rgba(254, 184, 108, 1)",
  },
  {
    browser: "Communication Systems",
    visitors: 73,
    fill: "rgba(254, 108, 169, 1)",
  },
  { browser: "Emergency Plans", visitors: 30, fill: "rgba(108, 108, 254, 1)" },
];

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
  safari: { label: "Safari", color: "hsl(var(--chart-2))" },
  firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
  edge: { label: "Edge", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
    props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={4}
      />
    </g>
  );
};

export function SuperAdminPreparednessChart() {
  return (
    <Card className="flex flex-col xl:flex-row 2xl:flex-row items-center bg-transparent border-0 shadow-none py-0">
      {/* Chart Section */}
      <CardContent className="flex-1 p-0 border-0 shadow-none">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full sm:w-[180px] sm:h-[180px] md:w-[220px] md:h-[220px] relative"
        >
          <PieChart width={220} height={220}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              activeShape={renderActiveShape}
              activeIndex={[0, 1, 2, 3]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Data Section with Colored Bars */}
      <div className="flex flex-col items-start py-2 px-2 space-y-2 border-0 shadow-none mr-8">
        {chartData.map((data) => (
          <div
            key={data.browser}
            className="flex items-center justify-between w-full "
          >
            <div className="flex items-center flex-1 mb-4">
              <div
                className="w-4 h-2 rounded-[10px]"
                style={{ backgroundColor: data.fill }}
              ></div>
              <span className="text-[14px] text-gray-600 ml-4 mr-4">
                {data.browser}
              </span>
            </div>
            <div className="mb-4">
              <span className="font-medium text-[16px]">{data.visitors}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
