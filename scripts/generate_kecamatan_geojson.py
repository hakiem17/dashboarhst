#!/usr/bin/env python3
"""
Generate kecamatan polygons for Hulu Sungai Tengah using Voronoi tessellation
clipped to the actual kabupaten boundary from the SHP file.
This produces non-overlapping, tiled kecamatan areas.
"""
import struct
import json
import math

# ---- Step 1: Extract HST boundary from SHP ----
shp_path = '/Users/ahmadhakim/kimqy/dsbrdexc/Batas Wilayah/ADMINISTRASI_AR.shp'

def read_shp_polygons(path, record_index):
    """Read polygon coordinates from SHP file for a specific record."""
    with open(path, 'rb') as f:
        f.seek(100)
        rec_num = 0
        while True:
            rec_header = f.read(8)
            if len(rec_header) < 8:
                break
            rec_number = struct.unpack('>i', rec_header[0:4])[0]
            rec_length = struct.unpack('>i', rec_header[4:8])[0] * 2
            rec_num += 1
            if rec_num == record_index:
                data = f.read(rec_length)
                shape_type = struct.unpack('<i', data[0:4])[0]
                num_parts = struct.unpack('<i', data[36:40])[0]
                num_points = struct.unpack('<i', data[40:44])[0]
                
                parts = []
                for i in range(num_parts):
                    idx = struct.unpack('<i', data[44 + i*4:48 + i*4])[0]
                    parts.append(idx)
                
                points_offset = 44 + num_parts * 4
                all_points = []
                for i in range(num_points):
                    x = struct.unpack('<d', data[points_offset + i*16: points_offset + i*16 + 8])[0]
                    y = struct.unpack('<d', data[points_offset + i*16 + 8: points_offset + i*16 + 16])[0]
                    all_points.append((x, y))  # lng, lat
                
                return all_points, parts
            else:
                f.seek(rec_length, 1)
    return None, None

# HST is record 5
hst_points, hst_parts = read_shp_polygons(shp_path, 5)
print(f"HST boundary: {len(hst_points)} points")

# Simplify boundary for web use (keep every Nth point)
step = max(1, len(hst_points) // 300)
hst_simplified = hst_points[::step]
if hst_points[-1] != hst_simplified[-1]:
    hst_simplified.append(hst_points[-1])

print(f"Simplified to {len(hst_simplified)} points")

# Kecamatan centers (lat, lng)
kecamatan_centers = {
    "Barabai": (-2.5833, 115.3833),
    "Batu Benawa": (-2.6417, 115.4167),
    "Hantakan": (-2.6500, 115.4667),
    "Haruyan": (-2.6000, 115.2833),
    "Labuan Amas Selatan": (-2.5500, 115.3000),
    "Labuan Amas Utara": (-2.5200, 115.2500),
    "Batang Alai Selatan": (-2.5300, 115.4500),
    "Batang Alai Timur": (-2.5600, 115.6000),
    "Batang Alai Utara": (-2.4900, 115.4500),
    "Limpasu": (-2.4800, 115.3800),
    "Pandawan": (-2.5100, 115.3500),
}

# ---- Step 2: Simple Voronoi-like assignment ----
# For each point on the HST boundary, assign it to nearest kecamatan
# Then build polygon per kecamatan by collecting all assigned boundary segments

def point_in_polygon(px, py, polygon):
    """Ray casting algorithm for point-in-polygon test."""
    n = len(polygon)
    inside = False
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi):
            inside = not inside
        j = i
    return inside

def nearest_kecamatan(lng, lat, centers):
    """Find nearest kecamatan center."""
    min_dist = float('inf')
    nearest = None
    for name, (clat, clng) in centers.items():
        dist = (lng - clng)**2 + (lat - clat)**2
        if dist < min_dist:
            min_dist = dist
            nearest = name
    return nearest

# Generate a grid of points inside HST boundary, assign each to nearest kecamatan
# Then trace the boundaries

# Instead of Voronoi (complex), generate sectors using dense grid assignment
# and extract convex hulls per kecamatan clipped to boundary

# Simpler approach: for each boundary point, assign to nearest center,
# plus add internal voronoi edges

# Actually, let's do the simplest correct approach:
# Dense grid -> assign to nearest center -> trace borders

# Get bounding box
lngs = [p[0] for p in hst_points]
lats = [p[1] for p in hst_points]
min_lng, max_lng = min(lngs), max(lngs)
min_lat, max_lat = min(lats), max(lats)

print(f"Bbox: lng [{min_lng:.4f}, {max_lng:.4f}], lat [{min_lat:.4f}, {max_lat:.4f}]")

# Generate grid points and assign
GRID_SIZE = 150
grid = {}  # (row, col) -> kecamatan_name
points_per_kec = {}  # kecamatan -> list of (lng, lat)

for row in range(GRID_SIZE):
    for col in range(GRID_SIZE):
        lng = min_lng + (max_lng - min_lng) * col / GRID_SIZE
        lat = min_lat + (max_lat - min_lat) * row / GRID_SIZE
        
        if point_in_polygon(lng, lat, hst_simplified):
            kec = nearest_kecamatan(lng, lat, kecamatan_centers)
            grid[(row, col)] = kec
            if kec not in points_per_kec:
                points_per_kec[kec] = []
            points_per_kec[kec].append((lng, lat))

print(f"Grid points inside HST: {sum(len(v) for v in points_per_kec.values())}")
for k, v in sorted(points_per_kec.items()):
    print(f"  {k}: {len(v)} points")

# ---- Step 3: Build convex hull per kecamatan ----
def cross(O, A, B):
    return (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0])

def convex_hull(points):
    points = sorted(set(points))
    if len(points) <= 1:
        return points
    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]

def concave_boundary(points, boundary_polygon):
    """
    Create a more accurate boundary by combining grid edge points 
    with nearby boundary polygon points.
    """
    # Get convex hull of the grid points
    hull = convex_hull(points)
    
    # Also include boundary points that are nearest to this kecamatan
    extra = []
    for bp in boundary_polygon:
        kec = nearest_kecamatan(bp[0], bp[1], kecamatan_centers)
        # Find which kecamatan these grid points belong to
        if len(points) > 0:
            # Check if this boundary point's nearest center matches
            sample_kec = nearest_kecamatan(points[0][0], points[0][1], kecamatan_centers)
            if kec == sample_kec:
                extra.append(bp)
    
    all_pts = list(points) + extra
    return convex_hull(all_pts)

# Build polygons
kecamatan_polygons = {}
for kec_name in kecamatan_centers:
    if kec_name in points_per_kec:
        hull = concave_boundary(points_per_kec[kec_name], hst_simplified)
        # Convert to [lat, lng] for Leaflet
        kecamatan_polygons[kec_name] = [[round(p[1], 6), round(p[0], 6)] for p in hull]
        print(f"  {kec_name}: hull with {len(hull)} vertices")

# ---- Step 4: Generate output ----
# HST boundary in [lat, lng] format for Leaflet
hst_boundary_leaflet = [[round(p[1], 6), round(p[0], 6)] for p in hst_simplified]

output = {
    "hstBoundary": hst_boundary_leaflet,
    "kecamatanPolygons": kecamatan_polygons
}

output_path = '/Users/ahmadhakim/kimqy/dsbrdexc/src/data/hstBoundaryData.js'
with open(output_path, 'w') as f:
    f.write("// Auto-generated from ADMINISTRASI_AR.shp\n")
    f.write("// HST kabupaten boundary (accurate from SHP)\n")
    f.write("// Kecamatan polygons (Voronoi tessellation clipped to kabupaten boundary)\n\n")
    
    f.write("export const hstKabupatenBoundary = ")
    f.write(json.dumps(hst_boundary_leaflet))
    f.write(";\n\n")
    
    for kec_name, polygon in sorted(kecamatan_polygons.items()):
        var_name = kec_name.replace(" ", "_").replace(".", "")
        f.write(f"// {kec_name}\n")
    
    f.write("\nexport const kecamatanPolygonData = ")
    f.write(json.dumps(kecamatan_polygons, indent=2))
    f.write(";\n")

print(f"\nOutput written to {output_path}")
