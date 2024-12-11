import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../common";

const LineChart = ({ isCustomLineColors = false, isDashboard = false }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để xem đơn hàng.");
        return;
      }
      const res = await fetch(SummaryApi.getChartData.url, {
        method: SummaryApi.userDetail.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include"
      })
      const dataApi = await res.json();
      const data = dataApi.data
      const formattedData = [
        { id: "Tổng Đơn Hàng", color: "#0000FF",data: data.map((item, index) => ({ x: `Tháng ${index + 1}`, y: item.totalOrders })) },
        { id: "Đơn Hàng Thành Công", color: "#00FF00",data: data.map((item, index) => ({ x: `Tháng ${index + 1}`, y: item.successfulOrders })) },
        { id: "Đơn Hàng Đã Hủy", color: "#FF0000", data: data.map((item, index) => ({ x: `Tháng ${index + 1}`, y: item.cancelledOrders })) },
        { id: "Khách Hàng Đăng Kí", color: "#FFFF00",data: data.map((item, index) => ({ x: `Tháng ${index + 1}`, y: item.totalGeneralUsers })) },
      ];
      console.log(formattedData);
      setChartData(formattedData);
    }

    fetchData();
  }, [])

  return (
    <ResponsiveLine
      data={chartData}
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
        tooltip: {
          container: {
            color: colors.primary[500],
          },
        },
      }}
      colors={chartData.map(item => item.color)}
      margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 0,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "transportation",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 3,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? undefined : "count",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={8}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom",  
          direction: "row",   
          justify: false,    
          translateX: 0,
          translateY: 40,     
          itemsSpacing: 15,  
          itemWidth: 150,    
          itemHeight: 20,    
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
          textStyle: {
            fontSize: 10,  
            fill: "#FFFFFF",  
          }
        },
      ]}
    />

  );
};

export default LineChart;
