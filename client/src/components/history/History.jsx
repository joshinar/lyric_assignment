import React from 'react'
import moment from 'moment'

const History = ({setShow, show, history}) => {
  return (
    <>{show  &&<div style={{position:'absolute', top:0, right:0, width:'25%', height:'100%', background:'#fff', boder:'1px solid grey'}}>
    <div style={{background:'#3D5DCB', display:'flex', padding:'5px',justifyContent:'space-between', alignItems:'center', color:'white'}}>
      <span>History</span>
      <i className="fa fa-close" style={{cursor:'pointer'}} onClick={()=>setShow(false)}></i>
    </div>
    {history.length<1?<div style={{display:'grid', height:'70vh', placeItems:'center'}}><span>No History</span></div>:<div style={{padding:'1rem'}}>{history.map(obj=><>
      <span style={{letterSpacing:'0.5px', fontSize:'0.8rem'}}><i className="fa fa-circle-o" style={{color:'#3D5DCB'}}></i> {moment(obj._id).format("MMMM DD, YYYY")}</span>
      <>
        {obj.messages.map(msg=><div style={{display:'flex', justifyContent:'space-between', alignItems:'center',  fontSize:'0.8rem', padding:5}}>
          <span>{msg.message}</span>
          <span>{moment(msg.timestamp).format("HH:MM")}</span>
        </div>)}
      </>
    </>)}</div>}
  </div>}</>
  )
}

export default History