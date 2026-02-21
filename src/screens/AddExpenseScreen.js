import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGroup } from '../hooks/useGroup';
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
    };

    const payerName = group.people.find((p) => p.id === paidBy)?.name || 'Someone';

    if (isEditing) {
      await editExpense(groupId, existingExpense.id, payload);
    } else {
      await addExpense(groupId, payload, payerName);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      <Text style={styles.screenTitle}>{isEditing ? 'Edit Expense' : 'New Expense'}</Text>

      <Card>
        <Input
          label="Title"
          placeholder="e.g. Dinner, Cab..."
          value={title}
          onChangeText={setTitle}
        />
        <Input
          label="Amount ($)"
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
      </Card>

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
            {splitAmong.length > 0 && amount && !isNaN(parseFloat(amount)) && (
              <View style={styles.splitPreview}>
                <Text style={styles.splitPreviewText}>
                  💡 Each person pays: ${(parseFloat(amount) / splitAmong.length).toFixed(2)}
                </Text>
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
  noPersonText: { color: colors.gray, fontSize: typography.sm, fontStyle: 'italic' },
});
