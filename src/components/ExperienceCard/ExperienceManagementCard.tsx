import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';

export interface ExperienceCardData {
  id: number;
  title: string;
  company?: string;
  organization?: string;
  description: string;
  years: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
}

interface ExperienceManagementCardProps {
  item: ExperienceCardData;
  itemType: 'serviceman' | 'brahman';
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const ExperienceManagementCard: React.FC<ExperienceManagementCardProps> = ({ item, itemType, onEdit, onDelete }) => {
  const { theme } = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getCompanyOrOrganization = () => {
    if (itemType === 'serviceman') {
      return item.company || '';
    } else {
      return item.organization || '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{item.title}</Text>
          <Text style={[styles.company, { color: theme.colors.textSecondary }]}>
            {getCompanyOrOrganization()}
          </Text>
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
          <Text style={[styles.dateText, { color: theme.colors.textSecondary }]}>
            {formatDate(item.start_date)} - {formatDate(item.end_date)}
          </Text>
        </View>
        <View style={styles.yearsContainer}>
          <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.yearsText, { color: theme.colors.textSecondary }]}>
            {item.years} {item.years === 1 ? 'year' : 'years'}
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
    marginBottom: 12,
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
  company: {
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
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '500',
  },
  yearsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  yearsText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default ExperienceManagementCard;
