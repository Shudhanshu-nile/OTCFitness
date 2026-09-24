import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  /** 0 – 100 */
  percent: number;
  color?: string;
  /** Overrides the unfilled track, for bars sitting on a tinted surface. */
  trackColor?: string;
  height?: number;
  style?: any;
};

/** The mockup's `.track` / `.track i` progress bar. */
const TrackBar = ({ percent, color, trackColor, height = 7, style }: Props) => {
  const { colors } = useTheme();
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height,
          backgroundColor: trackColor ?? colors.trackBg,
        },
        style,
      ]}
    >
      <View
        style={{
          width: `${clamped}%`,
          height: '100%',
          borderRadius: height,
          backgroundColor: color ?? colors.accent,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
    width: '100%',
  },
});

export default TrackBar;
