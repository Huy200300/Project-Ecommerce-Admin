import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import productCategory from '../helpers/productCategory';
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryAip from '../common';
import { toast } from 'react-toastify';
import { brandByCategory } from '../helpers/brandByCategory';
import { displayProductImages } from '../helpers/displayProductImages';
import specificationsByCategory from '../helpers/specificationsByCategory';
import {
    Dialog, DialogTitle, DialogContent, IconButton,
    TextField, MenuItem, Button, FormControlLabel, Checkbox, Typography,
    Select
} from '@mui/material';

const UploadProduct = ({ onClose, reload }) => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        price: "",
        sellingPrice: "",
        countInStock: "",
        isNew: false,
        isHotDeal: false,
        hotDealDiscount: "",
        colors: [],
        specifications: {}
    });
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const availableSpecifications = specificationsByCategory[data?.category] || [];
    const [fullScreenImage, setFullScreenImage] = useState('');

    const handleColorChange = (index, key, value) => {
        const updatedColors = [...data.colors];
        updatedColors[index] = {
            ...updatedColors[index],
            [key]: value
        };
        setData(prev => ({
            ...prev,
            colors: updatedColors
        }));
    };

    const handleSpecificationChange = (key, value) => {
        setData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: value
            }
        }));
    };


    const handleAddColor = () => {
        setData(prev => ({
            ...prev,
            colors: [...prev.colors, { colorName: "", colorImages: [], stock: 0, size: "", price: 0, sellingPrice: 0 }]
        }));
    };

    const handleColorImageUpload = async (e, index) => {
        const fileArray = Array.from(e.target.files);
        const newImageUrls = [];

        for (const file of fileArray) {
            const uploadResult = await uploadImage(file);
            newImageUrls.push(uploadResult.url);
        }

        const updatedColors = [...data.colors];
        const currentColor = updatedColors[index];

        updatedColors[index] = {
            ...currentColor,
            colorImages: [...currentColor.colorImages, ...newImageUrls]
        };

        setData(prev => ({
            ...prev,
            colors: updatedColors
        }));
    };

    const handleOnChange = (e) => {
        const { name, value, checked, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUploadProduct = async (e) => {
        const files = e.target.files;
        const urls = [];

        for (const file of files) {
            const uploadResult = await uploadImage(file);
            urls.push(uploadResult.url);
        }

        setData(prev => ({
            ...prev,
            productImage: [...prev.productImage, ...urls]
        }));
    };

    const handleDeleteImage = (index, type, colorIndex = null) => {
        if (type === 'product') {
            const newProductImage = [...data.productImage];
            newProductImage.splice(index, 1);
            setData(prev => ({
                ...prev,
                productImage: newProductImage
            }));
        } else if (type === 'color' && colorIndex !== null) {
            const updatedColors = [...data.colors];
            const currentColor = updatedColors[colorIndex];

            currentColor.colorImages.splice(index, 1);

            updatedColors[colorIndex] = {
                ...currentColor,
            };

            setData(prev => ({
                ...prev,
                colors: updatedColors
            }));
        }
    };


    const handleSubmitProduct = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...data,
            specifications: data.specifications,
            specificationsModel: data.category,
        };

        const dataResponse = await fetch(SummaryAip.create_product.url, {
            method: SummaryAip.create_product.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });
        const dataApi = await dataResponse.json();
        if (dataApi.success) {
            toast.success(dataApi.message);
            onClose();
            reload("Pending");
        } else if (dataApi.error) {
            toast.error(dataApi.message);
        }
    };

    const getAvailableColors = (category) => {
        const colorsByCategory = {
            mobiles: ["Đen", "Trắng", "Đỏ", "Xanh Ngọc", "Bạc", "Kem", "Xám", "Tím", "Xanh Lá", "Xanh", "Vàng", "Titan Trắng", "Titan Đen", "Titan Tự Nhiên", "TiTan Xanh"],
            laptop: ["Xám", "Bạc", "Xanh", "Vàng", "Đen", "Xanh Dương"],
            ipad: ["Bạc", "Xám", "Vàng", "Xanh Lá", "Kem"],
            watches: ["Đen", "Nâu", "Bạc", "Xanh Đen", "Vàng"],
            televisions: ["Đen", "Trắng"],
            earphones: ["Đen", "Trắng"],
            refrigerator: ["Bạc", "Trắng"],
            air_conditioning: ["Trắng", "Xám"],
            accessory: ["Đen", "Trắng"]
        };
        return colorsByCategory[category] || [];
    };
    const phoneSizes = ['64GB', '128GB', '256GB'];

    const availableColors = getAvailableColors(data.category);
    const availableBrands = brandByCategory(data.category);



    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h6">Thêm sản phẩm mới</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <IoClose />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <form onSubmit={handleSubmitProduct}>
                    <TextField
                        label="Tên Sản Phẩm"
                        variant="outlined"
                        fullWidth
                        required
                        name="productName"
                        value={data.productName}
                        onChange={handleOnChange}
                        margin="normal"
                    />
                    <TextField
                        label="Danh Mục"
                        variant="outlined"
                        select
                        fullWidth
                        required
                        name="category"
                        value={data.category}
                        onChange={handleOnChange}
                        margin="normal"
                    >
                        <MenuItem value="">Chọn Danh Mục</MenuItem>
                        {productCategory.map((el, index) => (
                            <MenuItem key={index} value={el.value}>{el.label}</MenuItem>
                        ))}
                    </TextField>
                    {availableBrands.length > 0 && (
                        <TextField
                            label="Hãng "
                            variant="outlined"
                            select
                            fullWidth
                            required
                            name="brandName"
                            value={data.brandName}
                            onChange={handleOnChange}
                            margin="normal"
                        >
                            <MenuItem value="">Select Brand</MenuItem>
                            {availableBrands.map((el, index) => (
                                <MenuItem key={index} value={el.value}>{el.label}</MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        label="Giá Gốc"
                        variant="outlined"
                        fullWidth
                        required
                        name="price"
                        type="number"
                        value={data.price}
                        onChange={handleOnChange}
                        margin="normal"
                    />

                    <TextField
                        label="Giá Bán"
                        variant="outlined"
                        fullWidth
                        required
                        name="sellingPrice"
                        type="number"
                        value={data.sellingPrice}
                        onChange={handleOnChange}
                        margin="normal"
                    />

                    <TextField
                        label="Số Lượng Trong Kho"
                        variant="outlined"
                        fullWidth
                        required
                        name="countInStock"
                        type="number"
                        value={data.countInStock}
                        onChange={handleOnChange}
                        margin="normal"
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.isNew}
                                onChange={handleOnChange}
                                name="isNew"
                            />
                        }
                        label="Sản Phẩm Mới"
                    />

                    <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ mt: 2, mb: 2 }}
                        startIcon={<FaCloudUploadAlt />}
                    >
                        Hình ảnh sản phẩm
                        <input
                            type="file"
                            hidden
                            multiple
                            onChange={handleUploadProduct}
                        />
                    </Button>
                    <div>
                        {displayProductImages(data.productImage, setOpenFullScreenImage, setFullScreenImage, handleDeleteImage, 'product')}
                    </div>

                    <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Colors</Typography>

                    {!data.category ? (
                        <p className="text-red-500">Bạn cần chọn danh mục trước.</p>
                    ) : (
                        <>
                            {data.colors.map((color, index) => (
                                <div key={index} style={{ marginBottom: '16px' }}>
                                    <TextField
                                        label="Màu"
                                        variant="outlined"
                                        fullWidth
                                        select
                                        name="colorName"
                                        value={color.colorName}
                                        onChange={(e) => handleColorChange(index, 'colorName', e.target.value)}
                                        margin="normal"
                                    >
                                        {availableColors.map((color, i) => (
                                            <MenuItem key={i} value={color}>
                                                {color}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    {data.category === 'mobiles' && (
                                        <>
                                            <Select
                                                label="Dung lượng"
                                                variant="outlined"
                                                fullWidth
                                                value={color.size || ''}
                                                onChange={(e) => handleColorChange(index, 'size', e.target.value)}
                                                margin="normal"
                                            >
                                                {phoneSizes.map(size => (
                                                    <MenuItem key={size} value={size}>
                                                        {size}
                                                    </MenuItem>
                                                ))}
                                            </Select>

                                            <TextField
                                                label="Giá gốc theo dung lượng"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                name="price"
                                                value={color.price}
                                                onChange={(e) => handleColorChange(index, 'price', e.target.value)}
                                                margin="normal"
                                            />
                                            <TextField
                                                label="Giá bán theo dung lượng"
                                                variant="outlined"
                                                fullWidth
                                                type="number"
                                                name="sellingPrice"
                                                value={color.sellingPrice}
                                                onChange={(e) => handleColorChange(index, 'sellingPrice', e.target.value)}
                                                margin="normal"
                                            />
                                        </>
                                    )}

                                    <TextField
                                        label="Số lượng trong kho theo màu và dung lượng"
                                        variant="outlined"
                                        fullWidth
                                        name="stock"
                                        type="number"
                                        value={color.stock}
                                        onChange={(e) => handleColorChange(index, 'stock', e.target.value)}
                                        margin="normal"
                                    />

                                    <Button
                                        variant="contained"
                                        component="label"
                                        fullWidth
                                        sx={{ mt: 1, mb: 1 }}
                                        startIcon={<FaCloudUploadAlt />}
                                    >
                                        Hình ảnh màu sản phẩm đó
                                        <input
                                            type="file"
                                            hidden
                                            multiple
                                            onChange={(e) => handleColorImageUpload(e, index)}
                                        />
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => {
                                            const updatedColors = [...data.colors];
                                            updatedColors.splice(index, 1);
                                            setData(prev => ({
                                                ...prev,
                                                colors: updatedColors
                                            }));
                                        }}
                                        sx={{ mt: 2 }}
                                    >
                                       Xóa màu
                                    </Button>

                                    <div>
                                        {displayProductImages(color.colorImages, setOpenFullScreenImage, setFullScreenImage, handleDeleteImage, "color", index)}
                                    </div>
                                </div>
                            ))}

                            <Button onClick={handleAddColor} variant="contained" fullWidth sx={{ mt: 2 }}>
                                Thêm màu sản phẩm
                            </Button>
                        </>
                    )}

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={data.isHotDeal}
                                onChange={handleOnChange}
                                name="isHotDeal"
                            />
                        }
                        label="Sản Phẩm Hot"
                    />

                    {data.isHotDeal && (
                        <TextField
                            label="Giảm giá Hot Deal (%)"
                            variant="outlined"
                            fullWidth
                            required
                            name="hotDealDiscount"
                            type="number"
                            value={data.hotDealDiscount}
                            onChange={handleOnChange}
                            margin="normal"
                        />
                    )}

                    <TextField
                        label="Mô tả sản phẩm"
                        variant="outlined"
                        fullWidth
                        required
                        name="description"
                        value={data.description}
                        onChange={handleOnChange}
                        margin="normal"
                    />

                    {data.category && (
                        <div>
                            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Thông Số Kỹ Thuật</Typography>
                            {Object.entries(availableSpecifications).map(([key, label]) => (
                                <TextField
                                    key={key}
                                    label={label}
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={data.specifications[key] || ''}
                                    onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                />
                            ))}
                        </div>
                    )}


                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Thêm sản phẩm
                    </Button>
                </form>
            </DialogContent>

            {openFullScreenImage && <DisplayImage image={fullScreenImage} onClose={() => setOpenFullScreenImage(false)} />}
        </Dialog>
    );
};

export default UploadProduct;
