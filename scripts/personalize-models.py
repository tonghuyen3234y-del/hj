"""Remove the reference site's planar sign lettering; app.js supplies HJ. signs.
Run once against the downloaded reference GLBs. Geometry for the town is retained.
"""
import pathlib, json, struct, collections
root = pathlib.Path(__file__).resolve().parent.parent / 'assets' / 'models'
for name in ['town-base', 'town-buildings', 'town-props']:
    path = root / (name + '.glb')
    raw = path.read_bytes()
    size = struct.unpack_from('<I', raw, 12)[0]
    doc = json.loads(raw[20:20+size])
    binary = bytearray(raw[28+size:])
    def read_accessor(index):
        acc = doc['accessors'][index]; view = doc['bufferViews'][acc['bufferView']]
        count = {'SCALAR':1, 'VEC3':3, 'VEC4':4}[acc['type']]
        fmt = {5126:'f',5123:'H',5125:'I',5121:'B'}[acc['componentType']]
        offset = view.get('byteOffset',0)+acc.get('byteOffset',0)
        return list(struct.iter_unpack('<'+fmt*count,binary[offset:offset+struct.calcsize('<'+fmt)*count*acc['count']]))
    removed = 0
    for node in doc['nodes']:
        if 'mesh' not in node or not node.get('name','').endswith('_matte'): continue
        for primitive in doc['meshes'][node['mesh']]['primitives']:
            vertices = read_accessor(primitive['attributes']['POSITION'])
            indices = [row[0] for row in read_accessor(primitive['indices'])]
            parent = list(range(len(vertices))); unique = {}
            def find(i):
                while parent[i] != i: parent[i] = parent[parent[i]]; i = parent[i]
                return i
            def join(a,b): parent[find(a)] = find(b)
            for i, v in enumerate(vertices):
                key = tuple(round(x,5) for x in v)
                if key in unique: join(i,unique[key])
                else: unique[key] = i
            for j in range(0,len(indices),3): join(indices[j],indices[j+1]);join(indices[j],indices[j+2])
            components = collections.defaultdict(list)
            for i,v in enumerate(vertices): components[find(i)].append(v)
            remove = set()
            for key, points in components.items():
                dims = [max(v[j] for v in points)-min(v[j] for v in points) for j in range(3)]
                # Printed glyphs are flat vertical outlines. Keep volumetric props,
                # window panes, road markings, and the architectural sign boards.
                if len(points)>10 and max(dims)<.65 and dims[1]>.015 and (dims[0]<.0001 or dims[2]<.0001): remove.add(key)
            kept = [index for j in range(0,len(indices),3) if find(indices[j]) not in remove for index in indices[j:j+3]]
            removed += len(remove)
            if not kept: continue
            accessor = doc['accessors'][primitive['indices']]
            view = doc['bufferViews'][accessor['bufferView']]
            offset = view.get('byteOffset',0)+accessor.get('byteOffset',0)
            fmt = {5123:'H',5125:'I'}[accessor['componentType']]
            data = struct.pack('<'+fmt*len(kept),*kept)
            binary[offset:offset+len(data)] = data
            accessor['count'] = len(kept);accessor['min']=[min(kept)];accessor['max']=[max(kept)]
    json_data = json.dumps(doc,separators=(',',':'),ensure_ascii=False).encode()
    json_data += b' ' * (-len(json_data)%4)
    binary += b'\0' * (-len(binary)%4)
    total = 12+8+len(json_data)+8+len(binary)
    path.write_bytes(struct.pack('<III',0x46546c67,2,total)+struct.pack('<II',len(json_data),0x4e4f534a)+json_data+struct.pack('<II',len(binary),0x004e4942)+binary)
    print(name, 'removed', removed, 'reference lettering components')
