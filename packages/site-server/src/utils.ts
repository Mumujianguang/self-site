import { API_BASE_URL } from "./constants";

export const withBaseUrl = (url: string) => {
  return `${API_BASE_URL}/${url}`;
}