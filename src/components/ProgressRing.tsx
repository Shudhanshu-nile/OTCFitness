import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Fonts, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  /** 0 – 100 */
  percent: number;
  /** Big value in the middle of the ring */
  value: string;
  /** Small caption under the value */
  caption: string;
  size?: number;
  stroke?: number;
  color?: string;
};

/** The mockup's `ring()` helper, rebuilt with react-native-svg. */
const ProgressRing = ({
  percent,
  value,
  caption,
  size = 84,
  stroke = 6.5,
  color,
}: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  const radius = (size - stroke - 1.5) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference * (1 - clamped / 100);

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <G rotation={-90} originX={size / 2} originY={size / 2}>
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.surface3}
            strokeWidth={stroke}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color ?? colors.accent}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
          />
        </G>
      </Svg>

      <View style={styles.label} pointerEvents="none">
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.caption}>{caption}</Text>
      </View>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    wrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    value: {
      fontFamily: Fonts.InterExtraBold,
      fontSize: 17,
      letterSpacing: -0.5,
      color: c.text,
    },
    caption: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 9,
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: c.text3,
      marginTop: 1,
    },
  });

export default ProgressRing;
