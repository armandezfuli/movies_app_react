import { type FC, type ChangeEvent } from "react"
import type { SearchProps } from "../../types"

const Search: FC<SearchProps> = ({ searchTerm, setSearchTerm }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value)
    }

    return (
        <div className="search">
            <div>
                <img src="/search.svg" alt="Search icon" />
                <input
                    type="text"
                    value={searchTerm}
                    placeholder="Search through thousands of movies"
                    onChange={handleChange}
                    aria-label="Search for movies"
                />
            </div>
        </div>
    )
}
export default Search
