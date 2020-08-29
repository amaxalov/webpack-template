import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { App } from './App'

export const Root: React.FC<unknown> = () => (
  <React.StrictMode>
    <App lang='12' />
  </React.StrictMode>
)

ReactDOM.render(<Root />, document.getElementById('root'))
