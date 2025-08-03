import { useState, useEffect, type FC } from "react"
import Search from "./components/Search"
import Spinner from "./components/Spinner"
import MovieCard from "./components/MovieCard"
import { useDebounce } from "react-use"
import { getTrendingMovies } from "./lib/appwrite"
import { fetchMovies } from "./api/tmdb"
import type { Movie, SearchDocument } from "./types/index"


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

    useEffect(() => {
        const loadMovies = async () => {
            setLoading(true)
            setErrorMessage("")
            try {
                const results = await fetchMovies(debouncedSearchTerm)
                setMovies(results)
            } catch (err) {
                setErrorMessage("Error fetching movies")
            } finally {
                setLoading(false)
            }
        }
        loadMovies()
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
                        Find <span className="text-gradient">Movies</span> You'll Love
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
