import api from "@/api/api"
import type { Movie } from "@/shared/types"
import { updateSearchCount } from "@/api/appwrite"

export const searchMovies = async (query: string): Promise<Movie[]> => {
    try {
        const response = await api.get("/search/movie", {
            params: { query: query.trim() },
        })
        const movies = response.data.results ?? []

        if (movies.length > 0) {
            await updateSearchCount(query.trim(), movies[0])
        }
        return movies
    } catch (error) {
        console.error("[Movies Search Service] searchMovies failed:", error)
        throw error
    }
}
