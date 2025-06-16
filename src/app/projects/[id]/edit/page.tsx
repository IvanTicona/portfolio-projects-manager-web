"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
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
}

export default function ProjectEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get<Project>(`/projects/${id}`);
        setProject(data);
        setTitle(data.title);
        setDescription(data.description || "");
        setUrl(data.url || "");
        setTechnologies(data.technologies || []);
      } catch {
        setError("Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddTech = () => {
    const tech = techInput.trim();
    if (tech && !technologies.includes(tech)) {
      setTechnologies((t) => [...t, tech]);
      setTechInput("");
    }
  };

  const handleRemoveTech = (tech: string) => {
    setTechnologies((t) => t.filter((x) => x !== tech));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0]);
      setRemoveImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("url", url);
      technologies.forEach((tech) => formData.append("technologies[]", tech));
      if (removeImage) {
        formData.append("removeImage", "true");
      } else if (imageFile) {
        formData.append("image", imageFile);
      }
      await api.put(`/projects/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push(`/projects/${id}`);
    } catch {
      setError("Error al actualizar el proyecto");
    } finally {
      setSaving(false);
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

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
        mx: "auto",
        mt: 4,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant={isMdUp ? "h5" : "h6"}>Editar Proyecto</Typography>

      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextField
        label="Descripción"
        value={description}
        multiline
        rows={4}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        label="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmUp ? "row" : "column",
          gap: 1,
          alignItems: "flex-start",
        }}
      >
        <TextField
          label="Agregar tecnología"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), handleAddTech())
          }
          fullWidth={!isSmUp}
        />
        <Button onClick={handleAddTech} variant="contained">
          Agregar
        </Button>
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {technologies.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            onDelete={() => handleRemoveTech(tech)}
          />
        ))}
      </Stack>

      {project?.image?.url && !imageFile && (
        <Box>
          <Typography>Imagen actual:</Typography>
          <Box
            component="img"
            src={project.image.url}
            alt="Imagen del proyecto"
            sx={{ width: "100%", mb: 1 }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={removeImage}
                onChange={(e) => setRemoveImage(e.target.checked)}
              />
            }
            label="Eliminar imagen actual"
          />
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          flexDirection: isSmUp ? "row" : "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Button variant="outlined" component="label">
          {project?.image?.url ? "Reemplazar imagen" : "Subir imagen"}
          <input type="file" hidden onChange={handleFileChange} />
        </Button>
        {imageFile && <Typography>Seleccionado: {imageFile.name}</Typography>}
      </Box>

      <Button type="submit" variant="contained" disabled={saving}>
        {saving ? <CircularProgress size={24} /> : "Guardar cambios"}
      </Button>
    </Box>
  );
}
