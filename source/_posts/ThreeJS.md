---
title: Three.js
date: 2025-07-27 10:03:57
tags:
---

init scene
```
    const canvas = document.createElement('canvas')
    const sizes = {
    width: this.$refs.container.clientWidth,
    height: this.$refs.container.clientHeight
    }
    canvas.width = sizes.width;
    canvas.height = sizes.height;
    this.$refs.container.appendChild(canvas);
    // 创建3D场景对象Scene
    const scene = new THREE.Scene();
    console.log(scene); 
    // Geometry
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshBasicMaterial({color: '#aaa', wireframe:true})
    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(0, 0, -10);
    scene.add(mesh)

    // 创建相机对象Camera
    // 45-75 是透视投影相机建议的视角范围fov
    // 视角比例aspect w/h
    // 投影近平面
    // 投影远平面
    const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 1000);
    scene.add(camera);

    const renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.render(scene, camera);
```

Controls
```
// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)
```

Animation
```
tick(){
    mesh.rotaion.y += 0.05
    console.log("tick tack")
    requestAnimationFrame(tick)
}
```
tick  调用频率是帧速率相关的 可以用Date或者THREE.Clock
```
const clock = new THREE.Clock()
const animate = () => {
    const t = clock.getElapsedTime()
    group.rotation.y=0.5*Math.PI*t
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();
```

Issue： 单纯调用gsap无效 需要配合requestAnimationFrame和render方法才能使模型运动生效
```
    gsap.to(group.position, {
        duration:1,
        delay:1,
        x:20
    })
    gsap.to(group.position, {
        duration:1,
        delay:2,
        x:0
    })
   
    const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
    };

    animate();
```

正交相机
```
const camera = new THREE.OrthographicCamera(
    -20*container.current.clientWidth/container.current.clientHeight, /*左边界*/
    20*container.current.clientWidth/container.current.clientHeight,/*右边界*/
    20,/*上边界*/
    -20,/*下边界*/
    0.1,
    1000
)
```

相机环绕
```
 // mouse rotate
document.addEventListener('mousemove', (e)=>{
    if(!container.current) return
    const x = (e.x - container.current.offsetLeft)/container.current.clientWidth - 0.5;
    const y = -(e.x - container.current.offsetTop)/container.current.clientHeight + 0.5;
    // 圆形轨迹的坐标呈正弦/余弦往复
    camera.position.z = Math.cos(x*Math.PI*10)*20
    camera.position.x = Math.sin(x*Math.PI*10)*20
    // 注意！ 相机位置移动时 会从原目标移开 所以重新设置lookAt
    camera.lookAt(scene.position)
    renderer.render(scene, camera)
})
```

camera controls
+ OrbitControl
+ DeviceOrientationControls
+ FirstPersionControls
+ FlyControls
+ PointLockControls
+ TrackballControls