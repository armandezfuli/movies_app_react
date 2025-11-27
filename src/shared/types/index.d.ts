import { Models } from "appwrite"

export interface Movie {
    title: string
    vote_average: number
    poster_path: string | null
    release_date: string | null
    original_language: string | null
    id?: number
}
export interface MovieCardProps {
    movie: Movie
}

export interface SearchProps {
    searchTerm: string
    setSearchTerm: (data: string) => void
}

export interface TmdbMovieResponse {
    results: Movie[]
    total_results?: number
    total_pages?: number
    page?: number
    [key: string]: any
}

export interface SearchDocument extends Models.Document {
    searchTerm: string
    count: number
    movie_id: number
    poster_url: string
}