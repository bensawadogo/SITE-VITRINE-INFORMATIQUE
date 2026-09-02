# optimiser-images-responsive.py — génère des variantes réduites (WebP) pour les
# cartes produits (affichées à ~180-300 px) et la photo boutique.
# Usage : python optimiser-images-responsive.py
import os
from PIL import Image

ROOT = r'C:\SITE-VITRINE-INFORMATIQUE'
PROD = os.path.join(ROOT, 'images', 'products')
BOU = os.path.join(ROOT, 'images')


def make_variant(src, prefix, target_w, quality=82):
    """Génère une version réduite (largueur cible) en WebP + JPEG."""
    try:
        im = Image.open(src).convert('RGB')
        w = target_w
        h = int(im.height * (w / im.width))
        im2 = im.resize((w, h), Image.LANCZOS)
        base_dir = os.path.dirname(src)
        name = os.path.splitext(os.path.basename(src))[0]
        out_webp = os.path.join(base_dir, name + prefix + '.webp')
        out_jpg = os.path.join(base_dir, name + prefix + '.jpg')
        im2.save(out_webp, 'WEBP', quality=quality, method=6)
        im2.save(out_jpg, 'JPEG', quality=quality, optimize=True, progressive=True)
        print(f'  {os.path.basename(out_webp)}  {im2.size}  {os.path.getsize(out_webp)/1024:.1f} Ko')
    except Exception as e:
        print(f'  ERREUR {src}: {e}')


print('=== VARIANTES PRODUITS (-400 : cartes, x2 mobile/tablette) ===')
for i in range(1, 9):
    make_variant(os.path.join(PROD, f'p{i}.webp'), '-400', 400)

print('=== VARIANTE BOUTIQUE (-440) ===')
make_variant(os.path.join(BOU, 'boutique.jpg'), '-440', 440, quality=80)

print('TERMINÉ')