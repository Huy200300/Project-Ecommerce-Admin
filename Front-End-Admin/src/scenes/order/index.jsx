import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai"; 
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SummaryApi from "../../common";
import { useEffect, useState } from "react";

const Order = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await fetch(SummaryApi.all_orders.url, {
            method: SummaryApi.all_orders.method,
            credentials: "include",
        });
        const dataApi = await res.json();
        setData(dataApi.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const columns = [
        { field: "orderId", headerName: "Order ID", flex: 1.4 },
        {
            field: "transactionId",
            headerName: "Transaction ID",
            flex: 1
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            flex: 1.3,
            renderCell: ({ row }) => {
                const fullName = row?.shippingDetails[0]?.shippingAddress.fullName || "No name";
                return <Typography>{fullName}</Typography>;
            },
        },

        {
            field: "phone",
            headerName: "Phone",
            flex: 1,
            renderCell: ({ row }) => {
                const phone = row?.shippingDetails[0]?.shippingAddress.phone || "No phone";
                return <Typography>{phone}</Typography>;
            },
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1.2,
            renderCell: ({ row }) => {
                return <Typography>{row.amount.toLocaleString()} VND</Typography>;
            },
        },
        {
            field: "shippingAddress",
            headerName: "Shipping Address",
            flex: 2,
            renderCell: ({ row }) => {
                const shippingAddress = row?.shippingDetails[0]?.shippingAddress.fullAddress || "No shippingAddress"
                return <Typography className="text-wrap">{shippingAddress}</Typography>;
            },
        },
        {
            field: "shippingMethod",
            headerName: "Shipping Method",
            flex: 1,
            renderCell: ({ row }) => {
                return <Typography>{row?.shippingDetails[0]?.shippingMethod || "No method"}</Typography>;
            },
        },
        {
            field: "paymentMethod",
            headerName: "Payment Method",
            flex: 1,
            renderCell: ({ row }) => {
                const address = row?.paymentDetails[0]?.bank || "chưa trả";
                return <Typography>{address}</Typography>;
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            renderCell: ({ row }) => {
                return <Typography>{row.status}</Typography>;
            },
        },
        {
            field: "createdAt",
            headerName: "Created At",
            flex: 1,
            valueGetter: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            field: "isPaid", 
            headerName: "Verifier Payment Status",
            flex: 1.5,
            renderCell: ({ row }) => {
                const isPaid = row.isPaid;
                return (
                    <div className="flex items-center space-x-2">
                        {isPaid ? (
                            <AiOutlineCheckCircle className="text-green-500" size={20} /> 
                        ) : (
                            <AiOutlineCloseCircle className="text-red-500" size={20} /> 
                        )}
                        <Typography
                            className={isPaid ? "text-green-500" : "text-red-500"} 
                        >
                            {isPaid ? "Đã check" : "Chưa check "}
                        </Typography>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="mx-4" style={{ height: 400, width: '100%' }}>
            <Header title="Order" subtitle="Managing the Order Members" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    // autoHeight // Bật chiều cao tự động
                    // checkboxSelection
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row._id}
                    components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </div>
    );
};

export default Order;
