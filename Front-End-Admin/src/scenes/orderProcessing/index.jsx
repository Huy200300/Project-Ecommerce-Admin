import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { useTheme } from "@emotion/react";
import OrderDetailModal from "../../components/OrderDetailModal";

const steps = [
    { label: "Đơn hàng mới", status: "Pending" },
    { label: "Đang xử lý", status: "Processing" },
    { label: "Chuyển cho giao hàng", status: "Shipping" },
    { label: "Đang giao hàng", status: "Shipped" },
    { label: "Đã giao", status: "Delivered" },
    { label: "Đã hủy", status: "Cancelled" },
];

function getStatusLabel(status) {
    const statusMap = {
        Pending: "Đơn hàng mới",
        Processing: "Đang xử lý",
        Shipping: "Chuyển cho giao hàng",
        Shipped: "Đang giao hàng",
        Delivered: "Đã giao",
        Cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
}


const OrderProcessing = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [orders, setOrders] = useState([]);
    const [filterStatus, setFilterStatus] = useState("");
    const [pageSize, setPageSize] = useState(8);
    const [page, setPage] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Bạn cần đăng nhập để xem đơn hàng.");
            return;
        }
        const res = await fetch(SummaryApi.get_order_processing.url, {
            method: SummaryApi.get_order_processing.method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include",
        });
        const dataApi = await res.json();

        setOrders(dataApi.data);

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

    const filteredOrders = filterStatus
        ? orders.filter((order) => currentStatus(order) === filterStatus)
        : orders;

    const handleCancelOrder = async (e, reason) => {
        if (!selectedOrder) return;
        await updateOrderStatus(e, selectedOrder._id, "Cancelled", reason);
    };

    const handleOpenModal = (order) => {
        setSelectedOrder(order);
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
            flex: 1,
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
            flex: 1,
            renderCell: (params) => {
                const status = currentStatus(params.row);
                return (
                    <span
                        className={`px-2 py-1 rounded text-xs font-medium ${status === "Pending" && "bg-yellow-100 text-yellow-600"
                            } ${status === "Processing" && "bg-blue-100 text-blue-600"} ${status === "Shipping" && "bg-purple-100 text-purple-600"
                            } ${status === "Shipped" && "bg-purple-100 text-orange-600"} ${status === "Delivered" && "bg-green-100 text-green-600"} ${status === "Cancelled" && "bg-red-100 text-red-600"
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
            flex: 2.5,
            renderCell: (params) => (
                <>
                    {filterStatus === "Cancelled" ? (
                        <div>{params.row.statusHistory[params.row.statusHistory.length - 1].reason}</div>
                    ) : (
                        <>
                            {currentStatus(params.row) === "Processing" && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(e) =>
                                        updateOrderStatus(e, params.row._id, "Shipping", "Chuyển cho giao hàng")
                                    }
                                >
                                    Chuyển cho giao hàng
                                </Button>
                            )}

                            {currentStatus(params.row) === "Pending" && (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal(params.row)}
                                        className="ml-2"
                                    >
                                        Nhận xử lý
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </>
            ),
            hide: filterStatus === "Shipping" || filterStatus === "Delivered" || filterStatus === "Shipped",

        }
    ];


    return (
        <div className="mx-4" style={{ height: 400, width: "100%" }}>
            <Header title="Order" subtitle="Managing the Order Members" />
            <div className=" flex space-x-2">
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
                <button
                    onClick={() => setFilterStatus("")}
                    className={`border text-white rounded px-3 py-2 transition ${filterStatus === "" ? 'bg-blue-500 text-white' : 'text-black'
                        }`}
                >
                    Tất cả trạng thái
                </button>
            </div>

            <Box
                m="0 0 0 0"
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
                order={selectedOrder}
                onConfirm={(e) => updateOrderStatus(e, selectedOrder._id, "Processing", "Nhận xử lý")}
                onCancelOrder={handleCancelOrder}
            />
        </div>
    );
};

export default OrderProcessing;
