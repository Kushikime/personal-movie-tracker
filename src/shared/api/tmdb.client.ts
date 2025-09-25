const API_KEY = ".";

export class ApiError extends Error {
  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

class ApiClient {
  private endpoint: string;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  async query<T, U = undefined>(
    urlPath: string = "",
    options: RequestInit = {},
    body?: U
  ): Promise<T> {
    try {
      // Default headers can be set here.
      const headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };

      const config: RequestInit = {
        ...options,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
      };

      const response = await fetch(
        `${this.endpoint}${urlPath}?api_key=${API_KEY}`,
        config
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.log("error: ", JSON.stringify(errorData));

        if (errorData) {
          throw new ApiError(errorData.status_code, errorData.status_message);
        } else {
          throw new ApiError(response.status, response.statusText);
        }
      }

      return response.json();
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }

      throw new Error(
        `An unexpected error occured during API call: ${(err as Error).message}`
      );
    }
  }
}

const apiClient = new ApiClient("/api/tmdb");

const TMDBApiClient = {
  get: <T>(endpoint: string) => {
    return apiClient.query<T>(endpoint, { method: "GET" });
  },
  post: <T, U>(endpoint: string, body: U) => {
    return apiClient.query<T, U>(endpoint, { method: "POST" }, body);
  },
  put: <T, U>(endpoint: string, body: U) => {
    return apiClient.query<T, U>(endpoint, { method: "PUT" }, body);
  },
  delete: <T>(endpoint: string) => {
    return apiClient.query<T>(endpoint, { method: "DELETE" });
  },
};

interface Result {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: "string";
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface GetPopularMoviesResponse {
  page: number;
  results: Result[];
  total_pages: number;
  total_results: number;
}

const getPopularMovies = async () => {
  try {
    const response = await TMDBApiClient.get<GetPopularMoviesResponse>(
      "/3/movie/popular"
    );
    return response;
  } catch (err) {
    console.error("PIZDEC: ", err);
  }
};

export { TMDBApiClient, getPopularMovies };
export type { GetPopularMoviesResponse };
