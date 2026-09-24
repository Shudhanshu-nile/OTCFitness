import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Fonts, DISCIPLINE, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

type Props = {
  label: string;
  /** `.pill.free` / `.pill.pro` / `.pill.new` */
  tone?: 'free' | 'pro' | 'new';
};

/** The mockup's `.pill` badge. */
const Pill = ({ label, tone = 'free' }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={[styles.pill, styles[`${tone}Bg`]]}>
      <Text style={[styles.label, styles[`${tone}Text`]]}>{label}</Text>
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    pill: {
      alignSelf: 'flex-start',
      paddingVertical: 5,
      paddingHorizontal: 9,
      borderRadius: 7,
    },
    label: {
      fontFamily: Fonts.InterBold,
      fontSize: 10,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    freeBg: { backgroundColor: c.accentBgStrong },
    freeText: { color: c.accent },
    proBg: { backgroundColor: c.warnBgSoft },
    proText: { color: c.warn },
    newBg: { backgroundColor: c.swimBgSoft },
    newText: { color: DISCIPLINE.swim },
  });

export default Pill;
