import { FC, useEffect, useState } from "react"
import { useParams } from "react-router"
import { MovieDetails } from "../types"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
}

function formatRuntime(minutes?: number | null) {
    if (minutes == null) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
}

const MoviesDetails: FC = () => {
    const { id } = useParams<{ id?: string }>()
    const movieId = id ?? "/404" // 4935 1338799 1234821  911430 299534 1078605

    const [data, setData] = useState<MovieDetails | null>(null)
    const [certification, setCertification] = useState<string>("")
    const [imdbRating, setImdbRating] = useState<string>("N/A")
    const [trailerUrl, setTrailerUrl] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!movieId) return

        const controller = new AbortController()

        // Fetch IMDB Rating
        const fetchImdbRating = async (imdbId: string, signal: AbortSignal) => {
            try {
                const res = await fetch(
                    `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}`,
                    { signal }
                )
                if (!res.ok) throw new Error("OMDb request failed")
                const json = await res.json()
                setImdbRating(json.imdbRating ?? "N/A")
            } catch {
                setImdbRating("N/A")
            }
        }

        // Fetch Movie Details
        const fetchMovieDetails = async () => {
            try {
                setLoading(true)

                const res = await fetch(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=credits,release_dates,videos`,
                    { ...options, signal: controller.signal }
                )

                if (!res.ok) {
                    throw new Error(`TMDB request failed: ${res.status}`)
                }

                const json = await res.json()
                setData(json)

                const usRelease = json.release_dates?.results?.find(
                    (r: { iso_3166_1: string }) => r.iso_3166_1 === "US"
                )
                setCertification(usRelease?.release_dates?.[0]?.certification ?? "N/A")

                const trailer = json.videos?.results?.find(
                    (v: { type: string; site: string }) =>
                        v.type === "Trailer" && v.site === "YouTube"
                )
                setTrailerUrl(
                    trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
                )

                if (json.imdb_id) {
                    await fetchImdbRating(json.imdb_id, controller.signal)
                } else {
                    setImdbRating("N/A")
                }
            } catch (err) {
                if (err instanceof Error && err.name !== "AbortError") {
                    console.error("Fetch error:", err)
                    setError(err.message)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchMovieDetails()

        return () => controller.abort()
    }, [movieId])

    if (!data) return null
    const {
        backdrop_path,
        poster_path,
        title,
        release_date,
        genres,
        overview,
        original_language,
        runtime,
        vote_average,
    } = data

    const imgUrl = `https://image.tmdb.org/t/p/w1920_and_h1080_multi_faces/${backdrop_path}`
    const posterUrl = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${poster_path}`
    const formattedReleaseDate = release_date?.replace(/-/g, "/")
    const releaseYear = formattedReleaseDate?.slice(0, 4)
    const language = original_language?.toUpperCase()
    const rating = vote_average ? vote_average.toFixed(1) : "N/A"

    if (loading) return <div>Loading...</div>
    if (error) return <div className="text-red-400">{error}</div>

    return (
        <div className="">
            <header className="relative w-full md:min-h-dvh mt-0 flex justify-center items-center">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `linear-gradient(to bottom,
                        rgba(0, 0, 0, 0.9) 0%,
                        rgba(0, 0, 0, 0.7) 20%,
                        rgba(0, 0, 0, 0.5) 50%,
                        rgba(0, 0, 0, 0.7) 80%,
                        rgba(0, 0, 0, 0.9) 100%),url(${imgUrl})`,
                    }}></div>
                <div className="relative h-full flex flex-col md:flex-row items-center justify-center text-white z-10">
                    <div className="flex items-center mt-8 md:ml-8 lg:ml-12">
                        <img
                            src={posterUrl}
                            alt=""
                            className="
                                    rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.1),0_5px_15px_rgba(0,0,0,0.1)]
                                    w-[250px] lg:w-[300px] xl:w-[350px] 
                                "
                        />
                    </div>
                    <div className="px-4 py-8 md:px-8 lg:px-12">
                        <div className="h-full">
                            <div className="">
                                <div className="">
                                    <h1
                                        className="m-0 text-start text-xl xl:text-3xl drop-shadow-xl
                                        rounded-lg p-0 leading-10 mb-6">
                                        {title}{" "}
                                        <span className="text-sm align-super text-white/90">
                                            ({releaseYear})
                                        </span>
                                    </h1>
                                </div>
                                <div className="">
                                    <div className="mb-4 md:w-2/3">
                                        <ul className="flex items-center gap-x-2 font-medium">
                                            <li className="border drop-shadow-xl border-inherit px-2 py-1 text-xs xl:text-base rounded-md text-white/80 font-bold">
                                                {certification}
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90 xl:text-base">
                                                {release_date}
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90 xl:text-base">
                                                ({language})
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90 xl:text-base">
                                                {formatRuntime(runtime)}
                                            </li>
                                        </ul>
                                    </div>
                                    <ul className="flex gap-x-2 mt-6">
                                        {genres?.map(
                                            (g: { id: number; name: string }) => {
                                                return (
                                                    <li
                                                        key={g.id}
                                                        className="bg-white/10 backdrop-blur-xl px-3 py-1 rounded-2xl text-white/90 hover:text-white text-xs xl:text-base font-medium">
                                                        <a href="/">{g.name}</a>
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                    <div className="mt-4 xl:mt-8 md:w-2/3 flex items-center gap-x-4 font-medium">
                                        <div className="flex items-center">
                                            <img
                                                src="/tmdb.svg"
                                                alt="TMDb Logo"
                                                className="w-8 h-8 p-0 m-0 mr-2"
                                            />
                                            <span className="text-lg text-white/90">
                                                {vote_average}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src="/IMDB_Logo_2016.svg"
                                                alt="TMDb Logo"
                                                className="w-8 p-0 m-0 mr-2"
                                            />
                                            <span className="text-lg text-white/90 ">
                                                {imdbRating}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <div
                                                className="group cursor-pointer text-white/90 hover:text-white flex items-center"
                                                onClick={() => setIsModalOpen(true)}>
                                                <svg
                                                    className="w-6 h-6 mr-2 fill-red-400 group-hover:fill-red-500 drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 330 330"
                                                    xmlSpace="preserve">
                                                    <path d="M292.95 152.281 52.95 2.28c-4.625-2.891-10.453-3.043-15.222-0.4C32.959 4.524 30 9.547 30 15v300c0 5.453 2.959 10.476 7.728 13.12 2.266 1.256 4.77 1.88 7.272 1.88 2.763 0 5.522-0.763 7.95-2.28l240-149.999c4.386-2.741 7.05-7.548 7.05-12.72 0-5.172-2.664-9.979-7.05-12.72z M60 287.936V42.064l196.698 122.937L60 287.936z" />
                                                </svg>
                                                Play Trailer
                                            </div>
                                            {isModalOpen && trailerUrl && (
                                                <div
                                                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                                                    onClick={() => setIsModalOpen(false)}>
                                                    <div
                                                        className="relative w-full max-w-4xl bg-black rounded-lg p-4"
                                                        onClick={(e) =>
                                                            e.stopPropagation()
                                                        }>
                                                        <button
                                                            className="absolute top-2 right-2 text-white/90 hover:text-white text-2xl"
                                                            onClick={() =>
                                                                setIsModalOpen(false)
                                                            }>
                                                            &times;
                                                        </button>
                                                        <iframe
                                                            className="w-full h-auto xs:h-[300px] sm:h-[500px]"
                                                            src={trailerUrl.replace(
                                                                "watch?v=",
                                                                "embed/"
                                                            )}
                                                            title="Movie Trailer"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen></iframe>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 md:mt-12 lg:mt-14 xl:mt-16">
                                <p className="md:max-w-2/3 xl:w-1/2 overflow-hidden text-justify text-base font-medium leading-8 text-white/85 py-2 px-4 rounded-lg bg-white/10 backdrop-blur-xl xl:text-base xl:font-semibold">
                                    {overview}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default MoviesDetails
