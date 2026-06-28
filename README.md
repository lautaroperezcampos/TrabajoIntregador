# Salvador de Tránsito

Estudiante: Lautaro Perez Campos

## Descripción breve

Salvador de Tránsito es un juego del navegador en el que controlás a un oficial de tránsito que debe evitar que peatones distraídos sean atropellados mientras cruzan una avenida. La única forma de salvarlos es empujarlos rápidamente hacia la vereda más cercana antes de que un auto los alcance.

## "Está mal, pero no tan mal"

A simple vista, empujar a una persona está mal. Sin embargo, en el contexto del juego, ese empujón es lo que evita que el peatón sea atropellado por un auto. La acción que parece incorrecta termina siendo la que salva una vida, planteando que el contexto puede justificar una acción que de otra forma sería negativa.

## Controles

- Flechas direccionales o **W A S D** para mover al oficial de tránsito.
- Acercarse y tocar a un peatón en peligro lo empuja automáticamente hacia la vereda más cercana, en la dirección hacia la que esté mirando el oficial.

## Objetivo del juego

Salvar la cantidad mínima de peatones requerida en cada nivel, evitando ser atropellado, para avanzar y completar los 3 niveles con al menos una vida restante.

## Mecánicas principales

- Movimiento libre del personaje en las 4 direcciones, con rotación del sprite según hacia dónde mira.
- Empuje de peatones: al tocarlos, se aceleran hacia la vereda más cercana en la dirección en la que el oficial está mirando.
- Tráfico de autos en distintos carriles, con direcciones alternadas.
- Alerta visual sobre el peatón cuando un auto se acerca por su carril, dando tiempo al jugador para reaccionar.
- Camera shake al chocar con un auto.
- Sistema de vidas y puntaje, con HUD visible durante la partida.
- Pantallas separadas para menú, tutorial, intro de cada nivel, victoria y game over.

## Niveles

**Nivel 1:** Avenida con 2 carriles activos. Tráfico reducido para introducir la mecánica de empuje.

**Nivel 2:** La misma avenida, ahora con 3 carriles activos y mayor frecuencia de aparición de autos y peatones.

**Nivel 3:** Avenida completa con los 4 carriles activos, tráfico en ambos sentidos simultáneamente.

## Suman puntos

- Cada peatón que llega sano a la vereda.

## Restan vidas

- Ser golpeado por un auto.
- Que un peatón sea atropellado mientras cruza.

## Funcionamiento de los NPCs

Los peatones aparecen en posiciones aleatorias sobre la vereda (superior o inferior) y cruzan la calle en línea recta hacia el otro lado. Si el oficial los toca, cambian de comportamiento: se aceleran y son redirigidos hacia la vereda más cercana, en la dirección hacia la que el oficial está mirando en ese momento. Si no son empujados a tiempo y un auto los alcanza, se pierden y se resta una vida. El sistema evita generar peatones en columnas donde un auto esté pasando demasiado cerca, para que siempre sea posible reaccionar.

## Instrucciones para ejecutar el juego localmente

1. Descargar o clonar la carpeta del proyecto.
2. Abrir la carpeta en Visual Studio Code (o el editor de preferencia).
3. Abrir `index.html` con una extensión de servidor local (por ejemplo, Live Server en VS Code) para evitar problemas de carga de los sprites SVG.
4. El juego se abre en el navegador y se controla con el teclado.

## Tecnologías utilizadas

- HTML5 (estructura y pantallas del juego)
- CSS3 (estilos visuales)
- JavaScript (lógica del juego, sin librerías externas)
- Canvas API (renderizado gráfico)
- SVG (sprites e ilustraciones del juego, creados en Illustrator)