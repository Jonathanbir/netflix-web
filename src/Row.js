import movieTrailer from "movie-trailer";
import React, { useEffect } from "react";
import { useState } from "react";
import YouTube from "react-youtube";
import axios from "./axios";
import "./Row.css";

const base_url = "https:/image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  // A snippet of code which runs based on a specific conditon
  useEffect(() => {
    //if [], run once when the row loads, and dont run again
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results);
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleClick = (movie) => {
    console.log("movie", movie);
    if (trailerUrl) {
      setTrailerUrl("");
    } else {
      //獲取任何電影的 Youtube 預告片
      //返回一個或多個預告片 URL
      movieTrailer(movie?.name || "")
        .then((url) => {
          console.log("url", url);
          //https://www.youtube.com/watch?v=XtMThy8QKqU
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <div className="row_posters">
        {/*several row_posters */}
        {movies.map((movie) => (
          <img
            key={movie.id}
            onClick={() => handleClick(movie)}
            className={`row_poster ${isLargeRow && "row_posterLarge"}`}
            src={`${base_url}${
              isLargeRow ? movie.poster_path : movie.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
      {/* container => posters */}
    </div>
  );
}
export default Row;
