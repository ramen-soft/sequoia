import React, { ReactElement } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ProjectContextProvider } from './context/ProjectContext.js'
import { SeqContextProvider } from './context/SeqContext.tsx'
import { TimerContextProvider } from './context/TimerContext.tsx'

export type PropsWithChildren<T> = T & {children: ReactElement}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProjectContextProvider>
      <TimerContextProvider>
        <SeqContextProvider>
          <App />
        </SeqContextProvider>
      </TimerContextProvider>
    </ProjectContextProvider>
  </React.StrictMode>,
)
