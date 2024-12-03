import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.less'
import setupHuaweiSDK from './modules/sdk/huawei'
import { authorize } from './modules/login'

setupHuaweiSDK()

authorize().then(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
})
