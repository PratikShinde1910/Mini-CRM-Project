export const modernTheme = {
  colors: {
    primary: '#6366f1', 
    primaryLight: '#a5b4fc',
    secondary: '#f59e0b', 
    success: '#10b981', 
    warning: '#f59e0b', 
    error: '#ef4444', 
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9', 
    onSurface: '#1e293b', 
    onSurfaceVariant: '#64748b', 
    outline: '#e2e8f0', 
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      lineHeight: 36,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
      lineHeight: 16,
    },
    button: {
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
  },
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const createCardStyle = (theme = modernTheme) => ({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.borderRadius.md,
  padding: theme.spacing.md,
  marginBottom: theme.spacing.md,
  ...theme.shadows.sm,
});

export const createButtonStyle = (variant = 'primary', theme = modernTheme) => {
  const baseStyle = {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (variant) {
    case 'primary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
      };
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 1,
        borderColor: theme.colors.outline,
      };
    case 'outline':
      return {
        ...baseStyle,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
      };
    default:
      return baseStyle;
  }
};