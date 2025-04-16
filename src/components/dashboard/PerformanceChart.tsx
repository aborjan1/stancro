
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface ListingStat {
  id: string;
  title: string;
  views: number;
  interests: number;
}

interface PerformanceChartProps {
  listingStats: ListingStat[] | undefined;
  isLoading: boolean;
}

const PerformanceChart = ({ listingStats, isLoading }: PerformanceChartProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Listing Performance</CardTitle>
        <CardDescription>Views and interests for your listings</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {!isLoading && listingStats && (
          <ChartContainer
            config={{
              views: { theme: { light: "#4F46E5", dark: "#818CF8" } },
              interests: { theme: { light: "#E56717", dark: "#FB923C" } },
            }}
            className="aspect-[4/3] sm:aspect-[2/1] w-full"
          >
            <>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={listingStats}
                  margin={{
                    top: 5,
                    right: 5,
                    left: 5,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" fontSize={12} tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value} />
                  <YAxis />
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent labelKey="title" />
                    }
                  />
                  <Bar dataKey="views" fill="var(--color-views)" name="Views" />
                  <Bar dataKey="interests" fill="var(--color-interests)" name="Interests" />
                </BarChart>
              </ResponsiveContainer>
              <ChartLegend>
                <ChartLegendContent />
              </ChartLegend>
            </>
          </ChartContainer>
        )}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <p>Loading statistics...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
