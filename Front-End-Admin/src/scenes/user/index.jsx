import { Box, Typography, useTheme, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import { Select, MenuItem } from "@mui/material";
import Header from "../../components/Header";
import SummaryApi from "../../common";
import { useEffect, useState } from "react";
import ROLE from "../../common/role";
import { toast } from "react-toastify";
import GenericModal from "../../components/GenericModal";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";



const ROLE_ICONS = {
  ADMIN: <AdminPanelSettingsOutlinedIcon fontSize="small" />,
  GENERAL: <SupervisorAccountOutlinedIcon fontSize="small" />,
  orderManager: <AssignmentOutlinedIcon fontSize="small" />,
  accountant: <MonetizationOnOutlinedIcon fontSize="small" />,
  deliveryStaff: <LocalShippingOutlinedIcon fontSize="small" />,
  productManager: <Inventory2OutlinedIcon fontSize="small" />
};



const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchData = async () => {
    try {
      const res = await fetch(SummaryApi.all_users.url, {
        method: SummaryApi.all_users.method,
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`API request failed with status ${res.status}`);
      }

      const dataApi = await res.json();

      if (dataApi.data) {
        setData(dataApi.data);
        const initialRoles = {};
        dataApi.data.forEach(user => {
          initialRoles[user._id] = user.role;
        });
        setRoles(initialRoles);
      } else {
        console.error('No data found in API response');
        throw new Error('No data found');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(`Error fetching data: ${error.message}`);
    }
  };


  useEffect(() => {
    fetchData().catch((error) => {
      console.error(error);
      toast.error("Failed to fetch data. Please try again later.");
    });
  }, []);


  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: 'center',
    },
    {
      field: "email",
      headerName: "Email",
      flex: 2,
      headerAlign: 'center',
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
      headerAlign: 'center',
    },
    {
      field: "role",
      headerName: "Role",
      flex: 2,
      headerAlign: 'center',
      renderCell: ({ row: { role } }) => (
        <Box
          width="60%"
          m="0 auto"
          p="5px"
          display="flex"
          justifyContent="flex-start"
          alignItems="center"
          backgroundColor={
            role === "ADMIN"
              ? colors.greenAccent[600]
              : role === "GENERAL"
                ? colors.pinkAccent[600]
                : role === "orderManager"
                  ? colors.blueAccent[600]
                  : role === "accountant"
                    ? colors.yellowAccent[600]
                    : role === "productManager"
                      ?
                      colors.cyanAccent[600]
                      : colors.redAccent[600]
          }
          borderRadius="4px"
          overflow="hidden"
        >
          {ROLE_ICONS[role]}
          <Typography className="uppercase" color={colors.grey[100]} sx={{ ml: "3px", fontSize: "12px", fontWeight: "bold" }}>
            {role}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: 1,
      type: "date",
      valueGetter: ({ value }) => new Date(value).toLocaleDateString(),
      headerAlign: 'center',
    },
    {
      field: "avatar",
      headerName: "Image",
      flex: 1,
      headerAlign: 'center',
      renderCell: ({ row }) => (
        <Box display="flex" justifyContent="center">
          {row.avatar ? (
            <img
              src={row.avatar}
              alt={row.name}
              style={{ width: "50px", height: "50px", borderRadius: "50%", objectFit: "cover" }}
            />
          ) : (
            <PersonOutlineIcon style={{ fontSize: "50px", color: colors.grey[500] }} />
          )}
        </Box>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 2,
      headerAlign: 'center',
      renderCell: ({ row }) => {
        const currentRole = roles[row._id] || "";
        const isRoleChanged = currentRole !== row.role;
        return (
          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
            <Select
              value={currentRole}
              onChange={(e) => setRoles({ ...roles, [row._id]: e.target.value })}
              displayEmpty
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="" disabled>Select Role</MenuItem>
              {Object.values(ROLE).map((el) => (
                <MenuItem className="uppercase" value={el} key={el}>
                  <span className="uppercase">{el}</span>
                </MenuItem>
              ))}
            </Select>
            <Button
              variant="contained"
              color={isRoleChanged ? "info" : "primary"}
              onClick={() => {
                if (isRoleChanged) {
                  handleChangeRole(row._id, currentRole);
                } else {
                  handleOpenModal(row);
                }
              }}
            >
              {isRoleChanged ? "Change Role" : "Edit"}
            </Button>
          </Box>
        );
      },
    },
  ];


  const handleChangeRole = async (id, newRole) => {
    const res = await fetch(SummaryApi.updateUserRole.url, {
      method: SummaryApi.updateUserRole.method,
      credentials: "include",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, newRole })
    })
    const dataApi = await res.json();
    if (dataApi.success) {
      toast.success(dataApi.message)
      fetchData()
    } else {
      toast.error(dataApi.message)
    }
  }

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedUser(null);
  };


  const handleEdit = (data) => {
    console.log("Editing row: ", data);
  };


  return (
    <Box m="20px">
      <Header title="USER" subtitle="Managing the USER Members" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
            textAlign: "center"
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
            textAlign: "center"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            textAlign: "center"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
            textAlign: "center"
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
            textAlign: "center"
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
            textAlign: "center"
          },
        }}
      >
        <DataGrid rows={data} columns={columns} getRowId={(row) => row._id} />
      </Box>
      <GenericModal open={openModal} data={selectedUser} onClose={handleCloseModal} onUpdate={handleEdit} />
    </Box>
  );
};

export default Team;
