import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import './home.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import { IconContext } from "react-icons";
import { BsXLg } from "react-icons/bs";
import { FaCoins, FaEuroSign, FaSearch, FaCalendar } from "react-icons/fa";

import { APIService } from "../services/api";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Alert from 'react-bootstrap/Alert';

import moment from 'moment';

function AdminPage() {

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [cotation, setCotation] = useState([]);
  const [cryptoList, setCryptoList] = useState([]);


  const [defaultPrix, setDefaultPrix] = useState(null);


  const [disabled, setDisabled] = useState(true);
  const [date, setDate] = useState(null);
  const [crypto, setCrypto] = useState(null);
  const [quantite, setQuantite] = useState(null);
  const [prix, setPrix] = useState(null);

  const defaultDate = moment().format('YYYY-MM-D');


  const parseCotation = (c) => {
    return {
      crypto: c.crypto,
      date: new Date(c.date),
      prix: parseFloat(c.prix),
      change: parseFloat(c.change)
    }
  }

  useEffect(() => {
    APIService.getCotation()
      .then(
        (result) => {
          result  = result.map(parseCotation);
          setCotation(result);
          var cryptoList = result.map(c => c.crypto).filter((v,
            i, a) => a.indexOf(v) === i);
          setCryptoList(cryptoList);
        },
        (error) => {
          setError(error);
        }
      )
  }, [])

  useEffect(() => {
    setDefaultPrix(quantite && crypto ? parseFloat(quantite) * crypto?.prix: '');}
  , [quantite, crypto]);


  useEffect(() => {
    setDisabled( ! (quantite && crypto));}
  , [quantite, crypto]);


  const selectCrypto = (e) => {
    var sc = cotation.filter(v=> v.crypto === e.target.value)[0];
    setCrypto(sc);
    setDisabled(selectCrypto !== null && quantite != null)
  }


  const submitTransaction = () => {
    APIService.createTransaction(date || defaultDate, crypto.crypto, quantite, prix || defaultPrix).then((result) => {
      navigate('/transaction');
    })
  }



  return (
    <IconContext.Provider value={{ color: "white" }}>
      <div className='d-flex flex-column p-3 h-100'>
        <div className='d-flex flex-row p-3'>
          <div className=''>
            <Link id='back' to="/actifs" ><BsXLg />
            </Link>
          </div>
          <div className='flex-fill text-center'>Ajouter une transaction</div>
          <div className=''>
            <BsXLg className="invisible" />
          </div>
        </div>
        <div className='flex-fill'> </div>
        <div className='flex-fill'>
          <InputGroup className="mb-5">
            <InputGroup.Text className='text-white bg-dark'><FaCalendar /></InputGroup.Text>
            <Form.Control id="date-input" type="date"  placeholder="date" className='text-white bg-dark' defaultValue={defaultDate} onChange={(e) => setDate(e.target.value)}/>
          </InputGroup>
          <InputGroup className="mb-5">
            <InputGroup.Text className='text-white bg-dark'><FaSearch /></InputGroup.Text>
            <Form.Select id="crypto-input" aria-label="Default select example" className='text-white bg-dark' onChange={selectCrypto} >
              <option className="text-black-50">Sélectionner une crypto</option>
              {cryptoList.map(c => (<option key={c} value={c}>{c}</option>))}
            </Form.Select>
          </InputGroup>
          <InputGroup className="mb-5">
            <InputGroup.Text className='text-white bg-dark'><FaCoins /></InputGroup.Text>
            <Form.Control id="quantite-input" placeholder="Quantité" className='text-white bg-dark' onChange={(e) => setQuantite(e.target.value)}/>
          </InputGroup>
          <InputGroup className="mb-5">
            <InputGroup.Text className='text-white bg-dark'><FaEuroSign /></InputGroup.Text>
            <Form.Control id="prix-input" placeholder="Prix d'prix" className='text-white bg-dark' defaultValue={defaultPrix} onChange={(e) => setPrix(e.target.value)}/>
          </InputGroup>
        </div>
        <div className='flex-fill text-center'> <Button  id="submit" className="btn text-white bg-dark btn-outline-light my-2" onClick={submitTransaction} disabled={disabled}>Enregistrer une transaction</Button></div>
      </div>
      {error? <Alert variant='warning'>{error}</Alert> : ''}
    </IconContext.Provider>
  );
}

export default AdminPage;
