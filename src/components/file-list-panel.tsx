import { Dirent } from 'fs'
import { join } from 'path'
import { Injector } from '@furystack/inject'
import { createComponent, Shade } from '@furystack/shades'
import { CurrentWorkDir } from '../services/current-workdir'
import { FileEntry } from './file-entry'
import { Breadcrumbs } from './breadcumbs'

export const FileListPanel = Shade<
  { injector: Injector; style?: Partial<CSSStyleDeclaration> },
  { entries: Dirent[]; isLoading: boolean; path: string; selectedEntries: Dirent[]; focusedEntry?: Dirent }
>({
  shadowDomName: 'file-list-panel',
  getInitialState: ({ props }) => {
    const wd = props.injector.getInstance(CurrentWorkDir)
    return {
      entries: wd.entries.getValue(),
      isLoading: wd.isLoading.getValue(),
      path: wd.path.getValue(),
      selectedEntries: [],
    }
  },
  constructed: ({ props, updateState }) => {
    const wd = props.injector.getInstance(CurrentWorkDir)
    const observers = [
      wd.entries.subscribe((entries) => updateState({ entries })),
      wd.isLoading.subscribe((isLoading) => updateState({ isLoading })),
      wd.path.subscribe((path) => updateState({ path })),
    ]
    return () => observers.forEach((o) => o.dispose())
  },
  render: ({ getState, injector, props, updateState }) => {
    const { entries, isLoading, path, selectedEntries, focusedEntry } = getState()
    return (
      <div>
        {/* Breadcrumb */}
        <Breadcrumbs path={path} />
        <div
          style={{ padding: '0.4em', userSelect: 'none' }}
          onkeypress={(ev) => {
            /** */
          }}>
          {getState().entries.map((entry) => (
            <FileEntry
              isSelected={selectedEntries.includes(entry)}
              isFocused={focusedEntry === entry}
              onClick={(ev) => {
                updateState({
                  focusedEntry: entry,
                  selectedEntries: ev.shiftKey
                    ? [...selectedEntries, entry]
                    : ev.ctrlKey
                    ? selectedEntries.includes(entry)
                      ? selectedEntries.filter((e) => e !== entry)
                      : [...selectedEntries, entry]
                    : [entry],
                })
              }}
              parentFolder={path}
              dirent={entry}
              onActivate={() => {
                if (entry.isDirectory()) {
                  injector.getInstance(CurrentWorkDir).change(join(path, entry.name))
                } else {
                  console.log('Open', entry)
                }
              }}
            />
          ))}
        </div>
      </div>
    )
  },
})
