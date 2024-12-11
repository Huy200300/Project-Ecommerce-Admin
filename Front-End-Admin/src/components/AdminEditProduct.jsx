import React, { useCallback, useEffect, useState } from 'react';
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



const AdminEditProduct = ({ onClose, dataProduct, reload }) => {

    const [data, setData] = useState({
        ...dataProduct,
        specifications: {}
    })

    const [updatedSpecifications, setUpdatedSpecifications] = useState(data?.specifications || {});
    const productId = dataProduct?._id;
    const availableSpecifications = specificationsByCategory[data?.category] || {};
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false)
    const [fullScreenImage, setFullScreenImage] = useState('')
    const excludedFields = ["_id", "__v"];

    const getDataFromLocalStorage = (key) => {
        const savedData = localStorage.getItem(key);
        try {
            return savedData ? JSON.parse(savedData) : [];
        } catch (error) {
            console.error(`Error parsing saved data from localStorage for key ${key}:`, error);
            return [];
        }
    };
    const [cart, setCart] = useState(() => getDataFromLocalStorage("cart"));
    const [favorites, setFavorites] = useState(() => getDataFromLocalStorage("favorites"));

    const handleOnChange = useCallback((e) => {
        const { name, value, checked, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    }, []);

    const fetchData = async (productId) => {
        const res = await fetch(`${SummaryAip.specifications_by_id.url}/${productId}`, {
            method: SummaryAip.specifications_by_id.method,
            credentials: "include"
        })
        const dataApi = await res.json();
        setData(prev => ({
            ...prev,
            specifications: dataApi?.data
        }));

        setUpdatedSpecifications(dataApi?.data || {});
    }

    useEffect(() => {
        if (productId) {
            fetchData(productId);
        }
    }, [productId]);



    // useEffect(() => {
    //     if (!Object.keys(updatedSpecifications).length && data.category && availableSpecifications) {
    //         const initialSpecs = {};
    //         Object.keys(availableSpecifications).forEach((key) => {
    //             initialSpecs[key] = updatedSpecifications?.[key] || '';
    //         });
    //         setUpdatedSpecifications(initialSpecs);
    //     }
    // }, [availableSpecifications, data.category, updatedSpecifications]);

    const handleSpecificationChange = (key, value) => {
        setUpdatedSpecifications((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleBlur = (key) => {
        setData((prev) => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [key]: updatedSpecifications[key],

            },
        }));
    };


    const handleUploadProduct = async (e) => {
        const file = e.target.files[0]
        const uploadImageCloudinary = await uploadImage(file)
        setData((preve) => {
            return {
                ...preve,
                productImage: [...preve.productImage, uploadImageCloudinary.url]
            }
        })
    }

    const handleDeleteProductImage = async (index) => {
        const newProductImage = [...data.productImage]
        newProductImage.splice(index, 1)
        setData((prev) => {
            return {
                ...prev,
                productImage: [...newProductImage]
            }
        })
    }

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

    const handleColorChange = (index, field, value) => {
        const updatedColors = [...data.colors];
        updatedColors[index][field] = value;
        setData((prev) => ({
            ...prev,
            colors: updatedColors
        }));
    };

    const handleAddColor = () => {
        setData((prev) => ({
            ...prev,
            colors: [...prev.colors, { colorName: "", colorImages: [], stock: 0, size: "", price: 0 }]
        }));
    };

    const handleDeleteColor = (index) => {
        const updatedColors = [...data.colors];
        updatedColors.splice(index, 1);
        setData((prev) => ({
            ...prev,
            colors: updatedColors
        }));
    };

    const handleSubmitProduct = async (e, id) => {
        e.preventDefault()
        const dataResponse = await fetch(SummaryAip.update_product.url, {
            method: SummaryAip.update_product.method,
            credentials: "include",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                specifications: updatedSpecifications,
                specificationsModel: data.category,
                ...data
            })
        })
        const dataApi = await dataResponse.json()
        if (dataApi.success) {
            const updatedFavorites = favorites.map((favor) =>
                favor._id === id ? dataApi.data : favor
            );
            const updatedProducts = cart.map((product) =>
                product._id === id ? dataApi.data : product
            );

            setCart(updatedProducts);
            setFavorites(updatedFavorites);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            localStorage.setItem('cart', JSON.stringify(updatedProducts));
            toast.success(dataApi.message)
            onClose()
            reload(data?.status)
        } else if (dataApi.error) {
            toast.error(dataApi.message)
        }
    }

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

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setData((prev) => ({
            ...prev,
            category: selectedCategory,
            specifications: {}
        }));
    };


    const availableColors = getAvailableColors(data.category);
    const phoneSizes = ['64GB', '128GB', '256GB', "512GB", "1TB"];
    const brandOptions = brandByCategory(data.category);

    return (
        <div className='fixed w-full h-full bg-slate-200 bg-opacity-35 top-14 left-0 right-0 bottom-0 flex items-center justify-center'>
            <div className='bg-white p-4 rounded w-full max-w-2xl h-full max-h-[80%] overflow-hidden'>
                <div className='flex text-black items-center pb-3'>
                    <h2 className=' text-lg '>Sửa Sản Phẩm</h2>
                    <div onClick={onClose} className='w-fit ml-auto text-2xl cursor-pointer hover:text-red-500'>
                        <IoClose />
                    </div>
                </div>
                <form className='grid text-black p-4 gap-2 overflow-y-scroll h-full pb-4' onSubmit={(e) => handleSubmitProduct(e, data._id)}>
                    <label htmlFor="productName">Tên sản phẩm :</label>
                    <input required className='p-2 border bg-slate-100 rounded' type="text" name='productName' id='productName' placeholder='Enter Product Name' value={data.productName} onChange={handleOnChange} />
                    <label htmlFor="category" className='mt-3'>Danh mục :</label>
                    <select required value={data.category} name='category' onChange={handleCategoryChange} className='p-2 border bg-slate-100 rounded'>
                        <option value="">Chọn danh mục</option>
                        {
                            productCategory.map((el, index) => {
                                return (
                                    <option value={el.value} key={el.value + index}>{el.label}</option>
                                )
                            })
                        }
                    </select>
                    {brandOptions.length > 0 && (
                        <>
                            <label htmlFor="brandName">Hãng:</label>
                            <select required value={data.brandName} name='brandName' onChange={handleOnChange} className="p-2 border bg-slate-100 rounded">
                                {brandOptions.map(({ label, value }) => (
                                    <option key={value} value={value}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                    <label htmlFor="productImage" className='mt-3'>Ảnh sản phẩm :</label>
                    <label htmlFor="uploadImageInput">
                        <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>
                            <div className='text-slate-500 flex items-center justify-center flex-col gap-2 cursor-pointer'>
                                <span className='text-4xl'><FaCloudUploadAlt /></span>
                                <p className='text-sm'>Edit Product Image</p>
                                <input type="file" name="" id="uploadImageInput" className='hidden' onChange={handleUploadProduct} />
                            </div>
                        </div>
                    </label>
                    <div>
                        {displayProductImages(data.productImage, setOpenFullScreenImage, setFullScreenImage, handleDeleteProductImage)}
                    </div>
                    <label htmlFor="price" className='mt-3'>Giá gốc :</label>
                    <input required className='p-2 border bg-slate-100 rounded' type="number" name='price' id='price' placeholder='Enter Product Price' value={data.price} onChange={handleOnChange} />
                    <label htmlFor="countInStock" className='mt-3'>Số lươngj trong kho :</label>
                    <input required className='p-2 border bg-slate-100 rounded' type="number" name='countInStock' id='countInStock' placeholder='Enter Count In Stock' value={data.countInStock} onChange={handleOnChange} />
                    <label htmlFor="sellingPrice" className='mt-3'>Giá bán :</label>
                    <input required className='p-2 border bg-slate-100 rounded' type="number" name='sellingPrice' id='sellingPrice' placeholder='Enter Selling Price' value={data.sellingPrice} onChange={handleOnChange} />
                    <label htmlFor="colors" className='mt-3'>Màu :</label>
                    {data?.colors.map((color, index) => (
                        <div key={index} className="mb-4">
                            <label htmlFor={`colorName-${index}`} className='block'>Tên màu:</label>
                            <select
                                id={`colorName-${index}`}
                                value={color.colorName}
                                onChange={(e) => handleColorChange(index, 'colorName', e.target.value)}
                                className='p-2 border bg-slate-100 rounded w-full'
                            >
                                <option value="">Chọn màu</option>
                                {availableColors.map((color, i) => (
                                    <option value={color} key={i}>{color}</option>
                                ))}
                            </select>
                            <label htmlFor="colorImages" className='mt-3 block'>Hình ảnh:</label>
                            <label htmlFor={`uploadImageColor-${index}`}>
                                <div className='p-2 bg-slate-100 border rounded h-32 w-full flex justify-center items-center'>
                                    <div className='text-slate-500 flex items-center justify-center flex-col gap-2 cursor-pointer'>
                                        <span className='text-4xl'><FaCloudUploadAlt /></span>
                                        <p className='text-sm'>Tải ảnh lên</p>
                                        <input
                                            type="file"
                                            id={`uploadImageColor-${index}`}
                                            className='hidden'
                                            multiple
                                            onChange={(e) => handleColorImageUpload(e, index)}
                                        />
                                    </div>
                                </div>
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {displayProductImages(color.colorImages, setOpenFullScreenImage, setFullScreenImage, (i) => {
                                    const updatedColorImages = [...color.colorImages];
                                    updatedColorImages.splice(i, 1);
                                    handleColorChange(index, "colorImages", updatedColorImages);
                                })}
                            </div>
                            <label htmlFor={`colorStock-${index}`} className='block mt-3'>Số lượng màu trong kho:</label>
                            <input
                                type="number"
                                value={color.stock}
                                onChange={(e) => handleColorChange(index, 'stock', Number(e.target.value))}
                                className='p-2 border bg-slate-100 rounded w-full'
                                placeholder='Enter Stock Quantity'
                                min="0"
                            />
                            {data.category === 'mobiles' && (
                                <>
                                    <label htmlFor={`colorName-${index}`} className='block'>Kích thước:</label>
                                    <select
                                        id={`colorName-${index}`}
                                        variant="outlined"
                                        fullWidth
                                        value={color.size || ''}
                                        onChange={(e) => handleColorChange(index, 'size', e.target.value)}
                                        className='p-2 border bg-slate-100 rounded w-full'
                                    >
                                        <option value="">Select Size</option>
                                        {phoneSizes.map(size => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor={`colorName-${index}`} className='block'>Giá gốc theo dung lượng:</label>
                                    <input
                                        type="number"
                                        name="price"
                                        id="price"
                                        placeholder="Enter Price"
                                        value={color.price}
                                        onChange={(e) => handleColorChange(index, "price", Number(e.target.value))}
                                        className="p-2 w-full border bg-slate-100 rounded"
                                        min="0"
                                    />
                                    <label htmlFor={`colorName-${index}`} className='block'>Giá bán theo dung lượng:</label>
                                    <input
                                        type="number"
                                        name="sellingPrice"
                                        id="sellingPrice"
                                        placeholder="Enter sellingPrice"
                                        value={color.sellingPrice}
                                        onChange={(e) => handleColorChange(index, "sellingPrice", Number(e.target.value))}
                                        className="p-2 w-full border bg-slate-100 rounded"
                                        min="0"
                                    />
                                </>
                            )}

                            <button
                                type="button"
                                onClick={() => handleDeleteColor(index)}
                                className='text-red-600 hover:underline mt-2 block'
                            >
                                Xóa màu
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddColor}
                        className='px-3 py-2 bg-blue-600 text-white mb-4 hover:bg-blue-700'
                    >
                        Thêm màu
                    </button>
                    <label htmlFor="isHotDeal" className='mt-3'>Sản phẩm Hot:</label>
                    <input
                        type="checkbox"
                        name="isHotDeal"
                        id="isHotDeal"
                        checked={data.isHotDeal}
                        onChange={handleOnChange}
                        className="mt-2"
                    />
                    {data.isHotDeal && (
                        <>
                            <label htmlFor="hotDealDiscount" className='mt-3'>Giám giá Hot:</label>
                            <input
                                type="number"
                                name="hotDealDiscount"
                                id="hotDealDiscount"
                                placeholder="Enter Hot Deal Discount"
                                value={data.hotDealDiscount || ''}
                                onChange={handleOnChange}
                                className="p-2 border bg-slate-100 rounded"
                                min="0"
                            />
                        </>
                    )}
                    <label htmlFor="description" className='mt-3'>Mô tả sản phẩm :</label>
                    <textarea value={data.description} className='h-28 bg-slate-100 border resize-none p-1' rows={3} placeholder='Enter Product Description' name='description' onChange={handleOnChange}></textarea>
                    <div className="flex justify-start items-center">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name='isNew'
                                checked={data?.isNew}
                                onChange={handleOnChange}
                                className="mr-2"
                            />
                            isNew
                        </label>
                    </div>

                    <div>
                        {console.log(Object.keys(updatedSpecifications),data?.category)}
                        {Object.keys(updatedSpecifications).filter(([key]) => excludedFields?.includes(key)).length > 0
                            ? (
                                Object.entries(updatedSpecifications)
                                    .filter(([key]) => !excludedFields?.includes(key))
                                    .map(([key, value]) => (
                                        <div key={key} className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {key}:
                                            </label>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))
                            )
                            : data?.category && (
                                <div>
                                    <h2 className="text-lg font-semibold mt-2 mb-1">Thông Số Kỹ Thuật</h2>
                                    {Object.entries(availableSpecifications).map(([key, label]) => (
                                        <div key={key} className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                {label}:
                                            </label>
                                            <input
                                                type="text"
                                                value={updatedSpecifications?.[key] || ''}
                                                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                                                onBlur={() => handleBlur(key)}
                                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    <button className='px-3 py-2 bg-red-600 text-white mb-10 hover:bg-red-700'>Sửa sản phẩm</button>
                </form>
            </div>
            {
                openFullScreenImage && (
                    <DisplayImage onClose={() => setOpenFullScreenImage(false)} image={fullScreenImage} />
                )
            }

        </div>
    )
}

export default AdminEditProduct