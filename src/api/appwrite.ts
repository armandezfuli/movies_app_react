import { Client, Databases, ID, Query } from "appwrite"
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID
import type { Movie, SearchDocument } from "../shared/types"

const client = new Client()
    .setEndpoint("https://cloud.appwrite.io/v1")
    .setProject(PROJECT_ID)

const database = new Databases(client)

export const updateSearchCount = async (
    searchTerm: string,
    movie: Movie
): Promise<void> => {
    try {
        const result = await database.listDocuments<SearchDocument>(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.equal("searchTerm", searchTerm)]
        )
        if (result.documents.length > 0) {
            const doc = result.documents[0]
            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count: doc.count + 1,
            })
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url: `https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
            })
        }
    } catch (error) {
        console.log(error)
    }
}

export const getTrendingMovies = async (): Promise<SearchDocument[]> => {
    try {
        const result = await database.listDocuments<SearchDocument>(
            DATABASE_ID,
            COLLECTION_ID,
            [Query.limit(5), Query.orderDesc("count")]
        )
        return result.documents
    } catch (err: unknown) {
        console.error("Error updating search count:", err)
    }
    return []
}
