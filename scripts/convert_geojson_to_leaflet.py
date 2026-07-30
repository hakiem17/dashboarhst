import json

with open('/Users/ahmadhakim/kimqy/dsbrdexc/src/data/hstGeoJson.json', 'r') as f:
    geojson = json.load(f)

kecamatan_polygons = {}
kabupaten_boundary = []

name_map = {
    'BARABAI': 'Barabai',
    'BATU BENAWA': 'Batu Benawa',
    'HANTAKAN': 'Hantakan',
    'HARUYAN': 'Haruyan',
    'LABUAN AMAS SELATAN': 'Labuan Amas Selatan',
    'LABUAN AMAS UTARA': 'Labuan Amas Utara',
    'BATANG ALAI SELATAN': 'Batang Alai Selatan',
    'BATANG ALAI TIMUR': 'Batang Alai Timur',
    'BATANG ALAI UTARA': 'Batang Alai Utara',
    'LIMPASU': 'Limpasu',
    'PANDAWAN': 'Pandawan'
}

for feature in geojson.get('features', []):
    raw_name = feature.get('properties', {}).get('nama', '').upper()
    title_name = name_map.get(raw_name, raw_name.title())
    
    geom = feature.get('geometry', {})
    gtype = geom.get('type')
    coords = geom.get('coordinates', [])
    
    if gtype == 'Polygon':
        ring = coords[0]
        lat_lng_ring = [[round(pt[1], 6), round(pt[0], 6)] for pt in ring]
        kecamatan_polygons[title_name] = lat_lng_ring
        # Collect outer boundary points
        kabupaten_boundary.extend(lat_lng_ring[::3])
    elif gtype == 'MultiPolygon':
        multi_rings = []
        for poly in coords:
            ring = poly[0]
            lat_lng_ring = [[round(pt[1], 6), round(pt[0], 6)] for pt in ring]
            multi_rings.append(lat_lng_ring)
            kabupaten_boundary.extend(lat_lng_ring[::3])
        kecamatan_polygons[title_name] = multi_rings

# Generate hstBoundaryData.js
with open('/Users/ahmadhakim/kimqy/dsbrdexc/src/data/hstBoundaryData.js', 'w') as f:
    f.write("// Official Real GeoJSON Boundaries from murakatadigi.cloud\n\n")
    f.write("export const hstKabupatenBoundary = ")
    f.write(json.dumps(kabupaten_boundary[:200]))
    f.write(";\n\n")
    f.write("export const kecamatanPolygonData = ")
    f.write(json.dumps(kecamatan_polygons, indent=2))
    f.write(";\n\n")
    f.write("export const hstGeoJsonData = ")
    f.write(json.dumps(geojson, indent=2))
    f.write(";\n")

print("Generated hstBoundaryData.js successfully with hstKabupatenBoundary export!")
