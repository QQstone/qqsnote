---
title: Three.js
date: 2025-07-27 10:03:57
tags:
- Three.js
---
#### Renderer
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

#### Controls
```
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
...
// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement)

// controls.update() must be called after any manual changes to the camera's transform
camera.position.set( 0, 20, 100 );
controls.update();

// camera 移动是重复的render过程 需要requestAnimationFrame
function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	renderer.render( scene, camera );
}
```

#### Animation
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

#### Camera
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

debug tool: 
dat.gui (out of date) -> lil-gui
[control panel](https://github.com/freeman-lab/control-panel)
[controlkit](https://github.com/automat/controlkit.js)
[Guify](https://github.com/colejd/guify)
[Oui](https://github.com/wearekuva/oui)

#### 纹理映射

```
const loader = new THREE.TextureLoader()
const texture = loader.load('./assets/images/cover/cover-6.webp',
    (txt)=>{
        console.log(txt)
    },
    ()=>{
        console.log('loading')
    },
    (e)=>{
        console.error(e)
    }
)
// 设置纹理在U轴（水平方向）和V轴（垂直方向）上的重复次数。
texture.repeat.x = 2
texture.repeat.y = 2
// 设置纹理在U轴（S方向）和V轴（T方向）上的包裹模式（wrap mode）。
// THREE.MirroredRepeatWrapping接缝处镜像翻转
texture.wrapS = THREE.MirroredRepeatWrapping
texture.wrapT = THREE.MirroredRepeatWrapping
texture.offset.x = 0.5
// 素材逆时针旋转Π/2
texture.rotation = Math.PI * 0.5
texture.center.x = 1
texture.center.y = 1
// 放大时 线性平滑
texture.magFilter = THREE.LinearFilter
// 缩小时 取相邻两个mip层做线性平滑
texture.minFilter = THREE.LinearMipmapLinearFilter
const cubeMaterial = new THREE.MeshBasicMaterial({
    // color: 0xff0000, 
    // wireframe:true
    map: texture
})

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32)
const ball = new THREE.Mesh(sphereGeometry, cubeMaterial)
```

material properties:
+ transparent true/false
+ opacity 透明度0~1
+ wireframe 显示线框
+ side 材质应用到外侧(THREE.FrontSide)或者内侧(THREE.BackSide)
+ flatshading

matcap

environmentMap and HDRI(High Dynamic Range Imaging 高动态范围成像)

在宏大场景中，计算周围环境在物体上的倒影是巨大的运算负担，于是聪明的图形工作者想到了将环境贴图直接贴在反光物体上的想法

在Three.js中支持将立方体环境的图像映射到物体上 常用HDRI生成立方环境贴图的免费网站：https://polyhaven.com/hdris 原HDRIHeaven

或使用blender工具

#### 3D Text
TextBufferGeometry

[facetype.js](http://gero3.github.io/facetype.js/) 转换.ttf字体成json
QQs: 包含中文的字体转换后出现问题，json中以‘字-坐标’作key-value，中文(甚至字母和数字)转换失败在json中显示为方框，于是输入的字无法找到映射。loader导入这样的字体会报 character "xxx" does not exists in font family XXX
```
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

// text
const fontLoader = new FontLoader()
fontLoader.load('./assets/font/Kristen ITC_Regular.json', (font) => {
    const textGeometry = new TextGeometry(
        'Hello 3D',
        {
            font,
            size: 2,
            depth:0.2, /** 原height属性 */
            curveSegments: 12,
            bevelEnabled: true, /**斜角 */
            bevelThickness: 0.3,
            bevelSize: 0.2,
            bevelOffset: 0,
            bevelSegments: 5
        }
    )

    const textMaterial = new THREE.MeshBasicMaterial({ color: 'blue', wireframe:true })
    const textMesh = new THREE.Mesh(textGeometry, textMaterial)
    //textMesh.position.set(0,0,0)
    scene.add(textMesh)
})

```


#### 可视化优化
[Three.js常见性能问题和内存泄漏](https://blog.csdn.net/m0_57344393/article/details/149439134)
+ 及时dispose释放资源
+ 减少segment
+ 复用geometry实例 
+ 优化requestAnimationFrame 降低帧率和简化回调

#### webGPU
Three.js 支持webGPU,使用webGPU需要浏览器对该功能的支持 见{% post_link openGL openGL %}

对于没有原生支持的浏览器可以通过Polyfill实现

