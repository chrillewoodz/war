# Get center of polygon

``` typescript
const selectedConnectionElement = this.cache.mapElement.querySelector(`[data-areaId="${selectedConnection.areaId}"]`);
const bbox = (selectedConnectionElement as SVGSVGElement).getBBox();

const centerOfPolygon = {
  x: bbox.x,
  y: bbox.y,
};
```