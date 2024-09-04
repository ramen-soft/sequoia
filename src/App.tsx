import { useContext, useState } from 'react';
import './App.css'
import { ProjectContext } from './context/ProjectContext';
import { SeqContext } from './context/SeqContext';
import { PatternEditor } from './components/playlist/PatternEditor';
import { PianoRoll } from './components/pianoroll/PianoRoll';

function App() {

  const { project, setProject, title } = useContext(ProjectContext);

  const { engine } = useContext(SeqContext)

  const [initialized, setInitialized] = useState(false);

  const initializeEngine = ()=>{
    engine.init();
    engine.loadInstruments(['piano','trumpet','kick','snare','hithat']).then(()=>{
      console.log(engine.instruments);
    });
    setInitialized(true);
  }

  const playNote = ()=>{
    engine.play('sequoia/hithat', [440]);
  }

  return (
    <>
      {title}
      <button onClick={initializeEngine}>Iniciar</button>
      <button disabled={!initialized} onClick={playNote}>
        Play note
      </button>

      {JSON.stringify(project.patterns)}

      { /*project.editingPattern*/ 1 &&
        <PatternEditor pattern={project.patterns[0]}>

        </PatternEditor>
      }

      <PianoRoll pattern={project.patterns[0]} channel={project.patterns[0].channels[0]}>
                
      </PianoRoll>

      <button onClick={()=>setProject({...project, ...{editingPattern: project.patterns[0]}})}>Editar</button>
      

      <button onClick={()=>setProject({...project, ...{patterns: [...project.patterns, ...[{name: 'patatin', channels: [], steps: 5}]], title: 'blu'}})}></button>
    </>
  );
}

export default App
