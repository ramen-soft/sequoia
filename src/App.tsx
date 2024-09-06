import { useContext, useState } from 'react';
import './App.css'
import { SeqContext } from './context/SeqContext';
import { PatternEditor } from './components/playlist/PatternEditor';
import { PianoRoll } from './components/pianoroll/PianoRoll';
import { useProjectStore } from './states/ProjectState';
import { PatternDefinition } from './models/models';

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

      <button onClick={()=>{
        const pattern : PatternDefinition = {"name":"Pattern 01","steps":16,"channels":[{"instrument":"sequoia/piano","name":"Channel 01","checkpoints":[{"note":261.626,"time":{"start":0,"end":50,"duration":156.25},"step":0},{"note":261.626,"time":{"start":156,"end":206,"duration":156.25},"step":1},{"note":391.995,"time":{"start":312,"end":362,"duration":156.25},"step":2},{"note":261.626,"time":{"start":468,"end":518,"duration":156.25},"step":3},{"note":415.305,"time":{"start":625,"end":675,"duration":156.25},"step":4},{"note":261.626,"time":{"start":781,"end":831,"duration":156.25},"step":5},{"note":391.995,"time":{"start":937,"end":987,"duration":156.25},"step":6},{"note":261.626,"time":{"start":1093,"end":1143,"duration":156.25},"step":7},{"note":349.228,"time":{"start":1250,"end":1300,"duration":156.25},"step":8},{"note":311.127,"time":{"start":1406,"end":1456,"duration":156.25},"step":9},{"note":293.665,"time":{"start":1562,"end":1612,"duration":156.25},"step":10},{"note":311.127,"time":{"start":1718,"end":1768,"duration":156.25},"step":11},{"note":349.228,"time":{"start":1875,"end":1925,"duration":156.25},"step":12},{"note":311.127,"time":{"start":2031,"end":2081,"duration":156.25},"step":13},{"note":293.665,"time":{"start":2187,"end":2237,"duration":156.25},"step":14},{"note":233.082,"time":{"start":2343,"end":2393,"duration":156.25},"step":15}],"notes":[],"type":"pad"},{"instrument":"sequoia/kick","name":"Channel 02","notes":[],"checkpoints":[{"note":261.626,"time":{"start":0,"end":50,"duration":156.25},"step":0},{"note":261.626,"time":{"start":625,"end":675,"duration":156.25},"step":4},{"note":261.626,"time":{"start":1250,"end":1300,"duration":156.25},"step":8},{"note":261.626,"time":{"start":1875,"end":1925,"duration":156.25},"step":12}],"type":"pad"},{"instrument":"sequoia/snare","name":"Channel 03","notes":[],"checkpoints":[{"note":261.626,"time":{"start":625,"end":675,"duration":156.25},"step":4},{"note":261.626,"time":{"start":1875,"end":1925,"duration":156.25},"step":12}],"type":"pad"},{"instrument":"sequoia/hithat","name":"Channel 04","notes":[],"checkpoints":[{"note":261.626,"time":{"start":0,"end":50,"duration":156.25},"step":0},{"note":261.626,"time":{"start":312,"end":362,"duration":156.25},"step":2},{"note":261.626,"time":{"start":625,"end":675,"duration":156.25},"step":4},{"note":261.626,"time":{"start":937,"end":987,"duration":156.25},"step":6},{"note":261.626,"time":{"start":1250,"end":1300,"duration":156.25},"step":8},{"note":261.626,"time":{"start":1562,"end":1612,"duration":156.25},"step":10},{"note":261.626,"time":{"start":1875,"end":1925,"duration":156.25},"step":12},{"note":261.626,"time":{"start":2187,"end":2237,"duration":156.25},"step":14}],"type":"pad"}]};
        console.log(pattern);
        project.setPattern(0, pattern);
      }}>Load song</button>
    </>
  );
}

export default App
