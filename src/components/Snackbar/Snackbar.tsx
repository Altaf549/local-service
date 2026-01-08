import React, {useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import Icon from '@react-native-vector-icons/ionicons';

export type SnackbarType = 'success' | 'error' | 'info' | 'warning';

export interface SnackbarProps {
  message: string;
  type?: SnackbarType;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  onClose?: () => void;
  visible: boolean;
}

const {width, height} = Dimensions.get('window');

export const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type = 'info',
  action,
  duration = 4000,
  onClose,
  visible,
}) => {
  const {theme} = useTheme();
  const translateY = new Animated.Value(100);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideSnackbar();
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getIconName = (): string => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      case 'info':
      default:
        return 'information-circle';
    }
  };

  const getBackgroundColor = (): string => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'warning':
        return theme.colors.warning;
      case 'info':
      default:
        return theme.colors.info;
    }
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{translateY}],
          opacity,
          backgroundColor: theme.colors.surface,
          borderLeftColor: getBackgroundColor(),
        },
      ]}>
      <View style={styles.content}>
        <Icon
          name={getIconName()}
          size={24}
          color={getBackgroundColor()}
          style={styles.icon}
        />
        <Text style={[styles.message, {color: theme.colors.text}]}>
          {message}
        </Text>
      </View>
      {action && (
        <TouchableOpacity
          onPress={() => {
            action.onPress();
            hideSnackbar();
          }}
          style={styles.actionButton}>
          <Text
            style={[
              styles.actionText,
              {color: getBackgroundColor()},
            ]}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={hideSnackbar} style={styles.closeButton}>
        <Icon name="close" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
  actionButton: {
    marginLeft: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
});

