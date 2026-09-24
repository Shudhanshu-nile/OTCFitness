import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Fonts, DISCIPLINE, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

export type WeekDay = {
  /** Single-letter weekday label, e.g. "M" */
  day: string;
  /** Date number */
  date: number;
  /** Discipline keys training that day */
  sessions: (keyof typeof DISCIPLINE)[];
};

type Props = {
  days: WeekDay[];
  /** Index of the highlighted (current) day */
  activeIndex: number;
  onDayPress?: (index: number) => void;
};

/** The mockup's `.wstrip` / `.wday` seven-day bar. */
const WeekStrip = ({ days, activeIndex, onDayPress }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View style={styles.strip}>
      {days.map((d, i) => {
        const on = i === activeIndex;

        return (
          <TouchableOpacity
            key={`${d.day}-${d.date}`}
            activeOpacity={0.8}
            style={[styles.day, on && styles.dayOn]}
            onPress={() => onDayPress?.(i)}
          >
            <Text style={[styles.dayLabel, on && styles.textOn]}>{d.day}</Text>
            <Text style={[styles.dayDate, on && styles.textOn]}>{d.date}</Text>

            <View style={styles.dots}>
              {d.sessions.map((s, j) => (
                <View
                  key={`${s}-${j}`}
                  style={[
                    styles.dot,
                    on ? styles.dotOn : { backgroundColor: DISCIPLINE[s] },
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    strip: {
      flexDirection: 'row',
      gap: 6,
    },
    day: {
      flex: 1,
      alignItems: 'center',
      paddingTop: 9,
      paddingBottom: 8,
      borderRadius: 12,
      backgroundColor: c.surface2,
      borderWidth: 1,
      borderColor: c.border,
    },
    dayOn: {
      backgroundColor: c.accent,
      borderColor: c.accent,
    },
    dayLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 10,
      letterSpacing: 0.5,
      textTransform: 'uppercase',
      color: c.text3,
    },
    dayDate: {
      fontFamily: Fonts.InterBold,
      fontSize: 14,
      color: c.text,
      marginTop: 3,
    },
    textOn: {
      color: c.accentInk,
    },
    dots: {
      flexDirection: 'row',
      gap: 2.5,
      justifyContent: 'center',
      marginTop: 6,
      height: 5,
    },
    dot: {
      width: 5,
      height: 5,
      borderRadius: 2.5,
    },
    dotOn: {
      backgroundColor: c.accentInk,
    },
  });

export default WeekStrip;
