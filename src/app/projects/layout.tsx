"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Snackbar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuthStore } from "@/store/useAuthStore";
import { useProjectsStore } from "@/store/useProjectsStore";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const resetAuth = useAuthStore((state) => state.reset);
  const resetProjects = useProjectsStore((state) => state.reset);
  const filter = useProjectsStore((state) => state.filter);
  const setFilter = useProjectsStore((state) => state.setFilter);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const handleLogout = async () => {
    await logout();
    resetAuth();
    resetProjects();
    setSnackbarOpen(true);
    setTimeout(() => router.push("/"), 1000);
  };

  const toggleDrawer = () => {
    setDrawerOpen((open) => !open);
  };

  const drawerWidth = 240;

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar />
      <List>
        <ListItemButton onClick={() => router.push("/projects/new")}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add New" />
        </ListItemButton>
        <ListItemButton onClick={() => router.push("/projects")}>
          <ListItemIcon>
            <ListIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isMdUp && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Mis Proyectos
          </Typography>
          <Box
            sx={{
              position: "relative",
              borderRadius: (t) => t.shape.borderRadius,
              backgroundColor: (t) => t.palette.common.white,
              display: "flex",
              alignItems: "center",
              px: 1,
              width: { xs: "100%", sm: 300 },
            }}
          >
            <SearchIcon />
            <InputBase
              placeholder="Buscar…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              fullWidth
              sx={{ ml: 1 }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {isMdUp ? (
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      ) : (
        <Drawer
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: { xs: "100%", md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {children}
      </Box>

      <Snackbar
        open={snackbarOpen}
        message="Has cerrado sesión"
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      />
    </Box>
  );
}
