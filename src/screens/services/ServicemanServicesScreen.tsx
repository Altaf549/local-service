import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../../components/Header/Header';
import MaterialIcons from '@react-native-vector-icons/material-icons';

const ServicemanServicesScreen: React.FC = () => {
  const { theme } = useTheme();

  const handleAddService = () => {
    console.log('Add service pressed');
    // TODO: Navigate to add service screen or open modal
  };

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}>
      <Header 
        title="My Services" 
      />
      <View style={styles.content}>
        <View style={styles.emptyContainer}>
          <MaterialIcons 
            name="category" 
            size={80} 
            color={theme.colors.textSecondary} 
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No Services Added
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
            You haven't added any services yet. Start adding your services to manage them here.
          </Text>
        </View>
      </View>
      
      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleAddService}
      >
        <MaterialIcons 
          name="add" 
          size={24} 
          color={theme.colors.background} 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
