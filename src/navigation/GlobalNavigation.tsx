import {
  createNavigationContainerRef,
  CommonActions,
  ParamListBase,
} from '@react-navigation/native';
import { ScreenNames } from '../constants';

export const navigationRef = createNavigationContainerRef<ParamListBase>();

export function navigate(name: string, params?: any) {
  if (navigationRef.isReady()) {
    if (params) {
      navigationRef.navigate(name, params);
    } else {
      navigationRef.navigate(name);
    }
  }
}

export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

export function replaceToMain(tabName?: string, params?: any) {
  if (!navigationRef.isReady()) return;

  if (tabName) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: ScreenNames.Main,
            params: { screen: tabName, params: params },
          },
        ],
      }),
    );
  } else {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: ScreenNames.Main }],
      }),
    );
  }
}
