import { Dirent, promises } from 'fs'
import { join } from 'path'
import { Injectable } from '@furystack/inject'
import { Disposable, ObservableValue, ValueObserver } from '@furystack/utils'
import { shell } from 'electron'
import { CurrentWorkDir } from './current-workdir'

@Injectable({ lifetime: 'scoped' })
export class FileListPanelService implements Disposable {
  public hasFocus = new ObservableValue<boolean>()
  public focusedEntry = new ObservableValue<Dirent>()
  public selectedEntries = new ObservableValue<Dirent[]>([])
  public searchTerm = new ObservableValue<string>('')

  public async activate(entry?: Dirent) {
    const path = this.currentWorkDir.path.getValue()
    if (entry.name === '..') {
      this.currentWorkDir.goUp()
    } else if (entry.isDirectory()) {
      this.currentWorkDir.change(join(path, entry.name))
    } else if (entry.isSymbolicLink()) {
      const symLinkTarget = await promises.readlink(join(path, entry.name))
      this.currentWorkDir.change(symLinkTarget)
    } else if (entry.isFile()) {
      shell.openPath(join(path, entry.name))
    } else {
      console.log('Unhandled file entry', entry)
    }
  }

  public keyPressHandler(ev: KeyboardEvent) {
    const entries = this.currentWorkDir.entries.getValue()
    const hasFocus = this.hasFocus.getValue()
    const selectedEntries = this.selectedEntries.getValue()
    const focusedEntry = this.focusedEntry.getValue()
    const searchTerm = this.searchTerm.getValue()

    if (!hasFocus) {
      if (ev.key === 'Tab') {
        this.hasFocus.setValue(true)
      }
      return
    }
    switch (ev.key) {
      case ' ':
        this.selectedEntries.setValue(
          selectedEntries.includes(focusedEntry)
            ? selectedEntries.filter((e) => e !== focusedEntry)
            : [...selectedEntries, focusedEntry],
        )
        break
      case '*':
        this.selectedEntries.setValue(entries.filter((e) => !selectedEntries.includes(e)))
        break
      case 'ArrowUp':
        this.focusedEntry.setValue(entries[Math.max(0, entries.findIndex((e) => e === focusedEntry) - 1)])
        break
      case 'ArrowDown':
        this.focusedEntry.setValue(
          entries[Math.min(entries.length - 1, entries.findIndex((e) => e === focusedEntry) + 1)],
        )
        break
      case 'Home': {
        this.focusedEntry.setValue(entries[0])
        break
      }
      case 'End': {
        this.focusedEntry.setValue(entries[entries.length - 1])
        break
      }
      case 'Enter': {
        this.activate(focusedEntry)
        break
      }
      case 'Backspace': {
        this.currentWorkDir.goUp()
        break
      }
      case 'Tab': {
        this.hasFocus.setValue(!hasFocus)
        break
      }
      case 'Escape': {
        this.searchTerm.setValue('')
        this.selectedEntries.setValue([])
        break
      }
      default:
        if (ev.key.length === 1 && new RegExp(/[a-zA-z0-9]/).test(ev.key)) {
          const newSearchExpression = searchTerm + ev.key
          const newFocusedEntry = entries.find((e) => e.name.startsWith(newSearchExpression))
          this.focusedEntry.setValue(newFocusedEntry)
          this.searchTerm.setValue(newSearchExpression)
        } else {
          console.log(`Handler for '${ev.key}' not registered`)
        }
    }
  }

  private entriesObserver: ValueObserver<Dirent[]>

  constructor(public readonly currentWorkDir: CurrentWorkDir) {
    this.entriesObserver = currentWorkDir.entries.subscribe((entries) => {
      this.focusedEntry.setValue(entries[0])
      this.selectedEntries.setValue([])
    })
  }
  public async dispose() {
    this.searchTerm.dispose()
    this.focusedEntry.dispose()
    this.selectedEntries.dispose()
    this.entriesObserver.dispose()
  }
}
