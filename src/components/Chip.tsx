import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Fonts, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

/** The mockup's `.chips` / `.chip` segmented row. */
const ChipRow = ({ options, selected, onSelect }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.row}>
      {options.map(o => {
        const on = o === selected;
        return (
          <TouchableOpacity
            key={o}
            activeOpacity={0.8}
            style={[styles.chip, on && styles.chipOn]}
            onPress={() => onSelect(o)}
          >
            <Text style={[styles.label, on && styles.labelOn]}>{o}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 7,
    },
    chip: {
      paddingVertical: 7,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: c.chip,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipOn: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    label: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      color: c.text2,
    },
    labelOn: {
      color: c.accentInk,
    },
  });

export default ChipRow;
