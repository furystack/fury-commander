import { promises, Dirent } from 'fs'
import { sep } from 'path'
import { Injectable } from '@furystack/inject'
import { Disposable, ObservableValue } from '@furystack/utils'

@Injectable({ lifetime: 'scoped' })
export class CurrentWorkDir implements Disposable {
  public async dispose(): Promise<void> {
    /** */
    this.path.dispose()
    this.isLoading.dispose()
    this.entries.dispose()
  }
  public path = new ObservableValue('c:\\')

  public isLoading = new ObservableValue(false)
  public entries = new ObservableValue<Dirent[]>([])

  public async change(newWorkDir: string) {
    try {
      this.isLoading.setValue(true)

      const entries = await promises.readdir(newWorkDir, {
        encoding: 'utf-8',
        withFileTypes: true,
      })
      this.path.setValue(newWorkDir)
      if (newWorkDir.split(sep).filter((s) => s).length > 1) {
        const parent = new Dirent()
        parent.name = '..'
        this.entries.setValue([parent, ...entries])
      } else {
        this.entries.setValue(entries)
      }
    } catch (error) {
      /** */
    } finally {
      this.isLoading.setValue(false)
    }
  }

  public async goUp(level = 1) {
    const segments = this.path
      .getValue()
      .split(sep)
      .filter((s) => s)

    const steps = Math.min(level, segments.length - 1)

    const parent = steps ? segments.slice(0, -steps).join(sep) + sep : this.path.getValue()
    await this.change(parent)
  }

  /**
   *
   */
  constructor() {
    this.change(this.path.getValue())
  }
}
