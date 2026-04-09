import instance from "@/lib/axios/axios";

export const getCropAdvisorInsights = async (role: "buyer" | "farmer") => {
  // Adjust endpoint as per backend API
  const res = await instance.get(`/advisor/insights?role=${role}`);
  return res.data;
};
