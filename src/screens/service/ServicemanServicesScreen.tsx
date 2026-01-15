import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import PriceCard, { PriceCardData } from '../../components/PriceCard/PriceCard';
import AddPriceModal from '../../components/AddPriceModal/AddPriceModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { fetchServicePrices } from '../../redux/slices/servicePricesSlice';
import { fetchPujaPrices } from '../../redux/slices/pujaPricesSlice';
import { RootState } from '../../redux/store';

const ServicemanServicesScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { servicePrices, loading: serviceLoading, error: serviceError } = useSelector((state: RootState) => state.servicePrices);
  const { pujaPrices, loading: pujaLoading, error: pujaError } = useSelector((state: RootState) => state.pujaPrices);
  
  const isServiceman = userData?.role === 'serviceman';
  const isBrahman = userData?.role === 'brahman';
  const screenTitle = isServiceman ? 'My Services' : isBrahman ? 'My Pujas' : 'My Services';
  const emptyIcon = isServiceman ? 'category' : 'temple-hindu';
  const emptyTitle = isServiceman ? 'No Services Added' : 'No Pujas Added';
  const emptySubtitle = isServiceman 
    ? "You haven't added any services yet. Start adding your services to manage them here."
    : "You haven't added any pujas yet. Start adding your pujas to manage them here.";
  const addButtonText = isServiceman ? 'Add Service' : 'Add Puja';
  
  const loading = isServiceman ? serviceLoading : pujaLoading;
  const error = isServiceman ? serviceError : pujaError;
  const data = isServiceman ? servicePrices : pujaPrices;
  const refreshing = false; // TODO: Implement refreshing state in slices
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (userData?.role) {
      if (isServiceman) {
        dispatch(fetchServicePrices() as any);
      } else if (isBrahman) {
        dispatch(fetchPujaPrices() as any);
      }
    }
  }, [dispatch, userData?.role, isServiceman, isBrahman]);

  useEffect(() => {
    if (error) {
      const errorMessage = isServiceman 
        ? 'Failed to load services. Please try again.'
        : 'Failed to load pujas. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  }, [error, isServiceman]);

  const handleRefresh = () => {
    if (isServiceman) {
      dispatch(fetchServicePrices() as any);
    } else if (isBrahman) {
      dispatch(fetchPujaPrices() as any);
    }
  };

  const handleEditItem = (itemId: number) => {
    console.log(`Edit ${isServiceman ? 'service' : 'puja'}:`, itemId);
    // TODO: Navigate to edit screen or open modal
  };

  const handleDeleteItem = (itemId: number) => {
    const itemType = isServiceman ? 'Service' : 'Puja';
    Alert.alert(
      `Delete ${itemType}`,
      `Are you sure you want to delete this ${itemType.toLowerCase()}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log(`Delete ${itemType.toLowerCase()}:`, itemId);
            // TODO: Call delete API and refresh list
          },
        },
      ]
    );
  };

  const handleAddItem = () => {
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
  };

  const handleModalSuccess = () => {
    // Refresh the data after successful addition
    if (isServiceman) {
      dispatch(fetchServicePrices() as any);
    } else if (isBrahman) {
      dispatch(fetchPujaPrices() as any);
    }
  };

  const renderItem = ({ item }: { item: PriceCardData }) => (
    <PriceCard
      item={item}
      itemType={isServiceman ? 'service' : 'puja'}
      onEdit={handleEditItem}
      onDelete={handleDeleteItem}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons 
        name={emptyIcon} 
        size={80} 
        color={theme.colors.textSecondary} 
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        {emptyTitle}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
        {emptySubtitle}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        edges={['left', 'right']}
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}>
        <Header 
          title={screenTitle} 
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
            Loading {isServiceman ? 'services' : 'pujas'}...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}>
      <Header 
        title={screenTitle} 
      />
      <View style={styles.content}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={data.length === 0 ? styles.emptyListContainer : styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
        />
      </View>
      
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddItem}
      >
        <MaterialIcons 
          name="add" 
          size={24} 
          color={theme.colors.background} 
        />
      </TouchableOpacity>

      {/* Add Price Modal */}
      <AddPriceModal
        visible={showAddModal}
        onClose={handleModalClose}
        itemType={isServiceman ? 'service' : 'puja'}
        onSuccess={handleModalSuccess}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});

export default ServicemanServicesScreen;
