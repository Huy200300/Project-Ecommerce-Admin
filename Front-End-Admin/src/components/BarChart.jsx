import { useTheme } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const BarChart = ({ isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [revenueData, setRevenueData] = useState([]);

  // Mảng màu để phân phối cho từng tháng
  const monthColors = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#9B59B6", "#E74C3C", "#1ABC9C", "#2ECC71", "#3498DB", "#F39C12", "#D35400", "#8E44AD"
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để xem đơn hàng.");
        return;
      }
      const res = await fetch(SummaryApi.getRevenuePerMonth.url, {
        method: SummaryApi.getRevenuePerMonth.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setRevenueData(data.data);
      } else {
        toast.error(data.message);
      }
    };
    fetchData();
  }, []);


  return (
    <ResponsiveBar
      data={revenueData}
      theme={{
        axis: {
          domain: {
            line: {
              stroke: colors.grey[100],
            },
          },
          legend: {
            text: {
              fill: colors.grey[100],
            },
          },
          ticks: {
            line: {
              stroke: colors.grey[100],
              strokeWidth: 1,
            },
            text: {
              fill: colors.grey[100],

            },
          },
        },
        legends: {
          text: {
            fill: colors.grey[100],
          },
        },
      }}
      keys={["totalRevenue"]}
      indexBy="month"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={(bar) => monthColors[bar.indexValue - 1]}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      borderColor={{
        from: "color",
        modifiers: [["darker", "1.6"]],
      }}
      axisTop={null}
      axisRight={null}
      axisLeft={
        {
          tickSize: 0,
          tickPadding: 0,
          tickRotation: 0,
          
        }
      }
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "Tháng",
        legendPosition: "middle",
        legendOffset: 32,
      }}
      // axisLeft={{
      //   tickSize: 5,
      //   tickPadding: 5,
      //   tickRotation: 0,
      //   legend: isDashboard ? undefined : "Doanh thu (₫)", 
      //   legendPosition: "middle",
      //   legendOffset: -40,
      //   tickFormat: (value) => `₫${value.toLocaleString()}`,
      // }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{
        from: "color",
        modifiers: [["darker", 1.6]],
      }}
      // legends={[
      //   {
      //     dataFrom: "keys",
      //     anchor: "bottom-right",
      //     direction: "column",
      //     justify: false,
      //     translateX: 120,
      //     translateY: 0,
      //     itemsSpacing: 2,
      //     itemWidth: 100,
      //     itemHeight: 20,
      //     itemDirection: "left-to-right",
      //     itemOpacity: 0.85,
      //     symbolSize: 20,
      //     effects: [
      //       {
      //         on: "hover",
      //         style: {
      //           itemOpacity: 1,
      //         },
      //       },
      //     ],
      //   },
      // ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " trong tháng: " + e.indexValue;
      }}
    />
  );
};

export default BarChart;
