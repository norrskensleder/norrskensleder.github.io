// Simple Navbar component
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <img src="/norrskensleder/logo.svg" alt="norrskensleder logo" style={{ height: 36, marginRight: 12, borderRadius: 6 }} />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Norrskensleder</Link>
        </Typography>
        <Button color="inherit" component={Link} href="/blog">Blog</Button>
        <Button color="inherit" component={Link} href="/about">About</Button>
        <Button color="inherit" component={Link} href="/contact">Contact</Button>
      </Toolbar>
    </AppBar>
  );
}