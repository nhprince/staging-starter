---
name: file-upload
description: "Add file uploads with Cloudflare R2 — presigned URLs, image optimization, progress tracking. Use when Prince says 'add file upload' or 'image upload'. Free 10GB storage."
version: 1.0.0
author: Saturday (for Prince)
license: MIT
metadata:
  hermes:
    tags: [file-upload, r2, cloudflare, images, presigned-url, storage]
    related_skills: [cloudflare, backend-design, frontend-design, fullstack-developer]
---

# File Upload Module — Cloudflare R2

## Overview

Adds file upload capability using Cloudflare R2 (S3-compatible object storage). Uses presigned URLs for direct browser-to-R2 uploads, bypassing the Worker for better performance.

## When to Use

- Prince says "add file upload" or "image upload"
- User avatars, project images, document uploads
- **Don't use for:** tiny projects (use base64 in D1 for < 1MB files)

## Architecture

```
Browser → Worker (get presigned URL) → R2 (direct upload) → Worker (confirm)
```

## Backend (Hono Worker)

```ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${c.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: c.env.R2_ACCESS_KEY_ID,
    secretAccessKey: c.env.R2_SECRET_ACCESS_KEY,
  },
});

// Generate presigned URL for upload
app.post('/api/upload/presigned', async (c) => {
  const { filename, contentType } = await c.req.json();
  const key = `uploads/${Date.now()}-${filename}`;
  
  const command = new PutObjectCommand({
    Bucket: c.env.R2_BUCKET,
    Key: key,
    ContentType: contentType,
  });
  
  const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
  return c.json({ url, key });
});
```

## Frontend

```tsx
async function uploadFile(file: File) {
  // 1. Get presigned URL
  const { url, key } = await fetch('/api/upload/presigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  }).then(r => r.json());

  // 2. Upload directly to R2
  await fetch(url, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  // 3. Confirm upload
  await fetch('/api/upload/confirm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key }),
  });

  return key;
}
```

## Image Optimization

```ts
// Use Cloudflare Images for automatic optimization
// Or resize before upload using browser Canvas API
function resizeImage(file: File, maxWidth: number): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = maxWidth / img.width;
      canvas.width = maxWidth;
      canvas.height = img.height * scale;
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob!), file.type, 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

## Verification Checklist

- [ ] R2 bucket created
- [ ] Presigned URL generates successfully
- [ ] File uploads directly to R2
- [ ] File accessible via public URL (or signed URL)
- [ ] Image resize works before upload
- [ ] Progress indicator shows during upload

## Agent Tip 🤖

> Always validate file type and size on BOTH client and server.
> Max 10MB for images, 50MB for documents (adjust per project).
> Use `accept` attribute on file input to limit types.
