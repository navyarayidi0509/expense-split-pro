import { useState } from 'react';
import {
  View, Text, FlatList,
  TouchableOpacity, StyleSheet, Alert, ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGroup } from '../hooks/useGroup';
import { getCategoryById } from '../utils/categories';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import EmptyState from '../components/EmptyState';
import GroupNotFound from '../components/GroupNotFound';
import Input from '../components/Input';
import { colors, spacing, typography, radius } from '../theme';

export default function GroupDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId } = route.params;
  const { group, addPerson, removePerson, removeExpense } = useGroup(groupId);
  const [personName, setPersonName] = useState('');

  if (!group) return <GroupNotFound />;

  const totalSpent = group.expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleAddPerson = async () => {
    if (!personName.trim()) return;
    await addPerson(groupId, personName.trim());
    setPersonName('');
  };

  const handleDeletePerson = (personId) => {
    Alert.alert('Remove Person', 'Remove this person from the group?', [
      { text: 'Cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removePerson(groupId, personId) },
    ]);
  };

  const handleDeleteExpense = (expenseId) => {
    Alert.alert('Delete Expense', 'Delete this expense?', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeExpense(groupId, expenseId) },
    ]);
  };

  const sortedExpenses = [...group.expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Group Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>${totalSpent.toFixed(2)}</Text>
            <Text style={styles.summaryLabel}>Total Spent</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{group.expenses.length}</Text>
            <Text style={styles.summaryLabel}>Expenses</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{group.people.length}</Text>
            <Text style={styles.summaryLabel}>People</Text>
          </View>
        </View>
      </View>

      {/* People Section */}
      <Text style={styles.sectionTitle}>People</Text>
      <View style={styles.inputRow}>
        <Input
          placeholder="Add person name..."
          value={personName}
          onChangeText={setPersonName}
          style={styles.inputFlex}
        />
        <Button title="Add" onPress={handleAddPerson} size="md" style={styles.addBtn} />
      </View>

      {group.people.length === 0 ? (
        <Text style={styles.emptyPeople}>No people added yet. Add someone above!</Text>
      ) : (
        <FlatList
          horizontal
          data={group.people}
          keyExtractor={(item) => item.id}
          style={{ marginBottom: spacing.xl }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.personChip}
              onLongPress={() => handleDeletePerson(item.id)}
            >
              <Text style={styles.personAvatar}>
                {item.name.charAt(0).toUpperCase()}
              </Text>
              <Text style={styles.personChipText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Expenses Section */}
      <View style={styles.expenseHeader}>
        <Text style={styles.sectionTitle}>Expenses</Text>
        <Button
          title="+ Add"
          onPress={() => navigation.navigate('AddExpense', { groupId })}
          variant="success"
          size="sm"
        />
      </View>

      {sortedExpenses.length === 0 ? (
        <EmptyState
          title="No expenses yet"
          subtitle='Tap "+ Add" to record your first expense'
        />
      ) : (
        sortedExpenses.map((item) => {
          const payer = group.people.find((p) => p.id === item.paidBy);
          const cat = getCategoryById(item.category);
          return (
            <Card key={item.id} style={styles.expenseCard}>
              <Badge icon={cat.icon} color={cat.color} />
              <View style={styles.expenseInfo}>
                <Text style={styles.expenseTitle}>{item.title}</Text>
                <Text style={styles.expenseMeta}>
                  Paid by {payer?.name ?? 'Unknown'} · {cat.label}
                </Text>
                <Text style={styles.expenseDate}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.expenseRight}>
                <Text style={styles.expenseAmount}>${item.amount.toFixed(2)}</Text>
                <View style={styles.expenseActions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      navigation.navigate('AddExpense', { groupId, expense: item })
                    }
                  >
                    <Text>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteExpense(item.id)}
                  >
                    <Text>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          );
        })
      )}

      <Button
        title="View Settlements"
        onPress={() => navigation.navigate('Settlements', { groupId })}
        variant="warning"
        size="lg"
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayLighter, padding: spacing.lg },
  summaryCard: {
    backgroundColor: colors.primary, borderRadius: radius.xl,
    padding: spacing.xl, marginBottom: spacing.xxl,
  },
  summaryTitle: { color: colors.white, fontSize: typography.sm, fontWeight: '700', marginBottom: 14, opacity: 0.85 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryValue: { color: colors.white, fontSize: typography.xl, fontWeight: '800' },
  summaryLabel: { color: colors.white, fontSize: typography.xs, opacity: 0.75, marginTop: 2 },
  summaryDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.25)' },
  sectionTitle: { fontSize: typography.lg, fontWeight: '800', color: colors.dark, marginBottom: spacing.sm },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, marginBottom: spacing.sm },
  inputFlex: { flex: 1, marginBottom: 0 },
  addBtn: { marginBottom: 0, paddingVertical: spacing.md },
  personChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.white, borderRadius: radius.full,
    borderWidth: 1.5, borderColor: colors.grayLight,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginRight: spacing.sm,
  },
  personAvatar: {
    backgroundColor: colors.primary, color: colors.white,
    width: 22, height: 22, borderRadius: 11,
    textAlign: 'center', fontSize: typography.xs,
    fontWeight: '800', lineHeight: 22,
  },
  personChipText: { fontSize: typography.sm, fontWeight: '600', color: colors.dark },
  expenseHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm,
  },
  expenseCard: { flexDirection: 'row', alignItems: 'center' },
  expenseInfo: { flex: 1 },
  expenseTitle: { fontSize: typography.base, fontWeight: '700', color: colors.dark },
  expenseMeta: { fontSize: typography.xs, color: colors.gray, marginTop: 2 },
  expenseDate: { fontSize: typography.xs, color: '#bbb', marginTop: 2 },
  expenseRight: { alignItems: 'flex-end', gap: spacing.sm },
  expenseAmount: { fontSize: typography.lg, fontWeight: '800', color: colors.primary },
  expenseActions: { flexDirection: 'row', gap: spacing.sm },
  editBtn: { backgroundColor: colors.primaryLight, borderRadius: radius.sm, padding: spacing.sm },
  deleteBtn: { backgroundColor: colors.dangerLight, borderRadius: radius.sm, padding: spacing.sm },
  emptyPeople: { color: colors.gray, fontSize: typography.sm, marginBottom: spacing.md, fontStyle: 'italic' },
});