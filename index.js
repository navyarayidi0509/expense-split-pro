import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadGroups } from './src/services/storageServices';
import { setGroups } from './src/store/groupsSlice';

function AppWithRedux() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      const groups = await loadGroups();
      if (groups.length) dispatch(setGroups(groups));
    };
    bootstrap();
  }, []);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppWithRedux />
    </Provider>
  );
}

registerRootComponent(App);
