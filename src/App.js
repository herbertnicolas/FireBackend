import firebase from "./firebaseConnection";
import './style.css';
import { useState, useEffect } from 'react';

function App(){
  //dados user
  const [ nome, setNome ] = useState('')
  const [ cargo, setCargo ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ senha, setSenha ] = useState('')

  const [ user, setUser ] = useState({})
  useEffect(()=>{
    
  },[])

  async function login(){

    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then((snapshot)=>{
      setUser({
        nome: snapshot.data().nome,
        cargo: snapshot.data().cargo,
        email: snapshot.data().email,
        senha: snapshot.data().senha
      })
    })
  }

  async function signUp(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then(async (value) => {
      await firebase.firestore().collection('users')
        .doc(value.user.uid)
        .set({
          nome: nome,
          cargo: cargo,
          status: true
        })
        .then(()=>{
          setNome('')
          setCargo('')
          setEmail('')
          setSenha('')
          alert("Usuário cadastrado com sucesso!")
        })
        .catch((error) => {
          alert("Erro no cadastro: " + error)
        })
    })
  }

  async function logout(){
    await firebase.firestore()
  }
  
  return(
    <div className="container">
      <h1>Banco de Dados de Usuarios</h1>
    
      <span>Nome</span>
      <input type="text" value={nome} onChange={(e)=>{setNome(e.target.value)}}/> <br/>
      <span>Cargo</span>
      <input type="text" value={cargo} onChange={(e)=>{setCargo(e.target.value)}}/> <br/> 
      
      <span>Email</span>
      <input type="text" value={email} onChange={(e)=>{setEmail(e.target.value)}}/> <br/>
      <span>Senha</span>
      <input type="password" value={senha} onChange={(e)=>{setSenha(e.target.value)}}/> <br/>
      <hr/>
      <button onClick={login}> Fazer Login </button>
      <button onClick={signUp}> Cadastrar </button> 
      <button onClick={logout}> Sair da Conta! </button>
      </div>
  )
}
export default App