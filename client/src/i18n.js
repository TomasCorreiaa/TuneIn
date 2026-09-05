import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'en-US': {
    translation: {
      // Home
      "home_title": "Guess the music, win points!",
      "home_subtitle": "A real-time multiplayer music trivia game. Create a room, invite friends, pick your song, and see who is the fastest to guess the title and artist.",
      "nickname_label": "Your Nickname",
      "nickname_placeholder": "Ex: PlayerMusical",
      "choose_avatar": "Choose your Avatar",
      "change_avatar": "Change Avatar",
      "create_room": "Create Room",
      "join_room": "Join Room",
      "or": "or",
      "enter_code": "Enter Room Code",
      
      // Lobby
      "lobby_title": "The Waiting Room",
      "lobby_subtitle": "Pick your song in secret. Nobody will know what you picked!",
      "players_in_room": "Players in Room ({{count}})",
      "host": "(Host)",
      "kick": "Kick",
      "room_settings": "Room Settings",
      "auto_next_round": "Auto Next Round (5s)",
      "round_duration": "Round Duration",
      "seconds": "seconds",
      "only_host_settings": "Only the Host can change settings.",
      "search_placeholder": "Search for song or artist...",
      "searching": "Searching...",
      "search_hint": "Search to find your secret song.",
      "need_more_players": "⚠️ Need at least 2 players in the room to start!",
      "im_ready": "I'm Ready! (Picked: {{track}})",
      "pick_a_song": "Pick a song...",
      "music_confirmed": "Song Confirmed!",
      "waiting_for_others": "Waiting for the other players to choose...",
      
      // Arena
      "playing": "Playing...",
      "try_guess": "Try to guess the Song and Artist!",
      "guess_hint": "Type in the chat. If you guess right, you get points based on speed.",
      "title": "Title",
      "artist": "Artist",
      "guess_chat": "Guess Chat",
      "you_picked_this": "You picked this song!",
      "already_guessed_all": "You already guessed everything!",
      "type_guess": "Type your guess...",
      
      // Scoreboard
      "round_end_title": "End of Round!",
      "this_was_the_song": "This was the song played.",
      "loading_cover": "Loading cover...",
      "choice_of": "Choice of {{name}}",
      "leaderboard": "Leaderboard",
      "guessed_all": "Guessed Everything!",
      "guessed_title": "Guessed Title!",
      "guessed_artist": "Guessed Artist!",
      "next_round_starts_in": "Next round starts in...",
      "see_podium": "See Podium",
      "next_round": "Next Round",
      "waiting_for_host_next": "Waiting for Host to advance to next round...",
      "waiting_for_host_podium": "Waiting for Host to advance to podium...",
      
      // Podium
      "final_podium": "Final Podium",
      "game_ended_podium": "The game ended! Here are the best ears in the room.",
      "pts": "pts",
      "remaining_players": "Remaining Players",
      "back_to_lobby": "Back to Lobby",
      "waiting_for_host_end": "Waiting for Host to end the game...",
      
      // Shared
      "room": "Room:",
      "copied": "Link Copied!",
      "loading_room": "Loading room...",
      "error": "Error",
      "back": "Back"
    }
  },
  'pt-PT': {
    translation: {
      // Home
      "home_title": "Adivinha a música, ganha pontos!",
      "home_subtitle": "Um jogo multijogador de trivialidades musicais em tempo real. Cria uma sala, convida amigos, escolhe a tua música e vê quem é o mais rápido a adivinhar o título e o artista.",
      "nickname_label": "O teu Nickname",
      "nickname_placeholder": "Ex: JogadorMusical",
      "choose_avatar": "Escolhe o teu Avatar",
      "change_avatar": "Mudar Avatar",
      "create_room": "Criar Sala",
      "join_room": "Juntar à Sala",
      "or": "ou",
      "enter_code": "Insere o Código",
      
      // Lobby
      "lobby_title": "A Sala de Espera",
      "lobby_subtitle": "Escolhe a tua música em segredo. Ninguém vai saber o que escolheste!",
      "players_in_room": "Jogadores na Sala ({{count}})",
      "host": "(Host)",
      "kick": "Expulsar",
      "room_settings": "Definições da Sala",
      "auto_next_round": "Avanço Automático (5s)",
      "round_duration": "Tempo por Ronda",
      "seconds": "segundos",
      "only_host_settings": "Apenas o Host pode alterar as definições.",
      "search_placeholder": "Pesquisar por música ou artista...",
      "searching": "A pesquisar...",
      "search_hint": "Faz uma pesquisa para encontrares a tua música secreta.",
      "need_more_players": "⚠️ Precisas de pelo menos 2 jogadores na sala para começar!",
      "im_ready": "Estou Pronto! (Escolhi: {{track}})",
      "pick_a_song": "Escolhe uma música...",
      "music_confirmed": "Música Confirmada!",
      "waiting_for_others": "A aguardar que os restantes jogadores escolham...",
      
      // Arena
      "playing": "A Tocar...",
      "try_guess": "Tenta adivinhar a Música e o Artista!",
      "guess_hint": "Escreve no chat. Se acertares, ganhas pontos com base na rapidez.",
      "title": "Título",
      "artist": "Artista",
      "guess_chat": "Chat de Adivinhação",
      "you_picked_this": "Tu escolheste a música!",
      "already_guessed_all": "Já acertaste tudo!",
      "type_guess": "Escreve o teu palpite...",
      
      // Scoreboard
      "round_end_title": "Fim da Rodada!",
      "this_was_the_song": "Foi esta a música tocada.",
      "loading_cover": "A carregar capa...",
      "choice_of": "Escolha do {{name}}",
      "leaderboard": "Placar",
      "guessed_all": "Acertou Tudo!",
      "guessed_title": "Acertou Título!",
      "guessed_artist": "Acertou Artista!",
      "next_round_starts_in": "Próxima rodada começa em...",
      "see_podium": "Ver Pódio",
      "next_round": "Próxima Rodada",
      "waiting_for_host_next": "A aguardar que o Host avance para a próxima rodada...",
      "waiting_for_host_podium": "A aguardar que o Host avance para o pódio...",
      
      // Podium
      "final_podium": "Pódio Final",
      "game_ended_podium": "O jogo terminou! Os melhores ouvidos da sala.",
      "pts": "pts",
      "remaining_players": "Restantes Jogadores",
      "back_to_lobby": "Voltar ao Lobby",
      "waiting_for_host_end": "A aguardar que o Host termine o jogo...",
      
      // Shared
      "room": "Sala:",
      "copied": "Link Copiado!",
      "loading_room": "A carregar sala...",
      "error": "Erro",
      "back": "Voltar"
    }
  },
  'es-ES': {
    translation: {
      // Home
      "home_title": "¡Adivina la música, gana puntos!",
      "home_subtitle": "Un juego multijugador de trivia musical en tiempo real. Crea una sala, invita amigos, elige tu canción y mira quién es el más rápido en adivinar el título y el artista.",
      "nickname_label": "Tu Nickname",
      "nickname_placeholder": "Ej: JugadorMusical",
      "choose_avatar": "Elige tu Avatar",
      "change_avatar": "Cambiar Avatar",
      "create_room": "Crear Sala",
      "join_room": "Unirse a Sala",
      "or": "o",
      "enter_code": "Ingresa el Código",
      
      // Lobby
      "lobby_title": "La Sala de Espera",
      "lobby_subtitle": "Elige tu canción en secreto. ¡Nadie sabrá qué elegiste!",
      "players_in_room": "Jugadores en Sala ({{count}})",
      "host": "(Host)",
      "kick": "Expulsar",
      "room_settings": "Ajustes de Sala",
      "auto_next_round": "Avance Automático (5s)",
      "round_duration": "Tiempo por Ronda",
      "seconds": "segundos",
      "only_host_settings": "Solo el Host puede cambiar los ajustes.",
      "search_placeholder": "Buscar por canción o artista...",
      "searching": "Buscando...",
      "search_hint": "Busca para encontrar tu canción secreta.",
      "need_more_players": "⚠️ ¡Necesitas al menos 2 jugadores en la sala para empezar!",
      "im_ready": "¡Estoy Listo! (Elegí: {{track}})",
      "pick_a_song": "Elige una canción...",
      "music_confirmed": "¡Música Confirmada!",
      "waiting_for_others": "Esperando a que los demás jugadores elijan...",
      
      // Arena
      "playing": "Sonando...",
      "try_guess": "¡Intenta adivinar la Canción y el Artista!",
      "guess_hint": "Escribe en el chat. Si aciertas, ganas puntos según tu rapidez.",
      "title": "Título",
      "artist": "Artista",
      "guess_chat": "Chat de Adivinanzas",
      "you_picked_this": "¡Tú elegiste la canción!",
      "already_guessed_all": "¡Ya acertaste todo!",
      "type_guess": "Escribe tu suposición...",
      
      // Scoreboard
      "round_end_title": "¡Fin de la Ronda!",
      "this_was_the_song": "Esta fue la canción reproducida.",
      "loading_cover": "Cargando portada...",
      "choice_of": "Elección de {{name}}",
      "leaderboard": "Marcador",
      "guessed_all": "¡Acertó Todo!",
      "guessed_title": "¡Acertó Título!",
      "guessed_artist": "¡Acertó Artista!",
      "next_round_starts_in": "La próxima ronda comienza en...",
      "see_podium": "Ver Podio",
      "next_round": "Próxima Ronda",
      "waiting_for_host_next": "Esperando a que el Host avance a la próxima ronda...",
      "waiting_for_host_podium": "Esperando a que el Host avance al podio...",
      
      // Podium
      "final_podium": "Podio Final",
      "game_ended_podium": "¡El juego terminó! Aquí están los mejores oídos de la sala.",
      "pts": "pts",
      "remaining_players": "Jugadores Restantes",
      "back_to_lobby": "Volver al Lobby",
      "waiting_for_host_end": "Esperando a que el Host termine el juego...",
      
      // Shared
      "room": "Sala:",
      "copied": "¡Enlace Copiado!",
      "loading_room": "Cargando sala...",
      "error": "Error",
      "back": "Volver"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('tunein_language') || 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
