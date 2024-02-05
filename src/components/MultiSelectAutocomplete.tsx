import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import { TextField, Checkbox, CircularProgress, } from '@mui/material'
import Highlighter from 'react-highlight-words'
import { searchCharacters } from '../utils/rickAndMortyApi'
import './MultiSelectAutocomplete.css'

interface Character {
    id: number
    name: string
    image: string
    episode: string[]
}

const MultiSelectAutocomplete: React.FC = () => {

    const [query, setQuery] = useState<string>('');
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const [focusedOptionIndex, setFocusedOptionIndex] = useState<number | null>(null);


    useEffect(() => {
        if (query.trim() !== ''){
            setLoading(true)
            setError(null)
            searchCharacters(query)
                .then((data) => setCharacters(data))
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false))
        }
        else {
            setCharacters([])
        }
    }, [query])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
    }

    const handleCharacterClick = (character: Character) => {
        const isSelected = selectedCharacters.some((c) => c.id === character.id);
        if (isSelected) {
          setSelectedCharacters(selectedCharacters.filter((c) => c.id !== character.id))
        } else {
          setSelectedCharacters([...selectedCharacters, character])
        }
        // setQuery(''); // Reset query after selection
    }

   
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (characters.length > 0) {
            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault()
                    setFocusedOptionIndex((prevIndex) =>
                        prevIndex !== null && prevIndex < characters.length - 1 ? prevIndex + 1 : 0
                    )
                break
                case 'ArrowUp':
                    event.preventDefault()
                    setFocusedOptionIndex((prevIndex) =>
                        prevIndex !== null && prevIndex > 0 ? prevIndex - 1 : characters.length - 1
                    )
                break
                case 'Tab':
                    if (focusedOptionIndex !== null) {
                        event.preventDefault()
                        const selectedOption = characters[focusedOptionIndex]
                        const isSelected = selectedCharacters.some((c) => c.id === selectedOption.id)
                        if (isSelected) {
                            setSelectedCharacters(selectedCharacters.filter((c) => c.id !== selectedOption.id))
                            } else {
                                setSelectedCharacters((selectedCharacters) => [
                                    ...selectedCharacters,
                                    selectedOption,
                                ])
                            }
                    }
                break
                default:
                break
          }
        }
    };


    return(
        <div className='multi-select-container'>
            <Autocomplete
                multiple
                id="multi-select-autocomplete"
                options={characters}
                getOptionLabel={(character) => character.name}
                value={selectedCharacters}
                renderInput={(params) => (
                    <TextField 
                        {...params} 
                        label="Search characters" 
                        variant="outlined"
                        value={query}
                        onChange={handleInputChange} 
                        onKeyDown={handleKeyDown}
                    />
                )}
                loading = {loading}
                renderOption={(props, option) => (
                    <li {...props} onClick={() => handleCharacterClick(option)}>
                        <Checkbox edge="start" checked={selectedCharacters.some((c) => c.id === option.id)} />
                        <img src={option.image} alt={option.name} style={{ width: '32px', marginRight: '8px' }} />
                        <Highlighter highlightClassName='Highlight' searchWords={[query]} autoEscape={true} textToHighlight={option.name} />
                        {option.episode.length} episode
                    </li>
                )}
            />
            {loading && <CircularProgress />}
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </div>
    );
}

export default MultiSelectAutocomplete