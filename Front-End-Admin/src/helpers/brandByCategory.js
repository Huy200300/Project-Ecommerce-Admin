import bandMobile from "./bandProductCategoryMobile";
import brandLaptop from "./bandProductCategoryLaptop";
import brandTablet from "./bandProductCategoryTablet";
import brandWatch from "./bandProductCategoryWatch";
import brandTelevision from "./brandProductCategoryTelevision";

export const brandByCategory = (category) => {
  switch (category) {
    case "mobiles":
      return bandMobile;
    case "laptop":
      return brandLaptop;
    case "ipad":
      return brandTablet;
    case "watches":
      return brandWatch;
    case "televisions":
      return brandTelevision;
    default:
      return [];
  }
};
