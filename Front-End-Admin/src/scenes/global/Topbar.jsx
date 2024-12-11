import { Box, IconButton, useTheme } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation, useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from 'react-toastify';


const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    closeAllDropdowns();
  }, [location]);

  const handleLogOut = useCallback(async () => {
    const response = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: "include"
    });
    const data = await response.json();
    if (data.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      toast.success(data.message);
      navigate("/");
    } else {
      toast.error(data.message);
    }
  }, [navigate]);

  const closeAllDropdowns = () => {
    setIsDropdownOpen(false);
    setIsFavoritesOpen(false);
    setMenuDisplay(false)
  };

  const close = (setIsOpen, setIsOpenT) => {
    setIsOpen(false)
    setIsOpenT(false)
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
        <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton>
      </Box>

      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton className="relative flex justify-center" onClick={() => {
          setMenuDisplay(!menuDisplay);
          if (!menuDisplay) close(setIsDropdownOpen, setIsFavoritesOpen)
        }}>
          <PersonOutlinedIcon />
          {menuDisplay && (
            <div onClick={closeAllDropdowns} className='absolute font-semibold bg-white text-black bottom-0 right-0 top-14 z-40 h-fit p-2 shadow-lg rounded'>
              <nav>
                {/* <Link to="/profile" className='whitespace-nowrap hidden md:block hover:bg-slate-200 p-2'>
                  Thông tin tài khoản
                </Link>
                <Link to="/order" className='whitespace-nowrap hidden md:block hover:bg-slate-200 p-2'>
                  Đơn hàng của bạn
                </Link> */}
                <button onClick={handleLogOut} className='w-full text-start whitespace-nowrap hidden md:block hover:bg-slate-200 p-2'>
                  Đăng Xuất
                </button>
              </nav>
            </div>
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
