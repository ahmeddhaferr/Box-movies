import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import MovieCard from "./components/MovieCard";
import { OrbitProgress } from "react-loading-indicators";
import { useDebounce } from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIisLoading] = useState(false);
  const [debounced, setDebounced] = useState("second");

  useDebounce(() => setDebounced(searchTerm), 700, [searchTerm]);
  const fetchMovies = async (query = "") => {
    setIisLoading(true);
    setErrorMsg("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc.`;
      const respons = await fetch(endpoint, API_OPTIONS);
      if (!respons.ok) {
        throw new Error("Faild to fetch movies");
      }

      const data = await respons.json();
      if (data.Response === false) {
        setErrorMsg(data.Error || "failed to fetch movies");
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies:${error}`);
      setErrorMsg("Error fetching movies. Please try again later");
    } finally {
      setIisLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debounced);
  }, [debounced]);
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero banner" />
          <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy
            Without The Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        <section className="all-movies">
          <h2> All movies</h2>

          {isLoading ? (
            <OrbitProgress color="#7c84ff" size="medium" text="" textColor="" />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
