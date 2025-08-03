import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

export default function Gallery({ images }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const slides = images.map((src) => ({ src }));

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      margin: '16px 0',
      width: '100%'
    }}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Gallery image"
          style={{
            width: '100%',
            aspectRatio: '3/2',
            objectFit: 'cover',
            cursor: 'pointer',
            borderRadius: 8,
            boxShadow: '0 2px 16px #00336622',
            background: '#eee'
          }}
          onClick={() => { setOpen(true); setIndex(i); }}
        />
      ))}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={index}
        on={{ view: ({ index }) => setIndex(index) }}
      />
    </div>
  );
}
