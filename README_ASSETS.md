# 🎨 Azora OS Premium Marketing Assets

## Quick Start

Premium marketing assets are fully integrated and ready to use!

### Using Logos in Components

```tsx
import { Logo } from '@/components/logo';

// Simple usage
<Logo service="azora-os" />

// With custom styling
<Logo 
  service="aegis" 
  style="geometric"
  size="large"
  width={256}
  height={256}
  priority
/>
```

### Getting Service Information

```tsx
import { getService, SERVICES } from '@/lib/assets';

// Get specific service
const aegis = getService('aegis');
console.log(aegis?.name); // "Azora Aegis"
console.log(aegis?.tagline); // "Global Genesis Protocol"
```

---

## 📂 Asset Locations

- **Web Assets**: `public/images/logos/premium/` and `public/images/icons/`
- **Source Assets**: `marketing/premium/`
- **Components**: `components/logo.tsx`
- **Configuration**: `lib/assets.ts`

---

## 📖 Full Documentation

See `docs/ASSET_INTEGRATION.md` for complete integration guide.

---

**Status**: ✅ Ready to Use

