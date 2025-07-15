import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ImageSlider from '../../components/ImageSlider/ImageSlider';
import { Button } from 'react-native-paper';

const Onboarding = ({ navigation }: { navigation: any }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Discover the values behind any image',
      body: 'Quickly transform any photo into simplified black & white or grayscale shapes to study light, shadow, and form.',
      image: require('../../assets/onboarding-1.png'),
    },
    {
      title: 'Study tone, contrast & composition',
      body: 'Perfect for artists and designers to improve sketches, thumbnails, and studies with clear value breakdowns.',
      image: require('../../assets/onboarding-2.png'),
    },
    {
      title: 'Control and compare with easy tools',
      body: 'Adjust value levels and thresholds, toggle between views, and unlock premium features like PSD layer epxort and live mode.',
      image: require('../../assets/onboarding-3.png'),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigation.replace('Home');
    }
  };

  const handleSkip = () => navigation.replace('Home');

  const { title, body } = steps[currentStep];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ImageSlider
        images={Array.from(steps.map(step => step.image))}
        step={currentStep}
        handleChangeStep={setCurrentStep}
      />
      <Text style={styles.body}>{body}</Text>
      <View style={styles.buttonRow}>
        <Button onPress={handleSkip}>Skip</Button>
        <Button mode="contained" onPress={handleNext}>
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  body: {
    fontSize: 16,
    height: 90,
    textAlign: 'center',
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

export default Onboarding;
