import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

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
      const response = await fetch(
        "https://moviereact-50b2e-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong....Retrying");
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      setIsTrying(true);
      timeoutID = setTimeout(() => {
        fetchMovieHandler();
      }, 3000);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMovieHandler();
  }, [fetchMovieHandler]);

  const onDeleteHandler = () => {
    fetchMovieHandler();
  };
  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} onDelete={onDeleteHandler} />;
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
      <AddMovie onAddMovie={onDeleteHandler} />
      <section>
        <button onClick={fetchMovieHandler}>Fetch Movies</button>
        {isTrying && <button onClick={cancelHandler}>Stop retrying</button>}
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
