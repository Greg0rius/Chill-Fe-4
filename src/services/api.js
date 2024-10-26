import { auth, addBookmark, removeBookmark, getBookmarks } from "../firebase";

const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const getMovies = async (category) => {
  const apiUrl = `${TMDB_API_URL}/movie/${category}?language=en-US&page=1`;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${TMDB_API_KEY}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch movies from TMDB");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

export const fetchGenres = async () => {
  const TMDB_API_URL = import.meta.env.VITE_TMDB_API_URL;
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${TMDB_API_KEY}`,
    },
  };

  try {
    const response = await fetch(
      `${TMDB_API_URL}/genre/movie/list?language=en-US`,
      options
    );
    if (!response.ok) {
      throw new Error("Failed to fetch genres from TMDB");
    }
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
};

export const fetchBookmarks = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    const bookmarks = await getBookmarks(user.uid);
    return bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    throw error;
  }
};

export const addMovieToList = async (movie) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    await addBookmark(user.uid, movie);
  } catch (error) {
    console.error("Error adding movie to list:", error);
    throw error;
  }
};

export const removeMovieFromList = async (movieId) => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");

  try {
    await removeBookmark(user.uid, movieId);
  } catch (error) {
    console.error("Error removing movie from list:", error);
    throw error;
  }
};
