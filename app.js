import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getDatabase, 
    ref, 
    update, 
    increment 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD6wkKHQ9D6CQI5mxQzhxYII43oUXi_foY",
  authDomain: "app-votacao-8246b.firebaseapp.com",
  databaseURL: "https://app-votacao-8246b-default-rtdb.firebaseio.com",
  projectId: "app-votacao-8246b",
  storageBucket: "app-votacao-8246b.firebasestorage.app",
  messagingSenderId: "191382716408",
  appId: "1:191382716408:web:55795293fcdd56e04fa00d"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app)

var logincontainer = document.getElementById('login-container')
var votacaocontainer = document.getElementById('votacao-container')
var loginform = document.getElementById('login-form')
var loginerro = document.getElementById('login-erro')
var btnsair = document.getElementById('btn-sair')

loginform.addEventListener('submit', (e)=>{
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    signInWithEmailAndPassword(auth, email, senha)
    .catch( ()=>{
        loginerro.textContent = "ERRO: E-mail ou senha incorreta"
    })

})


btnsair.addEventListener('click', ()=> signOut(auth))

onAuthStateChanged(auth, async(usuario)=>{
  if(usuario){
    logincontainer.style.display = 'none'
    votacaocontainer.style.display = 'block'
  }
  else{
    logincontainer.style.display = 'flex'
    votacaocontainer.style.display = 'none'
  }
})

// Envia o voto para o Realtime Database
async function votarCandidato(id) {
    const usuario = auth.currentUser;
    if(!usuario) return

    const votoUsuarioRef = ref(db, "votos_usuarios/"+usuario.uid)
    const candidatoEspecificoRef = ref(db, "candidatos/"+id)

    try{
        const javotou = await getAuth(votoUsuarioRef)
        if(javotou.exists()){
          alert("Voce ja votou! Não é possivel alterae o voto")
          return
        }
        await update(candidatoEspecificoRef, 
          {votos: increment(1)})
        await set(votoUsuarioRef, id)
    }catch(error){
      alert("Ocorreu um erro ao processar seu voto")
      console.log("Erro ao votar", error)
    }
}

// Configura os cliques dos botões

const botõesVotar = document.querySelectorAll('.btn-votar')

botõesVotar.forEach((botao)=>{
  botao.addEventListener('click', (evento)=>{
    const idDoCandidato = evento.target.getAttribute('data-id')

    votarCandidato(idDoCandidato)

    document.querySelectorAll('.bolinha-verde').forEach(dot => dot.classList.remove('ativa'))

    const bolinha = document.getElementById(`dot-${idDoCandidato}`)
    if(bolinha){
      bolinha.classList.add('ativa')
    }

  })
})