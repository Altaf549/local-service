import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Modal,
    Alert,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../theme/ThemeContext';
import { Button } from '../Button/Button';
import { TextInputWithLabel } from '../TextInputWithLabel/TextInputWithLabel';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { moderateScale, moderateVerticalScale } from '../../utils/scaling';
import { useFormValidation, commonValidationRules } from '../../hooks/useFormValidation';

interface BookingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (bookingData: any) => void;
    loading?: boolean;
    bookingType: 'service' | 'puja';
    providerId: number;
    providerName: string;
}

const BookingModal: React.FC<BookingModalProps> = ({
    visible,
    onClose,
    onSubmit,
    loading = false,
    bookingType,
    providerId,
    providerName,
}) => {
    const { theme } = useTheme();
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [address, setAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [notes, setNotes] = useState('');

    const validationRules = {
        bookingDate: {
            required: true,
            custom: (value: string) => {
                if (!value) return 'Booking date is required';
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (selectedDate < today) {
                    return 'Booking date cannot be in the past';
                }
                return true;
            },
        },
        bookingTime: {
            required: true,
            custom: (value: string) => {
                if (!value) return 'Booking time is required';
                return true;
            },
        },
        address: {
            required: true,
            minLength: 10,
            custom: (value: string) => {
                if (!value) return 'Address is required';
                if (value.length < 10) return 'Address must be at least 10 characters';
                return true;
            },
        },
        mobileNumber: {
            required: true,
            custom: (value: string) => {
                if (!value) return 'Mobile number is required';
                if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ''))) {
                    return 'Please enter a valid 10-digit mobile number';
                }
                return true;
            },
        },
    };

    const { errors, validateForm, setFieldError, clearErrors } = useFormValidation(validationRules);

    const handleSubmit = async () => {
        clearErrors();

        const formData = {
            bookingDate,
            bookingTime,
            address,
            mobileNumber,
            notes,
        };

        const isValid = validateForm(formData);

        if (!isValid) {
            return;
        }

        const bookingData: any = {
            booking_date: bookingDate,
            booking_time: bookingTime,
            address: address.trim(),
            mobile_number: mobileNumber.replace(/\s/g, ''),
            notes: notes.trim(),
        };

        if (bookingType === 'service') {
            bookingData.service_id = providerId;
        } else {
            bookingData.puja_id = providerId;
        }

        onSubmit(bookingData);
    };

    const handleClose = () => {
        setBookingDate('');
        setBookingTime('');
        setAddress('');
        setMobileNumber('');
        setNotes('');
        clearErrors();
        onClose();
    };

    const getModalTitle = () => {
        return bookingType === 'service' ? 'Book Service' : 'Book Puja';
    };

    const getProviderLabel = () => {
        return bookingType === 'service' ? 'Service Provider' : 'Brahman';
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const formattedDate = selectedDate.toISOString().split('T')[0];
            setBookingDate(formattedDate);
        }
    };

    const handleTimeChange = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const hours = selectedTime.getHours();
            const minutes = selectedTime.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedTime = `${formattedHours}:${formattedMinutes} ${ampm}`;
            setBookingTime(formattedTime);
        }
    };

    const showDatePickerModal = () => {
        setShowDatePicker(true);
    };

    const showTimePickerModal = () => {
        setShowTimePicker(true);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
        >
            <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardAvoidingView}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <MaterialIcons name="close" size={24} color={theme.colors.text} />
                            </TouchableOpacity>
                            <Text style={[styles.title, { color: theme.colors.text }]}>{getModalTitle()}</Text>
                            <View style={styles.placeholder} />
                        </View>

                        <View style={styles.content}>
                            <View style={styles.providerInfo}>
                                <Text style={[styles.providerLabel, { color: theme.colors.textSecondary }]}>
                                    {getProviderLabel()}:
                                </Text>
                                <Text style={[styles.providerName, { color: theme.colors.text }]}>
                                    {providerName}
                                </Text>
                            </View>

                            <View style={styles.formSection}>
                                <View style={styles.inputSpacing}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>Booking Date</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { borderColor: errors.bookingDate ? '#ff4444' : theme.colors.border }]}
                                        onPress={showDatePickerModal}
                                    >
                                        <Text style={[styles.datePickerText, { color: bookingDate ? theme.colors.text : theme.colors.textSecondary }]}>
                                            {bookingDate || 'Select booking date'}
                                        </Text>
                                        <MaterialIcons name="calendar-today" size={20} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                    {errors.bookingDate && <Text style={styles.errorText}>{errors.bookingDate}</Text>}
                                </View>

                                <View style={styles.inputSpacing}>
                                    <Text style={[styles.label, { color: theme.colors.text }]}>Booking Time</Text>
                                    <TouchableOpacity
                                        style={[styles.datePickerButton, { borderColor: errors.bookingTime ? '#ff4444' : theme.colors.border }]}
                                        onPress={showTimePickerModal}
                                    >
                                        <Text style={[styles.datePickerText, { color: bookingTime ? theme.colors.text : theme.colors.textSecondary }]}>
                                            {bookingTime || 'Select booking time'}
                                        </Text>
                                        <MaterialIcons name="schedule" size={20} color={theme.colors.textSecondary} />
                                    </TouchableOpacity>
                                    {errors.bookingTime && <Text style={styles.errorText}>{errors.bookingTime}</Text>}
                                </View>

                                <View style={styles.inputSpacing}>
                                    <TextInputWithLabel
                                        label="Address"
                                        value={address}
                                        onChangeText={setAddress}
                                        placeholder="Enter complete address"
                                        multiline={true}
                                        numberOfLines={3}
                                        error={errors.address}
                                    />
                                </View>

                                <View style={styles.inputSpacing}>
                                    <TextInputWithLabel
                                        label="Mobile Number"
                                        value={mobileNumber}
                                        onChangeText={setMobileNumber}
                                        placeholder="Enter 10-digit mobile number"
                                        keyboardType="phone-pad"
                                        error={errors.mobileNumber}
                                    />
                                </View>

                                <View style={styles.inputSpacing}>
                                    <TextInputWithLabel
                                        label="Special Instructions (Optional)"
                                        value={notes}
                                        onChangeText={setNotes}
                                        placeholder="Any special instructions or requirements"
                                        multiline={true}
                                        numberOfLines={3}
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Button
                                title={loading ? "Booking..." : "Confirm Booking"}
                                onPress={handleSubmit}
                                disabled={loading}
                                fullWidth={true}
                            />
                        </View>
                        
                        {showDatePicker && (
                            <DateTimePicker
                                value={bookingDate ? new Date(bookingDate) : new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                                minimumDate={new Date()}
                            />
                        )}
                        
                        {showTimePicker && (
                            <DateTimePicker
                                value={new Date()}
                                mode="time"
                                display="default"
                                onChange={handleTimeChange}
                            />
                        )}
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: moderateScale(20),
        paddingVertical: moderateVerticalScale(15),
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    closeButton: {
        padding: moderateScale(8),
    },
    title: {
        fontSize: moderateScale(18),
        fontWeight: '600',
    },
    placeholder: {
        width: moderateScale(40),
    },
    content: {
        padding: moderateScale(20),
    },
    providerInfo: {
        backgroundColor: '#f8f9fa',
        padding: moderateScale(15),
        borderRadius: moderateScale(8),
        marginBottom: moderateVerticalScale(20),
    },
    providerLabel: {
        fontSize: moderateScale(14),
        marginBottom: moderateVerticalScale(5),
    },
    providerName: {
        fontSize: moderateScale(16),
        fontWeight: '600',
    },
    formSection: {
        marginBottom: moderateVerticalScale(20),
    },
    inputSpacing: {
        marginBottom: moderateVerticalScale(15),
    },
    footer: {
        paddingHorizontal: moderateScale(20),
        paddingBottom: moderateVerticalScale(20),
    },
    label: {
        fontSize: moderateScale(14),
        marginBottom: moderateVerticalScale(8),
        fontWeight: '500',
    },
    datePickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: moderateScale(8),
        paddingHorizontal: moderateScale(15),
        paddingVertical: moderateVerticalScale(12),
        backgroundColor: '#ffffff',
    },
    datePickerText: {
        fontSize: moderateScale(16),
    },
    errorText: {
        color: '#ff4444',
        fontSize: moderateScale(12),
        marginTop: moderateVerticalScale(5),
    },
});

export default BookingModal;
