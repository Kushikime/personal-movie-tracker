import { useEffect, useState } from "react";

import "./App.css";
import {
  getPopularMovies,
  type GetPopularMoviesResponse,
} from "./shared/api/tmdb.client";

function App() {
  const [result, setResult] = useState<GetPopularMoviesResponse | null>(null);

  useEffect(() => {
    getPopularMovies().then((res) => {
      if (res) setResult(res);
    });
  }, []);

  return (
    <>
      <div>{result && result.results.map((res) => <div>{res.title}</div>)}</div>
    </>
  );
}

export default App;
