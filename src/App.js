import './stylesheets/app.css'
import './stylesheets/index.css'
import Items from './components/Items'

const App = () => {
  return (
    <div className="App">
      <header className="App-header">  
        <div className="post-width">  
          <Items/>
        </div>
      </header>
    </div>
  );
}

export default App;
