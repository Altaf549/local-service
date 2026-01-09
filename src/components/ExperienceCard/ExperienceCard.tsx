import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import {
  scale,
  verticalScale,
  moderateScale,
  scaleFont,
  scaleSize,
} from '../../utils/scaling';

export interface ExperienceCardProps {
  id: number;
  title: string;
  company: string;
  start_date: string;
  end_date?: string;
  is_current?: boolean;
  description: string;
  onPress?: (id: number) => void;
  compact?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id,
  title,
  company,
  start_date,
  end_date,
  is_current = false,
  description,
  onPress,
  compact = false,
}) => {
  const {theme} = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <View 
      style={[
        styles.container, 
        {backgroundColor: theme.colors.card},
        compact && styles.compactContainer
      ]}
      onTouchEnd={handlePress}
    >
      <Text style={[styles.title, {color: theme.colors.text}]}>
        {title}
      </Text>
      <Text style={[styles.company, {color: theme.colors.textSecondary}]}>
        {company}
      </Text>
      <Text style={[styles.duration, {color: theme.colors.textSecondary}]}>
        {formatDate(start_date)} - {is_current ? 'Present' : formatDate(end_date || '')}
      </Text>
      {!compact && (
        <Text style={[styles.description, {color: theme.colors.text}]}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  compactContainer: {
    padding: moderateScale(12),
    marginBottom: verticalScale(8),
    marginRight: moderateScale(12),
    minWidth: scaleSize(200),
  },
  title: {
    fontSize: scaleFont(16),
    fontWeight: '600',
    marginBottom: verticalScale(4),
  },
  company: {
    fontSize: scaleFont(14),
    marginBottom: verticalScale(4),
  },
  duration: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: scaleFont(14),
    lineHeight: verticalScale(20),
  },
});

export default ExperienceCard;
