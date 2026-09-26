# Cuts design/theme-sheet.webp into transparent 2x WebP ornaments in src/assets/theme.
# Crop boxes (ASSETS) are in sheet pixels; scale them if you regenerate the sheet at another size.
# Usage: python3 scripts/extract-theme.py [sheet.webp]   (needs Pillow + NumPy)
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
import os
import sys
F=sys.argv[1] if len(sys.argv)>1 else 'design/theme-sheet.webp'
OUT='src/assets/theme'; os.makedirs(OUT,exist_ok=True)
a=np.array(Image.open(F).convert('RGB')).astype(np.float32)
H,W,_=a.shape
bg=np.array([247,242,231],np.float32)
dist=np.sqrt(((a-bg)**2).sum(-1))

# 1) Background mask on a lightly blurred copy (suppresses compression noise).
blur=np.array(Image.open(F).convert('RGB').filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32)
dblur=np.sqrt(((blur-bg)**2).sum(-1))
near=(dblur<20)
# Label every near-cream region; those touching the border or smaller than POCKET px are background.
POCKET=60000
dbl=dblur.tolist(); nb=near.tolist(); seen=[[False]*W for _ in range(H)]; bgmask=np.zeros((H,W),bool)
for sy in range(H):
  row=nb[sy]
  for sx in range(W):
    if row[sx] and not seen[sy][sx]:
      seen[sy][sx]=True; q=deque([(sy,sx)]); pts=[]; edge=False; tot=0.0
      while q:
        y,x=q.popleft(); pts.append((y,x)); tot+=dbl[y][x]
        if y==0 or x==0 or y==H-1 or x==W-1: edge=True
        for ny,nx in ((y+1,x),(y-1,x),(y,x+1),(y,x-1)):
          if 0<=ny<H and 0<=nx<W and nb[ny][nx] and not seen[ny][nx]:
            seen[ny][nx]=True; q.append((ny,nx))
      # Enclosed pockets must be true paper colour (pale petals average further from it).
      if edge or (len(pts)<POCKET and tot/len(pts)<7):
        ys,xs=zip(*pts); bgmask[list(ys),list(xs)]=True

# 1b) Eat the bright glow ring: grow background up to 4px into adjacent pixels at/above paper brightness.
lum=a@np.array([.299,.587,.114],np.float32); bglum=float(bg@np.array([.299,.587,.114]))
glow=(lum>=bglum-6)
for _ in range(4):
  p=np.pad(bgmask,1); grown=p[:-2,1:-1]|p[2:,1:-1]|p[1:-1,:-2]|p[1:-1,2:]
  bgmask=bgmask|(grown&glow)

# 2) Soft alpha: opaque off-background; inside background, ramp by colour distance for anti-aliased edges.
# Edge pixels at or above paper brightness are glow, not ink.
alpha=np.where(bgmask, np.clip((dist-8)/14,0,1)*np.clip((dblur-6)/10,0,1)*np.clip((bglum-lum-2)/10,0,1), 1.0)
# Drop isolated specks: opaque pixels with little opaque neighbourhood.
op=(alpha>0.5).astype(np.int32); K=9; c=np.pad(op,K//2).cumsum(0).cumsum(1); c=np.pad(c,((1,0),(1,0)))
cnt=c[K:,K:]-c[:-K,K:]-c[K:,:-K]+c[:-K,:-K]
alpha=np.where(cnt<12,0,alpha)
# 3) Un-mix the cream from semi-transparent edge pixels (removes the halo).
al=np.maximum(alpha,1e-3)[...,None]
rgb=np.clip((a-(1-al)*bg)/al,0,255)

# 4) Component labels (coarse) so overlapping crops only keep their own element.
fg=~bgmask
S=4; small=fg.reshape(H//S,S,W//S,S).any(axis=(1,3))
d=small.copy()
for _ in range(2):
  p=np.pad(d,1); d=p[1:-1,1:-1]|p[:-2,1:-1]|p[2:,1:-1]|p[1:-1,:-2]|p[1:-1,2:]
h,w=d.shape; lab=np.zeros((h,w),int); n=0
for y in range(h):
  for x in range(w):
    if d[y,x] and not lab[y,x]:
      n+=1; qq=deque([(y,x)]); lab[y,x]=n
      while qq:
        cy,cx=qq.popleft()
        for ny,nx in ((cy+1,cx),(cy-1,cx),(cy,cx+1),(cy,cx-1)):
          if 0<=ny<h and 0<=nx<w and d[ny,nx] and not lab[ny,nx]: lab[ny,nx]=n; qq.append((ny,nx))
labfull=np.repeat(np.repeat(lab,S,0),S,1)

ASSETS={ # name: (x0,y0,x1,y1)
 'frame-pink':(12,8,368,528),'crest-lotus':(420,44,524,120),'frame-maroon':(592,30,866,544),
 'garland-lotus':(866,0,1022,475),'ganesh-maroon':(376,128,572,428),'ganesh-medallion':(336,484,608,776),
 'garland-blossom':(856,500,1012,896),'lotus-bouquet':(16,552,328,796),'ganesh-gold':(632,556,788,844),
 'lantern-1':(24,772,108,1076),'lantern-2':(96,800,180,1132),'paisley':(228,768,344,960),
 'paisley-small':(348,836,420,948),'diya':(444,804,576,976),'divider-lotus':(596,864,828,934),
 'lotus-small':(640,934,780,996),'blossom-branch':(816,872,1004,1108),'clouds':(172,968,668,1076),
 'corner-left':(28,1076,258,1374),'garland-swag':(156,1056,528,1208),'blossom-sprig':(568,1040,740,1232),
 'lotus-bloom':(748,1080,936,1252),'drop-1':(940,1136,1004,1320),'lotus-bud':(180,1196,284,1316),
 'mandala':(304,1208,468,1372),'drop-2':(484,1204,556,1372),'tile':(564,1236,676,1348),
 'lotus-pond':(688,1252,908,1396),'corner-right':(720,1316,1002,1506),'border':(20,1388,440,1488),
}
rgba=np.dstack([rgb,alpha*255]).astype(np.uint8)
for name,(x0,y0,x1,y1) in ASSETS.items():
  crop=rgba[y0:y1,x0:x1].copy()
  L=labfull[y0:y1,x0:x1]
  ids,counts=np.unique(L[(L>0)&(crop[...,3]>200)],return_counts=True)
  mine=ids[np.argmax(counts)]
  keep=(L==mine)
  crop[...,3]=np.where(keep,crop[...,3],0)
  # trim to content
  ys,xs=np.where(crop[...,3]>8); crop=crop[max(ys.min()-2,0):ys.max()+3, max(xs.min()-2,0):xs.max()+3]
  im=Image.fromarray(crop)
  big=im.resize((im.width*2,im.height*2),Image.LANCZOS)
  r,g,b,al_=big.split()
  rgbim=Image.merge('RGB',(r,g,b)).filter(ImageFilter.UnsharpMask(radius=1.6,percent=70,threshold=2))
  big=Image.merge('RGBA',(*rgbim.split(),al_))
  big.save(f'{OUT}/{name}.webp','WEBP',quality=92,method=6)
  print(f'{name:18s} {big.size}')
