// App.js
import { useState, useEffect } from 'react';
import Header from './components/navbar/Navbar';
import Table from './components/table/Table';
import moment from 'moment'


const App = () => {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState([]);
  return (
    <>
    <Header/>
    <Table setShow={setShow} show={show} setHistory={setHistory} history={history}/>
    {show  &&<div style={{position:'absolute', top:0, right:0, width:'25%', height:'100%', background:'#fff', boder:'1px solid grey'}}>
      <div style={{background:'#3D5DCB', display:'flex', padding:'5px',justifyContent:'space-between', alignItems:'center', color:'white'}}>
        <span>History</span>
        <i className="fa fa-close" style={{cursor:'pointer'}} onClick={()=>setShow(false)}></i>
      </div>
      {history.length<1?<div style={{display:'grid', height:'70vh', placeItems:'center'}}><span>No History</span></div>:<>{history.map(obj=><>
        <p>{moment(obj._id).format("MMMM DD, YYYY")}</p>
        <ul>
          {obj.messages.map(msg=><div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'5px', fontSize:'0.8rem'}}>
            <span>{msg.message}</span>
            <span>{moment(msg.timestamp).format("HH:MM")}</span>
          </div>)}
        </ul>
      </>)}</>}
    </div>}
    </>
    );
  };

export default App;
