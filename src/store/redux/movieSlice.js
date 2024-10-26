import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMovies,
  fetchBookmarks,
  addMovieToList,
  removeMovieFromList,
} from "../../services/api";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (category, { rejectWithValue }) => {
    try {
      const response = await getMovies(category);
      return { category, movies: response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadBookmarks = createAsyncThunk(
  "movies/loadBookmarks",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchBookmarks();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addBookmark = createAsyncThunk(
  "movies/addBookmark",
  async (movie, { rejectWithValue }) => {
    try {
      await addMovieToList(movie);
      return movie;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeBookmark = createAsyncThunk(
  "movies/removeBookmark",
  async (movieId, { rejectWithValue }) => {
    try {
      await removeMovieFromList(movieId);
      return movieId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: {},
    bookmarks: [],
    status: "idle",
    error: null,
    hoveredIndex: null,
    genres: [],
  },
  reducers: {
    setHoveredIndex(state, action) {
      state.hoveredIndex = action.payload;
    },
    setGenres(state, action) {
      state.genres = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { category, movies } = action.payload;
        state.movies[category] = movies; // Store movies under the category
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Load bookmarks
      .addCase(loadBookmarks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadBookmarks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookmarks = action.payload;
      })
      .addCase(loadBookmarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Add bookmark
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks.push(action.payload);
      })

      // Remove bookmark
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter(
          (movie) => movie.id !== action.payload
        );
      });
  },
});

export const { setHoveredIndex, setGenres } = movieSlice.actions;

export const selectMoviesByCategory = (category) => (state) =>
  state.movies.movies[category] || [];

export default movieSlice.reducer;
