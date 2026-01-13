import {launchCamera, launchImageLibrary, MediaType, ImagePickerResponse, PhotoQuality} from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

export interface ImagePickerResult {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
  width?: number;
  height?: number;
}

export type ImagePickerSource = 'camera' | 'gallery';

const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera to take photos.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Camera permission error:', err);
    return false;
  }
};

const options = {
  mediaType: 'photo' as MediaType,
  quality: 0.8 as PhotoQuality,
  maxWidth: 1024,
  maxHeight: 1024,
  includeBase64: false,
  includeExtra: true,
};

const cameraOptions = {
  ...options,
  saveToPhotos: false,
  durationLimit: 0,
};

export const pickImage = async (source: ImagePickerSource): Promise<ImagePickerResult | null> => {
  return new Promise(async (resolve) => {
    const callback = (response: ImagePickerResponse) => {
      console.log('ImagePicker response:', response);
      
      if (response.didCancel) {
        console.log('User cancelled image picker');
        resolve(null);
        return;
      }

      if (response.errorMessage) {
        console.error('ImagePicker error:', response.errorMessage);
        resolve(null);
        return;
      }

      const asset = response.assets?.[0];
      if (!asset) {
        console.error('No asset found in response');
        resolve(null);
        return;
      }

      const result: ImagePickerResult = {
        uri: asset.uri!,
        fileName: asset.fileName,
        type: asset.type,
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
      };

      console.log('ImagePicker result:', result);
      resolve(result);
    };

    if (source === 'camera') {
      console.log('Checking camera permissions...');
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        console.error('Camera permission not granted');
        resolve(null);
        return;
      }
      console.log('Launching camera with options:', cameraOptions);
      launchCamera(cameraOptions, callback);
    } else {
      console.log('Launching image library with options:', options);
      launchImageLibrary(options, callback);
    }
  });
};

export const pickFromCamera = (): Promise<ImagePickerResult | null> => pickImage('camera');

export const pickFromGallery = (): Promise<ImagePickerResult | null> => pickImage('gallery');
