import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SeqContextProvider } from './context/SeqContext.tsx'
import { TimerContextProvider } from './context/TimerContext.tsx'

export type PropsWithChildren<T> = T & {children: ReactElement}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <TimerContextProvider>
        <SeqContextProvider>
          <App />
        </SeqContextProvider>
      </TimerContextProvider>
  </React.StrictMode>,
)
