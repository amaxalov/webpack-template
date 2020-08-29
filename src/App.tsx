import * as React from 'react'

export interface Props {
  lang: string
}

export const App: React.FC<Props> = ({ lang }: Props) => <h1>123 Hi from$ Rea ct! Welcome to{lang}!</h1>
