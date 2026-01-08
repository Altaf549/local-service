import React from 'react';
import {View, StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {Title} from '../components/Typography/Title';
import {CircleItem} from '../components/CircleItem/CircleItem';
import {Spacer} from '../components/Spacer/Spacer';
import {useTheme} from '../theme/useTheme';

interface PujaType {
  id: number;
  puja_name: string;
  price: number;
  image: string;
}

const PujaTypeScreen: React.FC = () => {
  const theme = useTheme();
  
  // Mock data - replace with actual API call
  const pujaTypes: PujaType[] = [
    { id: 1, puja_name: 'Satyanarayan Puja', price: 2500, image: 'https://example.com/satyanarayan.jpg' },
    { id: 2, puja_name: 'Ganesh Puja', price: 1500, image: 'https://example.com/ganesh.jpg' },
    { id: 3, puja_name: 'Laxmi Puja', price: 2000, image: 'https://example.com/laxmi.jpg' },
    { id: 4, puja_name: 'Shiv Puja', price: 1800, image: 'https://example.com/shiv.jpg' },
    { id: 5, puja_name: 'Durga Puja', price: 3000, image: 'https://example.com/durga.jpg' },
    { id: 6, puja_name: 'Navratri Puja', price: 3500, image: 'https://example.com/navratri.jpg' },
  ];

  const renderPujaItem = ({ item }: { item: PujaType }) => (
    <CircleItem
      image={item.image}
      title={item.puja_name}
      price={item.price}
      onPress={() => {
        // TODO: Navigate to puja details
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title level={1}>Puja Types</Title>
      </View>
      <Spacer size={theme.spacing.md} />
      <FlatList
        data={pujaTypes}
        renderItem={renderPujaItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default PujaTypeScreen;
