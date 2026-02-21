import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGroups } from '../hooks/useGroups';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import { colors, spacing, typography, radius } from '../theme';

export default function GroupsScreen() {
  const navigation = useNavigation();
  const { groups, createGroup, removeGroup } = useGroups();
  const [groupName, setGroupName] = useState('');

  const handleAdd = async () => {
    if (!groupName.trim()) return;
    await createGroup(groupName.trim());
    setGroupName('');
  };

  const handleDelete = (groupId) => {
    Alert.alert('Delete Group', 'This will delete all expenses in this group.', [
      { text: 'Cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => removeGroup(groupId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Input
          placeholder="New group name..."
          value={groupName}
          onChangeText={setGroupName}
          style={styles.inputFlex}
        />
        <Button title="Add" onPress={handleAdd} size="md" style={styles.addBtn} />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState title="No groups yet" subtitle="Create a group to start splitting expenses" />
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
            onLongPress={() => handleDelete(item.id)}
            activeOpacity={0.8}
          >
            <Card style={styles.groupCard}>
              <View style={styles.groupIconBox}>
                <Text style={styles.groupIconText}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.groupInfo}>
                <Text style={styles.groupName}>{item.name}</Text>
                <Text style={styles.groupMeta}>
                  {item.people.length} people · {item.expenses.length} expenses
                </Text>
              </View>
              <Text style={styles.totalAmount}>
                ${item.expenses.reduce((s, e) => s + e.amount, 0).toFixed(2)}
              </Text>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.grayLighter },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  inputFlex: { flex: 1, marginBottom: 0 },
  addBtn: { marginBottom: 0, paddingVertical: spacing.md },
  groupCard: { flexDirection: 'row', alignItems: 'center' },
  groupIconBox: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  groupIconText: { fontSize: typography.lg, fontWeight: '800', color: colors.primary },
  groupInfo: { flex: 1 },
  groupName: { fontSize: typography.lg, fontWeight: '700', color: colors.dark },
  groupMeta: { fontSize: typography.sm, color: colors.gray, marginTop: spacing.xs },
  totalAmount: { fontSize: typography.lg, fontWeight: '800', color: colors.primary },
});
