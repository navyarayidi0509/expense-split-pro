import { View, Text, StyleSheet } from 'react-native';
import { radius, spacing, typography } from '../theme';

export default function Badge({ icon, color, size = 44 }) {
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: color + '22',
          width: size,
          height: size,
          borderRadius: size * 0.27,
        },
      ]}
    >
      <Text style={styles.icon}>{icon}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 22,
  },
});