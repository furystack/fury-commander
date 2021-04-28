// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import { Injector } from '@furystack/inject'
import { createComponent, initializeShadeRoot } from '@furystack/shades'
import { App } from './components/app'

const shadeInjector = new Injector()

const rootElement: HTMLDivElement = document.getElementById('root') as HTMLDivElement
initializeShadeRoot({
  rootElement,
  injector: shadeInjector,
  jsxElement: <App />,
})
