import * as React from 'react'
import { render } from 'react-dom'

export const Root: React.FC = () => (
  <React.StrictMode>
    <div>123</div>
  </React.StrictMode>
)

render(<Root />, document.getElementById('root'))
