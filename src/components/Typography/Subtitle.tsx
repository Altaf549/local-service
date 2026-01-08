import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface SubtitleProps {
  children: React.ReactNode;
  style?: TextStyle;
  testID?: string;
}

export const Subtitle: React.FC<SubtitleProps> = ({
  children,
  style,
  testID,
}) => {
  const {theme} = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: theme.typography.h4.fontSize,
          fontWeight: theme.typography.h4.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h4.lineHeight,
          color: theme.colors.textSecondary,
        },
        style,
      ]}
      testID={testID}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});

