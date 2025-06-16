"use client";

import { useEffect } from "react";
import { Box, CircularProgress, Typography, Alert, Grid } from "@mui/material";
import { useProjectsStore } from "@/store/useProjectsStore";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsPage() {
  const { projects, fetchAll, filter, loading, error } = useProjectsStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const filtered = projects.filter((p) =>
    (p.technologies ?? []).some((tech) =>
      tech.toLowerCase().includes(filter.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (filtered.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6">No se encontraron proyectos.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={2}>
        {filtered.map((project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={project._id}>
            <ProjectCard project={project} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
