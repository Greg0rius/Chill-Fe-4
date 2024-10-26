import Footer from "../../components/footer/footer";
import Navbar from "../../components/navbar/navbar";
import "./daftarsaya.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadBookmarks,
  addBookmark,
  removeBookmark,
} from "../../store/redux/movieSlice";
import { auth } from "../../firebase";

function Mylist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookmarks = useSelector((state) => state.movies.bookmarks);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      navigate("/login");
      return;
    }

    dispatch(loadBookmarks());
  }, [navigate, dispatch]);

  const goToDetail = (movie) => {
    navigate(`/detail/${movie.id}`, { state: { movie, category: "mylist" } });
  };

  const handleBookmarkToggle = (movie) => {
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    const isMovieBookmarked = bookmarks.some((item) => item.id === movie.id);
    if (isMovieBookmarked) {
      dispatch(removeBookmark(movie.id));
    } else {
      dispatch(addBookmark(movie));
    }
  };

  return (
    <>
      <Navbar />
      <div className="mylist">
        <div className="my-list-container">
          {bookmarks.length > 0 ? (
            bookmarks.map((movie) => (
              <div key={movie.id} className="my-list-item">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  onClick={() => goToDetail(movie)}
                  className="movie-thumbnail"
                />
              </div>
            ))
          ) : (
            <p>Belum ada film yang ditambahkan.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Mylist;
