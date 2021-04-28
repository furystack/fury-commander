import { promises, Dirent } from 'fs'
import { Injectable } from '@furystack/inject'
import { Disposable, ObservableValue } from '@furystack/utils'

@Injectable({ lifetime: 'scoped' })
export class CurrentWorkDir implements Disposable {
  public async dispose(): Promise<void> {
    /** */
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
      this.entries.setValue(entries)
    } catch (error) {
      /** */
    } finally {
      this.isLoading.setValue(false)
    }
  }

  /**
   *
   */
  constructor() {
    this.change(this.path.getValue())
  }
}
