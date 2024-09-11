import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Filter from './components/filter';

function App() {
  return (
    <div className="App">
      <Header />
      <main id='listings-page'>
        <Filter />
      </main>
    </div>
  );
}

export default App;
