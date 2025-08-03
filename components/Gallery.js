import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function Gallery({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // images: [{ src, alt }]
  const slides = images.map((img) => ({ src: img.src, description: img.alt }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 16,
      margin: '16px 0',
      width: '100%'
    }}>
      {images.map((img, i) => (
        <div key={img.src} style={{ width: '100%' }}>
          <img
            src={img.src}
            alt={img.alt}
            style={{
              width: '100%',
              aspectRatio: '3/2',
              objectFit: 'cover',
              cursor: 'pointer',
              borderRadius: 8,
              boxShadow: '0 2px 16px #00336622',
              background: '#eee',
              display: 'block'
            }}
            onClick={() => { setOpen(true); setIndex(i); }}
          />
          {img.alt && (
            <div style={{ textAlign: 'center', fontSize: 14, color: '#555', marginTop: 4 }}>{img.alt}</div>
          )}
        </div>
      ))}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        on={{ view: ({ index }) => setIndex(index) }}
        render={{
          description: ({ description }) => description && (
            <div style={{ textAlign: 'center', marginTop: 8, color: '#fff', fontSize: 16 }}>{description}</div>
          )
        }}
      />
    </div>
  );
}
