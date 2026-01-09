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

export interface AchievementCardProps {
  id: number;
  title: string;
  description: string;
  achieved_date: string;
  onPress?: (id: number) => void;
  compact?: boolean;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
  id,
  title,
  description,
  achieved_date,
  onPress,
  compact = false,
}) => {
  const {theme} = useTheme();

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
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
      <Text style={[styles.date, {color: theme.colors.textSecondary}]}>
        {compact ? new Date(achieved_date).getFullYear() : achieved_date}
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
  date: {
    fontSize: scaleFont(12),
    marginBottom: verticalScale(8),
  },
  description: {
    fontSize: scaleFont(14),
    lineHeight: verticalScale(20),
  },
});

export default AchievementCard;
