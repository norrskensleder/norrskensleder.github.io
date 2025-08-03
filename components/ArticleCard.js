// ArticleCard component for blog previews
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import Link from 'next/link';

export default function ArticleCard({ post }) {
  return (
    <Card sx={{ mb: 3 }}>
      <CardActionArea component={Link} href={`/${post.slug}`}>
        {post.coverImage && (
          <CardMedia component="img" height="180" image={post.coverImage} alt={post.title} />
        )}
        <CardContent>
          <Typography variant="h6">{post.title}</Typography>
          <Typography variant="body2" color="text.secondary">{post.date}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }} noWrap>{post.content?.slice(0, 120)}...</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}