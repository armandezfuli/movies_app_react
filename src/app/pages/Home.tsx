import { useState } from "react"
import useDebouncedValue from "@/shared/hooks/useDebouncedValue"

import { useMovies } from "@/features/movies/hooks/useMovies"
import { useTrendingMovies } from "@/features/movies/hooks/useTrendingMovies"

import Search from "@/features/movies/components/Search"
import Spinner from "@/features/movies/components/Spinner"
import MovieCard from "@/features/movies/components/MovieCard"

export default function Home() {
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearchTerm = useDebouncedValue(searchTerm, 800)

    const {
        data: movies = [],
        isLoading,
        isError,
        error,
    } = useMovies({ query: debouncedSearchTerm })

    const { data: trendingMovies = [], isLoading: isTrendingLoading } =
        useTrendingMovies()

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
                    <h2>
                        {debouncedSearchTerm
                            ? `Results for "${debouncedSearchTerm}"`
                            : "All movies"}
                    </h2>

                    {isLoading ? (
                        <Spinner />
                    ) : isError ? (
                        <p className="text-red-500">
                            {(error as Error)?.message || "Failed to load movies"}
                        </p>
                    ) : movies.length === 0 ? (
                        <p className="text-gray-400">No movies found</p>
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
