import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GroupsScreen from '../screens/GroupsScreen';
import GroupDetailScreen from '../screens/GroupDetailScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import SettlementsScreen from '../screens/SettlementScreen';
import CurrencyScreen from '../screens/CurrencyScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitle: '',
        headerBackButtonDisplayMode: 'minimal',
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen name="Groups" component={GroupsScreen} options={{ title: 'My Groups' }} />
      <Stack.Screen
        name="GroupDetail"
        component={GroupDetailScreen}
        options={{ title: 'Group Detail' }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Add Expense' }}
      />
      <Stack.Screen
        name="Settlements"
        component={SettlementsScreen}
        options={{ title: 'Settlements' }}
      />
      <Stack.Screen
        name="Currency"
        component={CurrencyScreen}
        options={{ title: 'Select Currency' }}
      />
    </Stack.Navigator>
  );
}
