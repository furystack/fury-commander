import { exec } from 'child_process'
import { Injectable } from '@furystack/inject'

@Injectable()
export class RootEntries {
  public async get(): Promise<string[]> {
    if (process.platform === 'win32') {
      return await new Promise<string[]>((resolve) =>
        exec('wmic logicaldisk get caption', (err, out, stderr) => {
          resolve(out.split('\r\n').filter((v) => v.match(/^[A-Z]:/)))
        }),
      )
    }
    return ['/']
  }
}
