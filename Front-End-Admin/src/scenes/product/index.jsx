import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography, useTheme } from '@mui/material';
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import SummaryApi from "../../common";
import translatedCategory from "../../helpers/translatedCategory";
import { MdDeleteOutline } from 'react-icons/md';
import { FaCheck, FaRegEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminEditProduct from "../../components/AdminEditProduct";
import GenericModal from "../../components/GenericModal";
import UploadProduct from '../../components/UploadProduct';
import productCategory from "../../helpers/productCategory";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);
  const [editProduct, setEditProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openUploadProduct, setOpenUploadProduct] = useState(false)
  const [openDeleteProduct, setOpenDeleteProduct] = useState(false)

  const fetchProductsByStatus = async (filterStatus, categoryFilter) => {
    setLoading(true);
    const response = await fetch(SummaryApi.products_filter_status.url, {
      method: SummaryApi.products_filter_status.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ status: filterStatus, category: categoryFilter }),
    });
    setLoading(false);
    const dataApi = await response.json();
    setData(dataApi?.data);
  };

  const handleEditProduct = (product) => {
    setDataEdit(product);
    setEditProduct(true);
  };

  const deleteProduct = async () => {
    setLoading(true);
    const response = await fetch(SummaryApi.delete_product.url, {
      method: SummaryApi.delete_product.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ _id: selectedProduct }),
    });
    setLoading(false);
    const dataApi = await response.json();
    if (dataApi?.success) {
      toast.success(dataApi?.message);
      fetchProductsByStatus(actionType);
      setOpenDeleteProduct(false);
    } else {
      toast.error(dataApi?.message);
    }
  };

  const handleDeleteProduct = (productId, newStatus) => {
    setSelectedProduct(productId);
    setActionType(newStatus);
    setOpenDeleteProduct(true)
  }

  const handleStatusChange = (productId, newStatus) => {
    setSelectedProduct(productId);
    setActionType(newStatus);
    setConfirmModalIsOpen(true);
  };

  const confirmStatusChange = async () => {
    setLoading(true);
    const res = await fetch(SummaryApi?.update_products_status.url, {
      method: SummaryApi.update_products_status.method,
      credentials: "include",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        productId: selectedProduct,
        status: actionType,
      }),
    });
    setLoading(false);
    const data = await res.json()
    if (data.success) {
      toast.success(data.message);
      setFilterStatus(actionType);
      // fetchProductsByStatus(actionType);
      setConfirmModalIsOpen(false);
    }
  };

  const columns = [
    {
      field: "productName",
      headerName: "Product Name",
      flex: 2,
      cellClassName: "name-column--cell",
      headerAlign: 'center',
    },
    {
      field: "productImage",
      headerName: "Product Image",
      flex: 1,
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <img
          src={row.productImage[0]}
          alt={row.name}
          className="w-12 h-12 rounded-full"
        />
      ),
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {translatedCategory(params.row.category)}
        </Typography>
      ),
    },
    {
      field: "brandName",
      headerName: "Brand",
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {params.row.price} VND
        </Typography>
      ),
    },
    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 1,
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography color={colors.greenAccent[500]}>
          {params.row.sellingPrice} VND
        </Typography>
      ),
    },
    {
      field: "selled",
      headerName: "Selled",
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <div className="flex gap-4">
          {row.status === "Pending" && (
            <>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200 flex items-center"
                onClick={() => handleStatusChange(row?._id, "Completed")}
              >
                <FaCheck />
              </button>

              <button
                onClick={() => handleDeleteProduct(row?._id, row?.status)}
                className="bg-red-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-red-600 transition duration-200 flex items-center"
              >
                <MdDeleteOutline />
              </button>

              <button
                onClick={() => handleEditProduct(row)}
                className="bg-blue-500 px-4 py-2 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
              >
                <FaRegEdit />
              </button>
            </>
          )}
          {row.status === "Completed" && (
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition duration-200"
              onClick={() => handleStatusChange(row?._id, "Pending")}
            >
              Đánh dấu là chờ duyệt
            </button>
          )}
        </div>
      ),
    },
  ];

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  useEffect(() => {
    if (filterStatus) {
      fetchProductsByStatus(filterStatus, categoryFilter);
    } else {
      setData([]);
    }
  }, [filterStatus, categoryFilter]);


  return (
    <Box m="20px">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <div>
          <Typography variant="h4" component="h1">
            Sản phẩm
          </Typography>
          <Typography variant="subtitle1" component="h2">
            Danh sách sản phẩm
          </Typography>
        </div>

        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Lọc</InputLabel>
            <Select
              value={filterStatus}
              onChange={handleFilterChange}
              label="Lọc"
            >
              <MenuItem value="Pending">Chờ duyệt</MenuItem>
              <MenuItem value="Completed">Đã hoàn thành</MenuItem>
            </Select>
          </FormControl>

          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryChange}
              label="danh mục"
            >
              <MenuItem value="">Tất cả</MenuItem>
              {productCategory.map((category) => (
                <MenuItem key={category.id} value={category.value}>
                  {category.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            sx={{ whiteSpace: 'nowrap' }}
            onClick={() => setOpenUploadProduct(true)}
          >
            Thêm sản phẩm
          </Button>
        </Stack>

      </Stack>

      <Box mt={4} height="75vh">
        {
          !loading &&
          <DataGrid rows={data} columns={columns} getRowId={(row) => row?._id} />
        }
      </Box>

      <GenericModal
        title="Xác nhận thay đổi trạng thái"
        isOpen={confirmModalIsOpen}
        onClose={() => setConfirmModalIsOpen(false)}
        children="Bạn có chắc chắn muốn thay đổi trạng thái của sản phẩm này không?"
        footer={
          <div className="flex justify-end gap-4">
            <button
              onClick={confirmStatusChange}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setConfirmModalIsOpen(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            >
              Hủy
            </button>
          </div>
        }
      />

      <GenericModal
        title="Xác nhận xóa sản phẩm"
        isOpen={openDeleteProduct}
        onClose={() => setOpenDeleteProduct(false)}
        children="Bạn có chắc chắn muốn xóa sản phẩm này không?"
        footer={
          <div className="flex justify-end gap-4">
            <button
              onClick={deleteProduct}
              className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              Xác nhận
            </button>
            <button
              onClick={() => setOpenDeleteProduct(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-600 transition duration-200"
            >
              Hủy
            </button>
          </div>
        }
      />

      {
        openUploadProduct && (
          <UploadProduct onClose={() => setOpenUploadProduct(false)} reload={fetchProductsByStatus} />
        )
      }


      {editProduct && (
        <AdminEditProduct
          onClose={() => setEditProduct(false)}
          dataProduct={dataEdit}
          reload={fetchProductsByStatus}
        />
      )}
    </Box>

  );
};

export default Invoices;
