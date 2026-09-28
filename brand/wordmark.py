# Outline "Kyle Tse" from Geist (SIL OFL 1.1) at weight 620 into one SVG path.
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
f = TTFont(sys.argv[3] if len(sys.argv) > 3 else 'Geist-Variable.woff2')
f = instantiateVariableFont(f, {'wght': float(sys.argv[2]) if len(sys.argv)>2 else 620})
text = sys.argv[1] if len(sys.argv)>1 else 'Kyle Tse'
cmap = f.getBestCmap(); gs = f.getGlyphSet(); hmtx = f['hmtx']
upm = f['head'].unitsPerEm
kern = {}
x = 0; parts=[]
pen = SVGPathPen(gs)
track = -0.02*upm
for ch in text:
    g = cmap[ord(ch)]
    tp = TransformPen(pen, (1,0,0,-1,x,0))
    gs[g].draw(tp)
    x += hmtx[g][0] + track
bp = BoundsPen(gs)
x2=0
for ch in text:
    g=cmap[ord(ch)]; gs[g].draw(TransformPen(bp,(1,0,0,-1,x2,0))); x2+=hmtx[g][0]+track
xmin,ymin,xmax,ymax = bp.bounds
print(f"{xmin} {ymin} {xmax} {ymax} {upm}", file=sys.stderr)
print(pen.getCommands())
