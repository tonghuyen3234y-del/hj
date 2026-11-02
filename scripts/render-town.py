"""Offline homepage stills from the same personalized GLBs as the drive scene.
Run with Blender --background --python scripts/render-town.py.
"""
import bpy, math, json, pathlib, subprocess
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view
root=pathlib.Path(__file__).resolve().parent.parent
out=root/'assets'/'town';out.mkdir(parents=True,exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.resolution_x=2000;scene.render.resolution_y=1250;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.image_settings.color_mode='RGBA';scene.render.image_settings.compression=80
scene.render.film_transparent=True
scene.view_settings.view_transform='Standard'
scene.view_settings.look='Medium High Contrast' if 'Medium High Contrast' in [i.identifier for i in bpy.types.ColorManagedViewSettings.bl_rna.properties['look'].enum_items] else 'None'
scene.view_settings.exposure=0;scene.view_settings.gamma=1
for name in ['town-base','town-buildings','town-props']:
 bpy.ops.import_scene.gltf(filepath=str(root/'assets'/'models'/(name+'.glb')))
layout=json.loads(subprocess.check_output(['node','--input-type=module','-e',
 'import {T} from "./vendor/world-layout.js"; process.stdout.write(JSON.stringify(T));'],cwd=root,text=True))
def pos(x,y,z):return Vector((x,-z,y))
# Instances of the three reusable tree templates.
for species,description in layout['treeSpecies'].items():
 original=bpy.data.objects.get(description['mesh'])
 if original is None:continue
 original.hide_render=True
 for tree in layout['trees']:
  if tree['species']!=species:continue
  clone=original.copy();clone.data=original.data;scene.collection.objects.link(clone);clone.parent=None;clone.hide_render=False
  clone.matrix_world=Matrix.Translation(pos(tree['x'],0,tree['z'])) @ Matrix.Rotation(tree['rotation'],4,'Z') @ Matrix.Scale(tree['scale'],4) @ original.matrix_world
# Import the orange car at the road's starting point.
old=set(bpy.data.objects)
bpy.ops.import_scene.gltf(filepath=str(root/'assets'/'models'/'drive-car.glb'))
car_objects=set(bpy.data.objects)-old
vertices=[obj.matrix_world@Vector(corner) for obj in car_objects if obj.type=='MESH' for corner in obj.bound_box]
mi=Vector(tuple(min(p[k] for p in vertices) for k in range(3)));ma=Vector(tuple(max(p[k] for p in vertices) for k in range(3)))
scale=2.65/max(ma.x-mi.x,ma.y-mi.y)
transform=Matrix.Translation(pos(-7.5,.06,-1.4)+Vector((0,0,-mi.z*scale)))@Matrix.Rotation(math.pi/2,4,'Z')@Matrix.Scale(scale,4)
for obj in car_objects:
 if obj.parent not in car_objects:obj.matrix_world=transform@obj.matrix_world
# Camera keeps the render, SVG hit regions and labels in the same coordinate system.
bpy.ops.object.camera_add(location=(31,-36,27));camera=bpy.context.object;camera.name='HJ. homepage camera';camera.data.type='ORTHO';camera.data.ortho_scale=42.8
camera.rotation_euler=(Vector((0,0,.5))-camera.location).to_track_quat('-Z','Y').to_euler();scene.camera=camera
# Personal sign boards; source lettering was removed from the GLB triangles.
def material(name,color,emission=0):
 mat=bpy.data.materials.new(name);mat.diffuse_color=(*color,1);mat.use_nodes=True
 shader=mat.node_tree.nodes.get('Principled BSDF');shader.inputs['Base Color'].default_value=(*color,1);shader.inputs['Roughness'].default_value=.85
 shader.inputs['Emission Color'].default_value=(*color,1);shader.inputs['Emission Strength'].default_value=emission
 return mat
board=material('HJ. forest enamel',(.025,.065,.035));ink=material('HJ. warm ivory',(.82,.76,.56),.2)
font_path=pathlib.Path('/System/Library/Fonts/Supplemental/Songti.ttc')
font=bpy.data.fonts.load(str(font_path)) if font_path.exists() else None
signs=[('HJ. 印刷所',(-9,3,-3.44),(4.42,.72)),('档 案 馆',(-1.25,2.95,-3.98),(2.19,.62)),('工 坊 车 库',(-9.25,2.68,6.66),(3.32,.63)),('慢变量AI',(-3.05,2.64,5.92),(2.52,.61)),('邮 局',(4.75,2.96,6.45),(2.25,.63)),('灵 感 放 映 厅',(7,2.82,-1.90),(4.5,.49)),("Huijie’s Space · 好奇小镇",(0,-.55,12.13),(5.4,.58))]
for text,location,size in signs:
 bpy.ops.mesh.primitive_plane_add(size=1,location=pos(*location),rotation=(math.pi/2,0,0));plane=bpy.context.object;plane.name='HJ. sign';plane.scale=(size[0],size[1],1);plane.data.materials.append(board)
 curve=bpy.data.curves.new('HJ. lettering','FONT');curve.body=text;curve.align_x='CENTER';curve.align_y='CENTER';curve.size=size[1]*.59
 if font:curve.font=font
 letters=bpy.data.objects.new('HJ. '+text,curve);scene.collection.objects.link(letters);letters.location=pos(location[0],location[1],location[2]+.014);letters.rotation_euler=(math.pi/2,0,0);curve.materials.append(ink)
 bpy.context.view_layer.update()
 if letters.dimensions.x>size[0]*.92:letters.scale.x*=size[0]*.92/letters.dimensions.x
# Consistent geometry-derived outlines for hover/focus targets.
def hull(points):
 points=sorted(set(points))
 def cross(o,a,b):return (a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0])
 def half(ps):
  result=[]
  for point in ps:
   while len(result)>=2 and cross(result[-2],result[-1],point)<=0:result.pop()
   result.append(point)
  return result
 return half(points)[:-1]+half(points[::-1])[:-1]
def project(v):
 p=world_to_camera_view(scene,camera,v);return (round(p.x*1000,2),round((1-p.y)*625,2))
bpy.context.view_layer.update();regions={}
for building in layout['buildings']:
 obj=bpy.data.objects.get(building['root']);points=[]
 if obj:
  for child in [obj,*obj.children_recursive]:
   if child.type=='MESH' and not child.name.endswith('_glow'):points.extend(project(child.matrix_world@v.co) for v in child.data.vertices)
 regions[building['id']]={'polygon':hull(points),'label':project(pos(building['footprint']['x'],4.9,building['footprint']['z']))}
regions['chimney']=project(pos(-10.9,5.66,-7.15))
(out/'layout.js').write_text('export const townLayout = '+json.dumps(regions,separators=(',',':'))+';\n')
(out/'layout.json').write_text(json.dumps(regions,indent=2))
world=bpy.data.worlds.new('Town atmosphere');scene.world=world;world.use_nodes=True;background=world.node_tree.nodes.get('Background')
bpy.ops.object.light_add(type='SUN',location=(-12,-9,14));sun=bpy.context.object;sun.rotation_euler=(Vector((0,0,0))-sun.location).to_track_quat('-Z','Y').to_euler();sun.data.angle=math.radians(12)
lamps=[]
for item in layout['emissive']['nightLights']:
 bpy.ops.object.light_add(type='POINT',location=pos(*item['position']));lamp=bpy.context.object;lamp.data.color=(1,.64,.3);lamp.data.shadow_soft_size=.35;lamps.append(lamp)
for x,z in [(-9,-3.5),(-1.25,-3.8),(7,-2.7)]:
 bpy.ops.object.light_add(type='POINT',location=pos(x,1.9,z));lamp=bpy.context.object;lamp.data.color=(1,.71,.42);lamp.data.shadow_soft_size=.5;lamps.append(lamp)
# Keep glow materials emissive at night, quiet in daylight.
glow_materials=[]
for mat in bpy.data.materials:
 if 'luminous' in mat.name.lower() or 'headlamp' in mat.name.lower():
  shader=mat.node_tree.nodes.get('Principled BSDF') if mat.use_nodes else None
  if shader:glow_materials.append(shader)
for mode in ['day','night']:
 night=mode=='night';sun.data.energy=.08 if night else 2.7;sun.data.color=(.58,.67,1) if night else (1,.92,.76)
 background.inputs['Color'].default_value=(.34,.42,.58,1) if night else (.78,.83,.72,1);background.inputs['Strength'].default_value=.23 if night else .7
 for lamp in lamps:lamp.data.energy=90 if night else 0
 for shader in glow_materials:shader.inputs['Emission Strength'].default_value=3.2 if night else .05
 scene.render.filepath=str(out/(mode+'.png'));bpy.ops.render.render(write_still=True)
print('HJ_TOWN_RENDER_COMPLETE')
