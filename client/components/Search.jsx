import React, { useState, useEffect } from 'react';
import { Input } from '@chakra-ui/react';
import IPodGraphic from './IPodGraphic';
import FetchMapSearchResults from '../api/FetchMapSearchResults';
import FetchPlaylist from '../api/FetchPlaylist';
import SearchResults from './SearchResults';
import '../css/search.css';

const Search = () => {
  //state for search results and playlist retrieval
	const [searchQuery, setSearchQuery] = useState('');
	const [searchResults, setSearchResults] = useState([]);
	const [playlist, setPlaylist] = useState(undefined);
	const [searchAgain, setSearchAgain] = useState(false);

  //state that controls the iPod
  const [play, setPlay] = useState(false);
  const [playlistIdx, setPlaylistIdx] = useState(0);

	const handleSearchForLocation = async () => {
		const results = await FetchMapSearchResults({ searchQuery });
    let filteredResults = [];
    for (let i = 0; i < results.length; i++){
      if (results[i].types.includes('geocode') && (results[i].types.includes('locality') || results[i].types.includes('postal_code'))) {
        filteredResults.push(results[i]);
      }
    }
		setSearchResults(filteredResults);
	};

	const handlePlaylist = async (result) => {
		const playlistData = await FetchPlaylist({ placeId: result.place_id });
		setPlaylist(playlistData);
	};

	return (
		<div className='search'>
      { playlist !== undefined && playlist.length > 0 && (
        <div className="now-playing"> 
          Now Playing: {playlist[playlistIdx].title} at {playlist[playlistIdx].venue}
        </div>
      )}
      { playlist !== undefined && playlist.length === 0 && (
        <div className="now-playing"> 
          No concerts found in this area.
        </div>
      )}
      <IPodGraphic 
        play={play}
        setPlay={setPlay}
        playlistIdx={playlistIdx}
        setPlaylistIdx={setPlaylistIdx}
        playlist={playlist}
        searchResults={searchResults}
        key={Date.now().toString}
      />
      <div className='searchBox'>
        <div className='searchBar'>
          <Input
            className='input'
            placeholder='Enter your city name or zip code to hear artists playing near you!'
            onChange={(e) => {
							setSearchQuery(e.target.value);
						}}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
								if (playlist !== undefined) {
									setSearchResults([]);
									setSearchAgain(true);
								}	
                handleSearchForLocation();
              }
            }}
          />
        </div>
        <div className='searchResults'>
          {searchResults.length > 0 && (! playlist || playlist.length === 0 || searchAgain) && (
            <SearchResults
              searchResults={searchResults}
              handlePlaylist={handlePlaylist}
							setPlaylist={setPlaylist}
              setPlay={setPlay}
							setPlaylistIdx={setPlaylistIdx}
							setSearchAgain={setSearchAgain}
              className='place-item'
            />
          )}
        </div>
      </div>
		</div>
	);
};

export default Search;
