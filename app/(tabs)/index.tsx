import { LinearGradient } from 'expo-linear-gradient';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';

const categories = [
  { name: 'Toyagama', count: 12, icon: require('@/assets/icons/toyagama.png') },
  { name: 'ATM', count: 4, icon: require('@/assets/icons/atm.png') },
  { name: 'Halte', count: 8, icon: require('@/assets/icons/halte.png') },
  { name: 'Sepeda', count: 5, icon: require('@/assets/icons/bike.png') },
  { name: 'Asrama', count: 6, icon: require('@/assets/icons/asrama.png') },
];

const features = [
  { title: 'Lokasi Terdekat', description: 'Cari lokasi fasilitas terdekat dengan cepat', icon: require('@/assets/icons/location.png') },
  { title: 'Informasi Fasilitas', description: 'Dapatkan detail fasilitas lengkap di UGM', icon: require('@/assets/icons/info.png') },
  { title: 'Bantuan 24/7', description: 'Mendapatkan bantuan kapan saja', icon: require('@/assets/icons/support.png') },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <LinearGradient
        colors={['#3F72AF', '#6A9FB5']}
        style={styles.header}
      >
        <Image
          source={require('@/assets/images/ugm_campus.png')}
          style={styles.headerImage}
        />
        <ThemedText type="title" style={styles.title}>GamaFacility</ThemedText>
        <ThemedText style={styles.description}>
          Temukan fasilitas kampus UGM dengan cepat & mudah. Dari Toyagama, ATM, Halte, Sepeda hingga Asrama.
        </ThemedText>
      </LinearGradient>

      {/* Features */}
      <View style={styles.featureContainer}>
        {features.map((f, idx) => (
          <View key={idx} style={styles.featureCard}>
            <Image source={f.icon} style={styles.featureIcon} />
            <ThemedText style={styles.featureTitle}>{f.title}</ThemedText>
            <ThemedText style={styles.featureDesc}>{f.description}</ThemedText>
          </View>
        ))}
      </View>

      {/* Categories Vertical */}
      <View style={styles.categoryContainer}>
        <ThemedText type="subtitle" style={styles.categoryHeader}>Kategori Fasilitas</ThemedText>
        {categories.map((cat, idx) => (
          <View key={idx} style={styles.categoryCard}>
            <Image source={cat.icon} style={styles.categoryIcon} />
            <View style={{marginLeft: 12}}>
              <ThemedText style={styles.categoryName}>{cat.name}</ThemedText>
              <ThemedText style={styles.categoryCount}>{cat.count} lokasi</ThemedText>
            </View>
          </View>
        ))}
      </View>

      {/* Dokumentasi / Map */}
      <View style={styles.mapContainer}>
        <ThemedText type="subtitle" style={styles.mapHeader}>Peta Kampus</ThemedText>
        <Image
          source={require('@/assets/images/peta.jpg')}
          style={styles.mapImage}
        />
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f4f6' },

  /* Header */
  header: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerImage: {
    width: '100%',
    height: 190,
    borderRadius: 5,
    marginBottom: 5,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  description: { fontSize: 14, color: '#e0e0e0', textAlign: 'center' },

  /* Features */
  featureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    width: 100,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  featureIcon: { width: 40, height: 40, marginBottom: 8 },
  featureTitle: { fontWeight: '600', fontSize: 14, textAlign: 'center' },
  featureDesc: { fontSize: 10, color: '#555', textAlign: 'center' },

  /* Categories Vertical */
  categoryContainer: { paddingHorizontal: 20, marginVertical: 16 },
  categoryHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  categoryIcon: { width: 50, height: 50 },

  categoryName: { fontSize: 16, fontWeight: '600' },
  categoryCount: { fontSize: 12, color: '#555' },

  /* Map */
  mapContainer: { paddingHorizontal: 20, marginBottom: 30 },
  mapHeader: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  mapImage: { width: '100%', height: 230, borderRadius: 5 },
});
