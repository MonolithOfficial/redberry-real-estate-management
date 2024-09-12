import logo from './logo.svg';
import './App.css';
import Header from './components/header';
import Filter from './components/filter';
import Listings from './components/listings';

function App() {
  return (
    <div className="App">
      <Header />
      <main id='listings-page'>
        <Filter />
        <Listings />
      </main>
    </div>
  );
}

export default App;
