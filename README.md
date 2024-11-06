# Sisal NTB: Front-end Guidelines

## Table of Contents

1. [Introduction and Workspace Setup](#introduction-and-workspace-setup)
2. [General Rules](#general-rules)
3. [Folder Structure](#folder-structure)
4. [Specific Guidelines](#specific-guidelines)
5. [Ordering](#Ordering)
6. [Testing](#testing)
7. [Git](#git)

## Introduction and Workspace Setup

Prerequisites:

- Node.js `v10.13.0` min
- Git scm `v2.19.1` min

It's recommended the use of [VSCode](https://code.visualstudio.com/) as IDE

Reccomended extensions are listed in `.vscode/extensions.json`

debugging inside vscode: (ctrl+shift+p -> "run task" -> "npm: start") -> (ctrl+shit+d -> enter)

Once cloned the repository:

`cd` inside the project folder
run `npm install` command (only once)
​run `npm start` command to start the local server

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the `--template typescript` option.

## General Rules

This project mostly follows [Airbnb React/JSX StyleGuides](https://airbnb.io/javascript/react/) with some reservations.

- Write in TypeScript
- Absolutely avoid portions of code not covered by types:
  - `as any` is allowed only when typescript does not allow to express that type
- The components must all be functional:
  - except exclusively for 'errorBounbdaries'
- Use `React.memo` for components memoization:
  - memoized version of a components must have _Memo_ suffix
- Styling components only through [_styled-components_](https://styled-components.com/):
  - styled components must have _Styled_ prefix
  - in-line style only through ` css={css``} ` formula
- For theming its used custom [styled-theming](https://styled-components.com/docs/tooling#styled-theming)
- Define props type at the top row of component definition
- Always declare types as `type` not `interface`
- Props type must have the same name as the component plus _Props_ suffix
- To avoid _prop drilling_ split up files in set of components only when they are:
  - independents from hooks
  - consistent
- To add a new font type or weight, refer to the import string inside `global.css`

## Linting

`npm run start` uses eslint with `react-app` preset

`npm run lint` uses eslint with `airbnb-typescript` preset

GOAL: fix `airbnb-typescript` configuration and add lint as precommit hook

- turn on quotes rule to ["warn", "double"]

## Folder Strucure

- `src` is used as root folder
- First directory level by by domain (e.g., biglietto, smart-search)
- Prefer flat structure
- Second directory level by functionality (e.g. hooks, components) (but only if needed)
- Static assets directories (e.g. images, icons) in root folder (src)

Code locality first: write code near (in the same file) where is used, if code is reused move it upward to nearest common directory

## Specific Guidelines

### Prop drilling

**optional**

[link](https://medium.com/javascript-in-plain-english/how-to-avoid-prop-drilling-in-react-using-component-composition-c42adfcdde1b) [link](https://medium.com/javascript-in-plain-english/how-to-avoid-prop-drilling-in-react-using-component-composition-c42adfcdde1b) [link](https://medium.com/@jeromefranco/how-to-avoid-prop-drilling-in-react-7e3a9f3c8674) [link](https://blog.logrocket.com/mitigating-prop-drilling-with-react-and-typescript/)

E l'effetto negativo di dover passare attraverso più componenti una grande quantità di props.

Può essere mitigato creando meno componenti, ed utilizzando la prop children in modo corretto.

Rappresenta un sostanziale costo di manutenzione e in fase di modifica, costringendo il lettore a controllare molte prop, in diversi componenti ed avere molti file aperti.

### Nomenclatura props

Andrebbero rispettate le nomenclature, verbi per le azioni, sostantivi per i dati, prefisso is per i booleani, e prefisso on per i callback.

```typescript
const [isOpen, setIsOpen] = React.useState(false)
<Modale isOpen={isOpen} onClose={() => setIsOpen(false)}/>
```

Se la nomenclatura non è parlante e rispetta la convenzione, il lettore è costretto ad andare a verificare i tipi e gli utilizzi delle props invece che capirne il significato al volo.

### Uso della API Context

Il context è molto costoso a livello di rendering nel momento in cui il valore del provider cambia.

I context vanno usati solo per informazioni che devono essere visibili a livello di tutta l'applicazione.

Non devono assolutamente essere usati quando basta del prop drilling di pochi livelli.

Per ogni context utilizzato aumenta la difficoltà di lettura 3 modifica del codice poichè si è costretti a fare una ricerca globale su dove viene utilizzato e cosa fa. Purtroppo il tooling non aiuta molto.

Per mitigare la probabilità di errore nel non fornire un context provider, è utile specificare esplicitamente il tipo del context con le parentesi angolari e passsare come valore di default (null as any) in modo da vedere subito l'errore nella UI

```typescript
type Persona = { nome: string; cognome: string };
const ResponsabileContext = React.createContext<Persona>(null as any);
```

### Comandi da tastiera

Tutte le comandistiche da tastiera vanno implementate in un file che contiene tutte le interazioni da tastiera (es: `navigazione-tastiera.ts`), quelle che non sono li dentro vanno eventualemente spostate.

Per un insieme coroposo di interazioni da tastiera può essere creato un file apposito.

Gli eventi da tastiera si possono gestire al meglio se globali ed hanno a disposizione tutte le informazioni per le logiche condizionali.

Non gestendoli a livello globale, e nello stessso file si incorre in problemi di leggibilità, manutenzione, accesso alle informazioni, capturing degli eventi.

Per disambiguare i comandi usare KeyboardNavigationContext.

### Git history

La modalità di lavoro su git concordata è branch development.

Il branch principale è develop, i feature branch invece hanno il prefisso feature.

La modalità di operare è, staccare un feature branch da develop, una volta concluso, deve essere merge-ato su develop.

Se emerge la necessità di portare le modifiche di develop in un feature branch ancora in corso, il feature branch va rebase-ato su develop.

Tutte le altre operazioni git nel nostro caso sono nocive nel nostro contesto, complicano i merge su develop, e impossibilitano la lettura della history.

### Programmazione funzionale

Gli utilizzi non necessari di costrutti non funzionali (for, forEach, let, effect, promise) complicano la lettura e la manutenzione del codice poichè costringono il lettore a controllare tutti i punti di modifica ed eseguire mentalmente gli statement di iterazione.

Ridurre al minimo l'uso di: for (usare map), forEach (usare map), let (usare const)

Ridurre al minimo l'uso di effect e promise

I costrutti imperativi possono essere utilizzati per motivi di performance ma vanno ben isolati dal resto del codice (nasconderli dentro uno scope, ovvero una function)

### Astrazioni

Le astrazioni (es: componenti, componenti che ricevono componenti come props, funzioni, funzioni che ricevono o ritornano funzioni, strutture intermedie che vengono successivamente iterate per essere renderizzate) vanno utilizzate il minimo necessario.

[Dan Abramov](https://www.deconstructconf.com/2019/dan-abramov-the-wet-codebase)
[Sebastian Markbage](https://www.youtube.com/watch?v=4anAwXYqLG8)

Tutte le astrazioni introdotte vanno attentamente discusse con gli team members.

Ogni astrazione introduce un grande livello di indirezione, che complica la lettura e la comprensione del codice, e se compaiono casistiche non previste, possono comportare la riscrittura di grandi parti di codice.

### Performance

Le modifiche al codice per migliorare le performance devono essere fatte solo in questi casi:

- liste o viste tabellari
- interazioni che devono avere feedback istantaneo

Si comincia con l'analisi tramite il profiler di react [dev tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi), e si procede con la memoizzazione, delle props con React.memo e dei stati derivati con useMemo

Apportare modifiche per le performance prima di avere una misurazione, o in sezioni che non lo richiedono è un perdita di tempo, e può addirittura provocare l'effetto contrario.

Non apportare modifiche per le performance, e non predisporre i componenti per un rendering performante appena se ne nota la necessità, comporta un debito tecnico che cresce esponenzialmente con le nuove modifiche, fino ad arrivare a rendere impossibile l'efficientamento del rendering.

### Tipizzazione

Va assolutamente evitato l'utlizzo di any, perchè disabilita il typechecking propagandi in tutti i siti di utilizzo, costringendo il lettore del codice a controllare il molteplici punti che forma ha quel dato, inoltre si perde anche la possibilità di autocompletamento.

Gli enum non vanno usati poichè in via di deprecazione, e sono anche difficili da modificare ed utilizzare.

Va usato `type` e non `interface`, poichè le interface hanno il declaration merging.

I DTO devono essere tipizzati, per evitare lunghe sessioni di debugging cercando l'attributo colpevole.

### Stilizzazione

Per gli stili condizionali vanno usate le props [link](https://styled-components.com/docs/basics#passed-props) [link](https://styled-components.com/docs/basics#attaching-additional-props)

Non usare le classi perchè viene meno l'information hiding, l'utilizzatore dello styled component è costretto a leggere l'implementazione ogni volta.

Gli styled component devono avere il prefisso `Styled`.

**optional** Quando stili di due elementi diversi sono direttamente dipendenti (es: flex + flex-grow; grid + grid-row) vanno scritti in linea con

```typescript
<div
  css={css`
    display: flex;
  `}
>
  <StyledQualcosa
    css={css`
      flex-grow: 1;
    `}
  ></StyledQualcosa>
</div>;

const StyledQualcosa = styled.div`
  background-color: red;
`;
```

Il resto della suddivisione tra inline e styled components è a discrezione.

### Custom Hooks

Le custom hook vanno create solo se:

- rappresentano un'astrazione ben definita riutilizzabile in più punti
- incapsulano una business logic non realizzabile con funzioni semplice

Non vanno usate invece per:

- spezzare una hook troppo grande
- incapsulare pochi hook senza logica (meglio scrivere inline)

Gli effetti negativi sono:

- lista infinita di parametri
- troppe custom hook, che comportano difficolta di lettura e modifica

### Thinking in React

[link](https://it.reactjs.org/docs/thinking-in-react.html)

Alla base di react ci sono:

- gli stati base (useState)
- gli stati derivati (useMemo, da usare quando lo stato derivato creerebbe una nuova istanza, ad esmpio gli array)
- gli effetti (useEffect, che vanno usati esclisivamente per io)

Non si devono usare assolutamente gli effect per sincronizzare lo stato, perchè aggiunge moltissimi livelli di indirezione, ed è molto facile dimenticarsi di collegare tutti gli effect creando bug difficilemnte risolvibili e anche race conditions.

### Fetching

**in fase di allineamento**

Il ritrovamento di risorse asincrone deve essere fatto con la libreria [SWR](https://swr.vercel.app/).

Per recuperare una risorsa va creata una funzione parlante che al proprio interno utilizza l'api fetch.

Eventuali adattamenti del dto vanno svolti nel metodo asincrono.

```typescript
async function getPersonaById(id: string): Promise<Persona> {
  const reponse = await fetch(`${rootRoot}/persona/${id}`);
  const data = await response.json();
  if (data.error) throw data.error;
  return data;
}

function DettaglioPersona() {
  const [id, setId] = React.useState<string | null>(null);
  const { data } = useSWR(id, getPersonaById);
  return null;
}
```

### Nomenclatura di dominio

**da definire**

La nomenclatura di dominio è: entità in italiano, prefissi e suffissi in inglese.

I DTO devono avere i campi in italiano.

Qualora necessario devono essere scritti funzioni adapter che trasformano i DTO in italiano.

Non deve capitare che lo stesso concetto abbia nomi diversi.

### Code locality

Usiamo l'approccio "il codice deve stare il più vicino possibile a dove viene utilizzato", per evitare di creare troppi file di difficile navigazione.

Il criterio per spostare un blocco di codice in un file dedicato è quando viene utilizzato in più file.

Il criterio per dedicare un file apposito ad un componente: il componente è autosufficiente e visualizza una view all'interno di un quadrato

Gli styled components vanno scritti nel file dove vengono utilizati, possono essere spostati in un file apposito solo se utilizzati da altri file.

### Dead code

Il codice non più utilizzato non va assolutamente committato, poichè è pressochè impossibile individuarlo con certezza successivamente.

La fase di stage si presta benissimo a questo controllo (si può usare anche la funzione "trova tutte le referenze" di vscode per essere sicuri)

### Variables

- Use `const` for all of your references; avoid using `var`.

  > Why? This ensures that you can’t reassign your references, which can lead to bugs and difficult to comprehend code.

- If you must reassign references, use `let` instead of `var`.

  > Why? `let` is block-scoped rather than function-scoped like `var`.

### Naming Conventions

Name a file like React already does:

- Extensions: Use .tsx extension for React components.
- Filename: Use PascalCase for filenames. E.g., App.tsx, SmartSearch.tsx.
- Reference Naming: Use PascalCase for React components and camelCase for their instances.
- Use unique names for files (for better debugging and navigation experience)

```javascript
// bad
import reservationCard from "./ReservationCard";

// good
import ReservationCard from "./ReservationCard";

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```

### Props

- Always use camelCase for prop names.

- Omit the value of the prop when it is explicitly true.

- Always include an `alt` prop on `<img>` tags. If the image is presentational, `alt` can be an empty string or the `<img>` must have `role="presentation"`.

- Do not use words like "image", "photo", or "picture" in `<img>` alt props.

  > Why? Screenreaders already announce img elements as images, so there is no need to include this information in the alt text.

- Avoid using an array index as key prop, prefer a stable ID.

  > Why? Not using a stable ID [is an anti-pattern](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) because it can negatively impact performance and cause issues with component state.

- Always define explicit defaultProps for all non-required props.

### Parentheses

- Wrap JSX tags in parentheses when they span more than one line.

### Tags

- Always self-close tags that have no children.
- If your component has multi line properties, close its tag on a new line.

### Mixins

- Do not use mixins.

  > Why? Mixins introduce implicit dependencies, cause name clashes, and cause snowballing complexity. Most use cases for mixins can be accomplished in better ways via components, higher-order components, or utility modules.

### Style

- Avoid creating a styled-component for every single HTML element in page:
  - Use in-line css in first instance
  - Write a styled-component if the element is repeated inside the component defined in that file
  - Abstract the styled-component inside its own file if the element in repeated across the project
- Use only the notation `Muli` or `Roboto` for `font-family` attribute
- Use the numeric notation for `font-weight` attribute (avoid use of bold, bolder etc.)
- Use `rem` as unit of measure for `font-size`. Default font size is 16px rely on this to make the conversions. Use https://nekocalc.com/px-to-rem-converter for convert px -> rem

## Ordering

Top Down ordering approach inside a component

1. smart component (uses hooks)
2. hooks
3. data fetching
4. derived data (extract only if necessary)
5. dumb components (only graphical components with callbacks with few or no logic)
6. styled component

## Build and deploy

Deploy to testing/integration environment is done with pipeline.

- Go to [](http://10.29.17.94/job/Betting/job/fe-betting-module/job/develop/)
  - Click on `Build now` and wait that task is finished (there should be green lights)
- Go to [](http://10.29.17.94/job/Betting/job/fe-container/job/develop/)
  - Click on `Build now` and wait that task is finished (there should be green lights)
- Check [](http://10.29.33.41:32080/betting/index.html) in the upper left corner for deployed commit hash

## Testing

Testing is done with [testing-library](https://testing-library.com/docs/) and [jest](https://jestjs.io/) as test runner (integrated with vscode)

See [principles](https://testing-library.com/docs/guiding-principles) guidelines

For user event simulation [user-event](https://testing-library.com/docs/ecosystem-user-event) will be used

For more assertion utilities [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom) will be used

For test linting purposese [eslint-plugin-testing-library](https://testing-library.com/docs/ecosystem-eslint-plugin-testing-library/) and [eslint-plugin-jest-dom](https://testing-library.com/docs/ecosystem-eslint-plugin-jest-dom/) will be used

For mocking network responses [msw](https://mswjs.io/docs) will be used

## Test flavors

Three types of tests will be done, in order of preference

- integration test
  - preferred kind of test, it will render the whole app and test only the interested part
  - [example](src\components\prematch\MenuPrematch.test.tsx)
- unit test (components)
  - for components that are used in more places
- unit test (logic)
  - for logic or formatting functions during development, as these tests are about internals, they can be left in place but must have unit or integration test counterpart
  - [example](src\components\common\livescore-box\LiveEventBox.test.ts)

## Useful techinques

- `screen.debug()`
- Google Chrome extension [testing playgorund](https://chrome.google.com/webstore/detail/testing-playground/hejbmebodbijjdhflfknehhcgaklhano) helps with selector writing

## i18n

[react-intl](https://formatjs.io/docs/getting-started/installation/) is used.

Messages must be writtend in one of the following ways (see documentation for restrictions).

Every formatted message MUST:

- have a description (what that message means)
- defaultMessage is label written in the main language, main language for this project is Italian.
- not have an id, it will be generated automatically

```typescript
import { FormattedMessage, useIntl } from "react-intl";

export function EsempioDiUtilizzo() {
  const intl = useIntl();
  return (
    <div>
      <FormattedMessage
        description="Compagnia e data attuale"
        defaultMessage="Sisal {ts, date, ::yyyyMMdd}"
        values={{ ts: Date.now() }}
      />
      <input
        placeholder={intl.formatMessage({
          defaultMessage: "Password",
          description: "testo placeholder della password",
        })}
      />
    </div>
  );
}
```

### l10n workflow

When new messages are written, the `npm run react-intl:extract` command must be run.
It will generate the file `src/l10n/extracted/it.json`.

This file will be used to make the order translations.

Possible editors:

- https://www.codeandweb.com/babeledit (7 day trial)
- http://zanata.org/
- https://weblate.org/en/
- http://jabylon.org/
- https://maksimivanov.com/posts/how-to-localize-react-application-using-react-intl/

TODO choose an editor

Once every file is created in `src/l10n/extracted` directory, the `npm run react-intl:compile` must be run.
It will generate corresponding files in `src/l10n/compiled` directory (this directory should be not included in git)

Check browser console error log for missing translations

#### Adding a language

- add a `react-intl:compile:en` script in package.json
- add a case statement in I18nProvider.tsx file `case "en": return (await import("src/l10n/compiled/en.json")).default;`

## Git

### Workflow

For this project we use [GitFlow](https://nvie.com/posts/a-successful-git-branching-model/) branching model.

New development (new features, non-emergency bug fixes) are built in **feature branches**.

Feature branches are branched off of the **develop branch**, and finished features and fixes are merged back into the **develop branch** when they’re ready for release.

When it is time to make a release, a release branch is created off of **develop**

The code in the release branch is deployed onto a suitable test environment, tested, and any problems are fixed directly in the release branch.
This **`deploy -> test -> fix -> redeploy -> retest`** cycle continues until you’re happy that the release is good enough to release to customers.

When the release is finished, the **release branch** is merged into **master** and into **develop** too, to make sure that any changes made in the release branch aren’t accidentally lost by new development.

The **master branch tracks released code only**. The only commits to master are merges from release branches and hotfix branches.

**Hotfix branches** are used to create emergency fixes
They are branched directly from a tagged release in the master branch, and when finished are merged back into both master and develop to make sure that the hotfix isn’t accidentally lost when the next regular release occurs.

![gitflow](<https://wac-cdn.atlassian.com/dam/jcr:61ccc620-5249-4338-be66-94d563f2843c/05%20(2).svg?cdnVersion=965>)

### Branch Naming

Branch name must begin with the user story or subtask id followed by the story/task name (all separated by dashes) eg.:

`ntb98-inserimento-e-validazione`

### Crafting Commits

#### Commit is valid if...

- [ ] is **consolidated** or complete and "compile"

  - [ ] for incomplete changes you can (not mutually exclusive)

    1. use feature branches and maybe squash commits into one at the end during the rebase,
    2. use work-in-progress commits (and modify them with `git commit --amend`),
    3. commit but wait to push;

  - [ ] fot test commit (for example to force a CI) remeber that
    1. commits can be created without modification with `git commit --allow-empty`,
    2. if strictly necessary to do them on shared branches (`master` in primis) use a clear prefix such as`WIP:`at the beginning of the messages.

- [ ] is **self-consistent**: implements, corrects or removes a single specific functionality
  - [ ] if you are committing closely related features, use a single commit, but in the subject of the message make it clear that it is a substantial change and in the body of the message indicate all the new features inserted;
  - [ ] if you are committing features that depend on each other and it is not possible to make the change conservatively then use a single commit, but the message must indicate this aspect;
- [ ] is **clean**: includes only files and source changes related to the change
  - [ ] if you have modified other files not related to the specific task, do separate commits. Maybe let's get used to commit small changes immediately as soon as we are sure;
  - [ ] if in the same files you have different task modifications (for example you have formatted the source) attempt to commit separately - do not forget that all the UIs for git allow you to commit portions of modified files (also from the command line with `git add --patch <file>`);
  - [ ] if you have mistakenly added a file or a modification too much in a commit remember that you can modify it with `git commit --amend`, but only if you have not yet pushed.

#### General advice

- Whenever possible, avoid committing entire folders without reviewing what you are inserting - use the staging area as much as possible.
- If you use the command line learn to manually add one file at a time with `git add <file>` - it will help you design perfect commits.
- Before committing always check the changes you are adding: it is the opportunity to check if you are following the guidelines described above.
- Before pushing new commits always check the diffs that you have introduced: it is your last chance to review your commits!

#### Remember

- Time spent preparing a commit is always time well spent.
- A clean history is an indication of a team that works well.
- In a year, a well-written commit message can save several hours (if not days) of work.

#### Commit message is valid if...

- [ ] use the english language

  ```diff
  - Modificato stile delle dropdown
  + Change dropdown UI
  ```

- [ ] begins with a capital letter

  ```diff
  - change dropdown UI
  + Change dropdown UI
  ```

- [ ] is preceded by the work area

  ```diff
  - Environment variables
  - Add new utilities
  + Themes: Add new environment variables
  + SSO: Add new utilities
  + Chatbot: Implement auto-close functionality
  ```

- [ ] the first line (called **_subject_**) does not exceed 50 characters

  ```diff
  - Implement very cool new functionality that serves its pourpose, and that is to let custom dropdowns work
  + Implement custom dropdowns
  ```

- [ ] has an extended description separated by `:` and an empty line (and manually wrapped to 72 characters) when the 50 characters are too few

  ```diff
  + Themes: Fix custom dropdown behaviour:
  +
  + We previously used Liferay.Menu utility, but it since an unspecified
  + Fix Pack the ARIA support was dropped.
  +
  + With this commit we are changing the implementation to Bootstrap
  + jQuery plugins.
  ```

  (attention to `:` at the end of the first line!)

- [ ] describes **the reasons of the change** rather than the change itself

  ```diff
  - Chatbot: Fix update BotRule config
  + Chatbot: Fix location of BotRule config storage:
  +
  + When storing as file the configuration of a BotRule we need to use a
  + temporary folder in order for files to not show up on Documents and
  + Media apps.
  +
  + With this change we store them in a Portlet Repository.
  ```

- [ ] includes reference to any associated reports and description of the problem

  ```diff
  - SSO: Workaround for Liferay DXP bug
  + SSO: Workaround for BPER-13 (LPS-34567):
  +
  + We need to explicitly re-index the user after changes to the user’s
  + roles associations. This is a workaround.
  ```

- [ ] includes reference to any internal reports using the `Fixes # NNNN` pattern

  ```diff
  - Offices: Solve problems for 137
  + Offices: Let the user filter for office type:
  +
  + Fixes #137
  ```

- [ ] it is written in imperative form and can be inserted in this pattern:

  > If applied, this commit will **_your subject line here_**

  ```diff
  - If applied, this commit will «cleanup»
  - If applied, this commit will «new files»
  + If applied, this commit will «clean theme files»
  + If applied, this commit will «remove useless files»
  + If applied, this commit will «implement something»
  ```

It is preferred to start the commit message with the user story or subtask id between square braces followed by colon and the subject eg.:

`[NTB-98]: Change dropdown UI`

#### Exceptions

Exceptions are some standard commit messages:

- `SF, WS` for commits that modify **the source code _white space_ and nothing else** for reasons of _source formatting_
- `SF` for commits that modify the source code correcting possibly missing brackets and similar for reasons of _source formatting_
-
- `Auto SF` for committing the changes generated by the formatting tools: `npm run format`
- `Initial commit` and `Initial import` when the repository starts.
- `Ignore <files>` to identify the addition of `<files>` inside `.gitignore`
- `Remove and ignore <files>` to identify the addition of `<files>` inside `.gitignore` and their removal from the versioning system.

#### References

- **How to Write a Git Commit Message**
  https://chris.beams.io/posts/git-commit/

# Glue notes

- per modificare puntamenti al backend in fase di sviluppo modificare proxy.config.js

- IP della macchina di integration: `10.29.33.41:32080` (bisogna stare in vpn)

- frontend di integration: `http://10.29.33.40:32080/betting/index.html`

- backend di integration: `http://10.29.33.40:32080/services`

# Performance

- per formattare le date nei componenti ripetuti utilizzare l'API [javascript intl](https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date)
- alle immagini va sempre data una dimensione assoluta sia width che height (specialmente se ripetuta) perchè può causare ricalcoli di layout a cascata anche di 400ms
- nel `css={css}` non va inclusa l'interpolazione della riga, ciò fa creare troppe classi css, mettere l'attributo interpolato inline nella prop style

## Optimization Workflow

- riscaldo il circuito (fare una decina di volte l'azione che si vuole misurare) (il browser ottimizza il codice eseguito più volte, così si hanno misurazioni più precise)
- faccio la misurazione con il profiler (di react dev tools) (impostando "record why each component rerendered")

- A

  - guardo il chart Ranked e identifico visualmente i componenti più costosi
  - passo sopra con il mouse e vedo perchè hanno rerenderizzato
  - memoizzo i componenti più lenti (con React.memo), che sono facili da memoizzare (es: rirenderizzano solo perchè il padre ha rirenderizzato oppure è cambaita una prop che intuitivamente sappiamo sia rimasta la stessa)

- su un componente profilato:
  - Xms of Yms
    - X sta per millisecondi impiegati nell'esecuzioine della funzione del componente
      - se < 1ms è ok
      - altrimenti può essere necesseario ottimizzare le performance dei cicli (for, map, filter ecc...) tenendo in considerazione che la maggiorparted delle volte l'allocazione dedgli array è la più costaosa in termini di cpu e ram
    - Y sta per millisecondi impiegati complessivamente per renderizzare e committare il component e i figli
      - che su una visualizzazione tabellare dovrebbe essere inferiore a numero_righe \* 2ms
  - controllare se le prop che hanno fatto rirenderizzare il componente hanno effettivamente cambiato contenuto
    - se il contenuto è lo stesso, ma la istanza javascript no, bisogna andare a memoizzare i valori

# Backend local

requisites:

- connected to vpn
- docker ex: https://www.docker.com/products/docker-desktop
- read access to http://git-ita.nplts.sisal.it/betting/sisal-kura
- login credentials (see section below)

set `virtual-silicon-number` in the file [Dockerfile](ntb-local-be/Dockerfile) (DO NOT COMMIT this change)

command `npm run local-backend` (service available on `localhost:8080`)

When the command is launched, it opens an interactive shell that will ask for

- git credentials
- branch to launch

`npm start` already points by default to `localhost:8080`

if your git password changed, running the command will fail once, launch it one more time

## Login

To be able to login and sell you need to create your own credentials

- https://hackmd.io/--CgkGI9Sqms-jWh28AMlQ
- when creating the user one more step is needed massimali->sportqf->abilitazioni->tutti
- save somewhere `silicon-number` as it is needed to be able to use backend locally

the login is stateful
S

## Known issues

Ensure that the file `start.sh` haslinux line endings (LF) in case git unpack files with windows line endings (CRLF)

if "vendita" is not working, in console where the command was launched

- press enter (you should see `osgi>`)
- `lb`
- look for the row containing `tg-betting-selling-service` and remember the id (at the start of the line)
- `stop 158` where 158 is the number from before
- `start 158` where 158 is the number from before
- if login is not working
  - stop start `tg-template-repository` 182
  - stop start `tg-betting-selling-service` 158
