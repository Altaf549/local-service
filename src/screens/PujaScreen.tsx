import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Title} from '../components/Typography/Title';

const PujaScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Title level={1}>Puja</Title>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PujaScreen;
