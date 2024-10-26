import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import play from "../../assets/play-button-arrowhead.png";
import cheklist from "../../assets/cheklist.svg";
import arrowdown from "../../assets/KeyboardArrowDown.svg";
import star from "../../assets/star.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./cardContinueWatching.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  addBookmark,
  loadBookmarks,
} from "../../store/redux/movieSlice";
import ProgressBar from "./seekBar";

export default function CardContinueWatching() {
  const movies = useSelector((state) => state.movies.movies['now_playing']) || [];
  const bookmarks = useSelector((state) => state.movies.bookmarks);
  const status = useSelector((state) => state.movies.status);
  const dispatch = useDispatch();
  const [isHover, setIsHover] = useState(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchMovies("now_playing"));
      await dispatch(loadBookmarks());
    };

    fetchData();
  }, [dispatch]);

  const handleMouseEnter = (index) => {
    setIsHover(index);
  };

  const handleMouseLeave = () => {
    setIsHover(null);
  };

  const handleAddToMyList = (movie) => {
    dispatch(addBookmark(movie));
  };

  return (
    <div className="card-continue-title">
      <h2>Melanjutkan Tonton Film</h2>
      <div className="card-continue-list">
        <Slider {...settings}>
          {status === "loading" && <p>Loading...</p>}
          {movies.length === 0 && status !== "loading" && <p>No movies to continue watching.</p>}
          {movies.map((card, index) => (
            <div
              className="card-continue"
              key={`list${index}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <img
                className="content"
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt={card.original_title}
              />
              <div className="judul">
                <h3>{card.original_title}</h3>
                <span className="rating">
                  <img src={star} alt="star" />
                  {card.vote_average}
                </span>
              </div>

              <AnimatePresence>
                {isHover === index && (
                  <motion.div
                    className="card-hover"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                      alt=""
                    />
                    <div className="frame-821">
                      <div className="frame-771">
                        <div className="frame-781">
                          <button type="button" onClick={() => handleAddToMyList(card)}>
                            <img src={play} alt="play" />
                          </button>
                          <div className="check">
                            <img src={cheklist} alt="cheklist" />
                          </div>
                        </div>
                        <div className="frame-711">
                          <img src={arrowdown} alt="arrow down" />
                        </div>
                      </div>
                      <div className="frame-751">
                        <ProgressBar />
                        <p>{card.runtime ? `${Math.floor(card.runtime / 60)}j ${card.runtime % 60}m` : "N/A"}</p>
                      </div>
                      <div className="frame-752"></div>
                      <ul className="frame-761">
                        {card.genre_ids.map((id) => (
                          <li key={id}>{id}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
