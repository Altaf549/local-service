import React, {useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import Icon from '@react-native-vector-icons/ionicons';

export interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder = 'Enter password',
  error,
  disabled = false,
  style,
  inputStyle,
  testID,
}) => {
  const {theme} = useTheme();
  const [isVisible, setIsVisible] = useState(false);

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
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: disabled
              ? theme.colors.disabled
              : theme.colors.surface,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.md,
          },
        ]}>
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
          secureTextEntry={!isVisible}
          editable={!disabled}
          testID={testID}
        />
        <TouchableOpacity
          onPress={() => setIsVisible(!isVisible)}
          style={styles.eyeIcon}
          disabled={disabled}>
          <Icon
            name={isVisible ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
  },
});

