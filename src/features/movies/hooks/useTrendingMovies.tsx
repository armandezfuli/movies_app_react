import { useQuery } from "@tanstack/react-query"
import { getTrendingMovies } from "@/api/appwrite"
import type { SearchDocument } from "@/shared/types"

export const useTrendingMovies = () => {
    return useQuery<SearchDocument[]>({
        queryKey: ["trending"],
        queryFn: getTrendingMovies,
        staleTime: 1000 * 60 * 10,
    })
}
