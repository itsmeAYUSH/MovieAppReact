import React from "react";
import classes from "./Movie.module.css";

const Movie = (props) => {
  const onDeleteHandler = async () => {
    await fetch(
      `https://moviereact-50b2e-default-rtdb.firebaseio.com/movies/${props.id}.json`,
      {
        method: "DELETE",
      }
    );
    props.onDelete();
  };
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={onDeleteHandler}>Delete</button>
    </li>
  );
};

export default Movie;
