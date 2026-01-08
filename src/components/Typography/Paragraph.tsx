import React from 'react';
import {Text, StyleSheet, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface ParagraphProps {
  children: React.ReactNode;
  style?: TextStyle;
  testID?: string;
}

export const Paragraph: React.FC<ParagraphProps> = ({
  children,
  style,
  testID,
}) => {
  const {theme} = useTheme();

  return (
    <Text
      style={[
        {
          fontSize: theme.typography.body.fontSize,
          fontWeight: theme.typography.body.fontWeight as TextStyle['fontWeight'],
          lineHeight: theme.typography.body.lineHeight,
          color: theme.colors.text,
        },
        style,
      ]}
      testID={testID}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({});

