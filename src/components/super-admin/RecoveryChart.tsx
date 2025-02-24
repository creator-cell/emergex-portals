"use client"
import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-06-25", desktop: 141, mobile: 190 },
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

export function RecoveryChart() {
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
      {/* Removed border and shadow */}
      <CardContent className="p-0">
        {/* Removed background */}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[70px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            barCategoryGap={15} // Adjust this value for the gap between the bars
            barGap={20}
            margin={{
              left: 20,
              right: 20,
            }}
          >
            {/* Define the gradient */}
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
              height={0} // Set height to 0 to hide the axis
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
              fill="url(#barGradient)" // Use the gradient here
              radius={[5, 5, 5, 5]} // Adding border-radius to the bars
              strokeWidth={2}
              barSize={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
