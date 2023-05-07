import { useState} from 'react';
import Header from './components/navbar/Navbar';
import Table from './components/table/Table';
import History from './components/history/History';


const App = () => {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState([]);
  return (
    <>
    <Header/>
    <Table setShow={setShow} show={show} setHistory={setHistory} history={history}/>
    <History show={show} history={history} setShow={setShow}/>
    </>
    );
  };

export default App;
