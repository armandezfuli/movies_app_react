import axios from "axios"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    timeout: 15000,
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
    params: {
        language: "en-US",
    },
})

export default api
