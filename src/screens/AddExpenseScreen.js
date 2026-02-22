import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGroup } from '../hooks/useGroup';
import { useCurrency } from '../hooks/useCurrency';
import { CATEGORIES } from '../utils/categories';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import GroupNotFound from '../components/GroupNotFound';
import { colors, spacing, typography, radius } from '../theme';

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { groupId, expense: existingExpense } = route.params;
  const { group, addExpense, editExpense } = useGroup(groupId);
  const { selectedCurrency, format, convert } = useCurrency();

  const isEditing = !!existingExpense;

  const [title, setTitle] = useState(existingExpense?.title || '');
  const [amount, setAmount] = useState(existingExpense?.amount?.toString() || '');
  const [paidBy, setPaidBy] = useState(existingExpense?.paidBy || null);
  const [splitAmong, setSplitAmong] = useState(existingExpense?.splitAmong || []);
  const [category, setCategory] = useState(existingExpense?.category || 'other');

  if (!group) return <GroupNotFound />;

  const toggleSplitPerson = (personId) => {
    setSplitAmong((prev) =>
      prev.includes(personId) ? prev.filter((id) => id !== personId) : [...prev, personId]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Please enter a title.');
    if (!amount || isNaN(parseFloat(amount))) return Alert.alert('Error', 'Enter a valid amount.');
    if (!paidBy) return Alert.alert('Error', 'Select who paid.');
    if (!splitAmong.length)
      return Alert.alert('Error', 'Select at least one person to split among.');

    const payload = {
      title: title.trim(),
      amount: parseFloat(amount),
      paidBy,
      splitAmong,
      category,
      currency: selectedCurrency,
    };

    if (isEditing) {
      await editExpense(groupId, existingExpense.id, payload);
    } else {
      await addExpense(groupId, payload);
    }
    navigation.goBack();
  };

  const perPersonAmount =
    splitAmong.length > 0 && amount && !isNaN(parseFloat(amount))
      ? parseFloat(amount) / splitAmong.length
      : null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.screenTitle}>{isEditing ? '✏ Edit Expense' : '➕ New Expense'}</Text>

      <Card>
        <Input
          label="Title"
          placeholder="e.g. Dinner, Cab..."
          value={title}
          onChangeText={setTitle}
        />

        {/* Amount input with currency label */}
        <Text style={styles.amountLabel}>Amount</Text>
        <View style={styles.amountRow}>
          <View style={styles.currencyTag}>
            <Text style={styles.currencyTagText}>{selectedCurrency}</Text>
          </View>
          <Input
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={styles.amountInput}
          />
        </View>
      </Card>

      {/* Category */}
      <Text style={styles.sectionLabel}>Category</Text>
      <Card>
        <View style={styles.chipRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                category === cat.id && { backgroundColor: cat.color, borderColor: cat.color },
              ]}
              onPress={() => setCategory(cat.id)}
            >
              <Text>{cat.icon}</Text>
              <Text
                style={[styles.categoryLabel, category === cat.id && styles.categoryLabelSelected]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* Paid By */}
      <Text style={styles.sectionLabel}>Paid By</Text>
      <Card>
        {group.people.length === 0 ? (
          <Text style={styles.noPersonText}>No people in this group yet.</Text>
        ) : (
          <View style={styles.chipRow}>
            {group.people.map((person) => (
              <TouchableOpacity
                key={person.id}
                style={[styles.chip, paidBy === person.id && styles.chipSelected]}
                onPress={() => setPaidBy(person.id)}
              >
                <Text style={[styles.chipText, paidBy === person.id && styles.chipTextSelected]}>
                  {person.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </Card>

      {/* Split Among */}
      <Text style={styles.sectionLabel}>Split Among</Text>
      <Card>
        {group.people.length === 0 ? (
          <Text style={styles.noPersonText}>No people in this group yet.</Text>
        ) : (
          <>
            <TouchableOpacity
              onPress={() =>
                setSplitAmong(
                  splitAmong.length === group.people.length ? [] : group.people.map((p) => p.id)
                )
              }
            >
              <Text style={styles.selectAllText}>
                {splitAmong.length === group.people.length ? 'Deselect All' : 'Select All'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.chipRow, { marginTop: spacing.sm }]}>
              {group.people.map((person) => (
                <TouchableOpacity
                  key={person.id}
                  style={[styles.chip, splitAmong.includes(person.id) && styles.chipSelected]}
                  onPress={() => toggleSplitPerson(person.id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      splitAmong.includes(person.id) && styles.chipTextSelected,
                    ]}
                  >
                    {person.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Split preview with currency conversion */}
            {perPersonAmount && (
              <View style={styles.splitPreview}>
                <Text style={styles.splitPreviewText}>
                  💡 Each person pays: {format(perPersonAmount)}
                </Text>
                {selectedCurrency !== 'USD' && (
                  <Text style={styles.splitPreviewSub}>(${perPersonAmount.toFixed(2)} USD)</Text>
                )}
              </View>
            )}
          </>
        )}
      </Card>

      <Button
        title={isEditing ? 'Save Changes' : 'Add Expense'}
        onPress={handleSubmit}
        size="lg"
        style={{ marginTop: spacing.md }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.grayLighter, padding: spacing.lg },
  screenTitle: {
    fontSize: typography.xxl,
    fontWeight: '800',
    marginBottom: spacing.xl,
    color: colors.dark,
  },
  sectionLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: '#444',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  amountLabel: {
    fontSize: typography.md,
    fontWeight: '700',
    color: '#444',
    marginBottom: spacing.sm,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  currencyTag: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
  },
  currencyTagText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: typography.sm,
  },
  amountInput: {
    flex: 1,
    marginBottom: 0,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.md, color: '#555', fontWeight: '500' },
  chipTextSelected: { color: colors.white, fontWeight: '700' },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderWidth: 1.5,
    borderColor: colors.grayLight,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  categoryLabel: { fontSize: typography.sm, color: '#555', fontWeight: '500' },
  categoryLabelSelected: { color: colors.white, fontWeight: '700' },
  selectAllText: { color: colors.primary, fontWeight: '600', fontSize: typography.sm },
  splitPreview: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  splitPreviewText: { color: colors.primary, fontWeight: '600', fontSize: typography.sm },
  splitPreviewSub: { color: colors.primary, fontSize: typography.xs, marginTop: 2, opacity: 0.7 },
  noPersonText: { color: colors.gray, fontSize: typography.sm, fontStyle: 'italic' },
});
