import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';

export interface HeaderProps {
  title: string;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({title, style}) => {
  const {theme} = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.primary,
          paddingTop: insets.top,
        },
        style,
      ]}>
      <Text
        style={[
          styles.title,
          {
            color: theme.colors.background,
          },
        ]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'left',
  },
});

