import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert,
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeContext';
import { Header } from '../Header/Header';
import { Dropdown } from '../Dropdown/Dropdown';
import { Button } from '../Button/Button';
import { getServices, getPujas, updateServicePrice, updatePujaPrice } from '../../services/api';
import { Service, Puja } from '../../types/home';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { pickPdfDocument, PdfPickerResult } from '../../utils/pdfPicker';

interface AddPriceModalProps {
  visible: boolean;
  onClose: () => void;
  itemType: 'service' | 'puja';
  onSuccess: () => void;
}

const AddPriceModal: React.FC<AddPriceModalProps> = ({ 
  visible, 
  onClose, 
  itemType, 
  onSuccess 
}) => {
  const { theme } = useTheme();
  const [items, setItems] = useState<Service[] | Puja[]>([]);
  const [selectedItem, setSelectedItem] = useState<Service | Puja | null>(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [materialFile, setMaterialFile] = useState<PdfPickerResult | null>(null);

  const modalTitle = itemType === 'service' ? 'Add Service Price' : 'Add Puja Price';
  const placeholderText = itemType === 'service' ? 'Select a service' : 'Select a puja';
  const priceLabel = itemType === 'service' ? 'Service Price (₹)' : 'Puja Price (₹)';

  useEffect(() => {
    if (visible) {
      fetchItems();
    }
  }, [visible, itemType]);

  const fetchItems = async () => {
    try {
      setFetchLoading(true);
      const data = itemType === 'service' ? await getServices() : await getPujas();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
      Alert.alert('Error', `Failed to load ${itemType}s. Please try again.`);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedItem || !price) {
      Alert.alert('Error', 'Please select an item and enter a price.');
      return;
    }

    try {
      setLoading(true);
      
      let response;
      if (itemType === 'service') {
        response = await updateServicePrice(selectedItem.id, price);
      } else {
        response = await updatePujaPrice(selectedItem.id, price, materialFile);
      }
      
      if (response.success) {
        Alert.alert(
          'Success',
          `${itemType === 'service' ? 'Service' : 'Puja'} price added successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                onSuccess();
                handleClose();
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', response.message || `Failed to add ${itemType} price.`);
      }
    } catch (error) {
      console.error('Error updating price:', error);
      Alert.alert('Error', `Failed to add ${itemType} price. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
    setPrice('');
    setMaterialFile(null);
    onClose();
  };

  const handleFilePicker = async () => {
    try {
      const result = await pickPdfDocument();
      if (result) {
        setMaterialFile(result);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to pick PDF file. Please try again.');
    }
  };

  const formatDropdownOptions = () => {
    return items.map((item) => ({
      label: itemType === 'service' 
        ? (item as Service).service_name 
        : (item as Puja).puja_name,
      value: item.id,
    }));
  };

  const handleDropdownSelect = (value: string | number) => {
    const item = items.find(i => i.id === (typeof value === 'number' ? value : parseInt(value.toString())));
    setSelectedItem(item || null);
  };

  if (fetchLoading) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView 
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          edges={['left', 'right', 'bottom']}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading {itemType}s...
            </Text>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        edges={['left', 'right', 'bottom']}
      >
        <Header title={modalTitle} />
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              Select {itemType === 'service' ? 'Service' : 'Puja'}
            </Text>
            <Dropdown
              options={formatDropdownOptions()}
              selectedValue={selectedItem?.id || 0}
              onSelect={handleDropdownSelect}
              placeholder={placeholderText}
              disabled={fetchLoading}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {priceLabel}
            </Text>
            <TextInput
              style={[
                styles.priceInput,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border
                }
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              keyboardType="decimal-pad"
              returnKeyType="done"
            />
          </View>

          {itemType === 'puja' && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                Material File (Optional - PDF only)
              </Text>
              <TouchableOpacity
                style={[
                  styles.filePickerButton,
                  { 
                    backgroundColor: theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={handleFilePicker}
                disabled={loading}
              >
                <MaterialIcons 
                  name="picture-as-pdf" 
                  size={moderateScale(20)} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={[styles.filePickerText, { color: theme.colors.text }]}>
                  {materialFile ? materialFile.fileName : 'Choose PDF file'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={handleClose}
              disabled={loading}
              variant="outline"
              style={{ flex: 1 }}
            />
            
            <Button
              title="Add Price"
              onPress={handleSubmit}
              disabled={loading || !selectedItem || !price}
              loading={loading}
              style={{ flex: 2 }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: moderateScale(16),
    fontSize: moderateScale(16),
  },
  content: {
    flex: 1,
    padding: moderateScale(20),
  },
  section: {
    marginBottom: moderateVerticalScale(24),
  },
  label: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: moderateVerticalScale(12),
  },
  dropdownContainer: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    borderColor: '#e1e5e9',
    backgroundColor: '#f8f9fa',
  },
  itemsList: {
    maxHeight: moderateVerticalScale(200),
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContainer: {
    flexDirection: 'row',
  },
  priceInput: {
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: moderateScale(8),
    padding: moderateScale(16),
    gap: moderateScale(12),
  },
  filePickerText: {
    fontSize: moderateScale(16),
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: moderateVerticalScale(32),
  },
});

export default AddPriceModal;
