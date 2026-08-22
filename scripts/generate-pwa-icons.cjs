const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Ensure directories exist
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Function to generate a simple pure PNG buffer
function createPNG(width, height, drawFn) {
  // 8-byte PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk: 13 bytes
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8 bits per channel
  ihdrData.writeUInt8(6, 9); // RGBA color type
  ihdrData.writeUInt8(0, 10); // Compression method
  ihdrData.writeUInt8(0, 11); // Filter method
  ihdrData.writeUInt8(0, 12); // Interlace method

  function createChunk(type, data) {
    const len = data.length;
    const buf = Buffer.alloc(len + 12);
    buf.writeUInt32BE(len, 0);
    buf.write(type, 4, 4, 'ascii');
    data.copy(buf, 8);
    // CRC calculation
    const crc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
    buf.writeUInt32BE(crc, len + 8);
    return buf;
  }

  // CRC32 table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) c = 0xedb88320 ^ (c >>> 1);
      else c = c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  // Raw image scanlines (each row starts with 1 filter byte = 0)
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  for (let y = 0; y < height; y++) {
    scanlines[offset++] = 0; // Filter byte 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      scanlines[offset++] = r;
      scanlines[offset++] = g;
      scanlines[offset++] = b;
      scanlines[offset++] = a;
    }
  }

  const compressedData = zlib.deflateSync(scanlines);
  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Drawing function for Ana Maria Salas Luxury Icon
function drawLuxuryIcon(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const rOuter = (w / 2) * 0.92;
  const rInner = (w / 2) * 0.84;

  // Background: Warm Sand/Cream #FAF8F5
  let r = 250, g = 248, b = 245, a = 255;

  // Outer decorative gold border circle
  if (dist <= rOuter && dist >= rInner) {
    // Gold gradient #C5A880 (197, 168, 128) to #A68352
    const factor = (y / h) * 0.4 + 0.6;
    r = Math.round(197 * factor);
    g = Math.round(168 * factor);
    b = Math.round(128 * factor);
    a = 255;
    return [r, g, b, a];
  }

  // Inner circular area with dark luxury background #231F20 or warm pearl
  if (dist < rInner) {
    // Elegant dark pearl luxury background #242021 (36, 32, 33)
    r = 36;
    g = 32;
    b = 33;
    a = 255;

    // Subtle radial gold shimmer in center
    const shimmer = Math.max(0, 1 - dist / (w * 0.4));
    r = Math.round(r + shimmer * 30);
    g = Math.round(g + shimmer * 25);
    b = Math.round(b + shimmer * 15);

    // Eyelash/Eyebrow arched crest (symbolic beauty arch)
    // Arch curve: y = cy - 0.2*h + (dx / (0.35*w))^2 * 0.15*h
    const archY = cy - 0.18 * h + Math.pow(dx / (0.32 * w), 2) * (0.12 * h);
    if (Math.abs(y - archY) < h * 0.025 && Math.abs(dx) < 0.32 * w) {
      // Gold Arch #EBDBC9 / #C5A880
      return [218, 185, 140, 255];
    }

    // Monogram 'AMS' center diamond / star sparkles
    // Center diamond mark
    const diamondDist = Math.abs(dx) + Math.abs(dy - (cy + 0.05 * h));
    if (diamondDist < 0.16 * w) {
      const goldRatio = 1 - diamondDist / (0.16 * w);
      return [
        Math.round(197 + 50 * goldRatio),
        Math.round(168 + 40 * goldRatio),
        Math.round(128 + 30 * goldRatio),
        255,
      ];
    }

    // Four subtle satellite sparkle points
    const starDist1 = Math.sqrt(Math.pow(dx - 0.22 * w, 2) + Math.pow(dy - (cy - 0.25 * h), 2));
    const starDist2 = Math.sqrt(Math.pow(dx + 0.22 * w, 2) + Math.pow(dy - (cy - 0.25 * h), 2));
    if (starDist1 < 0.04 * w || starDist2 < 0.04 * w) {
      return [235, 219, 201, 255];
    }
  }

  return [r, g, b, a];
}

// Generate PNG icons
console.log('Generating PWA icons...');
const png192 = createPNG(192, 192, drawLuxuryIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), png192);

const png512 = createPNG(512, 512, drawLuxuryIcon);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), png512);

const appleTouch = createPNG(180, 180, drawLuxuryIcon);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouch);

const maskable512 = createPNG(512, 512, (x, y, w, h) => {
  // Maskable requires full background coverage with safe margin (80%)
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  // Base dark luxury background
  let r = 36, g = 32, b = 33, a = 255;
  
  if (dist < 0.35 * w) {
    const archY = cy - 0.12 * h + Math.pow(dx / (0.26 * w), 2) * (0.08 * h);
    if (Math.abs(y - archY) < h * 0.02 && Math.abs(dx) < 0.26 * w) {
      return [218, 185, 140, 255];
    }
    const diamondDist = Math.abs(dx) + Math.abs(dy - (cy + 0.03 * h));
    if (diamondDist < 0.13 * w) {
      return [220, 190, 145, 255];
    }
  }
  return [r, g, b, a];
});
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-512.png'), maskable512);

// Copy favicon into /public/favicon.ico and /public/icons/favicon.png
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), createPNG(64, 64, drawLuxuryIcon));

// Also generate high quality vector SVG icons
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EBDBC9" />
      <stop offset="50%" stop-color="#C5A880" />
      <stop offset="100%" stop-color="#8C6D40" />
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2D2726" />
      <stop offset="100%" stop-color="#1B1716" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <!-- Background Container -->
  <rect width="512" height="512" rx="110" fill="url(#bgGrad)" />
  
  <!-- Outer Gold Rim -->
  <rect x="20" y="20" width="472" height="472" rx="90" fill="none" stroke="url(#goldGrad)" stroke-width="4" opacity="0.6" />
  
  <!-- Inner Circle Arch -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="8 6" opacity="0.4" />
  
  <!-- Stylized Brow & Eyelash Arch -->
  <path d="M 120,200 Q 256,120 392,200" fill="none" stroke="url(#goldGrad)" stroke-width="7" stroke-linecap="round" filter="url(#glow)" />
  <path d="M 160,220 Q 256,160 352,220" fill="none" stroke="url(#goldGrad)" stroke-width="3" stroke-linecap="round" opacity="0.8" />
  
  <!-- Central Luxury Monogram 'AMS' -->
  <text x="256" y="310" font-family="'Cinzel', 'Playfair Display', serif" font-size="78" font-weight="600" fill="url(#goldGrad)" text-anchor="middle" letter-spacing="6">AMS</text>
  
  <!-- Subtitle -->
  <text x="256" y="356" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="500" fill="#EBDBC9" text-anchor="middle" letter-spacing="8" opacity="0.9">STUDIO</text>
  
  <!-- Sparkles -->
  <path d="M 256,105 L 260,118 L 273,122 L 260,126 L 256,139 L 252,126 L 239,122 L 252,118 Z" fill="url(#goldGrad)" />
  <path d="M 140,290 L 143,298 L 151,301 L 143,304 L 140,312 L 137,304 L 129,301 L 137,298 Z" fill="url(#goldGrad)" opacity="0.8" />
  <path d="M 372,290 L 375,298 L 383,301 L 375,304 L 372,312 L 369,304 L 361,301 L 369,298 Z" fill="url(#goldGrad)" opacity="0.8" />
</svg>`;

fs.writeFileSync(path.join(iconsDir, 'icon.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'icon-192.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'icon-512.svg'), svgContent);
fs.writeFileSync(path.join(iconsDir, 'favicon.svg'), svgContent);

console.log('PWA icons successfully created in /public/icons!');
