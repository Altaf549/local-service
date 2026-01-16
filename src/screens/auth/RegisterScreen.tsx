import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useTheme} from '../../theme/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {setUserData, setIsUser} from '../../redux/slices/userSlice';
import {registerUser, clearRegisterSuccess} from '../../redux/slices/authSlice';
import {TextInputWithLabel} from '../../components/TextInputWithLabel/TextInputWithLabel';
import {PasswordInput} from '../../components/PasswordInput/PasswordInput';
import {Dropdown, DropdownOption} from '../../components/Dropdown/Dropdown';
import {Button} from '../../components/Button/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation} from '@react-navigation/native';
import {AppStackParamList, LOGIN, MAIN_TABS, SERVICEMAN_HOME, USER_ROLES} from '../../constant/Routes';
import {useFormValidation, commonValidationRules} from '../../hooks/useFormValidation';
import {
  scale,
  verticalScale,
  moderateScale,
  moderateVerticalScale,
  scaleFont,
  scaleSize,
  scaleHeight,
  scaleWidth,
} from '../../utils/scaling';

type RegisterScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Register'>;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

const RegisterScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const {loading, error, registerSuccess} = useAppSelector(state => state.auth);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const validationRules = {
    name: commonValidationRules.name,
    email: commonValidationRules.email,
    mobileNumber: commonValidationRules.phone,
    password: commonValidationRules.password,
    confirmPassword: {
      required: true,
      custom: (value: string) => value === password || 'Passwords do not match',
    },
  };

  const {errors, validateForm, setFieldError, clearErrors} = useFormValidation(validationRules);

  const userTypes: DropdownOption[] = [
    {label: 'User', value: USER_ROLES.USER},
    {label: 'Brahman', value: USER_ROLES.BRAHMAN},
    {label: 'Serviceman', value: USER_ROLES.SERVICEMAN},
  ];

  const handleRegister = async () => {
    // Reset errors
    clearErrors();

    // Validate user role selection
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a user type');
      return;
    }

    // Validate form
    const formData = { name, email, mobileNumber, password, confirmPassword };
    const isValid = validateForm(formData);

    if (!isValid) {
      return;
    }

    try {
      const result = await dispatch(registerUser({
        name: name.trim(),
        email: email.trim(),
        mobile_number: mobileNumber.trim(),
        password,
        role: selectedRole
      })).unwrap();

      if ('needsActivation' in result) {
        // For serviceman and brahman registration that needs activation (no token)
        Alert.alert(
          'Registration Successful',
          `${result.role === USER_ROLES.SERVICEMAN ? 'Serviceman' : 'Brahman'} account created successfully! Your account needs to be activated by admin before you can access all features.`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to login screen since they need to login after activation
                navigation.navigate(LOGIN, {});
              }
            }
          ]
        );
      } else {
        // For all registrations with token (user, serviceman, brahman)
        dispatch(setUserData(result));
        dispatch(setIsUser(true));

        Alert.alert('Success', `Registered and logged in as ${selectedRole} successfully!`);
        
        // Navigate based on user role
        if (selectedRole === USER_ROLES.USER) {
          navigation.reset({
            index: 0,
            routes: [{ name: MAIN_TABS }],
          });
        } else {
          // Serviceman and brahman
          navigation.reset({
            index: 0,
            routes: [{ name: SERVICEMAN_HOME }],
          });
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Handle validation errors
      if (error.includes('name')) {
        setFieldError('name', error);
      } else if (error.includes('email')) {
        setFieldError('email', error);
      } else if (error.includes('mobile')) {
        setFieldError('mobileNumber', error);
      } else if (error.includes('password')) {
        setFieldError('password', error);
      } else {
        Alert.alert('Error', error);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <View style={[styles.circle, {backgroundColor: theme.colors.primary + '20'}]}>
            <Text style={[styles.logoText, {color: theme.colors.primary}]}>LS</Text>
          </View>
          <Text style={[styles.title, {color: theme.colors.text}]}>
            Create Account
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            Sign up to get started with your account
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <TextInputWithLabel
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              error={errors.name}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInputWithLabel
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </View>

          <View style={styles.inputGroup}>
            <TextInputWithLabel
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
              error={errors.mobileNumber}
            />
          </View>

          <View style={styles.inputGroup}>
            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              error={errors.password}
            />
          </View>

          <View style={styles.inputGroup}>
            <PasswordInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              error={errors.confirmPassword}
            />
          </View>

          <View style={styles.inputGroup}>
            <Dropdown
              label="Account Type"
              options={userTypes}
              selectedValue={selectedRole || undefined}
              onSelect={(value) => setSelectedRole(value as UserRole)}
              placeholder="Select your account type"
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={loading ? "Signing Up..." : "Sign Up"}
            onPress={handleRegister}
            disabled={!selectedRole || !name || !email || !mobileNumber || !password || !confirmPassword || loading}
            fullWidth={true}
            size="medium"
            loading={loading}
          />
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
              Already have an account? 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate(LOGIN,{})}>
              <Text style={[styles.footerLink, {color: theme.colors.primary}]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(20),
    flexGrow: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: verticalScale(60),
    marginBottom: verticalScale(50),
  },
  circle: {
    width: scaleSize(80),
    height: scaleSize(80),
    borderRadius: scaleSize(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(20),
  },
  logoText: {
    fontSize: scaleFont(28),
    fontWeight: 'bold',
  },
  title: {
    fontSize: scaleFont(32),
    fontWeight: 'bold',
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: scaleFont(16),
    textAlign: 'center',
    lineHeight: verticalScale(22),
  },
  formContainer: {
    marginBottom: verticalScale(32),
  },
  inputGroup: {
    marginBottom: verticalScale(20),
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: verticalScale(20),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  footerText: {
    fontSize: scaleFont(14),
  },
  footerLink: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    marginLeft: scaleSize(4),
  },
});

export default RegisterScreen;
