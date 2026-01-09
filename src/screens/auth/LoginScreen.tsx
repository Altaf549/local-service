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
import {useAppDispatch} from '../../redux/hooks';
import {setUserData, setIsUser} from '../../redux/slices/userSlice';
import {TextInputWithLabel} from '../../components/TextInputWithLabel/TextInputWithLabel';
import {PasswordInput} from '../../components/PasswordInput/PasswordInput';
import {Dropdown, DropdownOption} from '../../components/Dropdown/Dropdown';
import {Button} from '../../components/Button/Button';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList, REGISTER} from '../../constant/Routes';

type LoginScreenNavigationProp = StackNavigationProp<AppStackParamList, 'Login'>;

const {width, height} = Dimensions.get('window');

type UserRole = 'user' | 'brahman' | 'serviceman';

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {theme} = useTheme();
  const dispatch = useAppDispatch();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const userTypes: DropdownOption[] = [
    {label: 'User', value: 'user'},
    {label: 'Brahman', value: 'brahman'},
    {label: 'Serviceman', value: 'serviceman'},
  ];

  const handleLogin = () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasError = false;

    if (!selectedRole) {
      Alert.alert('Error', 'Please select a user type');
      return;
    }

    if (!email.trim()) {
      setEmailError('Please enter your email');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email');
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError('Please enter your password');
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Mock login - in real app, this would make API calls
    const mockUserData = {
      id: 1,
      name: `Test ${selectedRole}`,
      email: email,
      mobile_number: '1234567890',
      role: selectedRole,
      status: 'active',
      token: 'mock-token-' + Date.now(),
    };

    dispatch(setUserData(mockUserData));
    dispatch(setIsUser(true));

    Alert.alert('Success', `Logged in as ${selectedRole} successfully!`);
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
              error={emailError}
            />
          </View>

          <View style={styles.inputGroup}>
            <PasswordInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              error={passwordError}
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
            title="Sign In"
            onPress={handleLogin}
            disabled={!selectedRole || !email || !password}
            fullWidth={true}
            size="medium"
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
