import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface TitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  style?: TextStyle;
  numberOfLines?: number;
  testID?: string;
}

export const Title: React.FC<TitleProps> = ({
  children,
  level = 1,
  style,
  numberOfLines,
  testID,
}) => {
  const {theme} = useTheme();

  const getStyle = (): TextStyle => {
    switch (level) {
      case 1:
        return {
          fontSize: theme.typography.h1.fontSize,
          fontWeight: theme.typography.h1.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h1.lineHeight,
          color: theme.colors.text,
        };
      case 2:
        return {
          fontSize: theme.typography.h2.fontSize,
          fontWeight: theme.typography.h2.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h2.lineHeight,
          color: theme.colors.text,
        };
      case 3:
        return {
          fontSize: theme.typography.h3.fontSize,
          fontWeight: theme.typography.h3.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h3.lineHeight,
          color: theme.colors.text,
        };
      case 4:
        return {
          fontSize: theme.typography.h4.fontSize,
          fontWeight: theme.typography.h4.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h4.lineHeight,
          color: theme.colors.text,
        };
      default:
        return {
          fontSize: theme.typography.h1.fontSize,
          fontWeight: theme.typography.h1.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.h1.lineHeight,
          color: theme.colors.text,
        };
    }
  };

  return (
    <Text
      style={[getStyle(), style]}
      numberOfLines={numberOfLines}
      testID={testID}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});

