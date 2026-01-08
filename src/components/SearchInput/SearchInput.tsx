import React from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import Icon from '@react-native-vector-icons/ionicons';

export interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  disabled = false,
  style,
  inputStyle,
  testID,
}) => {
  const {theme} = useTheme();

  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: disabled
            ? theme.colors.disabled
            : theme.colors.surface,
          borderColor: theme.colors.border,
          borderRadius: theme.borderRadius.md,
        },
        style,
      ]}>
      <Icon
        name="search-outline"
        size={20}
        color={theme.colors.textSecondary}
        style={styles.searchIcon}
      />
      <TextInput
        style={[
          styles.input,
          {
            color: theme.colors.text,
            flex: 1,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        editable={!disabled}
        testID={testID}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearIcon}>
          <Icon
            name="close-circle"
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  clearIcon: {
    padding: 4,
    marginLeft: 8,
  },
});

