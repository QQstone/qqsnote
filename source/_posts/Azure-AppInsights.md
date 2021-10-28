---
title: Azure-AppInsights
date: 2021-08-26 10:33:05
tags:
---
在你的应用中安装sdk向Azure Application Insight服务发送遥测数据，支持web客户端，web服务和后台服务等
对应用性能影响小。非阻塞，单独线程
![](https://docs.microsoft.com/zh-cn/azure/azure-monitor/app/media/app-insights-overview/diagram.png)

> The instrumentation monitors your app and directs the telemetry data to an Azure Application Insights Resource using a unique GUID that we refer to as an Instrumentation Key. You can instrument not only the web service application, but also any background components, and the JavaScript in the web pages themselves. The application and its components can run anywhere - it doesn't have to be hosted in Azure.  使用Guid作为Instrumentation Key(ikey)标识作为监视器的Azure Insights资源。 监测web服务应用或后台组件亦或页面js 这些应用或组件、命令不必托管在Azure中
#### 创建Azure App Insights资源
Azure Portal -> Application Insights -> Create
![](https://docs.microsoft.com/zh-cn/azure/azure-monitor/app/media/create-new-resource/review-create.png)
#### 添加Javascript SDK
```
npm i --save @microsoft/applicationinsights-web
```
使用ikey或连接字符串创建客户端instance
```
import { ApplicationInsights } from '@microsoft/applicationinsights-web'

const appInsights = new ApplicationInsights({ config: {
  instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE' /* 使用ikey */
  /* 或使用 connectionString: 'YOUR_CONNECTION_STRING_GOES_HERE' */
  /* ...Other Configuration Options... */
} });
appInsights.loadAppInsights();
appInsights.trackPageView(); // Manually call trackPageView to establish the current user/session/pageview
```
React Plugin
```
npm install @microsoft/applicationinsights-react-js
npm install @microsoft/applicationinsights-web
```
创建实例
```
// AppInsights.js
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { createBrowserHistory } from 'history';

const browserHistory = createBrowserHistory({ basename: '' });
const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
    config: {
        instrumentationKey: 'YOUR_INSTRUMENTATION_KEY_GOES_HERE',
        extensions: [reactPlugin],
        extensionConfig: {
          [reactPlugin.identifier]: { history: browserHistory }
        }
    }
});
appInsights.loadAppInsights();
export { reactPlugin, appInsights };
```
在AppComponent使用Context.Provider 使所有子组件内可使用 useContext hook调用AppInsights实例
```
import React from "react";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "./AppInsights";

const App = () => {
    return (
        <AppInsightsContext.Provider value={reactPlugin}>
            /* your application here */
        </AppInsightsContext.Provider>
    );
};
```
子组件
```
import React from "react";
import { useAppInsightsContext } from "@microsoft/applicationinsights-react-js";

const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    
    appInsights.trackMetric("Component 'MyComponent' is in use");
    appInsights.trackEvent({ name: 'Component Init', properties: { 'mydata' } });
    
    return (
        <h1>My Component</h1>
    );
}
export default MyComponent;
```
#### useTrackMetric
```
const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    const trackComponent = useTrackMetric(appInsights, "MyComponent");
    
    return (
        <h1 onHover={trackComponent} onClick={trackComponent}>My Component</h1>
    );
}
```
#### useTrackEvent
```
import React, { useState, useEffect } from "react";
import { useAppInsightsContext, useTrackEvent } from "@microsoft/applicationinsights-react-js";

const MyComponent = () => {
    const appInsights = useAppInsightsContext();
    const [cart, setCart] = useState([]);
    const trackCheckout = useTrackEvent(appInsights, "Checkout", cart);
    const trackCartUpdate = useTrackEvent(appInsights, "Cart Updated", cart);
    useEffect(() => {
        trackCartUpdate({ cartCount: cart.length });
    }, [cart]);
    
    const performCheckout = () => {
        trackCheckout();
        // submit data
    };
    
    return (
        <div>
            <ul>
                <li>Product 1 <button onClick={() => setCart([...cart, "Product 1"])}>Add to Cart</button></li>
                <li>Product 2 <button onClick={() => setCart([...cart, "Product 2"])}>Add to Cart</button></li>
                <li>Product 3 <button onClick={() => setCart([...cart, "Product 3"])}>Add to Cart</button></li>
                <li>Product 4 <button onClick={() => setCart([...cart, "Product 4"])}>Add to Cart</button></li>
            </ul>
            <button onClick={performCheckout}>Checkout</button>
        </div>
    );
}

export default MyComponent;
```
#### Click Analytics Auto-collection plugin
自动跟踪网页上的单击事件，并使用 HTML 元素上的 data-* 属性来填充事件遥测数据。
```
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ClickAnalyticsPlugin } from '@microsoft/applicationinsights-clickanalytics-js';

const clickPluginInstance = new ClickAnalyticsPlugin();
// Click Analytics configuration
const clickPluginConfig = {
  autoCapture: true
};
// Application Insights Configuration
const configObj = {
  instrumentationKey: "YOUR INSTRUMENTATION KEY",
  extensions: [clickPluginInstance],
  extensionConfig: {
    [clickPluginInstance.identifier]: clickPluginConfig
  },
};

const appInsights = new ApplicationInsights({ config: configObj });
appInsights.loadAppInsights();
```
#### 监视对象
+ User   用浏览器cookie中存储的匿名id区分用户 
     > JavaScript SDK 自动生成匿名用户和会话 ID，然后在从应用发送这些 ID 后使用这些 ID 填充遥测事件。
+ Session 不活动半小时重新记Session 活动24h后重新记Session
+ Event 每次执行trackEvent逻辑 Event参数已加入一组标准属性，包括匿名用户id（anonymous user ID）QQs存疑！
#### 其他
[cookie处理](https://docs.microsoft.com/zh-cn/azure/azure-monitor/app/javascript#cookie-handling) [visit time](https://docs.microsoft.com/zh-cn/azure/azure-monitor/app/javascript#enable-time-on-page-tracking)
