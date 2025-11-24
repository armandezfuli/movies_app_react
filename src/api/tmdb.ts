import { buildApiUrl } from "../features/movies/utils/buildApiUrl"
import { updateSearchCount } from "./appwrite"
import type { Movie, TmdbMovieResponse } from "../shared/types"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const getApiOptions = (): RequestInit => ({
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
    },
})

const fetchMovies = async (query: string = ""): Promise<Movie[]> => {
    try {
        const endpoint = query
            ? buildApiUrl(`${API_BASE_URL}/search/movie`, { query })
            : buildApiUrl(`${API_BASE_URL}/discover/movie`, {
                  sort_by: "popularity.desc",
              })

        const response = await fetch(endpoint, getApiOptions())
        if (!response.ok) {
            throw new Error("Failed to fetch movies")
        }
        const data: TmdbMovieResponse = await response.json()
        const results = data.results || []
        if (query && query.length > 0 && results.length > 0) {
            await updateSearchCount(query, results[0])
        }
        return results
    } catch (e) {
        console.error("fetchMovies error:", e)
        throw e
    }
}

export { fetchMovies }
