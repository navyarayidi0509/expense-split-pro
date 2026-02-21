import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 1.5,
  },
  icon: {
    fontSize: 44,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: '#555',
  },
  subtitle: {
    fontSize: typography.md,
    color: colors.gray,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});
