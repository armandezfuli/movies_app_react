import api from "@/api/api"
import type { Movie } from "@/shared/types"

export const getPopularMovies = async (): Promise<Movie[]> => {
    try {
        const response = await api.get("/discover/movie")
        return response.data.results ?? []
    } catch (error) {
        console.error("[Movies Service] getPopularMovies failed:", error)
        throw error
    }
}
