import { useMemo } from "react";
import { useChat } from "@/features/chat/context/ChatContext";

/**
 * A custom hook that provides a page-aware API client.
 * It automatically uses the current route to determine the backend endpoint.
 */
export const useApi = () => {
  const { config, currentPage: contextPage, apiClient } = useChat();
  
  // Use window.location for broad compatibility
  const pathname = typeof window !== 'undefined' ? window.location.pathname : "/";
  const userId = config.user.id;
  const currentPage = contextPage;

  return useMemo(() => ({ //useMemo to not make api calls on every render. It will only make api calls when the values in the dependency array change.
    currentPage,
    userId,
    route: pathname,
    get: <T>(endpoint: string, params: Record<string, string | number> = {}) => 
      apiClient.get<T>(currentPage, endpoint, { user_id: userId, ...params }),
    post: <T>(endpoint: string, data: unknown, params: Record<string, string | number> = {}) => {
      const payload = typeof data === 'object' && data !== null 
        ? { ...data, route: pathname } 
        : data;
      return apiClient.post<T>(currentPage, endpoint, payload, { user_id: userId, ...params });
    },
  }), [currentPage, pathname, userId, apiClient]);
};

export default useApi;



