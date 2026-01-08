import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Title} from '../Typography/Title';
import {Button} from '../Button/Button';
import {moderateScale} from '../../utils/scaling';

export interface SectionHeaderProps {
  title: string;
  showSeeAll: boolean;
  onSeeAllPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  showSeeAll,
  onSeeAllPress,
}) => {
  return (
    <View style={styles.container}>
      <Title level={2}>{title}</Title>
      {showSeeAll && onSeeAllPress && (
        <Button
          title="See All"
          variant="text"
          size="small"
          onPress={onSeeAllPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

