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
import { TextInputWithLabel } from '../TextInputWithLabel/TextInputWithLabel';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { addServicePriceThunk, updateServicePriceThunk } from '../../redux/slices/servicePricesSlice';
import { addPujaPriceThunk, updatePujaPriceThunk } from '../../redux/slices/pujaPricesSlice';
import { getServices, getPujas } from '../../services/api';
import { Service, Puja } from '../../types/home';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { pickPdfDocument, PdfPickerResult } from '../../utils/pdfPicker';
import { PriceCardData } from '../PriceCard/PriceCard';
import Console from '../../utils/Console';

interface AddPriceModalProps {
  visible: boolean;
  onClose: () => void;
  itemType: 'service' | 'puja';
  onSuccess: () => void;
  editingItem?: any;
}

const AddPriceModal: React.FC<AddPriceModalProps> = ({ 
  visible, 
  onClose, 
  itemType, 
  onSuccess,
  editingItem
}) => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [items, setItems] = useState<Service[] | Puja[]>([]);
  const [selectedItem, setSelectedItem] = useState<Service | Puja | null>(null);
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [materialFile, setMaterialFile] = useState<PdfPickerResult | null>(null);

  const isEdit = !!editingItem;
  const modalTitle = isEdit 
    ? (itemType === 'service' ? 'Update Service Price' : 'Update Puja Price')
    : (itemType === 'service' ? 'Add Service Price' : 'Add Puja Price');
  const placeholderText = itemType === 'service' ? 'Select a service' : 'Select a puja';
  const priceLabel = itemType === 'service' ? 'Service Price (₹)' : 'Puja Price (₹)';

  useEffect(() => {
    if (visible) {
      fetchItems();
    }
  }, [visible, itemType]);

  useEffect(() => {
    if (editingItem) {
      // Pre-populate form when editing
      setPrice(editingItem.price);
      // For editing, we don't need to fetch items or set selected item
      // Just use the existing item data
    } else {
      // Reset form when adding
      setPrice('');
      setSelectedItem(null);
      setMaterialFile(null);
    }
  }, [editingItem]);

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
    if (!isEdit && !selectedItem) {
      Alert.alert('Error', 'Please select an item and enter a price.');
      return;
    }

    if (!price) {
      Alert.alert('Error', 'Please enter a price.');
      return;
    }

    try {
      setLoading(true);
      
      let result;
      if (isEdit) {
        // Update existing price
        if (itemType === 'service') {
          result = await dispatch(updateServicePriceThunk({ serviceId: editingItem.id, price }) as any);
        } else {
          result = await dispatch(updatePujaPriceThunk({ pujaId: editingItem.id, price, materialFile }) as any);
        }
      } else {
        // Add new price
        if (itemType === 'service') {
          result = await dispatch(addServicePriceThunk({ serviceId: selectedItem!.id, price }) as any);
        } else {
          result = await dispatch(addPujaPriceThunk({ pujaId: selectedItem!.id, price, materialFile }) as any);
        }
      }
      
      if (result.meta.requestStatus === 'fulfilled') {
        Alert.alert(
          'Success',
          `${isEdit ? 'Updated' : 'Added'} ${itemType === 'service' ? 'Service' : 'Puja'} price successfully!`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Just close the alert, modal is already handled
              }
            }
          ]
        );
        // Call onSuccess immediately to refresh parent data and close modal
        onSuccess();
      } else {
        onClose();
        Alert.alert('Error', result.payload as string || `Failed to ${isEdit ? 'update' : 'add'} ${itemType} price.`);
      }
    } catch (error) {
      onClose();
      console.error('Error updating price:', error);
      Alert.alert('Error', `Failed to ${isEdit ? 'update' : 'add'} ${itemType} price. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    Console.log("Closing modal");
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
          {!isEdit && (
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
          )}

          {isEdit && (
            <View style={styles.section}>
              <Text style={[styles.label, { color: theme.colors.text }]}>
                {itemType === 'service' ? 'Service' : 'Puja'}
              </Text>
              <Text style={[styles.selectedItemText, { color: theme.colors.textSecondary, borderColor: theme.colors.border }]}>
                  {itemType === 'service' 
                    ? editingItem?.service_name || 'Selected Service'
                    : editingItem?.puja_name || 'Selected Puja'
                  }
                </Text>
            </View>
          )}

          <View style={styles.section}>
            <TextInputWithLabel
              label={priceLabel}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter price"
              keyboardType="numeric"
              inputStyle={styles.priceInput}
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
              title={isEdit ? "Update Price" : "Add Price"}
              onPress={handleSubmit}
              disabled={loading || (!isEdit && !selectedItem) || !price}
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
  },
  itemsList: {
    maxHeight: moderateVerticalScale(200),
  },
  itemWrapper: {
    borderBottomWidth: 1,
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
  selectedItemText: {
    fontSize: moderateScale(16),
    padding: moderateScale(16),
    borderWidth: 1,
    borderRadius: moderateScale(8),
  },
});

export default AddPriceModal;
