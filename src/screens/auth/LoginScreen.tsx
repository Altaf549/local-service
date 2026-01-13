import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {setUserData, setIsUser} from '../../redux/slices/userSlice';
import {loginUser, clearLoginSuccess} from '../../redux/slices/authSlice';
import {TextInputWithLabel} from '../../components/TextInputWithLabel/TextInputWithLabel';
import {PasswordInput} from '../../components/PasswordInput/PasswordInput';
import {Dropdown, DropdownOption} from '../../components/Dropdown/Dropdown';
import {Button} from '../../components/Button/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParamList, MAIN_TABS, REGISTER, SERVICEMAN_HOME, USER_ROLES, PUJA_DETAILS, SERVICE_DETAILS} from '../../constant/Routes';
import {useFormValidation, commonValidationRules} from '../../hooks/useFormValidation';

type LoginScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Login'>;

const {width, height} = Dimensions.get('window');

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

const LoginScreen: React.FC = () => {
  const {theme} = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute();
  const dispatch = useAppDispatch();
  const {loading, error, loginSuccess} = useAppSelector(state => state.auth);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Extract route parameters for return navigation
  const routeParams = route.params as any;
  const returnTo = routeParams?.returnTo;
  const pujaId = routeParams?.pujaId;
  const serviceId = routeParams?.serviceId;

  const validationRules = {
    email: commonValidationRules.email,
    password: commonValidationRules.basicPassword,
  };

  const {errors, validateForm, setFieldError, clearErrors} = useFormValidation(validationRules);

  const userTypes: DropdownOption[] = [
    {label: 'User', value: USER_ROLES.USER},
    {label: 'Brahman', value: USER_ROLES.BRAHMAN},
    {label: 'Serviceman', value: USER_ROLES.SERVICEMAN},
  ];

  const handleLogin = async () => {
    // Reset errors
    clearErrors();

    // Validate user role selection
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a user type');
      return;
    }

    // Validate form
    const formData = { email, password };
    const isValid = validateForm(formData);

    if (!isValid) {
      return;
    }

    try {
      const result = await dispatch(loginUser({
        email,
        password,
        role: selectedRole
      })).unwrap();

      // Update user state in Redux
      dispatch(setUserData(result));
      dispatch(setIsUser(true));

      Alert.alert('Success', `Logged in as ${selectedRole} successfully!`);
      
      // Handle return navigation if coming from another screen
      if (returnTo && selectedRole === USER_ROLES.USER) {
        if (returnTo === 'PujaDetails' && pujaId) {
          navigation.reset({
            index: 0,
            routes: [
              { name: MAIN_TABS },
              { name: PUJA_DETAILS, params: { id: pujaId } }
            ],
          });
        } else if (returnTo === 'ServiceDetails' && serviceId) {
          navigation.reset({
            index: 0,
            routes: [
              { name: MAIN_TABS },
              { name: SERVICE_DETAILS, params: { id: serviceId } }
            ],
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: MAIN_TABS }],
          });
        }
      } else {
        // Navigate based on user role (default behavior)
        if (selectedRole === USER_ROLES.USER) {
          navigation.reset({
            index: 0,
            routes: [{ name: MAIN_TABS }],
          });
        } else if (selectedRole === USER_ROLES.SERVICEMAN || selectedRole === USER_ROLES.BRAHMAN) {
          navigation.reset({
            index: 0,
            routes: [{ name: SERVICEMAN_HOME }],
          });
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle validation errors
      if (error.includes('email')) {
        setFieldError('email', error);
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
            Welcome Back
          </Text>
          <Text style={[styles.subtitle, {color: theme.colors.textSecondary}]}>
            Sign in to continue to your account
          </Text>
        </View>

        <View style={styles.formContainer}>
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
            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              error={errors.password}
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
            title={loading ? "Signing In..." : "Sign In"}
            onPress={handleLogin}
            disabled={!selectedRole || !email || !password || loading}
            fullWidth={true}
            size="medium"
            loading={loading}
          />
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, {color: theme.colors.textSecondary}]}>
              Don't have an account? 
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate(REGISTER)}>
              <Text style={[styles.footerLink, {color: theme.colors.primary}]}>
                Sign Up
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
    padding: 20,
    flexGrow: 1,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.06,
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto',
    paddingBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default LoginScreen;
