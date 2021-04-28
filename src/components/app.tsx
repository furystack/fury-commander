import { createComponent, Shade } from '@furystack/shades'
import { Layout } from './layout'

export const App = Shade({
  shadowDomName: 'fury-commander-app',
  render: () => {
    return <Layout />
  },
})
