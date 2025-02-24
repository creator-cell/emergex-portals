import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"; // Removed Defs, LinearGradient, Stop
import { Card, CardContent } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { month: "January", desktop: 200 },
  { month: "February", desktop: 400 },
  { month: "March", desktop: 300 }, // Going down
  { month: "April", desktop: 500 }, // Going up
  { month: "May", desktop: 300 }, // Going down
  { month: "June", desktop: 600 }, // Going up
  { month: "July", desktop: 400 }, // Going down
  { month: "August", desktop: 700 }, // Going up
];

const chartConfig: ChartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export function AnalysisResponseChart() {
  return (
    <Card className="bg-transparent border-0 shadow-none">
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[70px] w-[100%]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 1,
              right: 1,
            }}
          >
            {/* Define the gradient */}
            <defs>
              <linearGradient
                id="areaGradient"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
                gradientTransform="rotate(340)"
              >
                <stop offset="13.5%" stopColor="rgba(217, 217, 217, 0)" />
                <stop offset="87.82%" stopColor="#9AE1D2" />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#areaGradient)" // Apply the gradient here
              fillOpacity={1}
              stroke="rgba(41, 188, 155, 1)" 
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
