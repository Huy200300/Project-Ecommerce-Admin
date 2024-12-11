import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import SummaryApi from "../../common";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import displayCurrency from "../../helpers/displayCurrency";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [user, setUser] = useState([])
  const [totalOrders, setTotalOrders] = useState(0)
  const [totalGeneralUsers, setTotalGeneralUsers] = useState(0)
  const [successfulOrders, setSuccessfulOrders] = useState(0)
  const [cancelledOrders, setCancelledOrders] = useState(0)
  const [transactions, setTransactions] = useState([]);
  const [limit, setLimit] = useState(10)

  const [previousStats, setPreviousStats] = useState({
    totalOrders: 0,
    successfulOrders: 0,
    cancelledOrders: 0,
    totalGeneralUsers: 0,
  });

  const handleChange = (event) => {
    setLimit(event.target.value);
  };

  const fetchData = async () => {
    const res = await fetch(SummaryApi.userDetail.url, {
      method: SummaryApi.userDetail.method,
      credentials: "include"
    })
    const dataApi = await res.json();
    if (dataApi?.success) {
      setUser(dataApi?.data)
    }
  }

  const fetchDashboardStats = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Bạn cần đăng nhập để xem đơn hàng.");
      return;
    }
    const res = await fetch(SummaryApi.getDashboardStats.url, {
      method: SummaryApi.getDashboardStats.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    })
    const data = await res.json();
    if (data.success) {
      setPreviousStats({
        totalOrders: totalOrders,
        successfulOrders: successfulOrders,
        cancelledOrders: cancelledOrders,
        totalGeneralUsers: totalGeneralUsers,
      });
      setCancelledOrders(data.cancelledOrders)
      setSuccessfulOrders(data.successfulOrders)
      setTotalGeneralUsers(data.totalGeneralUsers)
      setTotalOrders(data.totalOrders)
    } else {
      toast.error(data.message);
    }
  }

  const fetchTransactions = async (limit) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Bạn cần đăng nhập để xem giao dịch.");
        return;
      }
      const response = await fetch(`${SummaryApi.getRecentOrders.url}?limit=${limit}`, {
        method: SummaryApi.getRecentOrders.method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await response.json();
      setTransactions(data.data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchData()
    fetchDashboardStats()

  }, [])

  useEffect(() => { fetchTransactions(limit) }, [limit])

  const calculateIncrease = (current, previous) => {
    if (previous === 0) return "+100%";
    const percentChange = ((current - previous) / previous) * 100;
    return `${percentChange > 0 ? "+" : ""}${percentChange.toFixed(2)}%`;
  };

  return (
    <Box m="100px 20px 20px 20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        {/* <Box>
          <Button
            sx={{
              backgroundColor: colors.blueAccent[700],
              color: colors.grey[100],
              fontSize: "14px",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            <DownloadOutlinedIcon sx={{ mr: "10px" }} />
            Download Reports
          </Button>
        </Box> */}
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalOrders.toLocaleString()}
            subtitle="Tổng số đơn hàng"
            progress={totalOrders / 1000}
            increase={calculateIncrease(totalOrders, previousStats?.totalOrders)}
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={successfulOrders.toLocaleString()}
            subtitle="Đơn hàng thành công"
            progress={successfulOrders / totalOrders}
            increase={calculateIncrease(successfulOrders, previousStats?.successfulOrders)}
            icon={
              <CheckCircleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={totalGeneralUsers.toLocaleString()}
            subtitle="Khách hàng"
            progress={totalGeneralUsers / 1000}
            increase={calculateIncrease(totalGeneralUsers, previousStats?.totalGeneralUsers)}
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={cancelledOrders.toLocaleString()}
            subtitle="Đơn hàng bị hủy"
            progress={cancelledOrders / totalOrders}
            increase={calculateIncrease(cancelledOrders, previousStats?.cancelledOrders)}
            icon={
              <CancelIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>


        {/* <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="12,361"
            subtitle="Emails Sent"
            progress="0.75"
            increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="431,225"
            subtitle="Sales Obtained"
            progress="0.50"
            increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="32,441"
            subtitle="New Clients"
            progress="0.30"
            increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
          gridColumn="span 3"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title="1,325,134"
            subtitle="Traffic Received"
            progress="0.80"
            increase="+43%"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box> */}

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                variant="h5"
                fontWeight="600"
                color={colors.grey[100]}
              >
                Thống Kê Đơn Hàng & Khách Hàng
              </Typography>
              <Typography
                variant="h3"
                fontWeight="bold"
                color={colors.greenAccent[500]}
              >
                {/* $59,342.32 */}
              </Typography>
            </Box>
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: colors.greenAccent[500] }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>

        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h5" fontWeight="600">
              Giao dịch gần đây
            </Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Giới hạn</InputLabel>
              <Select
                label="Limit"
                value={limit}
                onChange={handleChange}
                labelId="limit-select-label"
                sx={{ color: colors.grey[100] }}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={30}>30</MenuItem>
                <MenuItem value={40}>40</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>
          </Box>


          {transactions?.map((transaction, i) => (
            <Box
              key={`${transaction._id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.greenAccent[500]}
                  variant="h7"
                  fontWeight="600"
                >
                  {transaction.transactionId}
                </Typography>
                <Typography color={colors.grey[100]}>
                  {transaction.shippingDetails?.[0]?.shippingAddress.fullName
                    ? transaction.shippingDetails[0].shippingAddress.fullName
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')
                    : ''}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{new Intl.DateTimeFormat('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              }).format(new Date(transaction.createdAt))}
              </Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {displayCurrency(transaction.amount)}
              </Box>
            </Box>
          ))}
        </Box>

        {/* <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Campaign
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Includes extra misc expenditures and costs</Typography>
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Sales Quantity
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box> */}
      </Box>
    </Box>
  );
};

export default Dashboard;
