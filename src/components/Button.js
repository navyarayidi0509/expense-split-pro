import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, radius, typography, spacing } from '../theme';

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
}) {
  const bgColor = {
    primary: colors.primary,
    success: colors.success,
    warning: colors.warning,
    danger: colors.danger,
    outline: 'transparent',
  }[variant];

  const textColor = variant === 'outline' ? colors.primary : colors.white;
  const borderColor = variant === 'outline' ? colors.primary : 'transparent';

  const paddingVertical = size === 'sm' ? spacing.sm : size === 'lg' ? spacing.lg : spacing.md;
  const fontSize = size === 'sm' ? typography.sm : size === 'lg' ? typography.lg : typography.md;

  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: bgColor, borderColor, paddingVertical },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <Text style={[styles.text, { color: textColor, fontSize }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  text: {
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});