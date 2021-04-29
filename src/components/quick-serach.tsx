import { createComponent, Shade } from '@furystack/shades'
import { FileListPanelService } from '../services/file-list-panel'

export const QuickSearch = Shade<unknown, { searchTerm: string; hasFocus: boolean }>({
  shadowDomName: 'quick-search',
  getInitialState: ({ injector }) => ({
    searchTerm: injector.getInstance(FileListPanelService).searchTerm.getValue(),
    hasFocus: false,
  }),
  constructed: ({ injector, updateState, element, getState }) => {
    const disposable = injector.getInstance(FileListPanelService).searchTerm.subscribe((searchTerm) => {
      const { hasFocus } = getState()
      updateState({ searchTerm }, true)
      const input = element.querySelector('input') as HTMLInputElement
      const shouldHide = !searchTerm && !hasFocus
      input.style.display = shouldHide ? 'none' : 'inline'
      input.disabled = shouldHide
      if (input.value !== searchTerm) {
        setTimeout(() => {
          input.value = searchTerm
          input.focus()
        })
      }
    })
    return () => disposable.dispose()
  },
  render: ({ getState, injector, updateState }) => {
    const { searchTerm } = getState()
    return (
      <input
        type="text"
        value={searchTerm}
        style={{ display: searchTerm ? 'inline' : 'none' }}
        disabled={!searchTerm}
        onfocus={() => updateState({ hasFocus: true }, true)}
        onblur={() => updateState({ hasFocus: false }, true)}
        onkeydown={(ev) => {
          if (ev.key !== 'Escape' && ev.key !== 'Tab') {
            ev.stopImmediatePropagation()
            injector.getInstance(FileListPanelService).searchTerm.setValue((ev.target as HTMLInputElement).value)
            return true
          }
        }}
      />
    )
  },
})
