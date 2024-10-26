import Navbar from "../../components/navbar/navbar";
import Hero from "../../components/hero/hero";
import CardContinueWatching from "../../components/cardContinueWatching/cardContinueWatching";
import "./home.css";
import MovieListCard from "../../components/movieListCard/movieListCard";
import Footer from "../../components/footer/footer";

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <Hero />

      <div className="show-movie-list">
        <CardContinueWatching />
        <MovieListCard
          judul="Top Rating Film dan Series Hari Ini" category="popular"/>
        <MovieListCard judul="Film Trending" category="top_rated" />
        <MovieListCard judul="Rilis Baru" category="upcoming" />
      </div>

      <Footer />
    </div>
  );
}
