"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import api from "@/utils/api";

export default function ProjectNewPage() {
  const router = useRouter();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [techInput, setTechInput] = useState("");
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (imageFile) formData.append("image", imageFile);

      await api.post("/projects", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/projects");
    } catch {
      setError("Error al crear el proyecto");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: { xs: "100%", sm: "80%", md: "60%", lg: "50%" },
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 2,
      }}
    >
      <Typography variant="h5" align="center">
        Crear Nuevo Proyecto
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

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

      <Stack
        direction={isSmUp ? "row" : "column"}
        spacing={1}
        alignItems="flex-start"
      >
        <TextField
          label="Agregar tecnología"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddTech();
            }
          }}
          fullWidth={!isSmUp}
        />
        <Button onClick={handleAddTech} variant="contained">
          Agregar
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {technologies.map((tech) => (
          <Chip
            key={tech}
            label={tech}
            onDelete={() => handleRemoveTech(tech)}
          />
        ))}
      </Stack>

      <Button variant="outlined" component="label">
        Subir imagen
        <input type="file" hidden onChange={handleFileChange} />
      </Button>
      {imageFile && <Typography>Archivo: {imageFile.name}</Typography>}

      <Button
        type="submit"
        variant="contained"
        disabled={saving}
        startIcon={saving ? <CircularProgress size={20} /> : null}
      >
        Crear proyecto
      </Button>
    </Box>
  );
}
