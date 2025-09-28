import { CONFIG } from '../constants/config';

export interface APIError {
  status: number;
  message: string;
  details?: unknown;
}

export abstract class BaseAPI {
  protected baseURL: string;
  protected timeoutMs: number;
  protected retries: number;

  constructor() {
    this.baseURL = CONFIG.API.BASE_URL;
    this.timeoutMs = 30000; // 30 seconds timeout
    this.retries = process.env.CI ? 2 : 1; // More retries in CI
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Add timeout signal
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Detailed error handling
        if (!response.ok) {
          const error: APIError = {
            status: response.status,
            message: response.statusText,
          };

          try {
            error.details = await response.json();
          } catch {
            // Ignore parse errors in error response
          }

          throw new Error(JSON.stringify(error));
        }

        // Validate response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
          throw new Error(
            `Expected JSON response but got ${contentType}`
          );
        }

        return response.json();

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on 4xx errors
        if (error instanceof Error && 
            error.message.includes('"status":4')) {
          break;
        }

        // Last attempt failed
        if (attempt === this.retries) {
          break;
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => 
          setTimeout(resolve, Math.pow(2, attempt) * 1000)
        );
      }
    }

    throw lastError || new Error('Request failed');
  }
}