import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import GoalScreen from '../screens/GoalScreen';
import LoginScreen from '../screens/LoginScreen';
import PlanPreviewScreen from '../screens/PlanPreviewScreen';
import BottomTabNavigator from './BottomTabNavigator';
import SessionScreen from '../screens/SessionScreen';
import CalendarScreen from '../screens/CalendarScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import GuideScreen from '../screens/GuideScreen';
import ScanScreen from '../screens/ScanScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import LogSessionScreen from '../screens/LogSessionScreen';
import PlanDetailScreen from '../screens/PlanDetailScreen';
import { ScreenNames } from '../constants';

const Stack = createNativeStackNavigator();

/**
 * Splash → onboarding (Welcome → Goal → Plan preview) → Main tabs.
 *
 * Onboarding currently runs on every launch. Gating it behind a "seen it"
 * flag needs persistent storage — see the README.
 */
const Appstack = () => {
  return (
    <Stack.Navigator
      initialRouteName={ScreenNames.Splash}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name={ScreenNames.Splash} component={SplashScreen} />

      {/* Onboarding */}
      <Stack.Screen name={ScreenNames.Welcome} component={WelcomeScreen} />
      <Stack.Screen name={ScreenNames.Goal} component={GoalScreen} />
      <Stack.Screen name={ScreenNames.Login} component={LoginScreen} />
      <Stack.Screen
        name={ScreenNames.PlanPreview}
        component={PlanPreviewScreen}
      />

      {/* App */}
      <Stack.Screen name={ScreenNames.Main} component={BottomTabNavigator} />
      <Stack.Screen name={ScreenNames.Session} component={SessionScreen} />
      <Stack.Screen name={ScreenNames.Calendar} component={CalendarScreen} />
      <Stack.Screen
        name={ScreenNames.Notifications}
        component={NotificationsScreen}
      />
      <Stack.Screen name={ScreenNames.Paywall} component={PaywallScreen} />
      <Stack.Screen name={ScreenNames.Guide} component={GuideScreen} />
      <Stack.Screen name={ScreenNames.Scan} component={ScanScreen} />
      <Stack.Screen name={ScreenNames.Analytics} component={AnalyticsScreen} />
      <Stack.Screen
        name={ScreenNames.LogSession}
        component={LogSessionScreen}
      />
      <Stack.Screen
        name={ScreenNames.PlanDetail}
        component={PlanDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default Appstack;
