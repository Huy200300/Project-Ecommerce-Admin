import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/user";
import Invoices from "./scenes/product";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Register from "./scenes/auth/Register";
import Login from "./scenes/auth/Login";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Order from "./scenes/order";
import OrderProcessing from "./scenes/orderProcessing";
import PaidOrders from "./scenes/paidOrders";
import DeliveryStaff from "./scenes/deliveryStaff";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  const location = useLocation();

  const isAuthRoute =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ToastContainer position="top-right" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {!isAuthRoute && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
            {!isAuthRoute &&  (
              <Topbar setIsSidebar={setIsSidebar} />
            )}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<Team />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/product" element={<Invoices />} />
              <Route path="/delivery-staff" element={<DeliveryStaff />} />
              <Route path="/order" element={<Order />} />
              <Route path="/order-processing" element={<OrderProcessing />} />
              <Route path="/paid-orders" element={<PaidOrders />} />
              <Route path="/form" element={<Form />} />
              <Route path="/bar" element={<Bar />} />
              <Route path="/pie" element={<Pie />} />
              <Route path="/line" element={<Line />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/geography" element={<Geography />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
