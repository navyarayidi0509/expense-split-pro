import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadGroups } from './src/services/storageServices';
import { setGroups } from './src/store/groupsSlice';
import { fetchExchangeRates } from './src/services/currencyService';
import { setRates } from './src/store/currencySlice';

function AppWithRedux() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      // load groups from AsyncStorage
      const groups = await loadGroups();
      if (groups.length) dispatch(setGroups(groups));

      // fetch live exchange rates on startup
      try {
        const data = await fetchExchangeRates('USD');
        dispatch(setRates(data));
      } catch (e) {
        console.warn('Could not fetch exchange rates:', e.message);
      }
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
