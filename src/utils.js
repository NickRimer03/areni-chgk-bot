import { filter } from "../config.js";

export function rndInt(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

export function getTourByPage(page = 1) {
  return `/tours?itemsPerPage=1&page=${page}`;
}

export function getTourById(id) {
  return `/tours/${id}`;
}

export function filterText(text) {
  return text.replace(filter, "").replace(/\s+/g, " ").toLowerCase().trim();
}

export function filterLineBreaks(text) {
  return text === null ? null : text.replace(/\n/g, " ");
}

export function removeAllSpaces(text) {
  return text.replace(/\s+/g, "");
}

export function hintizer(text) {
  return text.replace(/[^-\s]/g, "*");
}

export default {
  rndInt,
  getTourByPage,
  getTourById,
  filterText,
  filterLineBreaks,
  removeAllSpaces,
  hintizer,
};
