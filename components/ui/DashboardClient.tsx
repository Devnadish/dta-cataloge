"use client";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface DashboardClientProps {
  summary: {
    galleryCount: number;
    itemCount: number;
    userCount: number;
    commentCount: number;
  };
}

// Define a type for the chart data
interface ChartDataType {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[];
}

export default function DashboardClient({ summary }: DashboardClientProps) {
  // State for loading and data
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataType | null>(null);

  // Simulate loading state (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setChartData({
        labels: ["Galleries", "Items", "Users", "Comments"],
        datasets: [
          {
            label: "Metrics",
            data: [
              summary.galleryCount,
              summary.itemCount,
              summary.userCount,
              summary.commentCount,
            ],
            backgroundColor: "#8884d8",
          },
        ],
      });
    }, 1000); // Simulate a 1-second delay
    return () => clearTimeout(timer);
  }, [summary]);

  if (loading) {
    return (
      <div className="p-6 space-y-8">
        {/* Header */}
        <Skeleton className="h-8 w-48 rounded-md" />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <Skeleton className="h-4 w-24 rounded-md" /> {/* Card Title */}
                <Skeleton className="h-6 w-6 rounded-full" />{" "}
                {/* Icon Placeholder */}
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-16 rounded-md" />{" "}
                {/* Metric Value */}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart Section */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded-md" /> {/* Chart Title */}
            <Skeleton className="h-4 w-48 rounded-md mt-2" />{" "}
            {/* Chart Description */}
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full rounded-md" />{" "}
            {/* Chart Placeholder */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gallery Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Galleries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.galleryCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total number of galleries created.
            </p>
          </CardContent>
        </Card>

        {/* Item Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.itemCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total number of items uploaded.
            </p>
          </CardContent>
        </Card>

        {/* User Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.userCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total number of registered users.
            </p>
          </CardContent>
        </Card>

        {/* Comment Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Total Comments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {summary.commentCount}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Total number of comments posted.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Metrics Overview
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
            Overview of key metrics in your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ height: "400px" }}>
            {chartData && (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Metrics Overview",
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                      },
                    },
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
