import React from "react";

const categoryTranslations = {
  mobiles: { label: "Điện Thoại" },
  laptop: { label: "Laptop" },
  ipad: { label: "Máy Tính Bảng" },
  accessory: { label: "Phụ Kiện" },
  watches: { label: "Đồng Hồ" },
  apple: { label: "Apple" },
  televisions: {
    label: "Tivi",
  },
};

const translatedCategory = (category, noShow = false) => {
  const getCategoryName = () => {
    return categoryTranslations[category] || {};
  };

  const { label, icon } = getCategoryName(category);
  return label ? (
    <span className="capitalize flex items-center gap-1">
      {noShow && icon} {label}
    </span>
  ) : null;
};

export default translatedCategory;
