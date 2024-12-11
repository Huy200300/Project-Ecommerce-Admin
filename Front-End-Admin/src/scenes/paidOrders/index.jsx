import React, { useEffect, useState } from 'react'
import { DataGrid } from "@mui/x-data-grid";
import SummaryApi from '../../common';
import { useTheme, Typography, Box, Checkbox } from '@mui/material';
import Header from "../../components/Header";
import { tokens } from '../../theme';
import { toast } from "react-toastify";

const PaidOrders = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [data, setData] = useState([]);

    const fetchData = async () => {
        const res = await fetch(SummaryApi.get_paid_orders.url, {
            method: SummaryApi.get_paid_orders.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",

        });
        const dataApi = await res.json();

        if (dataApi.data && dataApi.data.length > 0) {
            setData(dataApi.data);
        } else {
            console.log("No data available.");
            setData([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCheckboxChange = async (event, orderId) => {
        const isPaid = event.target.checked;

        setData((prevData) =>
            prevData.map((order) =>
                order._id === orderId ? { ...order, isPaid: isPaid } : order
            )
        );

        const res = await fetch(SummaryApi.update_payment_paid.url, {
            method: SummaryApi.update_payment_paid.method,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
            body: JSON.stringify({ orderId, isPaid }),
        });
        const dataApi = await res.json();
        if (dataApi?.success) {
            toast.success(dataApi?.message);
            setData((prevData) =>
                prevData.map((order) =>
                    order._id === orderId ? { ...order, isPaid: isPaid } : order
                )
            );
        } else if (dataApi?.error) {
            toast.error(dataApi?.message);
            fetchData()
        }
    };

    const columns = [
        { field: "orderId", headerName: "Order ID", flex: 1.34, headerAlign: 'center', },
        {
            field: "transactionId",
            headerName: "Transaction ID",
            flex: 1,
            headerAlign: 'center',
        },
        {
            field: "customerName",
            headerName: "Customer Name",
            flex: 1,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                const fullName = row?.shippingDetails[0]?.shippingAddress.fullName || "No name";
                return <Typography>{fullName}</Typography>;
            },
        },

        {
            field: "phone",
            headerName: "Phone",
            flex: 1,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                const phone = row?.shippingDetails[0]?.shippingAddress.phone || "No phone";
                return <Typography>{phone}</Typography>;
            },
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                return <Typography>{row.amount.toLocaleString()} VND</Typography>;
            },
        },
        {
            field: "shipping",
            headerName: "Shipping Address",
            flex: 2,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                const shippingAddress = row?.shippingDetails[0]?.shippingAddress.fullAddress || "No shippingAddress"
                return <Typography className="text-wrap">{shippingAddress}</Typography>;
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                return <Typography>{row.status}</Typography>;
            },
        },
        {
            field: "paidAt",
            headerName: "Paid At",
            flex: 1,
            headerAlign: 'center',
            valueGetter: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            field: "createdAt",
            headerName: "Created At",
            headerAlign: 'center',
            flex: 1,
            valueGetter: ({ value }) => new Date(value).toLocaleDateString(),
        },
        {
            field: "edit",
            headerName: "Check",
            flex: 1,
            headerAlign: 'center',
            renderCell: ({ row }) => {
                return (
                    <Checkbox
                        color="primary"
                        checked={row?.isPaid || false}
                        onChange={(e) => handleCheckboxChange(e, row?._id)}
                    />
                );
            }
        }
    ];


    return (
        <div style={{ height: 400, width: '100%' }}>
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
                    // autoHeight
                    // checkboxSelection
                    rows={data}
                    columns={columns}
                    getRowId={(row) => row?._id}
                // components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </div>
    )
}

export default PaidOrders