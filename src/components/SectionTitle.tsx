import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Fonts, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

type Props = {
  title: string;
  /** Right-hand action label, e.g. "Plans" */
  action?: string;
  onActionPress?: () => void;
  /** Renders the "Live" marker instead of a text action. */
  live?: boolean;
  style?: any;
};

/** The mockup's `.sect-t` row. */
const SectionTitle = ({ title, action, onActionPress, live, style }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>

      {live ? (
        <View style={styles.liveWrap}>
          <View style={styles.liveDot} />
          <Text style={styles.live}>Live</Text>
        </View>
      ) : action ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onActionPress}
          activeOpacity={0.7}
        >
          <Text style={styles.action}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 26,
      marginBottom: 12,
    },
    title: {
      fontFamily: Fonts.InterBold,
      fontSize: 16.5,
      letterSpacing: -0.36,
      color: c.text,
    },
    actionBtn: {
      marginLeft: 'auto',
    },
    action: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12.5,
      color: c.accent,
    },
    liveWrap: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    liveDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: c.accent,
      borderWidth: 3,
      borderColor: c.accentRing,
    },
    live: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12.5,
      color: c.accent,
    },
  });

export default SectionTitle;
