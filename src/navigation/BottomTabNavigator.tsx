import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Fonts, ScreenNames } from '../constants';
import { useTheme } from '../context/ThemeContext';

// Tab Screens
import HomeScreen from '../screens/HomeScreen';
import PlansScreen from '../screens/PlansScreen';
import CoachScreen from '../screens/CoachScreen';
import FuelScreen from '../screens/FuelScreen';
import MeScreen from '../screens/MeScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.text3,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height:
            Platform.OS === 'ios'
              ? 88
              : insets.bottom > 0
              ? 72 + insets.bottom
              : 68,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 9,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: Fonts.InterSemiBold,
          letterSpacing: 0.1,
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen
        name={ScreenNames.Today}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'home-variant' : 'home-variant-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.Plans}
        component={PlansScreen}
        options={{
          tabBarLabel: 'Plans',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'layers' : 'layers-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.Coach}
        component={CoachScreen}
        options={{
          tabBarLabel: 'Coach',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'lightning-bolt' : 'lightning-bolt-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.Fuel}
        component={FuelScreen}
        options={{
          tabBarLabel: 'Fuel',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'food-apple' : 'food-apple-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ScreenNames.Me}
        component={MeScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name={focused ? 'account' : 'account-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
