import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Target from './Target';
import { Fonts, RADIUS, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

export type Step = {
  /** Left column duration, e.g. "5 × 4min" */
  duration: string;
  /** Left column zone, e.g. "Z4" */
  zone: string;
  title: string;
  detail: string;
  /** Monospace target chips, e.g. "245–265 W" */
  targets: string[];
  /** The key block of the session — filled dot, tinted box. */
  key?: boolean;
};

type Props = {
  step: Step;
  /** Hides the connector below the last step. */
  last?: boolean;
};

/** The mockup's `.wstep` timeline row. */
const WorkoutStep = ({ step, last }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.duration}>{step.duration}</Text>
        <Text style={styles.zone}>{step.zone}</Text>
      </View>

      <View style={styles.right}>
        {/* connector line + node, the ::before / ::after in the CSS */}
        {!last ? <View style={styles.line} /> : null}
        <View style={[styles.node, step.key && styles.nodeKey]} />

        <View style={[styles.box, step.key && styles.boxKey]}>
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.detail}>{step.detail}</Text>

          {step.targets.length ? (
            <View style={styles.targets}>
              {step.targets.map(t => (
                <Target key={t} label={t} />
              ))}
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      gap: 13,
    },
    left: {
      width: 46,
      alignItems: 'flex-end',
      paddingTop: 13,
    },
    duration: {
      fontFamily: Fonts.InterBold,
      fontSize: 12,
      color: c.text,
      textAlign: 'right',
    },
    zone: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10,
      color: c.text3,
      marginTop: 1,
    },
    right: {
      flex: 1,
      paddingLeft: 17,
      paddingBottom: 12,
    },
    line: {
      position: 'absolute',
      left: 0,
      top: 15,
      bottom: -3,
      width: 2,
      borderRadius: 2,
      backgroundColor: c.border,
    },
    node: {
      position: 'absolute',
      left: -3,
      top: 15,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: c.surface,
      borderWidth: 2,
      borderColor: c.border2,
    },
    nodeKey: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    box: {
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: RADIUS.md,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    boxKey: {
      borderColor: c.accentBorderSoft,
      backgroundColor: c.accentBgSoft,
    },
    title: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 13.5,
      letterSpacing: -0.19,
      color: c.text,
    },
    detail: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      lineHeight: 17.25,
      color: c.text3,
      marginTop: 4,
    },
    targets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 9,
    },
  });

export default WorkoutStep;
