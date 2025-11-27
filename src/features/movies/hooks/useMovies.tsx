import { useQuery } from "@tanstack/react-query"
import { getPopularMovies } from "../services/getPopularMovies"
import { searchMovies } from "../services/searchMovies"
import type { Movie } from "@/shared/types"

interface UseMoviesOptions {
    query?: string
    enabled?: boolean
}

export const useMovies = ({ query = "", enabled = true }: UseMoviesOptions = {}) => {
    return useQuery<Movie[]>({
        queryKey: ["movies", query || "popular"],
        queryFn: () => (query ? searchMovies(query) : getPopularMovies()),
        staleTime: 1000 * 60 * 5,
        enabled,
        retry: 1,
        refetchOnWindowFocus: false,
    })
}
