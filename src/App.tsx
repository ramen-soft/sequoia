import { useContext, useState } from 'react';
import './App.css'
import { SeqContext } from './context/SeqContext';
import { PatternEditor } from './components/playlist/PatternEditor';
import { PianoRoll } from './components/pianoroll/PianoRoll';
import { useProjectStore } from './states/ProjectState';

function App() {

  //const { project, setProject, title } = useContext(ProjectContext);

  const project = useProjectStore();
  const { title } = project;

  const { engine } = useContext(SeqContext)

  const [initialized, setInitialized] = useState(false);

  const initializeEngine = ()=>{
    engine.init();
    engine.loadInstruments(['piano','trumpet','kick','snare','hithat']).then(()=>{
      
      
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
      <button onClick={playNote}>
        Play note
      </button>

      {JSON.stringify(project.patterns)}

      { /*project.editingPattern*/ 1 &&
        <PatternEditor pattern={project.patterns[0]}>

        </PatternEditor>
      }

      <PianoRoll pattern={project.patterns[0]} channel={project.patterns[0].channels[0]}>
                
      </PianoRoll>
    </>
  );
}

export default App
