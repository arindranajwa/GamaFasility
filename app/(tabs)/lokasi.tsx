import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    ImageBackground,
    Linking,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

// Mapping kategori ke ikon
const categoryIcons = {
    "Restaurant": "utensils",
    "Park": "tree",
    "School": "school",
    "Hospital": "hospital",
    "Toyagama": "map-marker-alt", // default
};

// SectionHeader Component
const SectionHeader = ({ title }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={{ opacity: fadeAnim }}>
            <ImageBackground
                source={require('@/assets/header-bg.png')} // ganti sesuai tema beranda
                style={styles.sectionHeaderBg}
                imageStyle={{ borderRadius: 12 }}
            >
                <FontAwesome5
                    name={categoryIcons[title] || "map-marker-alt"}
                    size={20}
                    color="#fff"
                    style={{ marginRight: 8 }}
                />
                <ThemedText style={styles.headerText}>{title}</ThemedText>
            </ImageBackground>
        </Animated.View>
    );
};

export default function LokasiScreen() {
    // Firebase Config
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
    const router = useRouter();

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Buka Google Maps
    const handlePress = (coordinates) => {
        const [lat, lng] = coordinates.split(',').map(c => c.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    // Edit
    const handleEdit = (item) => {
        router.push({
            pathname: "/formeditlocation",
            params: {
                id: item.id,
                name: item.name,
                coordinates: item.coordinates,
                accuration: item.accuration || "",
                category: item.category || "Toyagama"
            }
        });
    };

    // Delete
    const handleDelete = (id) => {
        Alert.alert(
            "Hapus Lokasi",
            "Apakah Anda yakin ingin menghapus lokasi ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    onPress: () => {
                        const pointRef = ref(db, `points/${id}`);
                        remove(pointRef);
                    },
                    style: "destructive",
                },
            ]
        );
    };

    // Load Data
    useEffect(() => {
        const pointsRef = ref(db, "points/");
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const points = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                const grouped = {};
                points.forEach((p) => {
                    if (!grouped[p.category]) grouped[p.category] = [];
                    grouped[p.category].push(p);
                });

                const formattedSections = Object.keys(grouped).map((category) => ({
                    title: category,
                    data: grouped[category],
                }));

                setSections(formattedSections);
            } else {
                setSections([]);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Refresh UI
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7a00cc" />
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderSectionHeader={({ section }) => <SectionHeader title={section.title} />}
                renderItem={({ item }) => {
                    const fadeAnim = useRef(new Animated.Value(0)).current;

                    useEffect(() => {
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 500,
                            useNativeDriver: true,
                        }).start();
                    }, []);

                    return (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <View style={styles.card}>
                                <TouchableOpacity
                                    onPress={() => handlePress(item.coordinates)}
                                    style={{ flex: 1 }}
                                >
                                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                    <View style={styles.itemCategoryContainer}>
                                        <FontAwesome5
                                            name={categoryIcons[item.category] || "map-marker-alt"}
                                            size={14}
                                            color="#7a00cc"
                                        />
                                        <ThemedText style={styles.itemCategory}>{item.category}</ThemedText>
                                    </View>
                                    <ThemedText style={styles.itemCoord}>{item.coordinates}</ThemedText>
                                </TouchableOpacity>

                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editBtn}>
                                        <FontAwesome5 name="edit" size={20} color="#fff" />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
                                        <MaterialIcons name="delete" size={24} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    );
                }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                stickySectionHeadersEnabled
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#f5f5f5",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    sectionHeaderBg: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 5,
        backgroundColor: "#6020c8ff", // fallback warna
    },

    headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "#000",           // warna garis pinggir
    textShadowOffset: { width: 3, height: 2 }, // arah shadow
    textShadowRadius: 2,               // ketebalan shadow
},


    card: {
        backgroundColor: "#fff",
        padding: 18,
        marginVertical: 8,
        borderRadius: 15,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    itemName: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 6,
        color: "#333",
    },

    itemCategoryContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginBottom: 4,
    },

    itemCategory: {
        fontSize: 14,
        fontWeight: "600",
        color: "#7a00cc",
    },

    itemCoord: {
        fontSize: 12,
        color: "#555",
    },

    actions: {
        flexDirection: "row",
        gap: 12,
    },

    editBtn: {
        backgroundColor: "#7245cbff",
        padding: 4,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },

    deleteBtn: {
        backgroundColor: "#b53bb5ff",
        padding:4,
        borderRadius: 4,
        justifyContent: "center",
        alignItems: "center",
    },
});
