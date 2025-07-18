import { useState, useEffect, type FC } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"
import { useDebounce } from "react-use"
import { getTrendingMovies, updateSearchCount, type SearchDocument } from "./appwrite"
import { type Movie } from "./components/MovieCard"

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const buildApiUrl = (path: string, params: Record<string, string | number>) => {
    const url = new URL(`${API_BASE_URL}${path}`)
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString())
    })
    return url.toString()
}

const getApiOptions = (): RequestInit => ({
    method: "GET",
    headers: {
        accept: "application/json",
        authorization: `Bearer ${API_KEY}`,
    },
})

interface TmdbMovieResponse {
    results: Movie[]
    total_results?: number
    total_pages?: number
    page?: number
    [key: string]: any
}

const App: FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [movies, setMovies] = useState<Movie[]>([])
    const [trendingMovies, setTrendingMovies] = useState<SearchDocument[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("")

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies()
            setTrendingMovies(movies)
        } catch (err) {
            console.log("Error fetching trending movies", err)
        }
    }

    const fetchMovies = async (query: string = "") => {
        setLoading(true)
        setErrorMessage("")
        try {
            const endpoint = query
                ? buildApiUrl("/search/movie", { query })
                : buildApiUrl("/discover/movie", { sort_by: "popularity.desc" })
            const response = await fetch(endpoint, getApiOptions())
            if (!response.ok) {
                console.log("Failed to fetch movies")
            }
            const data: TmdbMovieResponse = await response.json()

            if (data.Response === "false") {
                setErrorMessage(data.Error || "Failed to fetch movies")
                setMovies([])
                return
            }
            setMovies(data.results || [])

            if (query && query.length > 0) {
                await updateSearchCount(query, data.results[0])
            }
        } catch (e) {
            console.log(e)
            setErrorMessage("Error fetching movies")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm)
    }, [debouncedSearchTerm])

    useEffect(() => {
        loadTrendingMovies()
    }, [])

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="/hero.png" alt="hero" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You’ll Love
                        Without the Hassle
                    </h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>
                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>
                        <ul>
                            {trendingMovies.map((movie, index) => {
                                return (
                                    <li key={movie.$id}>
                                        <p>{index + 1}</p>
                                        <img src={movie.poster_url} alt={movie.title} />
                                    </li>
                                )
                            })}
                        </ul>
                    </section>
                )}
                <section className="all-movies">
                    <h2>All movies</h2>
                    {loading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
export default App
