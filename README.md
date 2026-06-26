# Oficial de Tránsito

Juego 2D donde el jugador controla a un policía que debe empujar peatones distraídos hacia la vereda antes de que los autos los atropellen.

## Contenido del proyecto

- `index.html` - interfaz principal del juego y pantallas de menú.
- `styles.css` - estilos para el canvas, HUD y pantallas de menú.
- `game.js` - lógica del juego, movimiento del jugador, autos, peatones y condiciones de victoria/derrota.

## Mecánica implementada

- Menú principal con botón `Play` y `Salir`.
- El jugador controla a un policía azul usando las teclas `WASD` o las flechas.
- Los peatones aparecen en la vereda y cruzan la avenida lentamente.
- **4 carriles de circulación** con sentidos alterados:
  - Carriles 1 y 3: circulan derecha → izquierda
  - Carriles 2 y 4: circulan izquierda → derecha
- Los carriles cerrados (según el nivel) muestran barreras blancas.
- Los autos representan peligro tanto para el policía como para los peatones.

## Niveles y Progresión

- **Nivel 1:** Solo 2 carriles activos, autos lentos.
- **Nivel 2:** 3 carriles activos, autos más rápidos.
- **Nivel 3:** 4 carriles activos, autos muy rápidos.

## Cómo ganar/perder

- **Victoria:** Salvar al menos 50 peatones.
- **Derrota:** Perder todas las vidas O no lograr salvar 50 peatones antes de que se agoten los peatones disponibles.

## Cómo jugar

1. Abre `index.html` en un navegador web compatible.
2. Presiona `Play` para comenzar.
3. Mueve al policía con `WASD` o las flechas.
4. Toca a un peatón para empujarlo a la vereda y salvarlo.
5. Evita los autos para no perder vidas.
6. Consigue 50 personas salvadas para ganar el nivel.

## Dependencias

No requiere instalación adicional. Solo necesitas un navegador web.

## Próximas mejoras posibles

- Animaciones más elaboradas para peatones y autos.
- Sonidos y efectos de audio.
- Sprites más realistas en lugar de círculos.
- Power-ups especiales.
