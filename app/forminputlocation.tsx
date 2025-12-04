import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import { getDownloadURL, getStorage, ref as sRef, uploadBytes } from "firebase/storage";
import React, { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const App = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [accuration, setAccuration] = useState('');
    const [category, setCategory] = useState('');
    const [image, setImage] = useState(null);

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission denied", "Izin galeri dibutuhkan.");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        const coords = loc.coords.latitude + ',' + loc.coords.longitude;
        setLocation(coords);
        setAccuration(loc.coords.accuracy + ' m');
    };

    const firebaseConfig = {
        apiKey: "AIzaSyB6mS66RQHIJB4HtwcJ4YUuYUHwLjy-boc",
        authDomain: "reactnative-aba59.firebaseapp.com",
        databaseURL: "https://reactnative-aba59-default-rtdb.firebaseio.com",
        projectId: "reactnative-aba59",
        storageBucket: "reactnative-aba59.firebasestorage.app",
        messagingSenderId: "883624086647",
        appId: "1:883624086647:web:e79ab2ac124b4c54baca72",
        measurementId: "G-K87WR4N80K"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const storage = getStorage(app);

    const handleSave = async () => {
        if (!name || !location || !category) {
            Alert.alert("Validasi", "Semua field wajib diisi!");
            return;
        }

        let imageUrl = null;
        if (image) {
            const response = await fetch(image);
            const blob = await response.blob();

            const filename = `images/${Date.now()}.jpg`;
            const storageRef = sRef(storage, filename);

            await uploadBytes(storageRef, blob);
            imageUrl = await getDownloadURL(storageRef);
        }

        const locationsRef = ref(db, 'points/');
        push(locationsRef, { name, coordinates: location, accuration, category, image: imageUrl })
            .then(() => {
                Alert.alert("Success", "Data tersimpan!");
                setName(''); setLocation(''); setAccuration(''); setCategory(''); setImage(null);
            })
            .catch((e) => { console.error(e); Alert.alert("Error", "Gagal menyimpan data"); });
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f0ff' }}>
                <Stack.Screen options={{ title: 'Form Input Location' }} />

                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <Text style={styles.inputTitle}>Nama Lokasi</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Isikan nama objek'
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor="#452986ff"
                    />

                    <Text style={styles.inputTitle}>Kategori Fasilitas</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={category}
                            onValueChange={(value) => setCategory(value)}
                            dropdownIconColor="#452986ff"
                        >
                            <Picker.Item label="Pilih kategori..." value="" />
                            <Picker.Item label="Toyagama" value="toyagama" />
                            <Picker.Item label="ATM" value="atm" />
                            <Picker.Item label="Halte Bus" value="halte" />
                            <Picker.Item label="Stasiun Sepeda" value="sepeda" />
                            <Picker.Item label="Asrama UGM" value="asrama" />
                        </Picker>
                    </View>

                    <Text style={styles.inputTitle}>Koordinat</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="contoh: -7.12,110.33"
                        value={location}
                        onChangeText={setLocation}
                        placeholderTextColor="#452986ff"
                    />

                    <Text style={styles.inputTitle}>Akurasi</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="contoh: 5 meter"
                        value={accuration}
                        onChangeText={setAccuration}
                        placeholderTextColor="#452986ff"
                    />

                    

                    <Text style={styles.inputTitle}>Gambar Lokasi</Text>
                    <TouchableOpacity onPress={pickImage} style={styles.button}>
                        <LinearGradient colors={['#633283ff', '#602577ff']} style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>Pilih Gambar</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {image && (
                        <Image source={{ uri: image }} style={styles.image} />
                    )}

                    <TouchableOpacity onPress={getCoordinates} style={styles.button}>
                        <LinearGradient colors={['#633283ff', '#602577ff']} style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>Get Current Location</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleSave} style={[styles.button, { marginBottom: 60 }]}>
                        <LinearGradient colors={['#633283ff', '#602577ff']} style={styles.buttonGradient}>
                            <Text style={styles.buttonText}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderColor: '#452986ff',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f9f5ff',
        fontSize: 16,
        color: '#4b0082'
    },
    inputTitle: {
        marginLeft: 12,
        marginTop: 12,
        fontSize: 16,
        fontWeight: '700',
        color: '#5b257fff'
    },
    pickerWrapper: {
        marginHorizontal: 12,
        borderWidth: 1,
        borderColor: '#452986ff',
        borderRadius: 12,
        overflow: "hidden",
        backgroundColor: '#f9f5ff'
    },
    button: {
        marginHorizontal: 12,
        marginVertical: 8
    },
    buttonGradient: {
        padding: 12,
        borderRadius: 12,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    image: {
        width: "90%",
        height: 200,
        alignSelf: "center",
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: '#9b59b6'
    }
});

export default App;
