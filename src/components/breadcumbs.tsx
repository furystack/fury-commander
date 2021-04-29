import { sep } from 'path'
import { createComponent, Shade } from '@furystack/shades'
import { CurrentWorkDir } from '../services/current-workdir'

export const Breadcrumbs = Shade<unknown, { path: string }>({
  getInitialState: ({ injector }) => ({
    path: injector.getInstance(CurrentWorkDir).path.getValue(),
  }),
  constructed: ({ injector, updateState }) => {
    const disposables = [
      injector.getInstance(CurrentWorkDir).path.subscribe((newPath) => updateState({ path: newPath })),
    ]

    return () => disposables.forEach((d) => d.dispose())
  },
  shadowDomName: 'fury-commander-breadcrumbs',
  render: ({ injector, getState }) => {
    const { path } = getState()
    const pathSegments = path.split(sep).filter((seg) => seg)
    return (
      <div>
        {pathSegments.map((seg, i) => {
          const segmentPath = pathSegments.slice(0, i + 1).join(sep) + sep
          return (
            <a
              onclick={() => injector.getInstance(CurrentWorkDir).change(segmentPath)}
              title={segmentPath}
              style={{ cursor: 'pointer' }}>
              {seg}
              {sep}
            </a>
          )
        })}
      </div>
    )
  },
})
