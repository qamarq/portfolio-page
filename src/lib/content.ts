import { about } from "../../content/about";
import { projects } from "../../content/projects";
import type { AboutContent, Project } from "./types";

export type { AboutContent } from "./types";

export function getAboutContent(): AboutContent {
  return about;
}

export function getProjects(): Project[] {
  return projects;
}
