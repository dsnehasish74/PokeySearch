import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";
function App() {
  const [pokeMons, setPokeymons] = useState([]);
  const [showingList, setShowingList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [next, setNext] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  useEffect(() => {
    axios.get("https://pokeapi.co/api/v2/pokemon").then((data) => {
      let results = [];
      data.data.results.map((r) => results.push(r.name));
      setPokeymons(results);
      setShowingList(results);
      setNext(data.data.next);
    });
    axios.get("https://pokeapi.co/api/v2/type").then((data) => {
      let results = [];
      data.data.results.map((r) => results.push(r.name));
      setTypes(results);
    });
  }, []);
  useEffect(() => {
    const timeOut = setTimeout(() => {
      setIsSuggestionOpen(true);
      let suggestList = pokeMons.filter((p) => p.includes(searchValue));
      setSearchList(suggestList);
    }, 250);

    return () => clearTimeout(timeOut);
  }, [searchValue, pokeMons]);
  const listener = (e) => {
    if (e.key === "Enter") {
      setIsSuggestionOpen(false);
      let searchedList = pokeMons.filter((p) => p.includes(e.target.value));
      setShowingList(searchedList);
    }
  };
  const handelChange = (e) => {
    console.log(e.target.value);
    setSearchValue(e.target.value);
  };

  const getFilteredPokeymon = (e) => {
    setSelectedType(e.target.value);
    console.log(e.target.value);
    if (e.target.value !== "All") {
      axios
        .get(`https://pokeapi.co/api/v2/type/${e.target.value}`)
        .then((data) => {
          console.log(data.data);
          let results = [];
          data.data.pokemon.map((r) => results.push(r.pokemon.name));
          setPokeymons(results);
          setShowingList(results);
        });
    }
  };

  const fetchMoreData = () => {
    if (next != null && selectedType === "All") {
      axios.get(next).then((data) => {
        let results = [];
        data.data.results.map((r) => results.push(r.name));
        console.log(results);
        setPokeymons((prev) => [...prev, ...results]);
        setShowingList((prev) => [...prev, ...results]);
        setNext(data.data.next);
      });
    }
  };
  return (
    <div className="App">
      <div className="Header">
        <div className="searchBar">
          <input
            onKeyDown={listener}
            className="input"
            onChange={handelChange}
            value={searchValue}
          ></input>
          {isSuggestionOpen && (
            <div>
              <ul className="Lists">
                {searchList.map((slist) => {
                  return (
                    <li>
                      <button
                        onClick={() => {
                          setSearchValue(slist);
                          setIsSuggestionOpen(false);
                        }}
                      >
                        {slist}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <div className="DropDown">
          <select id="cars" name="cars" onChange={getFilteredPokeymon}>
            <option value="All">All</option>
            {types.map((type, index) => (
              <option value={type} key={index}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="pokeyMonList">
        <InfiniteScroll
          dataLength={pokeMons.length}
          next={fetchMoreData}
          hasMore={true}
          loader={<h4>...</h4>}
        >
          {showingList.map((pokeMon, index) => {
            return (
              <div key={index} className="PokeyMonCard">
                <h3>{pokeMon}</h3>
              </div>
            );
          })}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default App;
