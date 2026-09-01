"""Optimiseur de logos — AGO Tech Company SARL
Usage : python optimiser-logos.py

Régénère les logos dans assets/images :
  - PNG quantifié (palette 256 couleurs, sans dithering -> logos nets, poids divisé par ~3)
  - WebP pleine résolution qualité 90 (méthode de compression maximale)
  - WebP 200px pour mobile 1x (footer 90px / header 140px affichés -> 200px couvre le retina 1.4x)

Nécessite Pillow : pip install pillow
"""
import os
from PIL import Image

BASE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(BASE, 'assets', 'images')


def taille_ko(path):
    return os.path.getsize(path) / 1024


def process(stem, sizes=(200,)):
    src_path = os.path.join(ASSETS, f'{stem}.png')
    avant = taille_ko(src_path)
    src = Image.open(src_path).convert('RGBA')

    # 1) PNG optimisé : quantification 256 couleurs, dithering désactivé (logos plats = contours nets)
    src.quantize(256, method=Image.Quantize.FASTOCTREE,
                 dither=Image.Dither.NONE).save(src_path, optimize=True)

    # 2) WebP pleine résolution, qualité 90 + effort de compression max
    src.save(os.path.join(ASSETS, f'{stem}.webp'), 'WEBP', quality=90, method=6)

    # 3) Déclinaisons mobiles (largeurs fixes, ratio préservé, rééchantillonnage Lanczos)
    for w in sizes:
        h = round(src.height * w / src.width)
        small = src.resize((w, h), Image.LANCZOS)
        small.save(os.path.join(ASSETS, f'{stem}-{w}.webp'), 'WEBP', quality=88, method=6)

    apres = taille_ko(src_path)
    print(f'{stem}.png   : {avant:6.1f} Ko -> {apres:6.1f} Ko  (-{100*(1-apres/avant):.0f}%)')
    print(f'{stem}.webp  : {taille_ko(os.path.join(ASSETS, stem + ".webp")):6.1f} Ko  (400px, q90)')
    for w in sizes:
        print(f'{stem}-{w}.webp : {taille_ko(os.path.join(ASSETS, f"{stem}-{w}.webp")):6.1f} Ko  ({w}px, mobile)')


if __name__ == '__main__':
    print('=== Optimisation des logos AGO ===')
    process('logo_ago')        # header (fond clair)
    process('logo_ago_white')  # footer (fond sombre)
    print('Terminé.')
