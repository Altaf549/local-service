import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../theme/ThemeContext';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';

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
    borderRadius: moderateScale(12),
    padding: moderateScale(16),
    marginBottom: moderateVerticalScale(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: moderateVerticalScale(12),
  },
  titleContainer: {
    flex: 1,
    marginRight: moderateScale(12),
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(4),
  },
  company: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: moderateScale(8),
  },
  actionButton: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    marginBottom: moderateVerticalScale(12),
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
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  yearsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4),
  },
  yearsText: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
});

export default ExperienceManagementCard;
