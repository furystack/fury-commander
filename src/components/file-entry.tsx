import { Dirent } from 'fs'
import { createComponent, Shade } from '@furystack/shades'

export const FileEntry = Shade<{
  dirent: Dirent
  parentFolder: string
  onActivate: () => void
  onClick?: (ev: MouseEvent) => void
  isSelected: boolean
  isFocused: boolean
}>({
  shadowDomName: 'file-entry',
  render: ({ props }) => {
    return (
      <div
        onclick={(ev) => props.onClick?.(ev)}
        ondblclick={() => props.onActivate()}
        style={{
          backgroundColor: props.isFocused ? 'cyan' : props.isSelected ? 'rgba(128,128,128,0.25)' : 'transparent',
          color: props.isFocused ? 'black' : props.isSelected ? 'yellow' : 'white',
          fontWeight: props.isFocused ? 'bolder' : 'lighter',
        }}>
        {props.dirent.name}
      </div>
    )
  },
})
