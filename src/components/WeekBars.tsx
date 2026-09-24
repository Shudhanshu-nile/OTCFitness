import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Fonts, DISCIPLINE, Palette } from '../constants';
import { useThemedStyles } from '../context/ThemeContext';

export type BarDay = {
  label: string;
  /** [discipline key, minutes] pairs; a zero-minute entry renders nothing */
  segments: [keyof typeof DISCIPLINE, number][];
};

type Props = {
  days: BarDay[];
  /** Minutes represented by a full-height column */
  max: number;
  /** Discipline keys to show in the legend */
  legend?: (keyof typeof DISCIPLINE)[];
};

const LEGEND_LABEL: Record<string, string> = {
  swim: 'Swim',
  bike: 'Bike',
  run: 'Run',
  strength: 'Strength',
  brick: 'Brick',
  rest: 'Recovery',
};

/** The mockup's `.bars` stacked weekly-load chart. */
const WeekBars = ({ days, max, legend }: Props) => {
  const styles = useThemedStyles(makeStyles);

  return (
    <View>
      <View style={styles.bars}>
        {days.map(day => {
          const total = day.segments.reduce((a, [, m]) => a + m, 0);
          const heightPct = Math.max(4, (total / max) * 100);

          return (
            <View key={day.label} style={styles.col}>
              <View style={[styles.stack, { height: `${heightPct}%` }]}>
                {day.segments
                  .filter(([, m]) => m > 0)
                  .map(([k, m], i) => (
                    <View
                      key={`${k}-${i}`}
                      style={{
                        flex: m,
                        backgroundColor: DISCIPLINE[k],
                        borderRadius: 2,
                      }}
                    />
                  ))}
              </View>
              <Text style={styles.colLabel}>{day.label}</Text>
            </View>
          );
        })}
      </View>

      {legend ? (
        <View style={styles.legend}>
          {legend.map(k => (
            <View key={k} style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: DISCIPLINE[k] }]}
              />
              <Text style={styles.legendLabel}>{LEGEND_LABEL[k]}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const makeStyles = (c: Palette) =>
  StyleSheet.create({
    bars: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 7,
      height: 108,
    },
    col: {
      flex: 1,
      height: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      gap: 7,
    },
    stack: {
      width: '100%',
      // column-reverse so the first segment sits at the bottom
      flexDirection: 'column-reverse',
      borderRadius: 6,
      overflow: 'hidden',
      gap: 1.5,
    },
    colLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 9.5,
      color: c.text3,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 14,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 8,
      height: 8,
      borderRadius: 2.5,
    },
    legendLabel: {
      fontFamily: Fonts.InterSemiBold,
      fontSize: 11,
      color: c.text2,
    },
  });

export default WeekBars;
