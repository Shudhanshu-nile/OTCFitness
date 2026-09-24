import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FormatChip, { FormatKey } from './FormatChip';
import {
  Fonts,
  RADIUS,
  DISCIPLINE_META,
  DisciplineKey,
  Palette,
} from '../constants';
import { useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

export type Plan = {
  title: string;
  discipline: DisciplineKey;
  weeks: string;
  hours: string;
  level: string;
  formats: FormatKey[];
  tag?: string;
};

type Props = {
  plan: Plan;
  onPress?: () => void;
};

/** The mockup's `.plan` library card. */
const PlanCard = ({ plan, onPress }: Props) => {
  const styles = useThemedStyles(makeStyles);
  const meta = DISCIPLINE_META[plan.discipline];

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={onPress}
    >
      {/* The gradient and its scrim are absolute fills rather than padded
          containers: a padded LinearGradient paints only its content box on
          iOS, which pushes the icon and tag outside the painted area. */}
      <View style={styles.top}>
        <LinearGradient
          colors={[withAlpha(meta.color, 0.55), withAlpha(meta.color, 0.12)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
          pointerEvents="none"
        />
        {/* .plan-top::after — keeps the icon and tag legible on any tint */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.62)']}
          locations={[0.2, 1]}
          style={styles.fill}
          pointerEvents="none"
        />

        <View style={styles.topRow}>
          <Icon name={meta.icon} size={21} color="#FFFFFF" />
          {plan.tag ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{plan.tag}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{plan.title}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaStrong}>{plan.weeks}</Text>
          <Text style={styles.meta}>{plan.hours} / wk</Text>
          <Text style={styles.meta}>{plan.level}</Text>
        </View>

        <View style={styles.formats}>
          {plan.formats.map(f => (
            <FormatChip key={f} format={f} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    card: {
      borderRadius: RADIUS.lg,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
    },
    top: {
      height: 92,
      justifyContent: 'flex-end',
      padding: 13,
    },
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    tag: {
      marginLeft: 'auto',
      paddingVertical: 5,
      paddingHorizontal: 9,
      borderRadius: 7,
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    tagText: {
      fontFamily: Fonts.InterBold,
      fontSize: 10,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: '#FFFFFF',
    },
    body: {
      paddingHorizontal: 14,
      paddingTop: 13,
      paddingBottom: 14,
    },
    title: {
      fontFamily: Fonts.InterBold,
      fontSize: 15,
      letterSpacing: -0.33,
      color: c.text,
    },
    metaRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 9,
      marginTop: 4,
    },
    meta: {
      fontFamily: Fonts.InterRegular,
      fontSize: 11.5,
      color: c.text3,
    },
    metaStrong: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11.5,
      color: c.text2,
    },
    formats: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 11,
    },
  });

export default PlanCard;
