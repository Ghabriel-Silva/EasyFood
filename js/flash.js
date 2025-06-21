window.addEventListener('DOMContentLoaded', () => {
    const flash = document.getElementById('flash-msg');
    if (flash) {
        setTimeout(() => {
            flash.classList.add('fade-out');

            // Aguarda o efeito de fade-out, depois remove o elemento do DOM
            setTimeout(() => {
                flash.remove(); // REMOVE completamente o elemento
            }, 500); // igual ao tempo da transição
        }, 3000); // tempo que a mensagem fica visível
    }
});
