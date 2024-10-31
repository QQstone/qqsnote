---
title: React Native Vision Camera
date: 2024-10-14 16:44:27
tags:
---
```
npm i react-native-vision-camera
```
#### camera 和 microphone 权限
AndroidManifest.xml中声明该App需要camera 和 microphone 权限：
```
<uses-permission android:name="android.permission.CAMERA" />

<!-- optionally, if you want to record audio: -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```
查询权限
```
const cameraPermission = Camera.getCameraPermissionStatus()
const microphonePermission = Camera.getMicrophonePermissionStatus()

const showPermissionsPage = cameraPermission !== 'granted' || microphonePermission === 'not-determined'
// 未授权则跳转到 PermissionsPage
props.navigation.navigate(showPermissionsPage?'PermissionsPage':'CameraPage')
```
getXXXPermissionStatus的结果:
+ granted 授权使用
+ not-determined 尚未申请
+ denied 拒绝(可以再次申请)
+ restricted 禁用

PermissionsPage 请求权限
```
const [cameraPermissionStatus, setCameraPermissionStatus] = useState('not-determined')
const [microphonePermissionStatus, setMicrophonePermissionStatus] = useState('not-determined')

useEffect(()=>{
    if(cameraPermissionStatus === 'granted' && microphonePermissionStatus === 'granted'){
        navigation.replace('CameraPage')
    }

}, [cameraPermissionStatus, microphonePermissionStatus])

const requestPermissions = useCallback(async ()=>{
    const cameraPermission = await Camera.requestCameraPermission()
    if(cameraPermission === 'denied') await Linking.openSettings() // 设备设置页
    setCameraPermissionStatus(cameraPermission)

    // ...
})

return (<Text onPress={requestPermissions}>grant</Text>)
```
#### Camera视图
```
const device = useCameraDevice('back')
const { hasPermission } = useCameraPermission()

if (!hasPermission) return <PermissionsPage />
if (device == null) return <NoCameraDeviceError />
return (
<Camera
    style={StyleSheet.absoluteFill}
    device={device}
    isActive={true}
/>
)
```
**设备devices**
```
const devices = Camera.getAvailableCameraDevices()
const device = getCameraDevice(devices, 'back')
```
[其他针对多摄像头和外部摄像头的选择](https://react-native-vision-camera.com/docs/guides/devices)

isActive可用于暂停会话(pause the session: isActive={false}) 相比于unmount可以更快速再次调用

**生命周期** 
onInitialized -- onStarted -- onPreviewStarted -- onPreviewStopped -- onStopped、

**格式**
```
const format = getCameraFormat(device, [
  { videoResolution: 'max' },
  { photoResolution: 'max' }
])
```
[other format settings](https://react-native-vision-camera.com/docs/guides/formats)

**Preview预览**
```
const camera = useRef<Camera>(null)
...
return(
    <Camera {...props} 
    ref={camera}
    photo={true} {/* enable take photo */}
    preview={isPausePreview}
    onPreviewStarted={() => console.log('Preview started!')}
    onPreviewStopped={() => console.log('Preview stopped!')}
    androidPreviewViewType="texture-view" />
)
```
**拍照**
```
const file = await camera.current.takePhoto()
await CameraRoll.save(`file://${file.path}`, {
  type: 'photo',
}) 
```