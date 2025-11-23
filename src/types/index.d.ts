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

interface Genre {
    id: number
    name: string
}
export interface MovieDetails {
    backdrop_path: string | null
    poster_path: string | null
    title: string
    release_date: string
    genres: Genre[]
    overview: string
    original_language: string
    runtime: number | null
    vote_average: number
    imdb_id?: string
    release_dates?: {
        results?: {
            iso_3166_1: string
            release_dates: { certification: string }[]
        }[]
    }
    videos?: {
        results?: {
            type: string
            site: string
            key: string
        }[]
    }
}