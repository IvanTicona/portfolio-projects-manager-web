"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CardActionArea,
  Chip,
  Stack,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Project } from "@/store/useProjectsStore";

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const router = useRouter();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardActionArea
        onClick={() => router.push(`/projects/${project._id}`)}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
        }}
      >
        {project.image?.url && (
          <CardMedia
            component="img"
            image={project.image.url}
            alt={project.title}
            sx={{
              height: isSmUp ? 140 : 100,
              objectFit: "cover",
            }}
          />
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant={isSmUp ? "h6" : "subtitle1"} gutterBottom noWrap>
            {project.title}
          </Typography>
          {project.description && (
            <Typography variant="body2" color="text.secondary" paragraph noWrap>
              {project.description}
            </Typography>
          )}
          {project.url && (
            <MuiLink
              href={project.url}
              target="_blank"
              rel="noopener"
              variant="caption"
              sx={{ display: "block", wordBreak: "break-all", mb: 1 }}
            >
              {project.url}
            </MuiLink>
          )}
          {project.technologies.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" mt={1}>
              {project.technologies.map((tech) => (
                <Chip
                  key={tech}
                  label={tech}
                  size={isSmUp ? "medium" : "small"}
                />
              ))}
            </Stack>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
