#!/usr/bin/env python3
"""
optimize-images.py — shrink the photos of the website before you push to GitHub.

WHY: phone photos (PXL_2026….jpg, IMG_2026….jpeg) are 3–10 MB each and big PNGs are
even worse. On GitHub Pages every visitor has to download them, which is the #1 reason
the site feels slow. This script makes them ~10x smaller with no visible difference.

USE (once, inside the website folder):
    pip install pillow
    python optimize-images.py              # shrink in place (originals are saved in backup_originals/)
    python optimize-images.py --dry-run    # only show what would happen
    python optimize-images.py --convert-png   # ALSO turn big photo-like PNGs into .jpg and fix the
                                              # references in the .html/.css/.js files for you

Options:  --max 1600   longest side in pixels (hero/background images: --hero-max 2000)
          --quality 80 JPEG quality
"""
import argparse, os, re, shutil, sys
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is missing.  Run:  pip install pillow")

EXTS = {'.jpg', '.jpeg', '.png'}
SKIP_DIRS = {'backup_originals', '.git', 'node_modules', '__pycache__'}
HERO_HINTS = ('hero', 'banner', 'cover', 'bg', 'background', 'picsart')
MIN_BYTES = 120 * 1024          # leave small files alone


def human(n):
    for unit in ('B', 'KB', 'MB', 'GB'):
        if n < 1024 or unit == 'GB':
            return f'{n:.0f} {unit}' if unit == 'B' else f'{n:.1f} {unit}'
        n /= 1024


def has_alpha(im):
    return im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)


def find_images(root):
    for p in sorted(root.rglob('*')):
        if p.suffix.lower() in EXTS and not (set(p.relative_to(root).parts) & SKIP_DIRS):
            yield p


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('folder', nargs='?', default='.')
    ap.add_argument('--max', type=int, default=1600)
    ap.add_argument('--hero-max', type=int, default=2000)
    ap.add_argument('--quality', type=int, default=80)
    ap.add_argument('--convert-png', action='store_true', help='turn big, non-transparent PNG photos into JPG and update references')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--no-backup', action='store_true')
    a = ap.parse_args()

    root = Path(a.folder).resolve()
    backup = root / 'backup_originals'
    renamed = {}                      # old file name -> new file name (for --convert-png)
    before_total = after_total = 0
    rows = []

    for path in find_images(root):
        size = path.stat().st_size
        try:
            with Image.open(path) as im:
                im.load()
                img = ImageOps.exif_transpose(im)        # phone photos: bake in the rotation
                w, h = img.size
                alpha = has_alpha(img)
                limit = a.hero_max if any(k in path.name.lower() for k in HERO_HINTS) else a.max
                too_big = max(w, h) > limit
                if size < MIN_BYTES and not too_big:
                    continue

                out_img = img
                if too_big:
                    s = limit / max(w, h)
                    out_img = img.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)

                is_png = path.suffix.lower() == '.png'
                target = path
                tmp = path.with_suffix(path.suffix + '.tmp')

                if is_png and not alpha and a.convert_png and size > 200 * 1024:
                    target = path.with_suffix('.jpg')
                    if target.exists() and target != path:
                        rows.append((path.name, size, size, 'skipped (a .jpg with that name already exists)'))
                        continue
                    tmp = target.with_suffix('.jpg.tmp')
                    out_img.convert('RGB').save(tmp, 'JPEG', quality=a.quality, optimize=True, progressive=True)
                elif is_png:
                    out_img.save(tmp, 'PNG', optimize=True)
                else:
                    out_img.convert('RGB').save(tmp, 'JPEG', quality=a.quality, optimize=True, progressive=True)
        except Exception as e:
            rows.append((path.name, size, size, f'skipped ({e})'))
            continue

        new_size = tmp.stat().st_size
        note = f'{w}x{h}' + (f' -> {out_img.size[0]}x{out_img.size[1]}' if too_big else '')
        if target != path:
            note += '  [PNG -> JPG]'
        if new_size >= size and target == path:
            tmp.unlink()
            rows.append((path.name, size, size, 'already small enough'))
            continue

        before_total += size
        after_total += new_size
        rows.append((path.name if target == path else f'{path.name} -> {target.name}', size, new_size, note))
        if a.dry_run:
            tmp.unlink()
            continue
        if not a.no_backup:
            dest = backup / path.relative_to(root)
            dest.parent.mkdir(parents=True, exist_ok=True)
            if not dest.exists():
                shutil.copy2(path, dest)
        if target != path:
            path.unlink()
            renamed[path.name] = target.name
        tmp.replace(target)

    # fix references after PNG -> JPG renames
    if renamed and not a.dry_run:
        fixed = 0
        for f in list(root.rglob('*.html')) + list(root.rglob('*.css')) + list(root.rglob('*.js')):
            if set(f.relative_to(root).parts) & SKIP_DIRS:
                continue
            text = f.read_text(encoding='utf-8')
            new = text
            for old, newname in renamed.items():
                new = re.sub(re.escape(old), newname, new)
            if new != text:
                f.write_text(new, encoding='utf-8')
                fixed += 1
        print(f'\nUpdated image names inside {fixed} file(s).')

    print()
    width = max([len(r[0]) for r in rows] + [10])
    for name, b, n, note in rows:
        print(f'{name:<{width}}  {human(b):>9} -> {human(n):>9}   {note}')
    if before_total:
        saved = before_total - after_total
        print(f'\nTotal: {human(before_total)} -> {human(after_total)}   (saved {human(saved)}, {saved * 100 // before_total}%)')
        if a.dry_run:
            print('(dry run: nothing was changed)')
        elif not a.no_backup:
            print('Originals are kept in backup_originals/  — do NOT push that folder to GitHub (add it to .gitignore).')
    else:
        print('Nothing to optimise — your images are already small.')


if __name__ == '__main__':
    main()
