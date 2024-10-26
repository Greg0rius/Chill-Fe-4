import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Slider from "react-slick";
import play from "../../assets/play-button-arrowhead.png";
import cheklist from "../../assets/cheklist.svg";
import arrowDown from "../../assets/KeyboardArrowDown.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./movieListCard.css";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchMovies,
  addBookmark,
  loadBookmarks,
  setHoveredIndex,
  setGenres,
} from "../../store/redux/movieSlice";
import { fetchGenres } from "../../services/api";
import { Link } from "react-router-dom";

export default function MovieListCard({ judul, category }) {
  const movies = useSelector((state) => state.movies.movies[category]) || [];
  const hoveredIndex = useSelector((state) => state.movies.hoveredIndex);
  const bookmarks = useSelector((state) => state.movies.bookmarks);
  const genres = useSelector((state) => state.movies.genres);
  const status = useSelector((state) => state.movies.status);
  const dispatch = useDispatch();
  const sliderRef = useRef(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genreData = await fetchGenres();
        dispatch(setGenres(genreData));
        dispatch(fetchMovies(category));
        dispatch(loadBookmarks());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [category, dispatch]);

  const handleAddToMyList = (movie) => {
    dispatch(addBookmark(movie));
  };

  const handleMouseEnter = (index) => {
    dispatch(setHoveredIndex(index));
  };

  const handleMouseLeave = () => {
    dispatch(setHoveredIndex(null));
  };

  const getGenreNames = (genreIds) => {
    const genreNames = genreIds.slice(0, 2).map((id) => {
      const genre = genres.find((g) => g.id === id);
      return genre ? genre.name : "";
    });
    return genreNames.map((name) => <li key={name}>{name}</li>);
  };

  return (
    <div className="movie-list-title">
      <h2 className="title">{judul}</h2>
      <div className="movie-list">
        <Slider {...settings} ref={sliderRef}>
          {movies.map((card, index) => (
            <Link
              to={`/detail/${index}`}
              state={{ movie: card, category: category }}
              className="card-container"
              key={`list${index}`}
            >
              <motion.div
                layout
                className="card-container"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div className="card-list">
                  <motion.img
                    src={`https://image.tmdb.org/t/p/w500${card.poster_path}`}
                    style={{
                      opacity: hoveredIndex === index ? "0" : "1",
                    }}
                    className="image-contain"
                  />
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 1 }}
                        animate={{ opacity: 1, scale: 1.3 }}
                        exit={{ opacity: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="hover-card"
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                          className="image-hover"
                        />
                        <div className="frame-82">
                          <div className="frame-77">
                            <div className="frame-78">
                              <button>
                                <img src={play} alt="play" />
                              </button>
                              <div
                                className="frame-71"
                                onClick={() => handleAddToMyList(card)}
                              >
                                <img src={cheklist} alt="cheklist" />
                              </div>
                            </div>
                            <div className="frame-71">
                              <img src={arrowDown} alt="dropdown" />
                            </div>
                          </div>
                          <div className="frame-75">
                            <span className="age">13+</span>
                            <p>{card.title}</p>
                          </div>
                          <ul className="frame-76">
                            {getGenreNames(card.genre_ids)} {}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
}

MovieListCard.propTypes = {
  judul: PropTypes.string.isRequired,
  category: PropTypes.string,
};
