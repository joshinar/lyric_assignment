import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import CsvReader from 'react-csv-reader';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import "./table.css"
const Table = ({setShow,setHistory, history, show}) => {
    const readerRef = useRef()
    const [data, setData] = useState([]);
    const fetchData = async () => {
        const res = await axios.get('http://localhost:5000/data');
        setData(res.data);
      };
    
      const fetchHistory=async()=>{
        const res = await axios.get('http://localhost:5000/history');
        setHistory(res.data);
        setShow(true)
      }
    const handleSave = async (id, field, value, row, col) => {
        const res = await axios.put(`http://localhost:5000/data/${id}`, { field, value,row,col });
        const { oldValue, newValue } = res.data;
        setHistory([...history, { id, field, oldValue, newValue, dateModified: new Date() }]);
      };
    
    const handleFileUpload = async (data) => {
        const arrayToCSV = (arr, delimiter = ',') =>arr.map(v => v.map(x => `"${x}"`).join(delimiter)).join('\n')
        const file = arrayToCSV(data,',')
        await axios.post('http://localhost:5000/upload', { file});
        fetchData();
      };
    
    let columns = Object.keys(data[0] || {}).map((key) => ({
        dataField: key,
        text: key,
        editable: true,
      }));
      columns = columns.filter(col=>col.dataField!=="_id")
    const afterSaveCell = (oldValue, newValue, row, column) => {
     const columnNum =(Object.keys(data[0])).indexOf(column.dataField)
     let rowNum;
     data.forEach((obj, idx)=>{
        if(obj._id == row._id)rowNum = idx})
    handleSave(row._id, column.dataField, newValue,rowNum+1,columnNum)
};
useEffect(() => {fetchData()}, []);
       
  return (
    <Container className="container" >
        <div style={{margin:'1rem 0'}}>
    <span>React Data grid</span>
    <Row className='flex' >
        <Col sm={10}><span style={{fontSize:'0.6rem', fontWeight:500}}>A data grid is an architecture or set of services that gives individuals or groups of users the ability to access, modify and transfer extremely large amounts of geographically distributed data for research purposes</span></Col>
        <Col sm={2}><button className='upload-btn' onClick={()=>readerRef.current.click()}>  <i className="fa fa-upload"></i> Upload File</button></Col>
      </Row>
      </div>
      {columns.length>0?
      <>
      <div style={{display:'flex', justifyContent:'end', margin:'10px 0'}}><i className="fa fa-clock-o" style={{cursor:'pointer'}} onClick={()=>fetchHistory()}></i></div>
      <BootstrapTable
        keyField="_id"
        data={data}
        columns={[...columns]}
        cellEdit={cellEditFactory({ mode: 'click', blurToSave: true, afterSaveCell })}
      />
      </>
      : <div style={{display:'grid', height:'70vh', placeContent:'center', borderRadius:'5px', boxShadow:'1px 1px 1px 1px rgba(0,0,0,0.1)'}}>
        <span>Upload a csv file..</span>.
        </div>}
      <div hidden><CsvReader ref={readerRef} onFileLoaded={handleFileUpload}/></div>
    </Container>
  )
}

export default Table