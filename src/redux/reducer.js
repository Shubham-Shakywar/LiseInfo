import { createSlice } from '@reduxjs/toolkit';

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState: [],
  reducers: {
    addPokemon: (state, action) => {
      state.push(action.payload);
    },
    editPokemon: (state, action) => {
      const index = state.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removePokemon: (state, action) => {
      return state.filter(p => p.id !== action.payload);
    },
  },
});

export const { addPokemon, editPokemon, removePokemon } = pokemonSlice.actions;
export default pokemonSlice.reducer;
