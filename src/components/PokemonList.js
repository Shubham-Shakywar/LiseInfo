import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
  ToastAndroid,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removePokemon } from '../redux/reducer';

const { width } = Dimensions.get('window');

const PokemonList = ({ navigation }) => {
  const dispatch = useDispatch();
  const pokemonList = useSelector(state => state.pokemon);
  const [searchQuery, setSearchQuery] = useState('');
console.log("pokemonList--->",pokemonList)
  // Handle removing a Pokemon
  const handleRemove = id => {
    dispatch(removePokemon(id));
    ToastAndroid.show('Pokémon has been removed successfully!', ToastAndroid.SHORT);

  };

  // Handle search query input
  const handleSearch = text => {
    setSearchQuery(text);
  };

  // Filter the Pokemon list based on the search query
  const filteredList = pokemonList.filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Left Side: Image */}
      <Image source={{ uri: item.imageUri }} style={styles.pokemonImage} />

      {/* Right Side: Text and Buttons */}
      <View style={styles.detailsContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>Name: {item.name}</Text>
          <Text style={styles.detail}>Breed: {item.breed}</Text>
          <Text style={styles.detail}>Description: {item.description}</Text>
          <Text style={styles.detail}>Level: {item.level}</Text>
          <Text style={styles.detail}>Abilities: {item.abilities}</Text>
          <Text style={styles.detail}>Catch Date: {item.catchDate}</Text>
        </View>
        {/* Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => navigation.navigate('AddEditPokemon', { pokemon: item })}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.deleteButton]}
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pokémon by name"
        placeholderTextColor="#A1A1A1"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {/* Conditional Rendering */}
      {pokemonList.length === 0 ? (
        <View style={styles.noPokemonContainer}>
          <Text style={styles.noPokemonText}>No Pokémon in the list, first add a Pokémon.</Text>
        </View>
      ) : filteredList.length === 0 ? (
        <View style={styles.noPokemonContainer}>
          <Text style={styles.noPokemonText}>
            No Pokémon found for the search name "{searchQuery}".
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredList}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Add Pokémon button at the bottom */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditPokemon')}
      >
        <Text style={styles.addButtonText}>+ Add Pokémon</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#D6EAF8', // Light blue to match your text container background
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#1ABC9C',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    // borderWidth: .4,
    borderColor: '#1ABC9C', // Matches the add button and other UI elements
  },

  pokemonImage: {
    height: width * 0.25,
    width: width * 0.25,
    borderRadius: 16,
    resizeMode: 'cover',
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  textContainer: {
    marginBottom: 8,
  },
  name: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#2E86C1',
    marginBottom: 8,
    backgroundColor: '#D6EAF8',
    padding: 8,
    borderRadius: 8,
  },
  detail: {
    fontSize: width * 0.04,
    color: '#1F618D',
    marginBottom: 4,
    backgroundColor: '#EBF5FB',
    padding: 6,
    borderRadius: 6,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: width * 0.1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#48C9B0',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  addButton: {
    backgroundColor: '#1ABC9C',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 16,
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  noPokemonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noPokemonText: {
    fontSize: width * 0.04,
    color: '#1ABC9C',
    fontWeight: 'bold',
  },
  searchInput: {
    height: 50,
    borderColor: '#1ABC9C',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: width * 0.04,
  },
});

export default PokemonList;
