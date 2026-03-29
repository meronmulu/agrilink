import React from "react";
import CropAdvisorChat from "@/components/CropAdvisorChat";

export default function FarmerInsightsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Insights</h1>
      <CropAdvisorChat defaultLocation="Central Ethiopia" />
    </div>
  );
}
