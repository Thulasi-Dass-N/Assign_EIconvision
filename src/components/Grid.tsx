import React from 'react';
import { StyleSheet, View } from 'react-native';

const GridOverlay = () => (
  <View style={StyleSheet.absoluteFill} pointerEvents="none">
    {[1, 2].map(i => (
      <View
        key={`v-${i}`}
        style={[styles.line, { top: `${(i * 100) / 3}%` }]}
      />
    ))}
    {[1, 2].map(i => (
      <View
        key={`h-${i}`}
        style={[
          styles.line,
          { left: `${(i * 100) / 3}%`, width: 1, height: '100%' },
        ]}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  line: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
});

export default GridOverlay;
