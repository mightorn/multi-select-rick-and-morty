import axios from 'axios'

const API_BASE_URL = 'https://rickandmortyapi.com/api'

export const searchCharacters = async (query: string) => {
  const response = await axios.get(`${API_BASE_URL}/character/?name=${query}`)
  return response.data.results
}
