import json
import math
import os
from collections import Counter, defaultdict

import bpy
from mathutils import Matrix, Vector


OUT_DIR = r"C:\Users\DC\projects\rastislav web\renders"
GLB_PATH = os.path.join(OUT_DIR, "fiat_ducato_x290_lowpoly.glb")
ATLAS_PATH = os.path.join(OUT_DIR, "fiat_ducato_x290_atlas.png")

COLORS = {
    "body_white": (1.0, 1.0, 1.0, 1.0),
    "glass_black": (0.0, 0.0, 0.0, 1.0),
    "rubber_black": (0.006, 0.006, 0.007, 1.0),
    "plastic_dark": (0.055, 0.058, 0.062, 1.0),
    "deep_shadow": (0.0, 0.0, 0.0, 1.0),
    "rim_silver": (0.63, 0.65, 0.66, 1.0),
    "lamp_clear": (0.82, 0.86, 0.88, 1.0),
    "lamp_amber": (1.0, 0.48, 0.03, 1.0),
    "lamp_red": (0.92, 0.02, 0.015, 1.0),
    "panel_shadow": (0.20, 0.21, 0.22, 1.0),
    "badge_red": (0.78, 0.02, 0.02, 1.0),
    "cool_grey": (0.36, 0.38, 0.40, 1.0),
}

SWATCH = {
    "body_white": (0, 2),
    "glass_black": (1, 2),
    "rubber_black": (2, 2),
    "plastic_dark": (3, 2),
    "deep_shadow": (0, 1),
    "rim_silver": (1, 1),
    "lamp_clear": (2, 1),
    "lamp_amber": (3, 1),
    "lamp_red": (0, 0),
    "panel_shadow": (1, 0),
    "badge_red": (2, 0),
    "cool_grey": (3, 0),
}


def purge_generated_datablocks():
    prefixes = (
        "CHASSIS_BODY",
        "WHEEL_FL",
        "WHEEL_FR",
        "WHEEL_RL",
        "WHEEL_RR",
        "ducato_x290_atlas_material",
        "fiat_ducato_x290_single_color_atlas",
    )
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.images):
        for datablock in list(collection):
            if datablock.name.startswith(prefixes) and datablock.users == 0:
                collection.remove(datablock)


def make_atlas():
    os.makedirs(OUT_DIR, exist_ok=True)
    size = 1024
    image = bpy.data.images.new("fiat_ducato_x290_single_color_atlas", size, size, alpha=True)
    pixels = [0.0] * (size * size * 4)
    cell = size // 4
    for name, rgba in COLORS.items():
        sx, sy = SWATCH[name]
        for y in range(sy * cell, (sy + 1) * cell):
            for x in range(sx * cell, (sx + 1) * cell):
                idx = (y * size + x) * 4
                pixels[idx:idx + 4] = rgba
    image.pixels[:] = pixels
    image.filepath_raw = ATLAS_PATH
    image.file_format = "PNG"
    image.save()
    return image


def make_material(image):
    material = bpy.data.materials.new("ducato_x290_atlas_material")
    material.use_nodes = True
    nodes = material.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")
    tex = nodes.new(type="ShaderNodeTexImage")
    tex.image = image
    tex.interpolation = "Closest"
    material.node_tree.links.new(tex.outputs["Color"], bsdf.inputs["Base Color"])
    bsdf.inputs["Roughness"].default_value = 0.78
    bsdf.inputs["Metallic"].default_value = 0.0
    material.diffuse_color = (1, 1, 1, 1)
    return material


class MeshBuilder:
    def __init__(self, default_smooth=False):
        self.verts = []
        self.vert_map = {}
        self.faces = []
        self.face_colors = []
        self.face_smooth = []
        self.default_smooth = default_smooth

    def new_component(self):
        self.vert_map = {}

    def vert_index(self, point):
        key = tuple(round(float(v), 6) for v in point)
        if key not in self.vert_map:
            self.vert_map[key] = len(self.verts)
            self.verts.append(key)
        return self.vert_map[key]

    def add_face(self, points, color, smooth=None):
        self.faces.append(tuple(self.vert_index(p) for p in points))
        self.face_colors.append(color)
        self.face_smooth.append(self.default_smooth if smooth is None else smooth)

    def add_box(self, min_corner, max_corner, color, smooth=False):
        self.new_component()
        x0, x1 = sorted((min_corner[0], max_corner[0]))
        y0, y1 = sorted((min_corner[1], max_corner[1]))
        z0, z1 = sorted((min_corner[2], max_corner[2]))
        v = [
            (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
            (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
        ]
        for face in (
            (0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1),
            (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0),
        ):
            self.add_face([v[i] for i in face], color, smooth)

    def add_prism_x(self, x_front, x_back, yz_points, color, smooth=False):
        self.new_component()
        front = [(x_front, y, z) for y, z in yz_points]
        back = [(x_back, y, z) for y, z in reversed(yz_points)]
        self.add_face(front, color, smooth)
        self.add_face(back, color, smooth)
        n = len(yz_points)
        for i in range(n):
            j = (i + 1) % n
            self.add_face([front[i], front[j], (x_back, yz_points[j][0], yz_points[j][1]), (x_back, yz_points[i][0], yz_points[i][1])], color, smooth)

    def add_quad_prism(self, p0, p1, p2, p3, thickness, color, smooth=False):
        self.new_component()
        a, b, c, d = Vector(p0), Vector(p1), Vector(p2), Vector(p3)
        normal = (b - a).cross(c - a)
        if normal.length < 0.000001:
            return
        normal.normalize()
        offset = normal * thickness
        front = [a + offset, b + offset, c + offset, d + offset]
        back = [a, d, c, b]
        self.add_face([tuple(v) for v in front], color, smooth)
        self.add_face([tuple(v) for v in back], color, smooth)
        for q in ((front[0], back[3], back[0], front[1]), (front[1], back[0], back[1], front[2]),
                  (front[2], back[1], back[2], front[3]), (front[3], back[2], back[3], front[0])):
            self.add_face([tuple(v) for v in q], color, smooth)

    def add_ring_y(self, segments, profile, color, smooth=True, transform=None):
        self.new_component()
        rows = []
        for i in range(segments):
            angle = 2 * math.pi * i / segments
            ca, sa = math.cos(angle), math.sin(angle)
            row = []
            for y, radius in profile:
                point = Vector((radius * ca, y, radius * sa))
                if transform:
                    point = transform @ point
                row.append(tuple(point))
            rows.append(row)
        m = len(profile)
        for i in range(segments):
            j = (i + 1) % segments
            for k in range(m):
                l = (k + 1) % m
                self.add_face([rows[i][k], rows[j][k], rows[j][l], rows[i][l]], color, smooth)

    def add_cylinder_y(self, radius, width, segments, color, cap_color=None, smooth=True, y_center=0.0, transform=None):
        self.new_component()
        cap_color = cap_color or color
        y0, y1 = y_center - width / 2, y_center + width / 2
        left, right = [], []
        for i in range(segments):
            a = 2 * math.pi * i / segments
            p0 = Vector((radius * math.cos(a), y0, radius * math.sin(a)))
            p1 = Vector((radius * math.cos(a), y1, radius * math.sin(a)))
            if transform:
                p0 = transform @ p0
                p1 = transform @ p1
            left.append(tuple(p0))
            right.append(tuple(p1))
        for i in range(segments):
            j = (i + 1) % segments
            self.add_face([left[i], left[j], right[j], right[i]], color, smooth)
        self.add_face(list(reversed(left)), cap_color, False)
        self.add_face(right, cap_color, False)

    def build_object(self, name, material, location=(0, 0, 0)):
        mesh = bpy.data.meshes.new(name + "_mesh")
        mesh.from_pydata(self.verts, [], self.faces)
        mesh.update(calc_edges=True)
        mesh.materials.append(material)
        for poly, smooth in zip(mesh.polygons, self.face_smooth):
            poly.material_index = 0
            poly.use_smooth = smooth
        assign_uvs(mesh, self.face_colors)
        obj = bpy.data.objects.new(name, mesh)
        obj.location = location
        bpy.context.collection.objects.link(obj)
        bpy.ops.object.select_all(action="DESELECT")
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.mesh.normals_make_consistent(inside=False)
        bpy.ops.object.mode_set(mode="OBJECT")
        return obj


def assign_uvs(mesh, face_colors):
    uv_layer = mesh.uv_layers.new(name="non_overlapping_atlas_uv")
    counters = defaultdict(int)
    grid = 190
    margin = 0.003
    swatch = 1.0 / 4.0
    cell = (swatch - 2 * margin) / grid
    for poly, color in zip(mesh.polygons, face_colors):
        sx, sy = SWATCH[color]
        n = counters[color]
        counters[color] += 1
        cx = n % grid
        cy = (n // grid) % grid
        u0 = sx * swatch + margin + cx * cell
        v0 = sy * swatch + margin + cy * cell
        u1 = u0 + cell * 0.78
        v1 = v0 + cell * 0.78
        coords = [(u0, v0), (u1, v0), (u1, v1), (u0, v1)]
        if len(poly.loop_indices) == 3:
            coords = [(u0, v0), (u1, v0), ((u0 + u1) * 0.5, v1)]
        for loop_index, uv in zip(poly.loop_indices, coords):
            uv_layer.data[loop_index].uv = uv


def add_cab_and_cargo_hull(b):
    b.new_component()
    sections = [
        (-5.15, 0.66, 2.42, 1.035),
        (-4.55, 0.66, 2.55, 1.065),
        (-0.96, 0.66, 2.55, 1.065),
        (-0.22, 0.68, 2.38, 1.035),
        (0.62, 0.64, 1.92, 0.980),
        (1.08, 0.60, 1.56, 0.930),
    ]
    for i in range(len(sections) - 1):
        x0, zb0, zt0, w0 = sections[i]
        x1, zb1, zt1, w1 = sections[i + 1]
        b.add_face([(x0, -w0, zb0), (x1, -w1, zb1), (x1, -w1, zt1), (x0, -w0, zt0)], "body_white", False)
        b.add_face([(x1, w1, zb1), (x0, w0, zb0), (x0, w0, zt0), (x1, w1, zt1)], "body_white", False)
        b.add_face([(x0, -w0, zt0), (x1, -w1, zt1), (x1, w1, zt1), (x0, w0, zt0)], "body_white", True)
        b.add_face([(x0, w0, zb0), (x1, w1, zb1), (x1, -w1, zb1), (x0, -w0, zb0)], "body_white", False)
    x, zb, zt, w = sections[0]
    b.add_face([(x, -w, zb), (x, w, zb), (x, w, zt), (x, -w, zt)], "body_white", False)
    x, zb, zt, w = sections[-1]
    b.add_face([(x, w, zb), (x, -w, zb), (x, -w, zt), (x, w, zt)], "body_white", False)

    # Separate lower sill and bumper blocks with tiny gaps to avoid hidden intersections.
    b.add_box((-5.02, -1.085, 0.30), (0.86, 1.085, 0.64), "body_white")
    b.add_box((1.12, -1.03, 0.28), (1.34, 1.03, 0.62), "plastic_dark")
    b.add_box((-5.40, -1.02, 0.30), (-5.20, 1.02, 0.64), "plastic_dark")


def add_windows_and_rubber(b):
    # Glass plates are opaque and non-beveled, mounted inside rubber frame volumes.
    b.add_quad_prism((-0.76, -0.73, 2.36), (-0.05, -0.65, 2.20), (0.43, -0.58, 1.58), (-0.36, -0.72, 1.70), 0.017, "glass_black")
    b.add_quad_prism((-0.05, 0.65, 2.20), (-0.76, 0.73, 2.36), (-0.36, 0.72, 1.70), (0.43, 0.58, 1.58), 0.017, "glass_black")
    b.add_box((-0.83, -0.78, 2.30), (0.50, -0.74, 2.42), "rubber_black")
    b.add_box((-0.83, 0.74, 2.30), (0.50, 0.78, 2.42), "rubber_black")

    for side in (-1, 1):
        y = side * 1.075
        t = 0.020 * side
        b.add_quad_prism((-0.52, y, 1.46), (0.28, y, 1.37), (0.22, y, 2.12), (-0.66, y, 2.28), t, "glass_black")
        b.add_box((-0.62, y - 0.026 * side, 1.38), (0.34, y + 0.026 * side, 1.47), "rubber_black")
        b.add_box((-0.72, y - 0.026 * side, 2.21), (0.24, y + 0.026 * side, 2.31), "rubber_black")
        b.add_box((-0.74, y - 0.026 * side, 1.44), (-0.66, y + 0.026 * side, 2.28), "rubber_black")
        b.add_box((0.25, y - 0.026 * side, 1.38), (0.34, y + 0.026 * side, 2.12), "rubber_black")

        # Dual-segment commercial mirror: arm, upper casing, lower wide-angle casing.
        b.add_box((0.33, y + 0.01 * side, 1.54), (0.68, y + 0.32 * side, 1.62), "plastic_dark")
        b.add_box((0.61, y + 0.24 * side, 1.52), (0.88, y + 0.49 * side, 1.78), "plastic_dark")
        b.add_box((0.66, y + 0.28 * side, 1.31), (0.84, y + 0.45 * side, 1.49), "plastic_dark")

        # Protruding side impact molding and handles.
        b.add_box((-4.54, y - 0.035 * side, 1.04), (-1.32, y + 0.035 * side, 1.19), "plastic_dark")
        b.add_box((-1.23, y - 0.035 * side, 1.03), (-0.17, y + 0.035 * side, 1.18), "plastic_dark")
        b.add_box((-0.60, y - 0.040 * side, 1.24), (-0.29, y + 0.040 * side, 1.33), "plastic_dark")
        b.add_box((-3.92, y - 0.038 * side, 1.24), (-3.58, y + 0.038 * side, 1.33), "plastic_dark")
        # Fuel cap physical plate on the left cargo side.
        if side == 1:
            b.add_box((-3.12, y - 0.018, 1.42), (-2.78, y + 0.018, 1.76), "panel_shadow")


def add_panel_seams(b):
    # Slim shadow troughs approximate 15-20 mm recessed panel gaps.
    for side in (-1, 1):
        y = side * 1.092
        for x in (-4.92, -3.98, -1.12, -0.70, 0.32):
            b.add_box((x - 0.012, y - 0.018 * side, 0.70), (x + 0.012, y + 0.018 * side, 2.36), "deep_shadow")
        b.add_box((-4.88, y - 0.018 * side, 2.34), (-1.02, y + 0.018 * side, 2.37), "deep_shadow")
        b.add_box((-0.82, y - 0.018 * side, 1.34), (0.34, y + 0.018 * side, 1.37), "deep_shadow")

    # Hood perimeter, rear cargo split, and rear handle/lighting.
    b.add_box((0.18, -0.66, 1.63), (0.22, 0.66, 1.67), "deep_shadow")
    b.add_box((0.45, -0.72, 1.35), (0.49, 0.72, 1.39), "deep_shadow")
    b.add_box((-5.255, -0.014, 0.74), (-5.225, 0.014, 2.36), "deep_shadow")
    b.add_box((-5.27, -0.72, 1.25), (-5.22, -0.52, 1.38), "plastic_dark")
    b.add_box((-5.27, 0.52, 1.25), (-5.22, 0.72, 1.38), "plastic_dark")
    for side in (-1, 1):
        y0 = side * 0.78
        y1 = side * 0.99
        b.add_box((-5.30, y0, 0.88), (-5.23, y1, 1.22), "lamp_red")
        b.add_box((-5.305, y0, 1.22), (-5.23, y1, 1.38), "lamp_amber")


def add_front_fascia(b):
    # Recessed grille cavity, side walls, independent slats, and raised emblem.
    grille = [(-0.58, 0.90), (0.58, 0.90), (0.66, 1.44), (-0.66, 1.44)]
    b.add_prism_x(1.235, 1.115, grille, "deep_shadow")
    for z in (1.02, 1.18, 1.34):
        b.add_box((1.205, -0.57, z - 0.025), (1.255, 0.57, z + 0.028), "plastic_dark")
    b.add_box((1.255, -0.135, 1.15), (1.315, 0.135, 1.31), "rim_silver")
    b.add_box((1.318, -0.085, 1.18), (1.350, 0.085, 1.28), "badge_red")

    # Three-section bumper vents with real inset black cavities.
    b.add_prism_x(1.305, 1.205, [(-0.96, 0.42), (-0.45, 0.42), (-0.42, 0.66), (-0.92, 0.70)], "deep_shadow")
    b.add_prism_x(1.315, 1.205, [(-0.33, 0.38), (0.33, 0.38), (0.35, 0.66), (-0.35, 0.66)], "deep_shadow")
    b.add_prism_x(1.305, 1.205, [(0.45, 0.42), (0.96, 0.42), (0.92, 0.70), (0.42, 0.66)], "deep_shadow")

    # Aggressive narrow X290 headlight housings: black inset shell + raised clear lens.
    left_housing = [(-0.99, 1.28), (-0.58, 1.44), (-0.38, 1.34), (-0.86, 1.16)]
    right_housing = [(0.58, 1.44), (0.99, 1.28), (0.86, 1.16), (0.38, 1.34)]
    b.add_prism_x(1.255, 1.170, left_housing, "deep_shadow")
    b.add_prism_x(1.255, 1.170, right_housing, "deep_shadow")
    b.add_prism_x(1.285, 1.245, [(-0.94, 1.29), (-0.61, 1.40), (-0.46, 1.33), (-0.84, 1.21)], "lamp_clear")
    b.add_prism_x(1.285, 1.245, [(0.61, 1.40), (0.94, 1.29), (0.84, 1.21), (0.46, 1.33)], "lamp_clear")
    b.add_box((1.292, -0.98, 1.18), (1.330, -0.80, 1.24), "body_white")
    b.add_box((1.292, 0.80, 1.18), (1.330, 0.98, 1.24), "body_white")
    b.add_box((1.295, -0.52, 0.89), (1.340, -0.34, 1.03), "lamp_amber")
    b.add_box((1.295, 0.34, 0.89), (1.340, 0.52, 1.03), "lamp_amber")


def add_wheel_arches(b):
    for side in (-1, 1):
        y = side * 1.105
        t = 0.030 * side
        for cx in (0.0, -4.15):
            cz, inner, outer = 0.46, 0.49, 0.63
            segments = 24
            for i in range(segments):
                a0 = math.pi * i / segments
                a1 = math.pi * (i + 1) / segments
                p0 = (cx + outer * math.cos(a0), y, cz + outer * math.sin(a0))
                p1 = (cx + outer * math.cos(a1), y, cz + outer * math.sin(a1))
                p2 = (cx + inner * math.cos(a1), y, cz + inner * math.sin(a1))
                p3 = (cx + inner * math.cos(a0), y, cz + inner * math.sin(a0))
                b.add_quad_prism(p0, p1, p2, p3, t, "plastic_dark")


def make_body(material):
    b = MeshBuilder(default_smooth=False)
    add_cab_and_cargo_hull(b)
    add_windows_and_rubber(b)
    add_panel_seams(b)
    add_front_fascia(b)
    add_wheel_arches(b)
    return b.build_object("CHASSIS_BODY", material, (0, 0, 0))


def add_wheel_vent(builder, side, angle):
    r0, r1 = 0.145, 0.255
    half_width = 0.034
    y = side * 0.216
    radial = Vector((math.cos(angle), 0, math.sin(angle)))
    tangent = Vector((-math.sin(angle), 0, math.cos(angle)))
    pts = [
        radial * r0 - tangent * half_width + Vector((0, y, 0)),
        radial * r0 + tangent * half_width + Vector((0, y, 0)),
        radial * r1 + tangent * half_width * 0.62 + Vector((0, y, 0)),
        radial * r1 - tangent * half_width * 0.62 + Vector((0, y, 0)),
    ]
    builder.add_quad_prism(tuple(pts[0]), tuple(pts[1]), tuple(pts[2]), tuple(pts[3]), 0.016 * side, "deep_shadow")


def make_wheel(name, material, location):
    b = MeshBuilder(default_smooth=True)
    seg = 44
    # Tire is a closed ring with rounded sidewall profile, not a flat cylinder.
    tire_profile = [
        (-0.235, 0.315), (-0.205, 0.455), (-0.120, 0.500), (0.000, 0.515),
        (0.120, 0.500), (0.205, 0.455), (0.235, 0.315), (0.000, 0.305),
    ]
    b.add_ring_y(seg, tire_profile, "rubber_black", True)

    # Steel utility rim with concave dish on both sides.
    for side in (-1, 1):
        b.add_ring_y(seg, [(side * 0.222, 0.070), (side * 0.208, 0.175), (side * 0.180, 0.278), (side * 0.215, 0.305)], "rim_silver", False)
        b.add_cylinder_y(0.112, 0.055, 36, "rim_silver", "rim_silver", False, y_center=side * 0.242)
        b.add_cylinder_y(0.060, 0.068, 28, "cool_grey", "cool_grey", False, y_center=side * 0.275)
        for i in range(5):
            add_wheel_vent(b, side, 2 * math.pi * i / 5 + 0.16)
        # Five lug bosses around the hub.
        for i in range(5):
            angle = 2 * math.pi * i / 5
            x, z = 0.102 * math.cos(angle), 0.102 * math.sin(angle)
            transform = Matrix.Translation(Vector((x, 0, z)))
            b.add_cylinder_y(0.018, 0.018, 12, "panel_shadow", "panel_shadow", False, y_center=side * 0.315, transform=transform)
    return b.build_object(name, material, location)


def validate(objects):
    report = {
        "objects": {},
        "total_triangles": 0,
        "total_vertices": 0,
        "non_manifold_edges": 0,
        "expected_names": ["CHASSIS_BODY", "WHEEL_FL", "WHEEL_FR", "WHEEL_RL", "WHEEL_RR"],
    }
    for obj in objects:
        mesh = obj.data
        mesh.validate(verbose=False)
        mesh.update(calc_edges=True)
        mesh.calc_loop_triangles()
        edge_counts = Counter()
        for poly in mesh.polygons:
            verts = list(poly.vertices)
            for i, a in enumerate(verts):
                edge_counts[tuple(sorted((a, verts[(i + 1) % len(verts)])))] += 1
        non_manifold = sum(1 for count in edge_counts.values() if count != 2)
        tris = len(mesh.loop_triangles)
        verts = len(mesh.vertices)
        report["objects"][obj.name] = {
            "triangles": tris,
            "vertices": verts,
            "origin": [round(v, 5) for v in obj.location],
            "non_manifold_edges": non_manifold,
            "uv_layers": [uv.name for uv in mesh.uv_layers],
            "materials": [mat.name for mat in mesh.materials],
            "smooth_faces": sum(1 for p in mesh.polygons if p.use_smooth),
        }
        report["total_triangles"] += tris
        report["total_vertices"] += verts
        report["non_manifold_edges"] += non_manifold
    names = [obj.name for obj in objects]
    report["all_expected_names_present"] = names == report["expected_names"]
    report["triangle_budget_ok"] = 10000 <= report["total_triangles"] <= 12000
    report["global_pivot_ground_zero_between_front_wheels"] = [0, 0, 0]
    report["glb_path"] = GLB_PATH
    report["atlas_path"] = ATLAS_PATH
    return report


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    purge_generated_datablocks()

    image = make_atlas()
    material = make_material(image)

    body = make_body(material)
    # Global ground pivot is exactly below the front axle midpoint: x=0, y=0, z=0.
    wheel_fl = make_wheel("WHEEL_FL", material, (0.0, 1.18, 0.515))
    wheel_fr = make_wheel("WHEEL_FR", material, (0.0, -1.18, 0.515))
    wheel_rl = make_wheel("WHEEL_RL", material, (-4.15, 1.18, 0.515))
    wheel_rr = make_wheel("WHEEL_RR", material, (-4.15, -1.18, 0.515))
    objects = [body, wheel_fl, wheel_fr, wheel_rl, wheel_rr]

    bpy.ops.object.light_add(type="AREA", location=(-1.6, -4.8, 5.2))
    light = bpy.context.object
    light.name = "preview_area_light"
    light.data.energy = 520
    light.data.size = 5
    light.hide_render = True
    bpy.ops.object.camera_add(location=(3.7, -6.3, 2.8), rotation=(math.radians(65), 0, math.radians(35)))
    camera = bpy.context.object
    camera.name = "preview_camera"
    bpy.context.scene.camera = camera
    camera.hide_render = True

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.export_scene.gltf(
        filepath=GLB_PATH,
        export_format="GLB",
        use_selection=True,
        export_materials="EXPORT",
        export_apply=False,
    )

    print(json.dumps(validate(objects), indent=2))


main()
