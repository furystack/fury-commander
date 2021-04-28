import { createComponent, Shade } from '@furystack/shades'
import { FileListPanel } from './file-list-panel'

export const Layout = Shade({
  shadowDomName: 'fury-commander-layout',
  render: ({ injector }) => {
    return (
      <div style={{ display: 'flex', backgroundColor: 'black', color: 'white', width: '100%', height: '100%' }}>
        <FileListPanel
          style={{ flexGrow: '1', flexShrink: '0' }}
          injector={injector.createChild({ owner: 'file-list-panel-1' })}
        />
        <FileListPanel
          style={{ flexGrow: '1', flexShrink: '0' }}
          injector={injector.createChild({ owner: 'file-list-panel-2' })}
        />
      </div>
    )
  },
})
