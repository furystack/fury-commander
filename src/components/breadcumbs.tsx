import { sep } from 'path'
import { createComponent, Shade } from '@furystack/shades'
import { CurrentWorkDir } from '../services/current-workdir'

export const Breadcrumbs = Shade<{ path: string }>({
  shadowDomName: 'fury-commander-breadcrumbs',
  render: ({ injector, props }) => {
    const pathSegments = props.path.split(sep).filter((seg) => seg)
    return (
      <div style={{ padding: '0.4em', marginBottom: '0.3em', borderBottom: '1px solid rgba(128,128,128,0.3)' }}>
        {pathSegments.map((seg, i) => {
          const segmentPath = pathSegments.slice(0, i + 1).join(sep) + sep
          return (
            <a
              onclick={() => injector.getInstance(CurrentWorkDir).change(segmentPath)}
              title={segmentPath}
              style={{ cursor: 'pointer' }}>
              {seg} {sep}&nbsp;
            </a>
          )
        })}
      </div>
    )
  },
})
