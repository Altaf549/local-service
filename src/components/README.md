# Common Components Library

This library provides a set of reusable React Native components with built-in dark/light mode support.

## Setup

The components are already integrated into `App.tsx` with `ThemeProvider`, `ToastManager`, and `SnackbarManager`.

## Components

### Button

```tsx
import { Button } from './src/components';

<Button
  title="Click Me"
  onPress={() => console.log('Pressed')}
  variant="primary" // 'primary' | 'secondary' | 'outline' | 'text'
  size="medium" // 'small' | 'medium' | 'large'
  disabled={false}
  loading={false}
  fullWidth={false}
/>
```

### Dropdown

```tsx
import { Dropdown } from './src/components';

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

<Dropdown
  options={options}
  selectedValue={selectedValue}
  onSelect={(value) => setSelectedValue(value)}
  placeholder="Select an option"
  label="Choose Option"
/>
```

### TextInputWithLabel

```tsx
import { TextInputWithLabel } from './src/components';

<TextInputWithLabel
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
  keyboardType="email-address"
  error={emailError}
/>
```

### CustomImage

```tsx
import { CustomImage } from './src/components';

// Using default Image
<CustomImage
  source={{ uri: 'https://example.com/image.jpg' }}
  type="default"
  style={{ width: 200, height: 200 }}
/>

// Using FastImage
<CustomImage
  source={{ uri: 'https://example.com/image.jpg' }}
  type="fast"
  resizeMode="cover"
/>
```

### Typography

```tsx
import { Title, Subtitle, Paragraph } from './src/components';

<Title level={1}>Main Title</Title>
<Title level={2}>Subtitle</Title>
<Subtitle>This is a subtitle</Subtitle>
<Paragraph>This is a paragraph text.</Paragraph>
```

### Divider

```tsx
import { Divider } from './src/components';

<Divider thickness={1} />
```

### Spacer

```tsx
import { Spacer } from './src/components';

<Spacer size="md" />
<Spacer size={20} />
<Spacer size="lg" horizontal />
```

### PasswordInput

```tsx
import { PasswordInput } from './src/components';

<PasswordInput
  label="Password"
  value={password}
  onChangeText={setPassword}
  placeholder="Enter password"
  error={passwordError}
/>
```

### SearchInput

```tsx
import { SearchInput } from './src/components';

<SearchInput
  value={searchQuery}
  onChangeText={setSearchQuery}
  placeholder="Search..."
  onClear={() => setSearchQuery('')}
/>
```

### Toast

```tsx
import { showToast } from './src/components';

// Show toast notification
showToast('Success message', 'success');
showToast('Error message', 'error');
showToast('Info message', 'info');
showToast('Warning message', 'warning');
```

### Snackbar

```tsx
import { showSnackbar } from './src/components';

// Show snackbar notification
showSnackbar('Action completed', 'success', {
  label: 'UNDO',
  onPress: () => console.log('Undo pressed'),
});
```

## Theme

The theme system supports dark and light modes automatically based on system settings, or you can manually control it:

```tsx
import { useTheme } from './src/theme/ThemeContext';

function MyComponent() {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.text }}>Hello</Text>
    </View>
  );
}
```

## Theme Colors

- `primary` - Primary brand color
- `secondary` - Secondary brand color
- `background` - Main background color
- `surface` - Surface/card background color
- `text` - Primary text color
- `textSecondary` - Secondary text color
- `border` - Border color
- `error` - Error color
- `success` - Success color
- `warning` - Warning color
- `info` - Info color
- `disabled` - Disabled state color
- `placeholder` - Placeholder text color
- `card` - Card background color
- `shadow` - Shadow color

