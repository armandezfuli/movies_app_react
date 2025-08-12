import { FC, useEffect, useState } from "react"
import { useParams } from "react-router"
import TmdbLogo from "../../public/tmdb.svg"
import IMDBLogo from "../../public/IMDB_Logo_2016.svg"

const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const VITE_OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY

const options = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
}

const movieId = 1234821 // 4935 1338799 1234821  911430 299534
const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=credits,release_dates,videos`

function formatRuntime(minutes) {
    if (!minutes && minutes !== 0) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
}

const MoviesDetails: FC = () => {
    const [data, setData] = useState(null)
    const [data2, setData2] = useState(null)
    const [certification, setCertification] = useState("")
    const [imdbRating, setImdbRating] = useState("N/A")
    const [trailerUrl, setTrailerUrl] = useState("")

    // Details Movie
    useEffect(() => {
        fetch(endpoint, options)
            .then((res) => res.json())
            .then((res) => {
                console.log("TMDB Response:", res)
                setData(res)
                // certification
                const usRelease = res.release_dates?.results.find(
                    (item) => item.iso_3166_1 === "US"
                )
                const certification =
                    usRelease?.release_dates?.[0]?.certification || "N/A"
                setCertification(certification)
                // triler
                const trailer = res.videos?.results.find(
                    (video) => video.type === "Trailer" && video.site === "YouTube"
                )
                setTrailerUrl(
                    trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : ""
                )
                // for imdb
                if (res.imdb_id) {
                    fetch(
                        `http://www.omdbapi.com/?i=${res.imdb_id}&apikey=${VITE_OMDB_API_KEY}`
                    )
                        .then((res) => res.json())
                        .then((omdbData) => {
                            console.log("OMDB Response:", omdbData)
                            setImdbRating(omdbData.imdbRating || "N/A")
                        })
                        .catch((err) => {
                            console.error("OMDB Error:", err)
                            setImdbRating("N/A")
                        })
                } else {
                    setImdbRating("N/A")
                }
            })
            .catch((err) => console.error("TMDB Error:", err))
    }, [movieId])

    // Credits
    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
            options
        )
            .then((res) => res.json())
            .then((res) => console.log(res))
            .catch((err) => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/release_dates`, options)
            .then((res) => res.json())
            .then((res) => {
                console.log(res)

                // پیدا کردن داده مربوط به آمریکا
                const usRelease = res.results.find((item) => item.iso_3166_1 === "US")
                const certification =
                    usRelease?.release_dates?.[0]?.certification || "N/A"

                console.log("Certification:", certification)
                setCertification(certification)
            })
            .catch((err) => console.error(err))
    }, [movieId])

    useEffect(() => {
        fetch(
            `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
            options
        )
            .then((res) => res.json())
            .then((res) => {
                console.log("Videos Response:", res)
                const trailer = res.results.find(
                    (video) => video.type === "Trailer" && video.site === "YouTube"
                )
                if (trailer) {
                    setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`)
                } else {
                    setTrailerUrl("")
                }
            })
            .catch((err) => {
                console.error("Videos Error:", err)
                setTrailerUrl("")
            })
    }, [movieId])

    const { id } = useParams()

    const img_url = `https://image.tmdb.org/t/p/w1920_and_h1080_multi_faces/${data?.backdrop_path}`
    const poster_url = `https://image.tmdb.org/t/p/w600_and_h900_bestv2/${data?.poster_path}`
    const original_title = data?.title
    const release_date = data?.release_date?.replace(/-/g, "/")
    const release_year = release_date?.slice(0, 4)
    const genres = data?.genres
    const belongs_to_collection = data?.popularity
    const overview = data?.overview
    const original_language = data?.original_language?.toUpperCase()
    const runtime = data?.runtime
    const vote_average = data?.vote_average?.toFixed(1) || "N/A"
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <div className="">
            <header className="relative w-full h-dvh mt-0">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-fixed"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, 
                        rgba(0, 0, 0, 0.9) 0%,
                        rgba(0, 0, 0, 0.6) 20%,
                        rgba(0, 0, 0, 0.4) 50%,
                        rgba(0, 0, 0, 0.6) 80%,
                        rgba(0, 0, 0, 0.9) 100%),url(${img_url})`,
                    }}
                />
                <div className="relative z-10 text-white h-full items-center grid grid-cols-6">
                    <div className="col-span-2 flex items-center">
                        <img
                            src={poster_url}
                            alt=""
                            className="m-0 ml-4 md:ml-6 lg:ml-12 xl:ml-24
                                    rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2),0_5px_15px_rgba(0,0,0,0.7)]
                                    w-[200px] md:w-[250px] lg:w-[300px] xl:w-[350px]
                                "
                        />
                    </div>
                    <div className="col-span-4">
                        <div className="h-full">
                            <div className="">
                                <div className="">
                                    <h1
                                        className="m-0 text-start text-xl drop-shadow-xl
                                        rounded-lg p-0 leading-14">
                                        {original_title}{" "}
                                        <span className="text-sm align-super text-white/90">
                                            ({release_year})
                                        </span>
                                    </h1>
                                </div>
                                <div className="">
                                    <div className="mb-4 w-1/3">
                                        <ul className="flex items-center gap-x-2">
                                            <li className="border drop-shadow-xl border-inherit px-2 py-1 text-xs rounded-md text-white/80">
                                                {certification}
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90">
                                                {release_date}
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90">
                                                ({original_language})
                                            </li>
                                            <li className="text-sm drop-shadow-xl text-white/90">
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
                                                        className="bg-white/10 backdrop-blur-xl px-3 py-1 rounded-2xl text-white/90 hover:text-white text-xs">
                                                        <a href="/">{g.name}</a>
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                    <div className="mt-4 w-1/3 flex items-center gap-x-4">
                                        <div className="flex items-center">
                                            <img
                                                src={TmdbLogo}
                                                alt="TMDb Logo"
                                                className="w-8 h-8 p-0 m-0 mr-2"
                                            />
                                            <span className="text-lg text-white/90">
                                                {vote_average}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src={IMDBLogo}
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
                                                            width="100%"
                                                            height="500"
                                                            src={trailerUrl.replace(
                                                                "watch?v=",
                                                                "embed/"
                                                            )}
                                                            title="Movie Trailer"
                                                            // frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen></iframe>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-24 bg-white/10 w-1/3 "></div>
                            </div>
                            <div className="mt-24">
                                <p className="max-w-2/3 overflow-hidden text-justify text-md leading-7 text-white/85 py-2 px-4 rounded-lg bg-white/10 backdrop-blur-xl">
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
