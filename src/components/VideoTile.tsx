import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  Fonts,
  RADIUS,
  DISCIPLINE_META,
  DisciplineKey,
  Palette,
} from '../constants';
import { useThemedStyles } from '../context/ThemeContext';
import { withAlpha } from '../utils/color';

type Props = {
  title: string;
  duration: string;
  discipline: DisciplineKey;
  locked?: boolean;
  onPress?: () => void;
};

/** A step-by-step guide thumbnail from the plan detail grid. */
const VideoTile = ({ title, duration, discipline, locked, onPress }: Props) => {
  const styles = useThemedStyles(makeStyles);
  const meta = DISCIPLINE_META[discipline];

  return (
    <TouchableOpacity
      activeOpacity={locked ? 1 : 0.88}
      disabled={locked || !onPress}
      style={[styles.tile, locked && styles.tileLocked]}
      onPress={onPress}
    >
      <View style={styles.thumb}>
        {/* absolute fill — a padded gradient paints only its content box */}
        <LinearGradient
          colors={[withAlpha(meta.color, 0.4), withAlpha(meta.color, 0.1)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fill}
          pointerEvents="none"
        />

        <View style={styles.badge}>
          <Icon
            name={locked ? 'lock-outline' : 'play'}
            size={13}
            color="#FFFFFF"
          />
        </View>

        <View style={styles.duration}>
          <Text style={styles.durationText}>{duration}</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    tile: {
      flex: 1,
      borderRadius: RADIUS.md,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface2,
    },
    tileLocked: {
      opacity: 0.55,
    },
    thumb: {
      height: 66,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    badge: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.45)',
    },
    duration: {
      position: 'absolute',
      bottom: 5,
      right: 6,
      paddingVertical: 2,
      paddingHorizontal: 5,
      borderRadius: 4,
      backgroundColor: 'rgba(0,0,0,0.55)',
    },
    durationText: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 9.5,
      color: '#FFFFFF',
    },
    title: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 12,
      lineHeight: 16.2,
      letterSpacing: -0.12,
      color: c.text,
      paddingHorizontal: 10,
      paddingTop: 9,
      paddingBottom: 11,
    },
  });

export default VideoTile;
