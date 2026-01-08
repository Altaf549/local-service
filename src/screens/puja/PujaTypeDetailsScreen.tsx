import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '../../theme/ThemeContext';
import {Header} from '../../components/Header/Header';

const PujaTypeDetailsScreen: React.FC = () => {
  const {theme} = useTheme();

  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[
        styles.container,
        {backgroundColor: theme.colors.background},
      ]}>
      <Header title="Puja Type Details" />
      <View style={styles.content}>
        {/* Content will be added later */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default PujaTypeDetailsScreen;
