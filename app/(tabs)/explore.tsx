import { IconSymbol } from '@/components/ui/icon-symbol';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

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

const categoryImages: Record<string, string> = {
  Toyagama: "https://cdn-icons-png.flaticon.com/512/727/727790.png",
  ATM: "https://cdn-icons-png.flaticon.com/512/483/483103.png",
  Halte: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
  Sepeda: "https://cdn-icons-png.flaticon.com/512/808/808424.png",
  Asrama: "https://cdn-icons-png.flaticon.com/512/1946/1946433.png",
  Default: "https://cdn-icons-png.flaticon.com/512/854/854866.png"
};

export default function ExploreScreen() {
  const [points, setPoints] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const pointsRef = ref(db, "/points");
    onValue(pointsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setPoints([]);
        return;
      }
      const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
      setPoints(list);
    });
  }, []);

  const categoryCounts = points.reduce((acc: Record<string, number>, p) => {
    const cat = p.category || "Default";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const filteredPoints = search.trim().length > 0
    ? points.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    )
    : [];

  const renderHorizontalCard = (item: any) => {
    const imageUrl = item.imageUrl || categoryImages[item.category] || categoryImages.Default;
    return (
      <View key={item.id} style={styles.horizontalCard}>
        <Image source={{ uri: imageUrl }} style={styles.horizontalCardImage} />
        <Text style={styles.horizontalCardName}>{item.name}</Text>
        <Text style={styles.horizontalCardCategory}>{item.category}</Text>
        <Text style={styles.horizontalCardPrice}>Gunakan Fasilitas Kampusmu!</Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <IconSymbol
        size={40}
        name="location.fill"
        style={{ marginRight: 12 }}
        color="#7a00cc"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Search tetap di atas */}
      <View style={{ padding: 12 }}>
        <TextInput
          style={styles.search}
          placeholder="Cari nama atau kategori..."
          value={search}
          onChangeText={setSearch}
          multiline={true}
          autoCorrect={false}
          autoCapitalize="none"
          textAlignVertical="top"
        />
      </View>

      {filteredPoints.length === 0 && (
        <>
          {/* Horizontal Cards */}
          <FlatList
            horizontal
            data={points}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 12, marginBottom: 20 }}
            renderItem={({ item }) => renderHorizontalCard(item)}
          />

          {/* Grafik */}
          <Text style={styles.chartTitle}>Jumlah Fasilitas per Kategori</Text>
          <BarChart
            data={{
              labels: Object.keys(categoryCounts),
              datasets: [{ data: Object.values(categoryCounts) }]
            }}
            width={Dimensions.get("window").width -34}
            height={200}
            fromZero
            showValuesOnTopOfBars
            chartConfig={{
              backgroundGradientFrom: "#f8f9fa",
              backgroundGradientTo: "#f8f9fa",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(122, 0, 204, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: { borderRadius: 10 },
              propsForBackgroundLines: { strokeWidth: 0.5, stroke: "#ccc" }
            }}
            style={{ marginVertical: 20, borderRadius: 16, marginHorizontal: 1 }}
          />

          <View style={styles.decorativeBox}>
            <Text style={{ color: "#fff", fontWeight: "700", textAlign: "center" }}>
              Semua fasilitas kampus siap menemani aktivitasmu!
            </Text>
          </View>
        </>
      )}

      {/* FlatList hasil search atau semua data */}
      <FlatList
        data={filteredPoints.length > 0 ? filteredPoints : points}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 50 }}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontSize: 16,
    height: 50,
    textAlignVertical: 'top',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600' },
  category: { fontSize: 12, color: '#6c757d' },
  horizontalCard: {
    width: 140,
    height: 180,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  horizontalCardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginBottom: 18,
    resizeMode: 'cover',
  },
  horizontalCardName: { fontWeight: '700', fontSize: 14, textAlign: 'center' },
  horizontalCardCategory: { fontSize: 12, color: '#642a8aff', marginBottom: 4 },
  horizontalCardPrice: { fontSize: 11, color: '#555' },
  chartTitle: { fontSize: 16, fontWeight: '700', marginLeft: 12, marginBottom: 6, color: '#673d84ff' },
  decorativeBox: {
    backgroundColor: '#692f90ff',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});