import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';

export interface DropdownOption {
  label: string;
  value: string | number;
}

export interface DropdownProps {
  options: DropdownOption[];
  selectedValue?: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
  containerStyle?: ViewStyle;
  testID?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  label,
  disabled = false,
  style,
  containerStyle,
  testID,
}) => {
  const {theme} = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({top: 0, left: 0});

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string | number) => {
    onSelect(value);
    setIsOpen(false);
  };

  const renderItem = ({item}: {item: DropdownOption}) => {
    const isSelected = item.value === selectedValue;
    return (
      <TouchableOpacity
        style={[
          styles.dropdownItem,
          {
            backgroundColor: theme.colors.surface,
            borderBottomColor: theme.colors.border,
          },
          isSelected && {backgroundColor: theme.colors.surface},
        ]}
        onPress={() => handleSelect(item.value)}>
        <Text
          style={[
            styles.dropdownItemText,
            {
              color: isSelected
                ? theme.colors.primary
                : theme.colors.text,
              fontWeight: isSelected ? '600' : '400',
            },
          ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
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
      )}
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            backgroundColor: disabled
              ? theme.colors.disabled
              : theme.colors.surface,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius.md,
          },
          style,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        testID={testID}>
        <Text
          style={[
            styles.dropdownButtonText,
            {
              color: selectedOption
                ? theme.colors.text
                : theme.colors.placeholder,
            },
          ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={[styles.arrow, {color: theme.colors.textSecondary}]}>
          ▼
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}>
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius.md,
                borderColor: theme.colors.border,
              },
            ]}>
            <FlatList
              data={options}
              renderItem={renderItem}
              keyExtractor={item => String(item.value)}
              style={styles.flatList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    minHeight: 48,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 16,
  },
  arrow: {
    fontSize: 12,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownList: {
    width: '80%',
    maxHeight: 300,
    borderWidth: 1,
    overflow: 'hidden',
  },
  flatList: {
    maxHeight: 300,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  dropdownItemText: {
    fontSize: 16,
  },
});

