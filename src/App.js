import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";

let timeoutID;
function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTrying, setIsTrying] = useState(false);

  const fetchMovieHandler = useCallback(async () => {

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.py4e.com/api/films/");

      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      setError(error.message);
      setIsTrying(true);
      timeoutID = setTimeout(() => {
        fetchMovieHandler();
      }, 3000);
    }
    setIsLoading(false);
  },[]);

  useEffect(()=>{
    fetchMovieHandler();
  },[fetchMovieHandler]);

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  const cancelHandler = () => {
    clearTimeout(timeoutID);
    setIsTrying(false);
    setError(null);
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
        {isTrying && <button onClick={cancelHandler}>Stop retrying</button>}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
