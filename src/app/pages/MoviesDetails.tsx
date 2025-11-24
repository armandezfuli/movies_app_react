import { FC } from "react"
import { useParams } from "react-router"

const MoviesDetails: FC = () => {

    const { id } = useParams()

    return (
        <h2>Movies Deatils {id}</h2>
    )
}

export default MoviesDetails