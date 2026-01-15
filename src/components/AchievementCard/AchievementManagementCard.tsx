import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export interface AchievementCardData {
  id: number;
  title: string;
  description: string;
  achieved_date: string;
  created_at: string;
  updated_at: string;
}

interface AchievementManagementCardProps {
  item: AchievementCardData;
  itemType: 'serviceman' | 'brahman';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const AchievementManagementCard: React.FC<AchievementManagementCardProps> = ({ item, itemType, onEdit, onDelete }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getAchievementDate = () => {
    return item.achieved_date;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary + '20' }]}
            onPress={() => onEdit(item.id)}
          >
            <MaterialIcons name="edit" size={18} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef444420' }]}
            onPress={() => onDelete(item.id)}
          >
            <MaterialIcons name="delete" size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <MaterialIcons name="event" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
            {formatDate(getAchievementDate())}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  organization: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  yearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default AchievementManagementCard;
