// Accessibility utilities and components
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  Link as MuiLink,
  VisuallyHidden
} from '@mui/material';
import { 
  Accessibility as AccessibilityIcon,
  KeyboardArrowDown,
  VolumeUp,
  Visibility,
  FontDownload
} from '@mui/icons-material';

// Skip to main content link
export const SkipToMain = () => (
  <MuiLink
    href="#main-content"
    sx={{
      position: 'absolute',
      top: -40,
      left: 8,
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      padding: '8px 16px',
      borderRadius: 1,
      textDecoration: 'none',
      zIndex: 9999,
      '&:focus': {
        top: 8,
      },
      transition: 'top 0.3s ease'
    }}
  >
    Skip to main content
  </MuiLink>
);

// Accessible heading component with proper hierarchy
export const AccessibleHeading = ({ 
  level = 1, 
  children, 
  id,
  visualLevel,
  ...props 
}) => {
  const HeadingTag = `h${level}`;
  const visualVariant = visualLevel ? `h${visualLevel}` : `h${level}`;
  
  return (
    <Typography 
      component={HeadingTag}
      variant={visualVariant}
      id={id}
      {...props}
    >
      {children}
    </Typography>
  );
};

// Focus trap component for modals and dropdowns
export const FocusTrap = ({ children, active = true }) => {
  const trapRef = React.useRef(null);

  useEffect(() => {
    if (!active) return;

    const element = trapRef.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  }, [active]);

  return <div ref={trapRef}>{children}</div>;
};

// Live region for announcing dynamic content changes
export const LiveRegion = ({ 
  children, 
  level = 'polite', 
  atomic = false 
}) => (
  <div
    aria-live={level}
    aria-atomic={atomic}
    aria-relevant="additions text"
    style={{
      position: 'absolute',
      left: '-10000px',
      width: '1px',
      height: '1px',
      overflow: 'hidden'
    }}
  >
    {children}
  </div>
);

// Keyboard navigation helper
export const useKeyboardNavigation = (items, onSelect) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => prev <= 0 ? items.length - 1 : prev - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0) {
          onSelect(items[activeIndex], activeIndex);
        }
        break;
      case 'Escape':
        setActiveIndex(-1);
        break;
    }
  };

  return { activeIndex, handleKeyDown, setActiveIndex };
};

// Accessible form field wrapper
export const AccessibleField = ({ 
  label, 
  required = false, 
  error, 
  helpText, 
  children,
  id
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        component="label" 
        htmlFor={fieldId}
        sx={{ 
          display: 'block', 
          mb: 1, 
          fontWeight: 500,
          color: error ? 'error.main' : 'text.primary'
        }}
      >
        {label}
        {required && (
          <span aria-label="required" style={{ color: 'red', marginLeft: 4 }}>
            *
          </span>
        )}
      </Typography>
      
      {React.cloneElement(children, {
        id: fieldId,
        'aria-describedby': [
          helpText ? helpId : null,
          error ? errorId : null
        ].filter(Boolean).join(' '),
        'aria-invalid': !!error,
        'aria-required': required
      })}
      
      {helpText && (
        <Typography 
          id={helpId}
          variant="caption" 
          color="text.secondary"
          sx={{ display: 'block', mt: 0.5 }}
        >
          {helpText}
        </Typography>
      )}
      
      {error && (
        <Typography 
          id={errorId}
          variant="caption" 
          color="error.main"
          sx={{ display: 'block', mt: 0.5 }}
          role="alert"
        >
          {error}
        </Typography>
      )}
    </Box>
  );
};

// Accessible button with loading state
export const AccessibleButton = ({ 
  loading = false, 
  loadingText = "Loading...", 
  children,
  disabled,
  ...props 
}) => (
  <Button
    disabled={disabled || loading}
    aria-disabled={disabled || loading}
    aria-describedby={loading ? "loading-description" : undefined}
    {...props}
  >
    {loading ? loadingText : children}
    {loading && (
      <VisuallyHidden id="loading-description">
        Please wait, your request is being processed
      </VisuallyHidden>
    )}
  </Button>
);

// Accessibility preferences panel
export const AccessibilityPanel = () => {
  const [preferences, setPreferences] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false
  });

  useEffect(() => {
    // Apply accessibility preferences
    const root = document.documentElement;
    
    if (preferences.highContrast) {
      root.style.setProperty('--contrast-mode', 'high');
    } else {
      root.style.removeProperty('--contrast-mode');
    }
    
    if (preferences.largeText) {
      root.style.setProperty('--font-size-multiplier', '1.2');
    } else {
      root.style.removeProperty('--font-size-multiplier');
    }
    
    if (preferences.reducedMotion) {
      root.style.setProperty('--motion-preference', 'reduce');
    } else {
      root.style.removeProperty('--motion-preference');
    }
  }, [preferences]);

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 20, 
        left: 20, 
        p: 2, 
        zIndex: 1000,
        minWidth: 200
      }}
      role="region"
      aria-label="Accessibility preferences"
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <AccessibilityIcon sx={{ mr: 1 }} />
        Accessibility
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant={preferences.highContrast ? "contained" : "outlined"}
          size="small"
          onClick={() => togglePreference('highContrast')}
          startIcon={<Visibility />}
          aria-pressed={preferences.highContrast}
        >
          High Contrast
        </Button>
        
        <Button
          variant={preferences.largeText ? "contained" : "outlined"}
          size="small"
          onClick={() => togglePreference('largeText')}
          startIcon={<FontDownload />}
          aria-pressed={preferences.largeText}
        >
          Large Text
        </Button>
        
        <Button
          variant={preferences.reducedMotion ? "contained" : "outlined"}
          size="small"
          onClick={() => togglePreference('reducedMotion')}
          startIcon={<VolumeUp />}
          aria-pressed={preferences.reducedMotion}
        >
          Reduce Motion
        </Button>
      </Box>
    </Paper>
  );
};

// Screen reader only content
export const ScreenReaderOnly = ({ children }) => (
  <VisuallyHidden>{children}</VisuallyHidden>
);

// Landmark wrapper for main content areas
export const Landmark = ({ 
  role = 'main', 
  label, 
  children, 
  id = 'main-content',
  ...props 
}) => (
  <Box
    component={role === 'main' ? 'main' : 'section'}
    role={role}
    aria-label={label}
    id={id}
    {...props}
  >
    {children}
  </Box>
);

export default {
  SkipToMain,
  AccessibleHeading,
  FocusTrap,
  LiveRegion,
  useKeyboardNavigation,
  AccessibleField,
  AccessibleButton,
  AccessibilityPanel,
  ScreenReaderOnly,
  Landmark
};