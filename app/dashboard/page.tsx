import { Metadata } from "next";
import DashboardClient from "../../components/ui/DashboardClient";

// Define metadata for the page
export const metadata: Metadata = {
  title: "Dashboard",
  description: "Overview of galleries, items, users, and comments.",
};

// Fetch data on the server
async function getDashboardSummary() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/dashboard-summary`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard summary");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw new Error("Failed to fetch dashboard summary");
  }
}

// Server-side rendered page
export default async function DashboardPage() {
  // Fetch the summary data
  const summary = await getDashboardSummary();

  // Pass the data to the client-side component
  return <DashboardClient summary={summary} />;
}
