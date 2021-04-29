import { Dirent } from 'fs'
import { createComponent, Shade } from '@furystack/shades'
import { FileListPanelService } from '../services/file-list-panel'

const getBackgroundColor = (isFocused: boolean, isPanelFocused: boolean) =>
  isFocused ? (isPanelFocused ? 'cyan' : 'darkcyan') : 'transparent'

const getTextColor = (isFocused: boolean, isSelected: boolean) =>
  isSelected ? (isFocused ? 'orange' : 'yellow') : isFocused ? 'black' : 'white'

const updateColors = (element: HTMLDivElement, isFocused: boolean, isPanelFocused: boolean, isSelected: boolean) => {
  element.style.backgroundColor = getBackgroundColor(isFocused, isPanelFocused)
  element.style.color = getTextColor(isFocused, isSelected)
}

export const FileEntry = Shade<
  {
    entry: Dirent
  },
  { isPanelFocused: boolean; isFocused: boolean; isSelected: boolean }
>({
  shadowDomName: 'file-entry',
  constructed: ({ injector, updateState, props, element, getState }) => {
    const service = injector.getInstance(FileListPanelService)
    const disposables = [
      service.selectedEntries.subscribe((selecteds) => {
        const state = getState()
        const isSelected = selecteds.includes(props.entry)
        updateColors(element.querySelector('div'), state.isFocused, state.isPanelFocused, isSelected)
        updateState({ isSelected }, true)
      }),
      service.focusedEntry.subscribe((focused) => {
        const state = getState()
        const isFocused = focused === props.entry
        updateColors(element.querySelector('div'), isFocused, state.isPanelFocused, state.isSelected)
        updateState({ isFocused }, true)
        if (isFocused) {
          element.scrollIntoView({
            behavior: 'auto',
          })
        }
      }),
      service.hasFocus.subscribe((hasFocus) => {
        const state = getState()
        updateColors(element.querySelector('div'), state.isFocused, hasFocus, state.isSelected)
        updateState({ isPanelFocused: hasFocus }, true)
      }),
    ]
    return () => disposables.forEach((d) => d.dispose())
  },
  getInitialState: ({ injector, props }) => {
    const service = injector.getInstance(FileListPanelService)
    return {
      isFocused: service.focusedEntry.getValue() === props.entry,
      isSelected: service.selectedEntries.getValue().includes(props.entry),
      isPanelFocused: service.hasFocus.getValue(),
    }
  },
  render: ({ props, getState, injector }) => {
    const service = injector.getInstance(FileListPanelService)
    const { isFocused, isSelected, isPanelFocused } = getState()

    return (
      <div
        onclick={() => {
          service.focusedEntry.setValue(props.entry)
        }}
        ondblclick={() => {
          service.activate(props.entry)
        }}
        style={{
          backgroundColor: isFocused
            ? isPanelFocused
              ? 'cyan'
              : 'darkcyan'
            : isSelected
            ? 'rgba(128,128,128,0.25)'
            : 'transparent',
          color: isFocused ? 'black' : isSelected ? 'yellow' : 'white',
          fontWeight: isFocused ? 'bolder' : 'lighter',
        }}>
        {props.entry.name}
      </div>
    )
  },
})
