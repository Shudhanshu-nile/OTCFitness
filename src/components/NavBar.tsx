import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fonts, Palette } from '../constants';
import { useTheme, useThemedStyles } from '../context/ThemeContext';

type Props = {
  title: string;
  onBack?: () => void;
  /** Right-hand slot, e.g. "Step 4 of 7" */
  right?: React.ReactNode;
};

/** The mockup's `.navbar` with its `.backbtn`. */
const NavBar = ({ title, onBack, right }: Props) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.bar}>
      {onBack ? (
        <TouchableOpacity
          style={styles.back}
          activeOpacity={0.75}
          onPress={onBack}
        >
          <Icon name="chevron-left" size={20} color={colors.text} />
        </TouchableOpacity>
      ) : null}

      <Text style={styles.title}>{title}</Text>

      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingTop: 2,
      paddingBottom: 10,
      paddingHorizontal: 18,
    },
    back: {
      width: 36,
      height: 36,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    title: {
      fontFamily: Fonts.InterBold,
      fontSize: 16,
      letterSpacing: -0.32,
      color: c.text,
    },
    right: {
      marginLeft: 'auto',
    },
  });

export default NavBar;
