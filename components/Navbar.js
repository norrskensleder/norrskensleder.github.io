// Enhanced Navbar component with responsive design
import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Menu as MenuIcon,
  Close as CloseIcon,
  Article as BlogIcon,
  Person as AboutIcon,
  Email as ContactIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Home', href: '/', icon: <HomeIcon /> },
    { label: 'Blog', href: '/blog', icon: <BlogIcon /> },
    { label: 'About', href: '/about', icon: <AboutIcon /> },
    { label: 'Contact', href: '/contact', icon: <ContactIcon /> }
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <Typography variant="h6" color="primary.main" fontWeight="bold">
          Norrskensleder
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton 
              component={Link} 
              href={item.href}
              onClick={handleDrawerToggle}
              sx={{
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ color: 'text.primary' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        color="primary"
        elevation={2}
        sx={{
          background: 'linear-gradient(45deg, #005cbf 30%, #0070f3 90%)',
          boxShadow: '0 3px 10px 0 rgba(0,92,191,0.3)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Norrskensleder - Northern Lights Leader">
              <Avatar 
                src="/norrskensleder/logo.svg" 
                alt="Norrskensleder logo"
                sx={{ 
                  width: 40, 
                  height: 40, 
                  mr: 2,
                  border: '2px solid rgba(255,255,255,0.3)',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }}
              />
            </Tooltip>
            <Typography 
              variant="h6" 
              component={Link} 
              href="/"
              sx={{ 
                color: 'inherit', 
                textDecoration: 'none',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
                '&:hover': {
                  textShadow: '0 0 8px rgba(255,255,255,0.5)'
                }
              }}
            >
              Norrskensleder
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navItems.slice(1).map((item) => (
                <Button
                  key={item.label}
                  color="inherit"
                  component={Link}
                  href={item.href}
                  startIcon={item.icon}
                  sx={{
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open navigation menu"
              edge="end"
              onClick={handleDrawerToggle}
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}