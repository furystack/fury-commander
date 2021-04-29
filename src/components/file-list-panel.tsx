import { Dirent } from 'fs'
import { Injector } from '@furystack/inject'
import { createComponent, Shade } from '@furystack/shades'
import { ClickAwayService } from '@furystack/shades-common-components'
import { FileListPanelService } from '../services/file-list-panel'
import { FileEntry } from './file-entry'
import { Breadcrumbs } from './breadcumbs'
import { QuickSearch } from './quick-serach'

export const FileListPanel = Shade<
  { injector: Injector; style?: Partial<CSSStyleDeclaration> },
  {
    entries: Dirent[]
  }
>({
  shadowDomName: 'file-list-panel',
  getInitialState: ({ props }) => {
    const service = props.injector.getInstance(FileListPanelService)
    return {
      entries: service.currentWorkDir.entries.getValue(),
    }
  },
  constructed: ({ props, updateState, element }) => {
    const service = props.injector.getInstance(FileListPanelService)

    window.addEventListener('keydown', service.keyPressHandler.bind(service))

    const observers = [
      service.currentWorkDir.entries.subscribe((entries) => updateState({ entries })),
      new ClickAwayService(element, () => {
        service.hasFocus.setValue(false)
      }),
    ]
    return () => {
      observers.forEach((o) => o.dispose())
      window.removeEventListener('keydown', service.keyPressHandler)
    }
  },
  render: ({ getState, injector }) => {
    const { entries } = getState()
    return (
      <div
        onclick={() => injector.getInstance(FileListPanelService).hasFocus.setValue(true)}
        style={{
          border: '4px double white',
          background: 'darkblue',
          height: 'calc(100% - 8px)',
          overflow: 'hidden',
        }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '0.4em',
            marginBottom: '0.3em',
            borderBottom: '1px solid white',
          }}>
          <Breadcrumbs />
          <QuickSearch />
        </div>
        <div style={{ padding: '0.4em', userSelect: 'none', height: 'calc(100% - 3.6em)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
            {entries.map((entry) => (
              <FileEntry entry={entry} />
            ))}
          </div>
        </div>
      </div>
    )
  },
})
