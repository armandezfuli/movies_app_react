import { BrowserRouter, Routes, Route } from "react-router"
import Home from "./pages/Home"
import MoviesDetails from "./pages/MoviesDetails"

export default  function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/movies/:id" element={<MoviesDetails />} />
            </Routes>
        </BrowserRouter>
    )
}

