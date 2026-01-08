import React, {useState, useCallback} from 'react';
import {View, StyleSheet} from 'react-native';
import {Toast, ToastType} from './Toast';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastIdCounter = 0;
let toastQueue: ToastItem[] = [];
let currentToast: ToastItem | null = null;
let setToastState: ((toast: ToastItem | null) => void) | null = null;
let setVisibleState: ((visible: boolean) => void) | null = null;

export const ToastManager: React.FC = () => {
  const [toast, setToast] = useState<ToastItem | null>(null);
  const [visible, setVisible] = useState(false);

  setToastState = setToast;
  setVisibleState = setVisible;

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      currentToast = null;
      if (toastQueue.length > 0) {
        const nextToast = toastQueue.shift()!;
        currentToast = nextToast;
        setToastState?.(nextToast);
        setVisibleState?.(true);
      } else {
        setToastState?.(null);
      }
    }, 300);
  }, []);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          visible={visible}
          onClose={handleClose}
        />
      )}
    </View>
  );
};

export const showToast = (
  message: string,
  type: ToastType = 'info',
  duration?: number,
) => {
  const toastItem: ToastItem = {
    id: `toast-${toastIdCounter++}`,
    message,
    type,
    duration,
  };

  if (currentToast) {
    toastQueue.push(toastItem);
  } else {
    currentToast = toastItem;
    setToastState?.(toastItem);
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
    zIndex: 9999,
  },
});

