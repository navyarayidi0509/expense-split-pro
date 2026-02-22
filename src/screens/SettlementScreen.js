import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useGroup } from '../hooks/useGroup';
import { useCurrency } from '../hooks/useCurrency';
import { calculateSettlements } from '../utils/settlements';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import GroupNotFound from '../components/GroupNotFound';
import { colors, spacing, typography, radius } from '../theme';

export default function SettlementsScreen() {
  const route = useRoute();
  const { groupId } = route.params;
  const { group, recordSettlementPaid } = useGroup(groupId);
  const { format } = useCurrency();

  if (!group) return <GroupNotFound />;

  const settlements = calculateSettlements(group.people, group.expenses);
  const paidSettlements = group.paidSettlements || [];

  const isAlreadyPaid = (settlement) =>
    paidSettlements.some((s) => s.from === settlement.from && s.to === settlement.to);

  const handleMarkPaid = (settlement) => {
    if (isAlreadyPaid(settlement)) return;
    Alert.alert(
      'Mark as Paid',
      `${settlement.from} paid ${settlement.to} ${format(settlement.amount)}?`,
      [
        { text: 'Cancel' },
        {
          text: 'Yes, Paid',
          onPress: () => recordSettlementPaid(groupId, settlement),
        },
      ]
    );
  };

  const allSettled = settlements.length === 0 || settlements.every((s) => isAlreadyPaid(s));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Who Pays Whom</Text>

      {allSettled ? (
        <EmptyState title="All settled up!" subtitle="Everyone is even. Nothing to pay." />
      ) : (
        <FlatList
          data={settlements}
          keyExtractor={(_, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const paid = isAlreadyPaid(item);
            return (
              <Card style={[styles.card, paid && styles.cardPaid]}>
                <View style={styles.cardTop}>
                  <View style={styles.names}>
                    <Text style={[styles.name, paid && styles.namePaid]}>{item.from}</Text>
                    <Text style={styles.arrow}> to </Text>
                    <Text style={[styles.name, paid && styles.namePaid]}>{item.to}</Text>
                  </View>
                  <Text style={[styles.amount, paid && styles.amountPaid]}>
                    {format(item.amount)}
                  </Text>
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity
                    style={[styles.paidBtn, paid && styles.paidBtnDone]}
                    onPress={() => handleMarkPaid(item)}
                    disabled={paid}
                  >
                    <Text style={styles.paidBtnText}>{paid ? 'Paid' : 'Mark Paid'}</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      )}

      {paidSettlements.length > 0 && (
        <>
          <Text style={styles.historyTitle}>Payment History</Text>
          <FlatList
            data={paidSettlements}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.historyCard}>
                <Text style={styles.historyText}>
                  {item.from} paid {item.to} {format(item.amount)}
                </Text>
                <Text style={styles.historyDate}>{new Date(item.paidAt).toLocaleDateString()}</Text>
              </Card>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.grayLighter },
  heading: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.dark,
    marginBottom: spacing.lg,
  },
  card: { marginBottom: spacing.sm },
  cardPaid: {
    backgroundColor: colors.successLight,
    borderColor: '#86efac',
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  names: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: typography.base, fontWeight: '700', color: colors.dark },
  namePaid: { color: '#4ade80' },
  arrow: { fontSize: typography.base, color: colors.gray, marginHorizontal: spacing.xs },
  amount: { fontSize: typography.md, fontWeight: '700', color: colors.success },
  amountPaid: { color: '#4ade80' },
  cardActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  paidBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  paidBtnDone: { backgroundColor: '#4ade80' },
  paidBtnText: { color: colors.white, fontWeight: '700', fontSize: typography.sm },
  historyTitle: {
    fontSize: typography.lg,
    fontWeight: '800',
    color: colors.dark,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  historyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  historyText: { fontSize: typography.sm, color: '#555' },
  historyDate: { fontSize: typography.xs, color: colors.gray },
});
