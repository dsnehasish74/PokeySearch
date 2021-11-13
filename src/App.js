import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import InfiniteScroll from "react-infinite-scroll-component";
function App() {
  const [pokeMons, setPokeymons] = useState([]); //Will store all pokeymons which are fetched
  const [showingList, setShowingList] = useState([]); //will show all the pokeymons which should be shown
  const [searchList, setSearchList] = useState([]); //will store all suggestions
  const [next, setNext] = useState(""); //to store the next page url
  const [searchValue, setSearchValue] = useState(""); //Will store value of Search bar
  const [isSuggestionOpen, setIsSuggestionOpen] = useState(false); // boolean to se is auto suggestion open or close
  const [types, setTypes] = useState([]); //Will store all the types available
  const [selectedType, setSelectedType] = useState("All"); //Will Stor the Type of Pokeymon Selected

  //Works at the begining when website renders Will store all the pokeymon names and types
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

  //Will Create suggestion List
  useEffect(() => {
    const timeOut = setTimeout(() => {
      if (searchValue.length > 0) {
        setIsSuggestionOpen(true);
      } else {
        setIsSuggestionOpen(false);
      }
      let suggestList = pokeMons.filter((p) => p.includes(searchValue));
      setSearchList(suggestList);
    }, 250);
    //Clean up Function
    return () => clearTimeout(timeOut);
  }, [searchValue, pokeMons]);

  //Will Listen for Enter Press
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

  // Handel filter
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
  //Handel InfiniteScroll
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
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
      <h1>Test</h1>
    </div>
  );
}

export default App;
