import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { apiClient } from "@/services/api";
import { APP_CONFIG } from "@/config/app-config";

/**
 * A custom hook that provides a page-aware API client.
 * It automatically uses the current route to determine the backend endpoint.
 */
export const useApi = () => {
  const location = useLocation();
  const userId = APP_CONFIG.chat.user.id;
  
  // Map current route to page type
  const currentPage: "home" | "support" = location.pathname === "/support" ? "support" : "home";

  return useMemo(() => ({
    currentPage,
    userId,
    route: location.pathname,
    get: <T>(endpoint: string, params: Record<string, string | number> = {}) => 
      apiClient.get<T>(currentPage, endpoint, { user_id: userId, ...params }),
    post: <T>(endpoint: string, data: unknown, params: Record<string, string | number> = {}) => {
      // If data is an object, automatically inject the route
      const payload = typeof data === 'object' && data !== null 
        ? { ...data, route: location.pathname } 
        : data;
      return apiClient.post<T>(currentPage, endpoint, payload, { user_id: userId, ...params });
    },
  }), [currentPage, location.pathname, userId]);
};




export default useApi;
