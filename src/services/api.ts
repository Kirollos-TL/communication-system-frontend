import { APP_CONFIG } from "@/config/app-config";

/**
 * A basic API client using the centralized configuration
 */
export const apiClient = {
  baseUrl: APP_CONFIG.api.baseUrl,

  getEndpoint(page: "home" | "support", endpoint: string, params: Record<string, string | number> = {}): string {
    const pageVal = APP_CONFIG.api.pageEndpoints[page];
    let resolvedEndpoint = APP_CONFIG.api.endpoints[endpoint] || endpoint;
    
    // Replace {page} placeholder
    resolvedEndpoint = resolvedEndpoint.replace("{page}", pageVal);
    
    // Replace other parameters like {user_id}, {chat_id}, etc.
    Object.entries(params).forEach(([key, value]) => {
      resolvedEndpoint = resolvedEndpoint.replace(`{${key}}`, String(value));
    });
    
    return resolvedEndpoint;
  },


  async get<T>(page: "home" | "support", endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const fullPath = this.getEndpoint(page, endpoint, params);
    const response = await fetch(`${this.baseUrl}${fullPath}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },

  async post<T>(page: "home" | "support", endpoint: string, data: unknown, params: Record<string, string | number> = {}): Promise<T> {
    const fullPath = this.getEndpoint(page, endpoint, params);
    const response = await fetch(`${this.baseUrl}${fullPath}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  },
};

export default apiClient;
