import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Snackbar, SnackbarType} from './Snackbar';

interface SnackbarItem {
  id: string;
  message: string;
  type: SnackbarType;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
}

let snackbarIdCounter = 0;
let snackbarQueue: SnackbarItem[] = [];
let currentSnackbar: SnackbarItem | null = null;
let setSnackbarState: ((snackbar: SnackbarItem | null) => void) | null = null;
let setVisibleState: ((visible: boolean) => void) | null = null;

export const SnackbarManager: React.FC = () => {
  const [snackbar, setSnackbar] = useState<SnackbarItem | null>(null);
  const [visible, setVisible] = useState(false);

  setSnackbarState = setSnackbar;
  setVisibleState = setVisible;

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      currentSnackbar = null;
      if (snackbarQueue.length > 0) {
        const nextSnackbar = snackbarQueue.shift()!;
        currentSnackbar = nextSnackbar;
        setSnackbarState?.(nextSnackbar);
        setVisibleState?.(true);
      } else {
        setSnackbarState?.(null);
      }
    }, 300);
  }, []);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          action={snackbar.action}
          duration={snackbar.duration}
          visible={visible}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

export const showSnackbar = (
  message: string,
  type: SnackbarType = 'info',
  action?: {
    label: string;
    onPress: () => void;
  },
  duration?: number,
) => {
  const snackbarItem: SnackbarItem = {
    id: `snackbar-${snackbarIdCounter++}`,
    message,
    type,
    action,
    duration,
  };

  if (currentSnackbar) {
    snackbarQueue.push(snackbarItem);
  } else {
    currentSnackbar = snackbarItem;
    setSnackbarState?.(snackbarItem);
    setVisibleState?.(true);
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9998,
  },
});

