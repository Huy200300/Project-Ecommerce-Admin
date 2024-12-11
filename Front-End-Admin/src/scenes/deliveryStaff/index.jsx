import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button, IconButton, TextField } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import OrderDetailModal from "../../components/OrderDetailModal";
import CancelIcon from "@mui/icons-material/Cancel";

// const steps = [
//     { label: "Đơn hàng mới", status: "Pending" },
//     { label: "Đang xử lý", status: "Processing" },
//     { label: "Đang chờ giao hàng", status: "Shipping" },
//     { label: "Đang giao hàng", status: "Shipped" },
//     { label: "Đã giao", status: "Delivered" },
//     { label: "Đã hủy", status: "Cancelled" },

// ];

const steps = [
    { label: "Đang chờ giao hàng", status: "Shipping" },
    { label: "Đang giao hàng", status: "Shipped" },
    { label: "Đã giao", status: "Delivered" },
    { label: "Đã hủy", status: "Cancelled" },
];

function getStatusLabel(status) {
    const statusMap = {
        Shipping: "Đang chờ giao hàng",
        Shipped: "Đang giao hàng",
        Delivered: "Đã giao",
        Cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
}

const DeliveryStaff = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("Shipping");
    const [pageSize, setPageSize] = useState(8);
    const [page, setPage] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelInput, setShowCancelInput] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [status, setStatus] = useState("")

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Bạn cần đăng nhập để xem thông tin nhân viên.");
            return;
        }
        try {
            const res = await fetch(SummaryApi.get_delivery_staff.url, {
                method: SummaryApi.get_delivery_staff.method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
            });
            const dataApi = await res.json();
            setOrders(dataApi.data);
        } catch (error) {
            toast.error("Có lỗi xảy ra khi tải dữ liệu.");
        }
    };

    const updateOrderStatus = async (e, orderId, newStatus, reason) => {
        e.preventDefault();
        e.stopPropagation();

        const res = await fetch(SummaryApi.update_status_order.url, {
            method: SummaryApi.update_status_order.method,
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ orderId, newStatus, reason }),
        });
        const dataApi = await res.json();
        if (dataApi.success) {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, statusHistory: dataApi.data } : order
                )
            );
            toast.success("Cập nhật trạng thái thành công");
            setFilterStatus(newStatus);
            setOpenModal(false);
        } else {
            toast.error(dataApi.message);
        }

    };

    const currentStatus = (order) => {
        const history = order.statusHistory || [];
        return history.length > 0
            ? history[history.length - 1].orderStatus
            : "Unknown";
    };

    const filteredOrders = orders.filter((order) => {
        const status = currentStatus(order);
        return filterStatus === "All"
            ? ["Shipping", "Shipped", "Delivered"].includes(status)
            : status === filterStatus;
    });


    const handleCancelOrder = async (e, reason) => {
        if (!selectedOrder) return;
        await updateOrderStatus(e, selectedOrder._id, "Cancelled", reason);
    };

    const handleOpenModal = (order, status) => {
        setSelectedOrder(order);
        setStatus(status)
        setOpenModal(true);
    };

    const columns = [
        { field: "orderId", headerName: "Mã đơn hàng", flex: 1 },
        {
            field: "productNames",
            headerName: "Tên sản phẩm",
            flex: 2,
            renderCell: (params) => (
                <div className="truncate">
                    {params.row.productDetails.map((product) => (
                        <div key={product._id}>{product.productName}</div>
                    ))}
                </div>
            ),
        },
        {
            field: "prices",
            headerName: "Giá",
            flex: 0.9,
            renderCell: (params) => (
                <div>
                    {params.row.productDetails.map((product) => (
                        <div key={product._id}>{product.price.toLocaleString()} VND</div>
                    ))}
                </div>
            ),
        },
        {
            field: "customerName",
            headerName: "Khách hàng",
            flex: 1,
            valueGetter: (params) => params.row.shippingDetails[0]?.shippingAddress.fullName,
        },
        {
            field: "customerPhone",
            headerName: "Sđt khách hàng",
            flex: 1,
            valueGetter: (params) => params.row.shippingDetails[0]?.shippingAddress.phone,
        },
        {
            field: "totalPrice",
            headerName: "Tổng tiền",
            flex: 1,
            valueGetter: (params) =>
                params.row.productDetails.reduce((total, product) => total + product.price * product.quantity, 0).toLocaleString() + " VND",
        },
        {
            field: "status",
            headerName: "Trạng thái",
            flex: 1.1,
            renderCell: (params) => {
                const status = currentStatus(params.row);
                return (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${status === "Shipped" && "bg-purple-100 text-orange-600"} ${status === "Shipping" && "bg-purple-100 text-purple-600"
                            } ${status === "Delivered" && "bg-green-100 text-green-600"} ${status === "Cancelled" && "bg-red-100 text-red-600"
                            }`}
                    >
                        {getStatusLabel(status)}
                    </span>
                );
            },
        },
        {
            field: "employee",
            headerName: "Nhân viên xử lí",
            flex: 0.9,
            valueGetter: (params) => {
                const { statusHistory } = params.row;
                if (statusHistory && statusHistory.length > 0) {
                    const lastStatus = statusHistory[statusHistory.length - 1];
                    return lastStatus.createdBy ? lastStatus.createdBy.name : "Không có";
                }
                return "Không có";
            },
        },
        {
            field: "action",
            headerName: filterStatus === "Cancelled" ? "Lý do" : "Hành động",
            flex: 2,
            renderCell: (params) => (
                <>
                    {
                        filterStatus === "Cancelled" ? (
                            <div>{params.row.statusHistory[params.row.statusHistory.length - 1].reason}</div>
                        ) : (
                            <>
                                {currentStatus(params.row) === "Shipping" && (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(params.row, "Shipping")}
                                        className="ml-2"
                                    >
                                        Nhận giao hàng
                                    </Button>
                                )}

                                {currentStatus(params.row) === "Shipped" &&
                                    (<>
                                        {showCancelInput[params.row._id] ? (
                                            <div className="flex">
                                                <TextField
                                                    size="small"
                                                    placeholder="Nhập lý do hủy"
                                                    value={cancelReason[params.row._id] || ""}
                                                    onChange={(e) =>
                                                        setCancelReason((prev) => ({
                                                            ...prev,
                                                            [params.row._id]: e.target.value,
                                                        }))
                                                    }
                                                    variant="outlined"
                                                    className="mr-2"
                                                />
                                                <IconButton
                                                    onClick={(e) =>
                                                        updateOrderStatus(
                                                            e,
                                                            params.row._id,
                                                            "Cancelled",
                                                            cancelReason[params.row._id]
                                                        )
                                                    }
                                                    color="error"
                                                >
                                                    <CancelIcon />
                                                </IconButton>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() =>
                                                        setShowCancelInput((prev) => ({
                                                            ...prev,
                                                            [params.row._id]: false,
                                                        }))
                                                    }
                                                    className="ml-2"
                                                >
                                                    Trở lại
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        setShowCancelInput((prev) => ({
                                                            ...prev,
                                                            [params.row._id]: true,
                                                        }))
                                                    }
                                                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transform hover:scale-105 transition-all duration-300"
                                                >
                                                    Hủy đơn
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    // onClick={(e) =>
                                                    //     updateOrderStatus(e, params.row._id, "Delivered", "Xác nhận giao hàng")
                                                    // }
                                                    onClick={() => handleOpenModal(params.row, "Shipped")}
                                                    className="ml-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-md transform hover:scale-105 transition-all duration-300"
                                                >
                                                    Xác nhận giao hàng
                                                </Button>
                                            </>
                                        )}
                                    </>
                                    )
                                }
                            </>
                        )
                    }
                </>
            ),
        }
    ];

    console.log(status)

    return (
        <div className="mx-4" style={{ height: 400, width: "100%" }}>
            <Header title="Nhân viên giao hàng" subtitle="Quản lý nhân viên giao hàng" />

            <div className="flex space-x-2 mb-4">
                {steps.map((step) => (
                    <button
                        key={step.status}
                        onClick={() => setFilterStatus(step.status)}
                        className={`border text-white rounded px-3 py-2 transition ${filterStatus === step.status ? 'bg-blue-500 text-white' : 'text-black'
                            }`}
                    >
                        {step.label}
                    </button>
                ))}
            </div>

            <Box
                m="0 0 0 0"
                height={400}
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.primary[400],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                    },
                }}
            >
                {filteredOrders.length > 0 ? (
                    <DataGrid
                        rows={filteredOrders}
                        columns={columns}
                        getRowId={(row) => row._id}
                        components={{ Toolbar: GridToolbar }}
                        pageSize={pageSize}
                        onPageSizeChange={(newSize) => setPageSize(newSize)}
                        page={page}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                ) : (
                    <div className="text-center">Không có đơn hàng nào .</div>
                )}
            </Box>
            <OrderDetailModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                status={status}
                order={selectedOrder}
                onConfirm={status === "Shipping" ? (e) => updateOrderStatus(e, selectedOrder._id, "Shipped", "Nhận giao hàng") : (e) => updateOrderStatus(e, selectedOrder._id, "Delivered", "Xác nhận giao hàng")}
                onCancelOrder={handleCancelOrder}
                isCancel={false}
                ok={status === "Shipping" ? "Nhận giao hàng" : "Xác nhận giao hàng"}
            />
        </div>
    );
};

export default DeliveryStaff;
