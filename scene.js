export async function personalizeScene(experience, engine, lang='zh') {
  const {CanvasTexture,Mesh,PlaneGeometry,MeshStandardMaterial,SRGBColorSpace}=engine;
  const signs=[
    {text:lang==='zh'?'HJ. 印刷所':'HJ. PRINT HOUSE',pos:[-9,3.00,-3.44],size:[4.42,.72]},
    {text:lang==='zh'?'档 案 馆':'THE ARCHIVE',pos:[-1.25,2.95,-3.98],size:[2.19,.62]},
    {text:lang==='zh'?'工 坊 车 库':'THE WORKSHOP',pos:[-9.25,2.68,6.66],size:[3.32,.63]},
    {text:lang==='zh'?'慢变量AI':'SLOW VARIABLES',pos:[-3.05,2.64,5.92],size:[2.52,.61]},
    {text:lang==='zh'?'邮 局':'POST OFFICE',pos:[4.75,2.96,6.45],size:[2.25,.63]},
    {text:lang==='zh'?'灵 感 放 映 厅':'THE SCREENING ROOM',pos:[7,2.82,-1.90],size:[4.5,.49]},
    {text:"Huijie’s Space · 好奇小镇",pos:[0,-.55,12.13],size:[5.4,.58]}
  ];
  for(const sign of signs){
    const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=Math.round(1024*sign.size[1]/sign.size[0]);
    const context=canvas.getContext('2d');context.fillStyle='#294636';context.fillRect(0,0,canvas.width,canvas.height);
    context.strokeStyle='#ad9468';context.lineWidth=3;context.strokeRect(5,5,canvas.width-10,canvas.height-10);
    context.fillStyle='#f2e5bc';context.font=`500 ${canvas.height*.64}px "Songti SC",Georgia,serif`;context.textAlign='center';context.textBaseline='middle';context.fillText(sign.text,canvas.width/2,canvas.height*.52,canvas.width*.91);
    const texture=new CanvasTexture(canvas);texture.colorSpace=SRGBColorSpace;
    const material=new MeshStandardMaterial({map:texture,roughness:.85,emissive:0x3a3224,emissiveIntensity:.18});
    const plane=new Mesh(new PlaneGeometry(...sign.size),material);plane.position.set(...sign.pos);plane.name='HJ. personalized sign';experience.town.group.add(plane);
  }
}
