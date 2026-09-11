import { Redirect } from 'expo-router';

export default function Index() {
  // Direct entry routes to the animated splash screen on app launch
  return <Redirect href="/(auth)/splash" />;
}
