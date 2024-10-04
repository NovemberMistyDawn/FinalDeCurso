// Configuración de Firebase
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "proyecto-fin-de-curso-7a060",
    storageBucket: "",
    messagingSenderId: "",
    appId: "1:25418583635:web:08fa7d1b5dd74d76d540a6"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Referencia a la base de datos de Firebase
var db = firebase.database();

// Verificamos si ya hay un nombre guardado en localStorage
window.onload = function () {
    const name = getName();
    if (name) {
        // Si hay un nombre, mostramos el chat y cargamos los mensajes
        document.getElementById('nameContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'block';
        displayMessages();
    }
};

// Función para guardar el nombre del usuario
function saveName() {
    const nameInput = document.getElementById('nameInput').value.trim();
    
    if (nameInput) {
        localStorage.setItem('name', nameInput); // Guardamos el nombre en localStorage
        document.getElementById('nameContainer').style.display = 'none'; // Ocultamos el formulario del nombre
        document.getElementById('chatContainer').style.display = 'block'; // Mostramos el chat
        displayMessages(); // Cargamos los mensajes
    } else {
        alert('Por favor, introduce un nombre válido.');
    }
}

// Función para obtener el nombre del usuario desde localStorage
function getName() {
    return localStorage.getItem('name') || null;
}

// Función para enviar el mensaje al chat
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();

    if (message) {
        const name = getName(); // Obtenemos el nombre del usuario
        if (name) {
            // Guardamos el mensaje en la base de datos de Firebase
            db.ref('chats/').push({
                name: name,
                message: message,
                timestamp: Date.now()
            });
            input.value = ''; // Limpiamos el input
        } else {
            alert('Por favor, introduce tu nombre.');
        }
    }
}

// Función para mostrar los mensajes del chat
function displayMessages() {
    const messagesContainer = document.getElementById('messages');

    // Obtenemos los mensajes desde Firebase en tiempo real
    db.ref('chats/').on('child_added', function(snapshot) {
        const data = snapshot.val();
        const name = data.name;
        const message = data.message;

        // Crear el contenedor del nuevo mensaje
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'received');
        messageElement.textContent = `${name}: ${message}`;
        
        // Añadir el mensaje al contenedor
        messagesContainer.appendChild(messageElement);

        // Hacer scroll hacia abajo cuando se añada un nuevo mensaje
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
}