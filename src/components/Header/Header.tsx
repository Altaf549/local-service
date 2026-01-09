import React from 'react';
import {View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';

export interface HeaderProps {
  title: string;
  style?: ViewStyle;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({title, style, rightIcon, onRightIconPress}) => {
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
      <View style={styles.leftContainer}>
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
      {rightIcon && (
        <TouchableOpacity 
          style={styles.rightIcon} 
          onPress={onRightIconPress}
        >
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'left',
  },
  rightIcon: {
    padding: 8,
  },
});

