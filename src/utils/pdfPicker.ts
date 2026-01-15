import * as DocumentPicker from '@react-native-documents/picker';

export interface PdfPickerResult {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

export const pickPdfDocument = async (): Promise<PdfPickerResult | null> => {
  try {
    const options = {
      type: ['application/pdf'],
      allowMultiSelection: false,
    };

    const result = await DocumentPicker.pick(options);
    console.log('DocumentPicker result:', result);

    if (!result || result.length === 0) {
      console.log('No document selected');
      return null;
    }

    const asset = result[0];
    const pdfResult: PdfPickerResult = {
      uri: asset.uri,
      fileName: asset.name || undefined,
      type: asset.type || undefined,
      fileSize: asset.size || undefined,
    };

    console.log('PDF Picker result:', pdfResult);
    return pdfResult;

  } catch (error: any) {
    if (error.code === 'DOCUMENT_PICKER_CANCELED') {
      console.log('User cancelled document picker');
      return null;
    }
    
    console.error('DocumentPicker error:', error);
    return null;
  }
};
