import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import { AchievementManagementCard, AchievementCardData } from '../../components/AchievementCard';
import AddAchievementModal from '../../components/AddAchievementModal/AddAchievementModal';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { fetchServicemanAchievements, updateExistingServicemanAchievement, removeServicemanAchievement } from '../../redux/slices/servicemanAchievementSlice';
import { fetchBrahmanAchievements, updateExistingBrahmanAchievement, removeBrahmanAchievement } from '../../redux/slices/brahmanAchievementSlice';
import { RootState } from '../../redux/store';
import {moderateVerticalScale, moderateScale} from '../../utils/scaling';

const ServicemanAchievementScreen: React.FC = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { userData } = useSelector((state: RootState) => state.user);
  const { achievements: servicemanAchievements, loading: servicemanLoading, error: servicemanError } = useSelector((state: RootState) => state.servicemanAchievements);
  const { achievements: brahmanAchievements, loading: brahmanLoading, error: brahmanError } = useSelector((state: RootState) => state.brahmanAchievements);
  
  const isServiceman = userData?.role === 'serviceman';
  const isBrahman = userData?.role === 'brahman';
  const screenTitle = isServiceman ? 'My Achievements' : isBrahman ? 'My Achievements' : 'My Achievements';
  const emptyIcon = 'emoji-events';
  const emptyTitle = 'No Achievements Added';
  const emptySubtitle = "You haven't added any achievements yet. Add your achievements to showcase your accomplishments.";
  const addButtonText = 'Add Achievement';
  
  const loading = isServiceman ? servicemanLoading : brahmanLoading;
  const error = isServiceman ? servicemanError : brahmanError;
  const data = isServiceman ? servicemanAchievements : brahmanAchievements;
  const refreshing = false; // TODO: Implement refreshing state in slices
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<AchievementCardData | null>(null);

  useEffect(() => {
    if (userData?.role) {
      if (isServiceman) {
        dispatch(fetchServicemanAchievements() as any);
      } else if (isBrahman) {
        dispatch(fetchBrahmanAchievements() as any);
      }
    }
  }, [dispatch, userData?.role, isServiceman, isBrahman]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', 'Failed to load achievements. Please try again.');
    }
  }, [error]);

  const handleEditItem = (itemId: number) => {
    const item = data.find(item => item.id === itemId);
    if (item) {
      // Map item to AchievementData format for modal
      const mappedItem = {
        id: item.id,
        title: item.title,
        description: item.description,
        achieved_date: item.achieved_date,
        created_at: item.created_at,
        updated_at: item.updated_at,
      };
      setEditingItem(mappedItem as any);
      setShowEditModal(true);
    }
  };

  const handleDeleteItem = (itemId: number) => {
    Alert.alert(
      'Delete Achievement',
      'Are you sure you want to delete this achievement?',
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
                await dispatch(removeServicemanAchievement(itemId) as any);
              } else {
                await dispatch(removeBrahmanAchievement(itemId) as any);
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to delete achievement. Please try again.');
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
      dispatch(fetchServicemanAchievements() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanAchievements() as any);
    }
    handleModalClose();
  };

  const handleEditSuccess = () => {
    // Refresh the data after successful update
    if (isServiceman) {
      dispatch(fetchServicemanAchievements() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanAchievements() as any);
    }
    handleModalClose();
  };

  const handleRefresh = () => {
    if (isServiceman) {
      dispatch(fetchServicemanAchievements() as any);
    } else if (isBrahman) {
      dispatch(fetchBrahmanAchievements() as any);
    }
  };

  const renderItem = ({ item }: { item: AchievementCardData }) => (
    <AchievementManagementCard
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

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header 
        title={screenTitle} 
      />
      <View style={styles.content}>
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading achievements...
            </Text>
          </View>
        ) : (
          <FlatList
            data={data as unknown as AchievementCardData[]}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            contentContainerStyle={data.length === 0 ? styles.emptyContainer : styles.listContent}
            ListEmptyComponent={renderEmptyState}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
        onPress={handleAddItem}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <AddAchievementModal
        visible={showAddModal}
        onClose={handleModalClose}
        itemType={isServiceman ? 'serviceman' : 'brahman'}
        onSuccess={handleModalSuccess}
      />

      <AddAchievementModal
        visible={showEditModal}
        onClose={handleModalClose}
        itemType={isServiceman ? 'serviceman' : 'brahman'}
        onSuccess={handleEditSuccess}
        editingItem={editingItem as any}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
    paddingBottom: moderateVerticalScale(80), // Add padding to prevent FAB from covering content
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(20),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: moderateVerticalScale(16),
    fontSize: moderateScale(16),
  },
  listContent: {
    flexGrow: 1,
  },
  emptyTitle: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: moderateVerticalScale(20),
    marginBottom: moderateVerticalScale(12),
  },
  emptySubtitle: {
    fontSize: moderateScale(16),
    textAlign: 'center',
    lineHeight: moderateScale(22),
    maxWidth: moderateScale(300),
  },
  fab: {
    position: 'absolute',
    bottom: moderateVerticalScale(70),
    right: moderateScale(24),
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: moderateScale(4),
    },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(4.65),
  },
});

export default ServicemanAchievementScreen;
