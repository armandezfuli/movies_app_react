import React, {useState, useEffect} from 'react'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from "react-use";
import {updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3/"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method: 'GET', headers: {
        accept: 'application/json', authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(false)
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 1000, [searchTerm])

    const fetchMovies = async (query = '') => {
        setLoading(true)
        setErrorMessage('')
        try {
            const endpoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURI(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
            const response = await fetch(endpoint, API_OPTIONS)
            if (!response.ok) {
                throw Error('Failed to fetch movies')
            }
            const data = await response.json()

            if (data.Response === 'false') {
                setErrorMessage(data.Error || 'Failed to fetch movies')
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

    return (<main>
        <div className="pattern"/>
        <div className="wrapper">
            <header>
                <img src="../public/hero.png" alt="hero"/>
                <h1>Find <span className="text-gradient">Movies</span> You’ll Love Without the Hassle</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>
            <section className="all-movies">
                <h2 className='mt-10'>All movies</h2>
                {loading ? (<Spinner/>) : errorMessage ? (<p className="text-red-500">{errorMessage}</p>) : (<ul>
                    {movies.map(movie => (<MovieCard key={movie.id} movie={movie}/>))}
                </ul>)}
            </section>
        </div>
    </main>)
}
export default App