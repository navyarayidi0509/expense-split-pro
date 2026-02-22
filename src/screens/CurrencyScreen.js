import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCurrency } from '../hooks/useCurrency';
import { SUPPORTED_CURRENCIES } from '../services/currencyService';
import Card from '../components/Card';
import { colors, spacing, typography, radius } from '../theme';

export default function CurrencyScreen() {
  const navigation = useNavigation();
  const { selectedCurrency, loading, error, lastUpdated, changeCurrency, loadRates } =
    useCurrency();

  useEffect(() => {
    loadRates('USD');
  }, []);

  const handleSelect = async (code) => {
    await changeCurrency(code);
    navigation.goBack();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Fetching live exchange rates...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={() => loadRates('USD')}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>
        Select your preferred currency. All expenses will be converted using live exchange rates.
      </Text>

      {lastUpdated && (
        <Text style={styles.lastUpdated}>
          Rates updated: {new Date(lastUpdated).toLocaleDateString()}
        </Text>
      )}

      <FlatList
        data={SUPPORTED_CURRENCIES}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isSelected = selectedCurrency === item.code;
          return (
            <TouchableOpacity onPress={() => handleSelect(item.code)} activeOpacity={0.8}>
              <Card style={[styles.currencyCard, isSelected && styles.currencyCardSelected]}>
                <View style={styles.currencyLeft}>
                  <View style={[styles.symbolBox, isSelected && styles.symbolBoxSelected]}>
                    <Text style={[styles.symbol, isSelected && styles.symbolSelected]}>
                      {item.symbol}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.code, isSelected && styles.codeSelected]}>
                      {item.code}
                    </Text>
                    <Text style={styles.name}>{item.name}</Text>
                  </View>
                </View>
                {isSelected && <Text style={styles.checkmark}>✓</Text>}
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.grayLighter },
  subtitle: { fontSize: typography.sm, color: colors.gray, marginBottom: spacing.sm },
  lastUpdated: { fontSize: typography.xs, color: colors.gray, marginBottom: spacing.lg },
  currencyCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  currencyCardSelected: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  currencyLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  symbolBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.grayLighter,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolBoxSelected: { backgroundColor: colors.primary },
  symbol: { fontSize: typography.lg, fontWeight: '800', color: colors.dark },
  symbolSelected: { color: colors.white },
  code: { fontSize: typography.base, fontWeight: '700', color: colors.dark },
  codeSelected: { color: colors.primary },
  name: { fontSize: typography.sm, color: colors.gray, marginTop: 2 },
  checkmark: { fontSize: typography.xl, color: colors.primary, fontWeight: '800' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  loadingText: { fontSize: typography.md, color: colors.gray, marginTop: spacing.md },
  errorIcon: { fontSize: 40, marginBottom: spacing.md },
  errorText: {
    fontSize: typography.md,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  retryBtnText: { color: colors.white, fontWeight: '700' },
});
