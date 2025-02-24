"use client";

import { TrendingUp } from "lucide-react";
import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "Hazard", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "Risk", visitors: 200, fill: "var(--color-safari)" },
  { browser: "Inventory", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "Plans", visitors: 173, fill: "var(--color-edge)" },
  { browser: "Resources", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function PreparednessChart() {
  return (
<Card className="flex flex-col xl:flex-row 2xl:flex-row items-center bg-transparent border-0 shadow-none">
{/* Chart Section */}
      <CardContent className="flex-1 pb-0 border-0 shadow-none">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Data Section with Colored Bars */}
      <div className="flex flex-col justify-between p-4 pr-16 space-y-2 border-0 shadow-none">
        {chartData.map((data) => (
          <div key={data.browser} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: data.fill }}
              />
              <span className="text-sm text-gray-600">{data.browser}</span>
            </div>

            <div className="flex-1 ml-4">
              <div
                className="h-2 rounded-full"
                style={{
                  backgroundColor: data.fill,
                  width: `${(data.visitors / 275) * 100}%`, // Adjust width based on the max visitor count (275)
                }}
              />
            </div>

            <span className="font-semibold">{data.visitors}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
