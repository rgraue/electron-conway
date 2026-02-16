import React from 'react';
import { createRoot } from 'react-dom/client';
import { Grid } from './components/grid';

const root = document.getElementById('root')!;

// up to you to gaurd this for nonprod use only
// new EventSource('/esbuild').addEventListener('change', () => location.reload())

// attach react to index.html
createRoot(root).render(
    <>
    <Grid width={50} height={25}/>
    </>
)