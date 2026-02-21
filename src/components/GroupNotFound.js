import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';

export default function GroupNotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔍</Text>
      <Text style={styles.text}>Group not found.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.grayLighter },
  icon: { fontSize: 40, marginBottom: spacing.md },
  text: { fontSize: typography.lg, fontWeight: '700', color: colors.gray },
});