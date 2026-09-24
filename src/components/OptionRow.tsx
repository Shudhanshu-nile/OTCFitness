import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, RADIUS, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  icon: string;
  iconColor: string;
  title: string;
  subtitle: string;
  selected?: boolean;
  onPress?: () => void;
};

/** The mockup's `.opt` selectable option card. */
const OptionRow = ({
  icon,
  iconColor,
  title,
  subtitle,
  selected,
  onPress,
}: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.opt, selected && styles.optOn]}
    >
      <View style={styles.icon}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={[styles.radio, selected && styles.radioOn]}>
        {selected ? (
          <Icon name="check" size={13} color={colors.accentInk} />
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    opt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      padding: 15,
      borderRadius: RADIUS.md,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface2,
    },
    optOn: {
      borderColor: c.accent,
      backgroundColor: c.optOnBg,
    },
    icon: {
      width: 44,
      height: 44,
      borderRadius: 13,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface3,
    },
    body: {
      flex: 1,
    },
    title: {
      fontFamily: Fonts.InterBold,
      fontSize: 14.5,
      letterSpacing: -0.26,
      color: c.text,
    },
    subtitle: {
      fontFamily: Fonts.InterRegular,
      fontSize: 12,
      lineHeight: 17.5,
      color: c.text3,
      marginTop: 3,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.border2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioOn: {
      borderColor: c.accent,
      backgroundColor: c.accent,
    },
  });

export default OptionRow;
