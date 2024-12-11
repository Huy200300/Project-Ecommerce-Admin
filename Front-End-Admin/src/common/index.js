const backendDomain = process.env.REACT_APP_SERVER_DOMAIN;

const SummaryApi = {
  signUp: {
    url: `${backendDomain}/api/register`,
    method: "POST",
  },
  signIn: {
    url: `${backendDomain}/api/login`,
    method: "POST",
  },
  userDetail: {
    url: `${backendDomain}/api/user-details`,
    method: "GET",
  },
  all_users: {
    url: `${backendDomain}/api/all-users`,
    method: "GET",
  },
  all_products: {
    url: `${backendDomain}/api/all-products`,
    method: "GET",
  },
  all_orders: {
    url: `${backendDomain}/api/all-orders`,
    method: "GET",
  },
  get_order_processing: {
    url: `${backendDomain}/api/order-processing`,
    method: "GET",
  },
  update_status_order: {
    url: `${backendDomain}/api/update-status-order`,
    method: "POST",
  },
  update_products_status: {
    url: `${backendDomain}/api/products-status`,
    method: "POST",
  },
  update_product: {
    url: `${backendDomain}/api/update-product`,
    method: "POST",
  },
  delete_product: {
    url: `${backendDomain}/api/delete-product`,
    method: "POST",
  },
  products_filter_status: {
    url: `${backendDomain}/api/products-filter-status`,
    method: "POST",
  },
  updateUserRole: {
    url: `${backendDomain}/api/update-user-role`,
    method: "POST",
  },
  logout_user: {
    url: `${backendDomain}/api/logout`,
    method: "GET",
  },
  get_paid_orders: {
    url: `${backendDomain}/api/paid-orders`,
    method: "GET",
  },
  update_payment_paid: {
    url: `${backendDomain}/api/update-payment-paid`,
    method: "POST",
  },
  create_product: {
    url: `${backendDomain}/api/create-product`,
    method: "POST",
  },
  get_user_order_status: {
    url: `${backendDomain}/api/order-status-updates`,
    method: "GET",
  },
  get_delivery_staff: {
    url: `${backendDomain}/api/delivery-staff`,
    method: "GET",
  },
  specifications_by_id: {
    url: `${backendDomain}/api/specifications-by-id`,
    method: "GET",
  },
  getDashboardStats: {
    url: `${backendDomain}/api/dashboard/stats`,
    method: "GET",
  },
  getChartData: {
    url: `${backendDomain}/api/dashboard/chartData`,
    method: "GET",
  },
  getRecentOrders: {
    url: `${backendDomain}/api/dashboard/recent`,
    method: "GET",
  },
  getRevenuePerMonth: {
    url: `${backendDomain}/api/dashboard/revenue-per-month`,
    method: "GET",
  },
};

export default SummaryApi;
