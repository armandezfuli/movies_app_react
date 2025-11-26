import { useParams } from "react-router"

export default function MoviesDetails() {
    const { id } = useParams()

    return <h2>Movies Deatils {id}</h2>
}


