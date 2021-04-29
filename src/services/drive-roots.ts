import { Injectable } from '@furystack/inject'
import { exec } from 'node:child_process'

@Injectable()
export class DriveRoots {
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
