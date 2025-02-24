import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Text } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2016-04-01", desktop: 222, mobile: 150 },
  { date: "2017-04-02", desktop: 97, mobile: 180 },
  { date: "2018-04-03", desktop: 167, mobile: 120 },
  { date: "2019-04-04", desktop: 242, mobile: 260 },
  { date: "2020-04-05", desktop: 373, mobile: 290 },
  { date: "2021-06-25", desktop: 141, mobile: 190 },
  { date: "2022-06-26", desktop: 434, mobile: 380 },
  { date: "2023-06-26", desktop: 434, mobile: 380 },
  { date: "2024-06-26", desktop: 434, mobile: 380 },
];

const chartConfig = {
  views: {
    label: "Page Views",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function AnalysisRecoveryChart() {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("desktop");

  const total = React.useMemo(
    () => ({
      desktop: chartData.reduce((acc, curr) => acc + curr.desktop, 0),
      mobile: chartData.reduce((acc, curr) => acc + curr.mobile, 0),
    }),
    []
  );

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[70px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            barCategoryGap={15}
            barGap={20}
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#277C16" />
                <stop offset="100%" stopColor="#389925" />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval={0} // Ensure all labels are shown
              tick={({ x, y, payload }) => {
                const year = new Date(payload.value).getFullYear(); // Extract year
                return (
                  <Text
                    x={x}
                    y={y + 10} // Adjust y-position for better placement
                    textAnchor="middle"
                    fontSize={10} // Adjust font size as needed
                    fill="#666"
                  >
                    {year}
                  </Text>
                );
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[50px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey={activeChart}
              background={{ fill: "rgb(206, 215, 205)" }}
              fill="url(#barGradient)"
              radius={[5, 5, 5, 5]}
              strokeWidth={2}
              barSize={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
