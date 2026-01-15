import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import ExperienceManagementCard, { ExperienceCardData } from '../../components/ExperienceCard/ExperienceManagementCard';
import AddExperienceModal from '../../components/AddExperienceModal/AddExperienceModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { fetchServicemanExperiences, updateServicemanExperience, deleteServicemanExperience } from '../../redux/slices/servicemanExperienceSlice';
import { fetchBrahmanExperiences, updateBrahmanExperience, deleteBrahmanExperience } from '../../redux/slices/brahmanExperienceSlice';
import { RootState } from '../../redux/store';
import { UserState } from '../../redux/slices/userSlice';

const ServicemanExperienceScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { experiences: servicemanExperiences, loading: servicemanLoading, error: servicemanError } = useSelector((state: RootState) => state.servicemanExperience);
  const { experiences: brahmanExperiences, loading: brahmanLoading, error: brahmanError } = useSelector((state: RootState) => state.brahmanExperience);
  
  const isServiceman = userData?.role === 'serviceman';
  const isBrahman = userData?.role === 'brahman';
  const screenTitle = isServiceman ? 'My Experience' : isBrahman ? 'My Experience' : 'My Experience';
  const emptyIcon = 'work-history';
  const emptyTitle = 'No Experience Added';
  const emptySubtitle = "You haven't added any work experience yet. Add your experience to showcase your expertise.";
  const addButtonText = 'Add Experience';
  
  const loading = isServiceman ? servicemanLoading : brahmanLoading;
  const error = isServiceman ? servicemanError : brahmanError;
  const data = isServiceman ? servicemanExperiences : brahmanExperiences;
  const refreshing = false; // TODO: Implement refreshing state in slices
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ExperienceCardData | null>(null);

  useEffect(() => {
    if (userData?.role) {
      if (isServiceman) {
        dispatch(fetchServicemanExperiences() as any);
      } else if (isBrahman) {
        dispatch(fetchBrahmanExperiences() as any);
      }
    }
  }, [dispatch, userData?.role, isServiceman, isBrahman]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to load experiences. Please try again.');
    }
  }, [error]);

  const handleRefresh = () => {
    if (isServiceman) {
      dispatch(fetchServicemanExperiences() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanExperiences() as any);
    }
  };

  const handleEditItem = (itemId: number) => {
    const item = data.find(item => item.id === itemId);
    if (item) {
      // Map item to ExperienceData format for modal
      const mappedItem = {
        id: item.id,
        title: item.title,
        company: isServiceman 
          ? (item as any).company || '' 
          : (item as any).organization || '',
        description: item.description,
        years: item.years,
        start_date: item.start_date,
        end_date: item.end_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
      setEditingItem(mappedItem as any);
      setShowEditModal(true);
    }
  };

  const handleDeleteItem = (itemId: number) => {
    Alert.alert(
      'Delete Experience',
      'Are you sure you want to delete this experience?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (isServiceman) {
                await dispatch(deleteServicemanExperience(itemId) as any);
              } else {
                await dispatch(deleteBrahmanExperience(itemId) as any);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete experience. Please try again.');
            }
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
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleModalSuccess = () => {
    // Refresh the data after successful addition/update
    if (isServiceman) {
      dispatch(fetchServicemanExperiences() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanExperiences() as any);
    }
    handleModalClose();
  };

  const handleEditSuccess = () => {
    // Refresh the data after successful update
    if (isServiceman) {
      dispatch(fetchServicemanExperiences() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanExperiences() as any);
    }
    handleModalClose();
  };

  const renderItem = ({ item }: { item: ExperienceCardData }) => (
    <ExperienceManagementCard
      item={item}
      itemType={isServiceman ? 'serviceman' : 'brahman'}
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
            Loading experiences...
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

      {/* Add Experience Modal */}
      <AddExperienceModal
        visible={showAddModal}
        onClose={handleModalClose}
        itemType={isServiceman ? 'serviceman' : 'brahman'}
        onSuccess={handleModalSuccess}
      />

      {/* Edit Experience Modal */}
      <AddExperienceModal
        visible={showEditModal}
        onClose={handleModalClose}
        itemType={isServiceman ? 'serviceman' : 'brahman'}
        onSuccess={handleEditSuccess}
        editingItem={editingItem}
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

export default ServicemanExperienceScreen;
