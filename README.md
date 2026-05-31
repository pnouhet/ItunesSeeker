# iTunes Seeker

iTunes Seeker est une application mobile développée en **React Native** (avec **Expo**) permettant aux utilisateurs d'explorer le catalogue musical d'Apple. L'application permet de rechercher des morceaux et des artistes, de consulter leurs informations, d'écouter des extraits audio, de les ajouter à une liste de favoris et de leur attribuer une note (de 1 à 5 étoiles).

Toute la persistance des données repose sur un stockage purement local sur l'appareil (localStorage).

## Fonctionnalités

- **Recherche Musique / Artiste** : Naviguez dans la base de données via une barre de recherche.
- **Fiches détaillées & Extraits** : Consultez les métadonnées (album, genre, nom) et écoutez des extraits musicaux de 30 secondes.
- **Moteur de favoris** : Constituez votre liste personnelle de morceaux et d'artistes que vous aimez.
- **Système de notation** : Évaluez vos éléments favoris ou vos trouvailles de 1 à 5 étoiles.
- **Persistance locale** : Les favoris et les notes sont récupérés instantanément au démarrage via le stockage interne du téléphone.

## Structure de l'application

L'application est architecturée autour de 3 vues principales organisées par un système de balayage par onglets et piles (Stacks).

1. **Accueil/Recherche**
   - Champ Input pour effectuer une recherche.
   - Système d'onglets pour cibler soit les "Artistes" soit les "Sons".
   - Affichage sous forme de liste scrollable (`FlatList`) avec boutons type "load more" pour afficher plus de résultats s'il y en a.
2. **Fiche Détail** 
   - Accessible depuis n'importe quelle carte. 
   - Gère le lecteur audio et l'interaction avec le son.
   - Interface permettant de noter (composant interactif d'étoiles) et d'ajouter/retirer des favoris.
3. **Favoris** 
   - Centralisation des données locales.
   - Regroupe indifféremment les artistes et les musiques enregistrées.
   - Ajout d'une icône pour retirer instantanément une carte de la vue après une confirmation visuelle (`Alert`).

## APIs Intégrées

Les données sont récoltées via plusieurs endpoints publics :
- **[API iTunes Search](https://performancepartners.apple.com/search-api) :** Coeur de la recherche, permet de faire remonter les sons, les metadatas d'albums, ainsi que les extraits audio MP3.
- **[API Deezer] :** Spécifiquement utilisée pour récupérer les photos de profil propres aux artistes, les données de l'API iTunes faisant hélas défaut sur ce point précis.

## Architecture & Dépendances

L'application a été initialisée et développée sur l'écosystème **Expo** (v54), garantissant une gestion de build saine et légère.

* **Noyau** : `react` (19.1.0) & `react-native` (0.81.5)
* **Navigation** : Réalisée via `React Navigation v7` (`@react-navigation/native`, `@react-navigation/bottom-tabs` et `@react-navigation/stack`) ainsi que ses gestions visuelles (`react-native-screens`, `react-native-safe-area-context`).
* **Stockage de données** : Le local storage (similaire au web) est assuré par l'API asynchrone `@react-native-async-storage/async-storage`.
* **Multimédia** : `expo-av` s'occupe de wrapper le composant audio natif pour la lecture du preview.
* **UI/UX & Iconographie** : Les icônes SVG sont servies par `lucide-react-native` et `react-native-svg`.

## Installation & Lancement

1. Clonez le dépôt et déplacez-vous dans le dossier du projet :
   ```bash
   git clone https://github.com/pnouhet/ItunesSeeker.git
   cd ItunesSeeker
   ```

2. Installez les dépendances :
   `npm install` ou `npm i`

3. Lancez le serveur de développement Expo :
   `npx expo start`

4. Lancez le projet :
   - Sur Smartphone avec l'application **Expo Go** (scannez le QR Code).
   - Sur Simulateur en tapant `i` (pour iOS) ou `a` (pour Android) dans le terminal.
