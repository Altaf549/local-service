import React from 'react';
import {View, Text, TextInput, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface TextInputWithLabelProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const TextInputWithLabel: React.FC<TextInputWithLabelProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  style,
  inputStyle,
  testID,
}) => {
  const {theme} = useTheme();

  return (
    <View style={[styles.container, style]}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
          },
        ]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: disabled
              ? theme.colors.disabled
              : theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            color: theme.colors.text,
            borderRadius: theme.borderRadius.md,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            minHeight: multiline ? numberOfLines * 24 + 32 : 48,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        testID={testID}
      />
      {error && (
        <Text
          style={[
            styles.errorText,
            {
              color: theme.colors.error,
              marginTop: theme.spacing.xs,
            },
          ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
  },
});

