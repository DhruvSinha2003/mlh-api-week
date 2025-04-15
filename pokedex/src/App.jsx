import axios from "axios";
import { useEffect, useState } from "react";

const PAGE_LIMIT = 20;

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const offset = (page - 1) * PAGE_LIMIT;
      const res = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=${PAGE_LIMIT}&offset=${offset}"
      );
      setCount(res.data.count);

      const details = await Promise.all(
        res.data.results.map((p) => axios.get(p.url))
      );
      setPokemons(
        details.map((d) => ({
          id: d.data.id,
          name: d.data.name,
          sprite: d.data.sprites.front_default,
          type: d.data.types.map((t) => t.type.name).join(", "),
        }))
      );
    };
    fetch();
  }, [page]);

  return (
    <div style={{ maxWidth: 400, margin: "auto", fontFamily: "sans-serif" }}>
      <h2>Pokedex</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {pokemons.map((p) => (
          <li
            key={p.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 8,
              border: "1px solid #eee",
              borderRadius: 8,
              padding: 8,
            }}
          >
            <span style={{ width: 30, fontWeight: "bold" }}>#{p.id}</span>
            <img
              src={p.sprite}
              alt={p.name}
              width={48}
              height={48}
              style={{ margin: "0 12px" }}
            />
            <span style={{ flex: 1, textTransform: "capitalize" }}>
              {p.name}
            </span>
            <span style={{ fontSize: 12, color: "#888" }}>{p.type}</span>
          </li>
        ))}
      </ul>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} / {Math.ceil(count / PAGE_LIMIT)}
        </span>
        <button
          onClick={() =>
            setPage((p) => (p < Math.ceil(count / PAGE_LIMIT) ? p + 1 : p))
          }
          disabled={page === Math.ceil(count / PAGE_LIMIT)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
