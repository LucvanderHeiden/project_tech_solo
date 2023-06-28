# Blok-tech matching feature

In deze repository vind je mijn uitgewerkte feature van een matching app. Via mijn app "Game, set, match" kunnen gamers matchen met andere gamers met dezelfde voorkeuren. Het belangrijkste hier is natuurlijk welke games ze graag spelen, maar ze kunnen daarnaast ook aangeven op welke platforms ze games spelen. De feature die ik voor de applicatie heb uitgewerkt is het registreren een inloggen. De gebruiker kan inloggen als ze al een account hebben en anders eerst zelf een account aanmaken. Na het inloggen wordt de gebruiker automatisch doorgestuurd naar zijn of haar profielpagina waarin de gebruiker hun eigen profiel kan bekijken.

De applicatie is gemaakt voor een schoolopdracht voor Blok tech. Het is aan ons de taak de gekozen feature volledig werkend te maken, dus niet alleen op de front-end, maar ook de back-end. 

## Installatie en opzet van applicatie

Om de applicatie te runnen op eigen computer zijn eerst enkele stappen vereist. 
* Download/installeer Node
* Download/installeer npm

Daarnaast moet deze repository gecloned worden op uw eigen computer, dit kunt u doen door de volgende command in de terminal uit te voeren: 
`$ git clone https://github.com/LucvanderHeiden/project_tech_solo`

Wanneer deze succesvol gecloned is zult u de benodigde packages moeten installeren via de terminal. Dit doet u door de volgende command uit te voeren: 
`git install`
Dit zou alle missende packages moeten installeren op uw computer.

Nu kan de applicatie gestart worden door de volgende command uit te voeren in de terminal:
`node server.js` of `npm start` om het via nodemon te starten.

De applicatie werkt nu bijna helemaal, alleen moet er nog verbinding gemaakt worden met de MongoDB database. Hiervoor moet een .env bestand aangemaakt worden en ingevuld worden. Dit bestand moet .env heten en hierin moet de volgende code geplaatst worden: 
```
DATABASE_URI=mongodb+srv://<username>:<password>@<clustername>.mongodb.net/project_tech?retryWrites=true&w=majority
SESSION_SECRET_CODE=<YOUR_SECRET_CODE>
```
Alleen door dit te doen kun je verbinding maken met de database en dus ook daadwerkelijk een account aanmaken en terugvinden.

Als je al deze stappen succesvol hebt doorlopen zou de applicatie zonder problemen moeten werken.

## Datastructuur

Zoals eerder gezegd maakt deze applicatie gebruik van een MongoDB database om accountinformatie in op te slaan. Dit doe ik in dit project met behulp van een package genaamd Mongoose. Met Mongoose heb je de mogelijkheid van te voren aan te geven uit welke properties een object in de database zal gaan bestaan. Dit heet een schema. Hier is de structuur als volgt. 

![user-schema](https://user-images.githubusercontent.com/26922676/162452681-13c0a915-de8a-4216-85d1-55eeee44274e.png)

We geven dus aan welke properties een gebruiker moet bevatten. Username, email en password zijn allemaal required, deze moeten dus ingevuld worden door de persoon die een account probeert aan te maken. Username en email zijn daarnaast ook unique, dit betekent dat er geen twee accounts met dezelfde username of emailadres aangemaakt kunnen worden. Dit properties daaronder zijn de platforms en games die de gebruiker kan selecteren. Deze zijn van het type string zodat de value hiervan opgeslagen wordt in de database. Deze value kunnen we later gebruiken om de dynamische profielinformatie te laten zien op de profielpagina.

In de database bevindt zich een collection met de naam users. In deze collection komen zoals de naam suggereert deze gebruikers te staan. Dit ziet er als volgt uit.

![user-in-database](https://user-images.githubusercontent.com/26922676/162452860-c1f01e8f-d797-403f-a1d1-6819a2089688.png)

Wanneer een gebruiker inlogt worden de username en email gecontroleerd en als deze informatie klopt wordt de gebruiker doorgestuurd naar zijn/haar profielpagina, hierin kan hij/zij zelf de user zien die zij hebben aangemaakt. 

## Heroku

Er was ooit een online versie beschikbaar van de applicatie op de volgende link: https://game-match-app.herokuapp.com/
Echter sinds Heroku geen gratis Dynos meer aanbiedt is deze niet meer actief.

## License

Deze applicatie maakt gebruikt van een MIT License. 

## Wiki

Voor meer informatie over dit project neem een kijkje in de Wiki.
