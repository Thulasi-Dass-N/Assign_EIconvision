import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/native-stack';

export type AppStackScreenParamsProps = {
  SplashScreen: undefined;
  CameraScreen: undefined;
  GalleryScreen: undefined;
  DetailsScreen: { entry: any };
};

export type MainStackNavigationProps =
  StackNavigationProp<AppStackScreenParamsProps>;
export type MainStackRouteProps = RouteProp<AppStackScreenParamsProps>;
