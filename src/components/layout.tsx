import { createComponent, Shade } from '@furystack/shades'
import { FileListPanel } from './file-list-panel'

export const Layout = Shade<unknown, { activePanel: number }>({
  getInitialState: () => ({ activePanel: 0 }),
  shadowDomName: 'fury-commander-layout',
  render: ({ injector, getState, element }) => {
    const { activePanel } = getState()
    setTimeout(() => {
      ;(element.querySelector('file-list-panel div') as HTMLDivElement)?.click()
    }, 1)
    return (
      <div style={{ display: 'flex', backgroundColor: 'black', color: 'white', width: '100%', height: '100%' }}>
        <FileListPanel
          style={{ width: '50%', flexShrink: '0' }}
          injector={injector.createChild({ owner: 'file-list-panel-1' })}
        />
        <FileListPanel
          style={{ width: '50%', flexShrink: '0' }}
          injector={injector.createChild({ owner: 'file-list-panel-2' })}
        />
      </div>
    )
  },
})
