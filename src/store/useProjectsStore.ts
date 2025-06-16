import { create } from "zustand";
import api from "@/utils/api";

export interface Project {
  _id: string;
  title: string;
  description?: string;
  url?: string;
  technologies: string[];
  image?: {
    public_id: string;
    url: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectsState {
  projects: Project[];
  filter: string;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  setFilter: (filter: string) => void;
  reset: () => void;
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  filter: "",
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api.get<Project[]>("/projects");
      set({ projects: res.data });
    } catch {
      set({ error: "Failed to fetch projects" });
    } finally {
      set({ loading: false });
    }
  },

  setFilter: (filter) => {
    set({ filter });
  },

  reset: () => {
    set({
      projects: [],
      filter: "",
      loading: false,
      error: null,
    });
  },
}));
