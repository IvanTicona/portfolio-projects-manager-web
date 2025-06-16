"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Chip,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import api from "@/utils/api";

interface Project {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  technologies: string[];
  image?: { url: string; public_id: string };
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get<Project>(`/projects/${id}`);
        setProject(res.data);
      } catch {
        setError("Error al obtener el proyecto");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${id}`);
      router.push("/projects");
    } catch {
      setError("Error al eliminar el proyecto");
    }
  };

  if (loading) {
    return (
      <Box sx={{ mt: 8, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ mt: 4, px: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!project) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>No se encontró el proyecto.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%" },
        mx: "auto",
        mt: 4,
      }}
    >
      <Card>
        {project.image?.url && (
          <CardMedia
            component="img"
            height={isSmUp ? 300 : 200}
            image={project.image.url}
            alt={project.title}
          />
        )}
        <CardContent>
          <Typography variant={isSmUp ? "h4" : "h5"} gutterBottom>
            {project.title}
          </Typography>
          {project.description && (
            <Typography paragraph>{project.description}</Typography>
          )}
          {project.url && (
            <Typography>
              URL:{" "}
              <a href={project.url} target="_blank" rel="noopener noreferrer">
                {project.url}
              </a>
            </Typography>
          )}
          {project.technologies.length > 0 && (
            <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
              {project.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size={isSmUp ? "medium" : "small"}
                />
              ))}
            </Stack>
          )}
          <Typography variant="caption" display="block" mt={2}>
            Creado: {new Date(project.createdAt).toLocaleDateString()}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={() => router.push(`/projects/${id}/edit`)}
          >
            Editar
          </Button>
          <Button color="error" onClick={() => setConfirmOpen(true)}>
            Borrar
          </Button>
        </CardActions>
      </Card>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirmar borrado</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este proyecto? Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancelar</Button>
          <Button color="error" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
