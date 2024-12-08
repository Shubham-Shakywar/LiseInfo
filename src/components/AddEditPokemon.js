import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ToastAndroid,
  Alert,
  Linking,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';

import { addPokemon, editPokemon } from '../redux/reducer';

const AddEditPokemon = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const isEditing = route.params?.pokemon;
  const pokemonList =  useSelector(state => state.pokemon);


  const [name, setName] = useState(isEditing?.name || '');
  const [breed, setBreed] = useState(isEditing?.breed || '');
  const [description, setDescription] = useState(isEditing?.description || '');
  const [imageUri, setImageUri] = useState(isEditing?.imageUri || null);
  const [level, setLevel] = useState(isEditing?.level || '');
  const [abilities, setAbilities] = useState(isEditing?.abilities || '');
  const [catchDate, setCatchDate] = useState(new Date().toLocaleDateString('en-GB'));
  console.log("catchDate---->",catchDate)
  const [modalVisible, setModalVisible] = useState(false);

  const [errors, setErrors] = useState({});

  const validateFields = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!breed.trim()) newErrors.breed = 'Breed is required.';
    if (!description.trim()) newErrors.description = 'Description is required.';
    if (!level.trim()) newErrors.level = 'Level is required.';
    else if (isNaN(level) || level <= 0) newErrors.level = 'Level must be a positive number.';
    if (!abilities.trim()) newErrors.abilities = 'Abilities are required.';
    if (!catchDate.trim()) {
      newErrors.catchDate = 'Catch date is required.';
    } else if (!validateDate(catchDate)) {
      newErrors.catchDate = 'Invalid date format. Use DD/MM/YYYY.';
    }
    if (!imageUri) newErrors.imageUri = 'Image is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateFields()) return;
  // Check if the name already exists in the list (for add or edit)
  const existingPokemon = pokemonList.find((pokemon) => pokemon.name.trim().toLowerCase() === name.trim().toLowerCase());

    if (existingPokemon && existingPokemon?.id !== isEditing?.id) {
      // If a different Pokémon with the same name exists, show an error
      setErrors((prev) => ({ ...prev, name: 'A Pokémon with this name already exists.' }));
      return;
    }
  
    const pokemon = {
      id: isEditing?.id || Date.now(),
      name,
      breed,
      description,
      imageUri,
      level,
      abilities,
      catchDate,
    };
  
    if (isEditing) {
      dispatch(editPokemon(pokemon));
      ToastAndroid.show('Pokémon details updated successfully!', ToastAndroid.SHORT);
    } else {
      dispatch(addPokemon(pokemon));
      ToastAndroid.show('Pokémon has been added successfully!', ToastAndroid.SHORT);
    }
  
    navigation.goBack();
  };
  

  const validateDate = (date) => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // Matches DD/MM/YYYY format
    return dateRegex.test(date);
  };

  const openCamera = () => {
    setModalVisible(false);
    ImageCropPicker.openCamera({
      width: 300,
      height: 300,
    })
      .then((image) => {
        setImageUri(image.path);
        setErrors((prev) => ({ ...prev, imageUri: null }));
      })
      .catch((error) => {
        console.log('Error opening camera:', error.code);
        if (error.code === 'E_NO_CAMERA_PERMISSION') {
          // Show alert if permission is missing
          Alert.alert(
            'Camera Permission Denied',
            'This app needs camera permission to take photos. Please enable it in the app settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Go to Settings',
                onPress: () => Linking.openSettings(), // Navigate to app settings
              },
            ],
            { cancelable: false }
          );
        }
      });
  };

  const pickFromGallery = () => {
    setModalVisible(false);
    ImageCropPicker.openPicker({
      width: 300,
      height: 300,
    })
      .then((image) => {
        setImageUri(image.path);
        setErrors((prev) => ({ ...prev, imageUri: null }));
      })
      .catch((error) => console.log('Error picking image:', error));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {isEditing ? 'Edit Pokémon' : 'Add Pokémon'}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, errors.name ? styles.errorInput : null]}
          placeholder="Name"
          placeholderTextColor="#BDBDBD"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: null }));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={[styles.input, errors.breed ? styles.errorInput : null]}
          placeholder="Breed"
          placeholderTextColor="#BDBDBD"
          value={breed}
          onChangeText={(text) => {
            setBreed(text);
            setErrors((prev) => ({ ...prev, breed: null }));
          }}
        />
        {errors.breed && <Text style={styles.errorText}>{errors.breed}</Text>}

        <TextInput
          style={[styles.input, styles.textArea, errors.description ? styles.errorInput : null]}
          placeholder="Description"
          placeholderTextColor="#BDBDBD"
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setErrors((prev) => ({ ...prev, description: null }));
          }}
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <TextInput
          style={[styles.input, errors.level ? styles.errorInput : null]}
          placeholder="Level"
          placeholderTextColor="#BDBDBD"
          value={level}
          onChangeText={(text) => {
            setLevel(text);
            setErrors((prev) => ({ ...prev, level: null }));
          }}
          keyboardType="numeric"
        />
        {errors.level && <Text style={styles.errorText}>{errors.level}</Text>}

        <TextInput
          style={[styles.input, errors.abilities ? styles.errorInput : null]}
          placeholder="Abilities (comma-separated)"
          placeholderTextColor="#BDBDBD"
          value={abilities}
          onChangeText={(text) => {
            setAbilities(text);
            setErrors((prev) => ({ ...prev, abilities: null }));
          }}
        />
        {errors.abilities && <Text style={styles.errorText}>{errors.abilities}</Text>}

        {/* <TextInput
          style={[styles.input, errors.catchDate ? styles.errorInput : null]}
          placeholder="Catch Date (DD/MM/YYYY)"
          placeholderTextColor="#BDBDBD"
          editable={false}
          value={catchDate}
          onChangeText={(text) => {
            setCatchDate(text);
            setErrors((prev) => ({ ...prev, catchDate: null }));
          }}
        />
        {errors.catchDate && <Text style={styles.errorText}>{errors.catchDate}</Text>} */}
      </View>

      {/* <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={[styles.placeholderText, errors.imageUri ? { color: 'red' } : null]}>
            {errors.imageUri || 'No image selected'}
          </Text>
        )}
      </View> */}

<View style={styles.imageContainer}>
  {imageUri ? (
    <Image source={{ uri: imageUri }} style={styles.image} />
  ) : (
  <View>
      <View style={[styles.emptyImageBox, errors.imageUri ? { borderColor: 'red' } : null]}>
      <Text style={styles.emptyImageText}>Upload Image</Text>
    </View>
    {
       errors.imageUri ? 
       <Text style={[styles.errorText,{marginTop:'1%',textAlign:'center'}]}>Image is required.</Text> 
       : null
    }
    
  </View>
  )}
</View>

      <TouchableOpacity style={styles.cameraButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Upload Image</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Choose an Option</Text>
            <TouchableOpacity style={styles.modalButton} onPress={openCamera}>
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={pickFromGallery}>
              <Text style={styles.modalButtonText}>Pick from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    backgroundColor: '#1ABC9C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1ABC9C',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  image: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1ABC9C',
  },
  placeholderText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  cameraButton: {
    backgroundColor: '#3498DB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#1ABC9C',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#34495E',
  },
  modalButton: {
    backgroundColor: '#1ABC9C',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  emptyImageBox: {
    width: 180,
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BDC3C7',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF0F1',
  },
  emptyImageText: {
    fontSize: 14,
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
});

export default AddEditPokemon;

// import React, { useState } from "react";
// import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
// // import Icon from "react-native-vector-icons/MaterialIcons"; // For camera icon, install react-native-vector-icons

// const AddEditPokemon = () => {
//   const [imageUri, setImageUri] = useState(null);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Upload Bank Passbook/Cancelled Cheque*</Text>
      
//       {/* Upload Area */}
//       <View style={styles.uploadBox}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         ) : (
//           <View style={styles.placeholder}>
//             {/* <Icon name="upload" size={40} color="#888" /> */}
//             <Text style={styles.placeholderText}>Upload Image</Text>
//             <Text style={styles.formatText}>(format: .jpg, .png)</Text>
//           </View>
//         )}
//       </View>

//       {/* Camera Icon */}
//       {/* <TouchableOpacity style={styles.cameraIcon}>
//         <Icon name="photo-camera" size={24} color="#fff" />
//       </TouchableOpacity> */}

//       {/* Footer Text */}
//       <Text style={styles.footerText}>
//         For the verification of your bank account, we will transfer a small
//         amount to the bank account provided.
//       </Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#333",
//   },
//   uploadBox: {
//     height: 200,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     backgroundColor: "#f9f9f9",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 10,
//     position: "relative",
//   },
//   placeholder: {
//     alignItems: "center",
//   },
//   placeholderText: {
//     fontSize: 16,
//     color: "#888",
//     marginTop: 10,
//   },
//   formatText: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 5,
//   },
//   imagePreview: {
//     width: "100%",
//     height: "100%",
//     borderRadius: 8,
//   },
//   cameraIcon: {
//     position: "absolute",
//     bottom: 20,
//     right: 20,
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#333",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   footerText: {
//     fontSize: 14,
//     color: "#6a1b9a",
//     marginTop: 10,
//     textAlign: "center",
//   },
// });

// export default AddEditPokemon;
