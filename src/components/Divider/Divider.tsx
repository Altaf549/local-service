import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface DividerProps {
  style?: ViewStyle;
  thickness?: number;
  testID?: string;
}

export const Divider: React.FC<DividerProps> = ({
  style,
  thickness = 1,
  testID,
}) => {
  const {theme} = useTheme();

  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: theme.colors.border,
          height: thickness,
        },
        style,
      ]}
      testID={testID}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});

