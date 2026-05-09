# Aurora backup (before next refresh)

This file snapshots the current aurora-related styling so it can be restored quickly.

## Theme files in use

- `src/app/globals.css`
- `src/components/mobile/ThemeSheet.tsx`
- `src/lib/theme.tsx`

## Aurora CSS snapshot

```css
.theme-aurora {
  --background: #eef2ff;
  --foreground: #1f1b4d;
  --card: rgba(255, 255, 255, 0.55);
  --card-foreground: #1f1b4d;
  --popover: rgba(255, 255, 255, 0.68);
  --popover-foreground: #1e1b4b;
  --primary: #7c87ff;
  --primary-foreground: #ffffff;
  --secondary: rgba(224, 231, 255, 0.6);
  --secondary-foreground: #312e81;
  --muted: rgba(248, 250, 255, 0.55);
  --muted-foreground: #5b6b82;
  --accent: #ff73c7;
  --accent-foreground: #ffffff;
  --destructive: #ef4444;
  --border: rgba(255, 255, 255, 0.45);
  --input: rgba(255, 255, 255, 0.48);
  --ring: #8b93ff;
  --sidebar: rgba(243, 246, 255, 0.72);
  --sidebar-foreground: #1e1b4b;
  --sidebar-primary: #7c87ff;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: rgba(224, 231, 255, 0.6);
  --sidebar-accent-foreground: #312e81;
  --sidebar-border: rgba(255, 255, 255, 0.45);
  --sidebar-ring: #8b93ff;
  --radius: 1.25rem;
  background-color: #eef2ff !important;
  overflow-x: hidden;
  background-image:
    radial-gradient(circle at 12% 8%, rgba(124, 135, 255, 0.28) 0%, transparent 44%),
    radial-gradient(circle at 88% 12%, rgba(255, 115, 199, 0.25) 0%, transparent 45%),
    radial-gradient(circle at 52% 44%, rgba(103, 232, 249, 0.2) 0%, transparent 52%),
    radial-gradient(circle at 22% 90%, rgba(196, 181, 253, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 88%, rgba(129, 140, 248, 0.22) 0%, transparent 48%);
  background-repeat: no-repeat;
  background-size: 170% 170%;
  background-attachment: fixed;
}
```

