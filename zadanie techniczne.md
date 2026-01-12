
# Specyfikacja zadania

Zadanie polega na stworzeniu aplikacji obsługującej pełen cykl CRUD na podstawie danych przedstawionych w załączniku. Aplikacja powinna umożliwiać:

- [ ] dodawanie nowych obiektów,
- [ ] edycję istniejących,
- [ ] usuwanie obiektów,
- [ ] wyświetlanie listy obiektów,

> wszystko zgodnie z opisanymi historyjkami użytkownika.

Projekt powinien mieć:

- [ ] widoki HTML obsługujące CRUD z użyciem frameworka React;
  - [ ] widok dodawnia
  - [ ] widok edycji (widok poniekąd powinien być współdzielony z widokiem dodawania)
  - [ ] wyświetlanie listy obiektów (powinien mieć możliwość usuwania z modalem potwierdzającym)
  - [ ] usuwanie obiektów (modal potwierdzający użyty w widoku edycji, i wyświetlaniu listy obiektów dostępny przez przycisk)

- [ ] zakodowanie designu w myśl responsive design;
- [ ] użycie CSS w myśl rwd (preprocesory CSS jak najbardziej dozwolone) żeby osiągnąć ładny i czytelny wygląd - można skorzystać z tailwinda;
> Dobrym kierunkiem tutaj będzie przyjęcie standardowych breakpointów: xs:370px sm: 500px, md: 768px, lg: 1024px, xl: 1280px
- [ ] backend w postaci mocków (nie będzie to przedmiotem oceny)
> Idealne tutaj będzie wykorzystanie onion-architecture -> folder domain w którym zdefiniowalibyśmy w typescript entities, w folderze application utworzylibyśmy proxy które dałoby dostęp do "bazy danych" w postaci pliku db.ts (w środku zwykły obiekt z wszystkimi potrzebnymi danymi -> nie będziemy się bawić w próbę utworzenia relacyjnych baz danych -> rzucamy redundatne dane jak w nosql'owej bazie dokumentowej do tego obiektu)

(wersja live aplikacji mile widziana - np. github pages albo azure static pages)

Jeśli coś będzie niejasne, można przyjąć rozwiązanie, które według Ciebie ma sens i pasuje do standardowych praktyk projektowych.

## Historyjka (w języku angielskim)

I want to be able to create, edit or delete a separate campaign for each of my products I want to sell

Sellers to enter the following information for each campaign:

• Campaign name (mandatory)

• Keywords (mandatory, pre-populated with typeahead)

• Bid amount (mandatory, min amount )

• Campaign fund (mandatory and deducted from their Emerald account 
funds, new balance updated on screen)

• Status (on or off - mandatory)

• Town (can pick from pre-populated)

dropdown list of towns)

• Radius (mandatory in kilometres)