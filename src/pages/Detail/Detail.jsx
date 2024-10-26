import "./Detail.css";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/navbar";
import add from "../../assets/plus-solid.svg";
import dlt from "../../assets/delete.png";
import {
  addMovieToList,
  removeMovieFromList,
  fetchBookmarks,
} from "../../services/api";

function Detail() {
  const { index } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const fetchBookmarksData = async () => {
      try {
        const bookmarks = await fetchBookmarks();
        setIsAdded(bookmarks.some((item) => item.id === movie?.id));
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      }
    };
    fetchBookmarksData();
  }, [movie]);

  const handleAddToMyList = async () => {
    try {
      if (isAdded) {
        await removeMovieFromList(movie.id);
        setIsAdded(false);
      } else {
        await addMovieToList(movie);
        setIsAdded(true);
      }
    } catch (error) {
      console.error("Error updating list:", error);
    }
  };

  return (
    <div className="detail">
      {movie ? (
        <>
          <Navbar />
          <div className="detail-hero">
            <img
              className="detail-banner"
              src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
              alt={movie.title}
            />
            <div className="sinopsis-container">
              <h1>{movie.title}</h1>
              <div className="teks">
                <p>Release date: {movie.release_date}</p>
                <p>{movie.overview}</p>
              </div>
              <div className="container-detail-button">
                <div className="frame-detail-button">
                  <button className="btn"> Mulai </button>
                  <button className="btn dark-btn" onClick={handleAddToMyList}>
                    <img src={isAdded ? dlt : add} alt="" className="plus" />
                    {isAdded
                      ? "Hapus dari Daftar Saya"
                      : "Tambahkan ke Daftar Saya"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <h1>Terjadi Kesalahan</h1>
      )}
    </div>
  );
}

export default Detail;
