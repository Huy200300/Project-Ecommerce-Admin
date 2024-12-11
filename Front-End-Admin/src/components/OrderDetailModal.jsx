import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";

const OrderDetailModal = ({ open, onClose, order, status, onCancelOrder, ok, onConfirm, isCancel = true }) => {
    const [showCancelInput, setShowCancelInput] = useState(false);
    const [cancelReason, setCancelReason] = useState("");

    const handleCancelOrder = (e) => {
        e.preventDefault();
        if (cancelReason) {
            onCancelOrder(e, cancelReason);
            setCancelReason("");
            setShowCancelInput(false);
        }
    };

    const hasStock = order?.productDetails?.some((product) => product.stock === 0);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Chi tiết đơn hàng
                <IconButton onClick={onClose} edge="end">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {order ? (
                    <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                        <div className="mb-6">
                            <h2 className="text-lg font-bold text-gray-800">
                                Mã đơn hàng: <span className="text-blue-600">#{order.orderId}</span>
                            </h2>
                        </div>

                        <div className="space-y-4">
                            {order.productDetails.map((product) => (
                                <div
                                    key={product._id}
                                    className={`flex items-center bg-white p-4 rounded-lg shadow-sm border ${product.stock === 0 ? "border-red-500" : "border-gray-200"
                                        }`}
                                >
                                    <div className="w-1/4 flex justify-center">
                                        <img
                                            src={product.color ? product.colorImage : product.colorImage}
                                            alt={product.productName}
                                            className="w-20 h-20 object-contain rounded-lg border"
                                        />
                                    </div>

                                    <div className="w-3/4 pl-4">
                                        <h3 className="text-md font-semibold text-gray-800">
                                            {product.productName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Giá:{" "}
                                            <span className="text-blue-500 font-medium">
                                                {product.price.toLocaleString()} VND
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Số lượng:{" "}
                                            <span className="text-blue-500 font-medium">
                                                {product.quantity}
                                            </span>
                                        </p>
                                        {product.stock === 0 && (
                                            <p className="text-sm text-red-500 font-semibold">
                                                Hết hàng
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-md font-semibold text-gray-800 mb-4">
                                Thông tin giao hàng:
                            </h3>
                            {order.shippingDetails.map((ship) => (
                                <div
                                    key={ship.shippingAddress._id}
                                    className="text-sm space-y-2 text-gray-700"
                                >
                                    <p>
                                        <span className="font-medium text-gray-800">Tên khách hàng:</span>{" "}
                                        {ship.shippingAddress.fullName}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Số điện thoại:</span>{" "}
                                        {ship.shippingAddress.phone}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Địa chỉ:</span>{" "}
                                        {ship.shippingAddress.fullAddress}
                                    </p>
                                    <p>
                                        <span className="font-medium text-gray-800">Giao tới:</span>{" "}
                                        {ship.shippingAddress.addressType}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Typography>Không tìm thấy chi tiết đơn hàng.</Typography>
                )}
            </DialogContent>
            <DialogActions>
                {showCancelInput ? (
                    <div className="flex items-center w-full">
                        <TextField
                            size="small"
                            placeholder="Nhập lý do hủy"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            variant="outlined"
                            className="flex-grow mr-2"
                        />
                        <IconButton onClick={handleCancelOrder} color="error">
                            <CancelIcon />
                        </IconButton>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                setShowCancelInput(false);
                                setCancelReason("");
                            }}
                            className="ml-2"
                        >
                            Trở lại
                        </Button>
                    </div>
                ) : (
                    <>
                        {
                            (isCancel) && <Button
                                variant="contained"
                                color="error"
                                onClick={() => setShowCancelInput(true)}
                            >
                                Hủy đơn hàng
                            </Button>
                        }
                        {!hasStock && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={onConfirm}
                            >
                                {ok ? ok : "Xác nhận xử lý"}
                            </Button>
                        )}
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailModal;
