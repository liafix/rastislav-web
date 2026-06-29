import json
import math
import os
from collections import Counter

import bpy
from mathutils import Vector


WORKSPACE = r"C:\Users\DC\projects\rastislav web"
RENDER_PATH = os.path.join(WORKSPACE, "ducato_render.png")
GLB_PATH = os.path.join(WORKSPACE, "ducato_optimized.glb")


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    for collection in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.lights, bpy.data.cameras):
        for datablock in list(collection):
            if datablock.users == 0:
                collection.remove(datablock)


def set_input(node, names, value):
    for name in names:
        if name in node.inputs:
            node.inputs[name].default_value = value
            return True
    return False


def make_pbr_material(name, color, roughness, metallic, specular=None):
    material = bpy.data.materials.new(name)
    material.use_nodes = True
    material.diffuse_color = color
    bsdf = material.node_tree.nodes.get("Principled BSDF")
    if bsdf:
        set_input(bsdf, ("Base Color",), color)
        set_input(bsdf, ("Roughness",), roughness)
        set_input(bsdf, ("Metallic",), metallic)
        if specular is not None:
            set_input(bsdf, ("Specular IOR Level", "Specular", "Specular Tint"), specular)
    return material


class MeshBuilder:
    def __init__(self, materials):
        self.verts = []
        self.faces = []
        self.mat_names = []
        self.smooth = []
        self.vert_map = {}
        self.materials = materials

    def new_component(self):
        self.vert_map = {}

    def vi(self, point):
        key = tuple(round(float(v), 6) for v in point)
        if key not in self.vert_map:
            self.vert_map[key] = len(self.verts)
            self.verts.append(key)
        return self.vert_map[key]

    def face(self, pts, mat_name, smooth=False):
        self.faces.append(tuple(self.vi(p) for p in pts))
        self.mat_names.append(mat_name)
        self.smooth.append(smooth)

    def box(self, mn, mx, mat_name, smooth=False):
        self.new_component()
        x0, x1 = sorted((mn[0], mx[0]))
        y0, y1 = sorted((mn[1], mx[1]))
        z0, z1 = sorted((mn[2], mx[2]))
        v = [
            (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
            (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
        ]
        for idxs in ((0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)):
            self.face([v[i] for i in idxs], mat_name, smooth)

    def quad_prism(self, p0, p1, p2, p3, thickness, mat_name, smooth=False):
        self.new_component()
        a, b, c, d = Vector(p0), Vector(p1), Vector(p2), Vector(p3)
        normal = (b - a).cross(c - a)
        if normal.length < 0.000001:
            return
        normal.normalize()
        o = normal * thickness
        front = [a + o, b + o, c + o, d + o]
        back = [a, d, c, b]
        self.face([tuple(v) for v in front], mat_name, smooth)
        self.face([tuple(v) for v in back], mat_name, smooth)
        for side in ((front[0], back[3], back[0], front[1]), (front[1], back[0], back[1], front[2]), (front[2], back[1], back[2], front[3]), (front[3], back[2], back[3], front[0])):
            self.face([tuple(v) for v in side], mat_name, smooth)

    def prism_x(self, x_front, x_back, yz_points, mat_name, smooth=False):
        self.new_component()
        front = [(x_front, y, z) for y, z in yz_points]
        back = [(x_back, y, z) for y, z in reversed(yz_points)]
        self.face(front, mat_name, smooth)
        self.face(back, mat_name, smooth)
        n = len(yz_points)
        for i in range(n):
            j = (i + 1) % n
            self.face([front[i], front[j], (x_back, yz_points[j][0], yz_points[j][1]), (x_back, yz_points[i][0], yz_points[i][1])], mat_name, smooth)

    def ring_y(self, segments, profile, mat_name, smooth=True):
        self.new_component()
        rows = []
        for i in range(segments):
            a = 2.0 * math.pi * i / segments
            ca, sa = math.cos(a), math.sin(a)
            row = []
            for y, r in profile:
                row.append((r * ca, y, r * sa))
            rows.append(row)
        m = len(profile)
        for i in range(segments):
            j = (i + 1) % segments
            for k in range(m):
                l = (k + 1) % m
                self.face([rows[i][k], rows[j][k], rows[j][l], rows[i][l]], mat_name, smooth)

    def cylinder_y(self, radius, width, segments, mat_name, cap_mat=None, smooth=True, y_center=0):
        self.new_component()
        cap_mat = cap_mat or mat_name
        y0, y1 = y_center - width / 2, y_center + width / 2
        left, right = [], []
        for i in range(segments):
            a = 2.0 * math.pi * i / segments
            left.append((radius * math.cos(a), y0, radius * math.sin(a)))
            right.append((radius * math.cos(a), y1, radius * math.sin(a)))
        for i in range(segments):
            j = (i + 1) % segments
            self.face([left[i], left[j], right[j], right[i]], mat_name, smooth)
        self.face(list(reversed(left)), cap_mat, False)
        self.face(right, cap_mat, False)

    def build(self, name, location=(0, 0, 0)):
        mesh = bpy.data.meshes.new(name + "_mesh")
        mesh.from_pydata(self.verts, [], self.faces)
        mesh.update(calc_edges=True)
        mat_index = {name: i for i, name in enumerate(self.materials)}
        for material in self.materials.values():
            mesh.materials.append(material)
        for polygon, mat_name, smooth in zip(mesh.polygons, self.mat_names, self.smooth):
            polygon.material_index = mat_index[mat_name]
            polygon.use_smooth = smooth
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
        if hasattr(mesh, "calc_normals_split"):
            mesh.calc_normals_split()
        mesh.update()
        return obj


def make_body(materials):
    b = MeshBuilder(materials)

    # Main asymmetrical Ducato X290 hull: long cargo volume with sloping cab nose.
    b.new_component()
    sections = [
        (-5.15, 0.66, 2.42, 1.03),
        (-4.50, 0.66, 2.56, 1.07),
        (-0.95, 0.66, 2.56, 1.07),
        (-0.22, 0.68, 2.38, 1.04),
        (0.64, 0.64, 1.92, 0.98),
        (1.10, 0.60, 1.56, 0.93),
    ]
    for i in range(len(sections) - 1):
        x0, zb0, zt0, w0 = sections[i]
        x1, zb1, zt1, w1 = sections[i + 1]
        b.face([(x0, -w0, zb0), (x1, -w1, zb1), (x1, -w1, zt1), (x0, -w0, zt0)], "Car_Paint")
        b.face([(x1, w1, zb1), (x0, w0, zb0), (x0, w0, zt0), (x1, w1, zt1)], "Car_Paint")
        b.face([(x0, -w0, zt0), (x1, -w1, zt1), (x1, w1, zt1), (x0, w0, zt0)], "Car_Paint", True)
        b.face([(x0, w0, zb0), (x1, w1, zb1), (x1, -w1, zb1), (x0, -w0, zb0)], "Car_Paint")
    x, zb, zt, w = sections[0]
    b.face([(x, -w, zb), (x, w, zb), (x, w, zt), (x, -w, zt)], "Car_Paint")
    x, zb, zt, w = sections[-1]
    b.face([(x, w, zb), (x, -w, zb), (x, -w, zt), (x, w, zt)], "Car_Paint")

    # Lower sill and bumpers.
    b.box((-5.02, -1.09, 0.30), (0.86, 1.09, 0.64), "Car_Paint")
    b.box((1.12, -1.04, 0.28), (1.34, 1.04, 0.62), "Matte_Black")
    b.box((-5.40, -1.02, 0.30), (-5.20, 1.02, 0.64), "Matte_Black")

    # Recessed black grille cavity, stepped slats, raised emblem.
    b.prism_x(1.245, 1.105, [(-0.62, 0.90), (0.62, 0.90), (0.70, 1.44), (-0.70, 1.44)], "Matte_Black")
    for z in (1.02, 1.18, 1.34):
        b.box((1.205, -0.58, z - 0.025), (1.265, 0.58, z + 0.028), "Matte_Black")
    b.box((1.270, -0.145, 1.14), (1.330, 0.145, 1.31), "Chrome_Dark")
    b.box((1.332, -0.085, 1.18), (1.365, 0.085, 1.28), "Tail_Red")

    # Bumper vents and sharp X290 headlight recesses.
    for pts in (
        [(-0.98, 0.42), (-0.45, 0.42), (-0.42, 0.68), (-0.92, 0.72)],
        [(-0.34, 0.38), (0.34, 0.38), (0.36, 0.68), (-0.36, 0.68)],
        [(0.45, 0.42), (0.98, 0.42), (0.92, 0.72), (0.42, 0.68)],
    ):
        b.prism_x(1.315, 1.200, pts, "Matte_Black")
    b.prism_x(1.265, 1.170, [(-1.00, 1.28), (-0.58, 1.45), (-0.38, 1.35), (-0.86, 1.16)], "Matte_Black")
    b.prism_x(1.265, 1.170, [(0.58, 1.45), (1.00, 1.28), (0.86, 1.16), (0.38, 1.35)], "Matte_Black")
    b.prism_x(1.295, 1.245, [(-0.94, 1.30), (-0.61, 1.41), (-0.46, 1.34), (-0.84, 1.22)], "Headlamp_Lens")
    b.prism_x(1.295, 1.245, [(0.61, 1.41), (0.94, 1.30), (0.84, 1.22), (0.46, 1.34)], "Headlamp_Lens")
    b.box((1.298, -0.52, 0.89), (1.345, -0.34, 1.03), "Amber_Lens")
    b.box((1.298, 0.34, 0.89), (1.345, 0.52, 1.03), "Amber_Lens")

    # Window topology: glass is a recessed material slot, with physical rubber frames.
    b.quad_prism((-0.76, -0.73, 2.36), (-0.05, -0.65, 2.20), (0.43, -0.58, 1.58), (-0.36, -0.72, 1.70), 0.010, "Car_Glass")
    b.quad_prism((-0.05, 0.65, 2.20), (-0.76, 0.73, 2.36), (-0.36, 0.72, 1.70), (0.43, 0.58, 1.58), 0.010, "Car_Glass")
    b.box((-0.83, -0.79, 2.30), (0.50, -0.745, 2.42), "Matte_Black")
    b.box((-0.83, 0.745, 2.30), (0.50, 0.79, 2.42), "Matte_Black")

    for side in (-1, 1):
        y = side * 1.075
        t = 0.010 * side
        b.quad_prism((-0.52, y, 1.46), (0.28, y, 1.37), (0.22, y, 2.12), (-0.66, y, 2.28), t, "Car_Glass")
        b.box((-0.62, y - 0.026 * side, 1.38), (0.34, y + 0.026 * side, 1.47), "Matte_Black")
        b.box((-0.72, y - 0.026 * side, 2.21), (0.24, y + 0.026 * side, 2.31), "Matte_Black")
        b.box((-0.74, y - 0.026 * side, 1.44), (-0.66, y + 0.026 * side, 2.28), "Matte_Black")
        b.box((0.25, y - 0.026 * side, 1.38), (0.34, y + 0.026 * side, 2.12), "Matte_Black")

        # Physical panel seams, side moldings, handles, and dual mirrors.
        for x in (-4.92, -3.98, -1.12, -0.70, 0.32):
            b.box((x - 0.011, y - 0.018 * side, 0.70), (x + 0.011, y + 0.018 * side, 2.36), "Panel_Gap")
        b.box((-4.54, y - 0.035 * side, 1.04), (-1.32, y + 0.035 * side, 1.19), "Matte_Black")
        b.box((-1.23, y - 0.035 * side, 1.03), (-0.17, y + 0.035 * side, 1.18), "Matte_Black")
        b.box((-0.60, y - 0.040 * side, 1.24), (-0.29, y + 0.040 * side, 1.33), "Matte_Black")
        b.box((-3.92, y - 0.038 * side, 1.24), (-3.58, y + 0.038 * side, 1.33), "Matte_Black")
        b.box((0.33, y + 0.01 * side, 1.54), (0.68, y + 0.32 * side, 1.62), "Matte_Black")
        b.box((0.61, y + 0.24 * side, 1.52), (0.88, y + 0.49 * side, 1.78), "Matte_Black")
        b.box((0.66, y + 0.28 * side, 1.31), (0.84, y + 0.45 * side, 1.49), "Matte_Black")
        if side == 1:
            b.box((-3.12, y - 0.018, 1.42), (-2.78, y + 0.018, 1.76), "Panel_Gap")

        for cx in (0.0, -4.15):
            cz, inner, outer = 0.46, 0.49, 0.63
            for i in range(20):
                a0 = math.pi * i / 20
                a1 = math.pi * (i + 1) / 20
                p0 = (cx + outer * math.cos(a0), y, cz + outer * math.sin(a0))
                p1 = (cx + outer * math.cos(a1), y, cz + outer * math.sin(a1))
                p2 = (cx + inner * math.cos(a1), y, cz + inner * math.sin(a1))
                p3 = (cx + inner * math.cos(a0), y, cz + inner * math.sin(a0))
                b.quad_prism(p0, p1, p2, p3, 0.030 * side, "Matte_Black")

    # Rear cargo doors and tail lamps.
    b.box((-5.255, -0.014, 0.74), (-5.225, 0.014, 2.36), "Panel_Gap")
    for side in (-1, 1):
        y0, y1 = side * 0.78, side * 0.99
        b.box((-5.30, y0, 0.88), (-5.23, y1, 1.22), "Tail_Red")
        b.box((-5.305, y0, 1.22), (-5.23, y1, 1.38), "Amber_Lens")

    body = b.build("body")
    glass_vertices = set()
    for poly in body.data.polygons:
        if body.data.materials[poly.material_index].name == "Car_Glass":
            glass_vertices.update(poly.vertices)
    group = body.vertex_groups.new(name="Window_Glass_Faces")
    group.add(list(glass_vertices), 1.0, "ADD")
    return body


def make_wheel(name, materials, location):
    b = MeshBuilder(materials)
    b.ring_y(36, [(-0.235, 0.315), (-0.205, 0.455), (-0.120, 0.500), (0, 0.515), (0.120, 0.500), (0.205, 0.455), (0.235, 0.315), (0, 0.305)], "Tire_Rubber", True)
    for side in (-1, 1):
        b.ring_y(36, [(side * 0.222, 0.070), (side * 0.208, 0.175), (side * 0.180, 0.278), (side * 0.215, 0.305)], "Rim_Steel", False)
        b.cylinder_y(0.112, 0.055, 28, "Rim_Steel", "Rim_Steel", False, y_center=side * 0.242)
        b.cylinder_y(0.060, 0.068, 20, "Chrome_Dark", "Chrome_Dark", False, y_center=side * 0.275)
        for i in range(5):
            angle = 2 * math.pi * i / 5 + 0.16
            radial = Vector((math.cos(angle), 0, math.sin(angle)))
            tangent = Vector((-math.sin(angle), 0, math.cos(angle)))
            y = side * 0.216
            pts = [
                radial * 0.145 - tangent * 0.034 + Vector((0, y, 0)),
                radial * 0.145 + tangent * 0.034 + Vector((0, y, 0)),
                radial * 0.255 + tangent * 0.021 + Vector((0, y, 0)),
                radial * 0.255 - tangent * 0.021 + Vector((0, y, 0)),
            ]
            b.quad_prism(tuple(pts[0]), tuple(pts[1]), tuple(pts[2]), tuple(pts[3]), 0.016 * side, "Matte_Black")
    return b.build(name, location)


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_studio():
    bpy.ops.mesh.primitive_plane_add(size=16, location=(-2.0, 0, 0))
    ground = bpy.context.object
    ground.name = "studio_ground_plane"
    ground.data.materials.append(make_pbr_material("Studio_Ground_Matte", (0.78, 0.78, 0.76, 1), 0.55, 0.0))

    bpy.ops.object.light_add(type="AREA", location=(2.8, -4.2, 5.5))
    key = bpy.context.object
    key.name = "Key_Area_500W"
    key.data.energy = 500
    key.data.size = 4.5
    look_at(key, (-1.2, 0, 1.2))

    bpy.ops.object.light_add(type="AREA", location=(3.4, 4.4, 3.2))
    fill = bpy.context.object
    fill.name = "Fill_Area_200W"
    fill.data.energy = 200
    fill.data.size = 5.5
    look_at(fill, (-1.4, 0, 1.2))

    bpy.ops.object.light_add(type="SUN", location=(-5.2, 3.2, 4.5))
    rim = bpy.context.object
    rim.name = "Rim_Sun_5W"
    rim.data.energy = 5
    look_at(rim, (-1.8, 0, 2.1))

    bpy.ops.object.camera_add(location=(3.1, -4.7, 2.25))
    camera = bpy.context.object
    camera.name = "Camera_3Q_Front_Left"
    look_at(camera, (0.25, -0.26, 1.25))
    camera.data.lens = 42
    camera.data.dof.use_dof = True
    camera.data.dof.focus_distance = 5.1
    camera.data.dof.aperture_fstop = 7.5
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    scene.render.resolution_x = 1920
    scene.render.resolution_y = 1080
    scene.render.film_transparent = False
    scene.world.color = (0.03, 0.035, 0.04)
    scene.render.filepath = RENDER_PATH

    try:
        scene.render.engine = "CYCLES"
        scene.cycles.samples = 80
        scene.cycles.use_denoising = True
        scene.view_settings.view_transform = "Filmic"
        scene.view_settings.look = "Medium High Contrast"
        scene.view_settings.exposure = 0
        scene.view_settings.gamma = 1
    except Exception:
        scene.render.engine = "BLENDER_EEVEE_NEXT" if "BLENDER_EEVEE_NEXT" in [item.identifier for item in scene.render.bl_rna.properties["engine"].enum_items] else "BLENDER_EEVEE"
        if hasattr(scene, "eevee"):
            if hasattr(scene.eevee, "use_gtao"):
                scene.eevee.use_gtao = True
            if hasattr(scene.eevee, "use_ssr"):
                scene.eevee.use_ssr = True


def validate(objects):
    report = {
        "objects": {},
        "total_triangles": 0,
        "total_vertices": 0,
        "non_manifold_edges": 0,
        "render_path": RENDER_PATH,
        "glb_path": GLB_PATH,
    }
    for obj in objects:
        mesh = obj.data
        mesh.validate(verbose=False)
        mesh.update(calc_edges=True)
        mesh.calc_loop_triangles()
        edge_counts = Counter()
        for poly in mesh.polygons:
            ids = list(poly.vertices)
            for i, a in enumerate(ids):
                edge_counts[tuple(sorted((a, ids[(i + 1) % len(ids)])))] += 1
        non_manifold = sum(1 for value in edge_counts.values() if value != 2)
        report["objects"][obj.name] = {
            "materials": [m.name for m in mesh.materials],
            "triangles": len(mesh.loop_triangles),
            "vertices": len(mesh.vertices),
            "non_manifold_edges": non_manifold,
        }
        report["total_triangles"] += len(mesh.loop_triangles)
        report["total_vertices"] += len(mesh.vertices)
        report["non_manifold_edges"] += non_manifold
    return report


def main():
    clear_scene()
    materials = {
        "Car_Paint": make_pbr_material("Car_Paint", (1, 1, 1, 1), 0.15, 0.2),
        "Car_Glass": make_pbr_material("Car_Glass", (0.010, 0.010, 0.010, 1), 0.02, 0.9, 1.0),
        "Matte_Black": make_pbr_material("Matte_Black", (0.012, 0.012, 0.013, 1), 0.72, 0.0),
        "Panel_Gap": make_pbr_material("Panel_Gap", (0.0, 0.0, 0.0, 1), 0.85, 0.0),
        "Tire_Rubber": make_pbr_material("Tire_Rubber", (0.006, 0.006, 0.007, 1), 0.82, 0.0),
        "Rim_Steel": make_pbr_material("Rim_Steel", (0.60, 0.62, 0.64, 1), 0.26, 0.55),
        "Chrome_Dark": make_pbr_material("Chrome_Dark", (0.23, 0.24, 0.25, 1), 0.18, 0.7),
        "Headlamp_Lens": make_pbr_material("Headlamp_Lens", (0.82, 0.87, 0.90, 1), 0.04, 0.1, 1.0),
        "Amber_Lens": make_pbr_material("Amber_Lens", (1.0, 0.45, 0.02, 1), 0.12, 0.05),
        "Tail_Red": make_pbr_material("Tail_Red", (0.9, 0.01, 0.01, 1), 0.18, 0.05),
    }

    body = make_body(materials)
    wheels = [
        make_wheel("wheel_front_l", materials, (0.0, 1.18, 0.515)),
        make_wheel("wheel_front_r", materials, (0.0, -1.18, 0.515)),
        make_wheel("wheel_rear_l", materials, (-4.15, 1.18, 0.515)),
        make_wheel("wheel_rear_r", materials, (-4.15, -1.18, 0.515)),
    ]
    asset_objects = [body] + wheels
    setup_studio()

    bpy.ops.object.select_all(action="DESELECT")
    for obj in asset_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.export_scene.gltf(filepath=GLB_PATH, export_format="GLB", use_selection=True, export_materials="EXPORT", export_apply=False)

    bpy.ops.render.render(write_still=True)
    print(json.dumps(validate(asset_objects), indent=2))


if __name__ == "__main__":
    main()
