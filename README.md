# dgpad

## Guía del BootLoader
```typescript
/*
 * index.html
 */

// configure viewPort
// load DGPad.js

DGPad.js // Heavily commented by me, not well understood
	// define global functions !!
	// if we need to stop mouse events
		Element.prototype.addEventListener; // modify
	// init or load
		// style
		// LANG: load appropriate file
		// MAIN: load all dependencies
		// FilePicker: load external lib
		// FPICKERFRAME: ?? what's this for ??
	// !! bad practice !! must make a global S&R !!
	window.onload();
		$MAIN_INIT(); // <- Utils.js
		$ECHO_SOURCE(); // ?? debugging ??

Utils.js/
	$MAIN_INIT();
		initCanvas();
		new Canvas();
		initEvents();
			// attach all the events from Canvas
		Event.prototype // modify
		Canvas.addTool(); // add all tools, constructors, etc... !!??
		Canvas.clearBackground();
		
// Application has loaded and is waiting for user events
```

## Ficheros más importantes
- `sources/Canvas.ts`
- `sources/Construction.ts`
- `sources/Constructors/ObjectConstructor.ts`
- `sources/Objects/PointObject.ts`

## Roadmap / TODOs
- [ ] transcribe as many files as possible
  - [ ] `Constructors` directory
  - [ ] `Objects` directory
- [ ] split `Utils.ts` into _utilities_ and _bootloading_
- [ ] create as many `*.d.ts` files as possible
- [ ] eliminate duplicate functionality
- [ ] **SYNC:** incorporate changes introduced by Eric for **Blockly** on last push
- [ ] improve `README`
- [ ] tackle global variables... probably just create an `Application` instance to hold all the relevant information
- [ ] involve Eric for a better understanding of the app
- [ ] TEST! TEST! TEST!

## Bootstrap procedure

1. DetermineViewport. This could be integrated into **DGPad**
2. **DGPad**
  1. Load Language: `'NotPacked/lang/LocalStrings(_XX).js'` defines global variable `$L = {};`
  2. Load Main: `'Main.js'` Loads the whole damn thing (145 files)
  3. Load FilePicker
  4. `window [load]` Main Init
  5. _IIFE_ create canvas

## Global vars

##### $BODY\_SCRIPT
holds the last script loaded. How does it work? this isn't set when the window is loaded

##### $MOBILE\_PHONE
false, defaults to desktop

##### $APP\_PATH
// Détermination sans autre globale du chemin 
// de ce script (dans quel dossier il se trouve) :

##### $ECHO\_SOURCE
must be for debugging purposes, it seems it'll be on by default if $APP\_PATH is not defined
// Si le script est le premier script DGPad trouvé dans la page :

##### $ALERT
holds the original `window.alert` method
// Désactive toutes les alertes sur cette fenêtre pour éviter que l'uiwebview
// soit polluée par une alerte "popup" de filepicker :

##### $APPLICATION , $iOS\_APPLICATION
// Indique si DGPad s'ouvre dans l'application iOS/Android ou bien dans le navigateur :

##### $STANDARD\_KBD
Only for standard android keyboard

##### $STOP\_MOUSE\_EVENTS
When this flag is set to true, some android mouse events are cleared away
// Seulement pour la plateforme Android, true dans ce cas :

##### $SCALE
unknown as of yet

##### $FPICKERFRAME
unknown

##### $INCLUDED\_FILES
an array that holds everything that has been loaded so far

##### $HEADSCRIPT
[typescript]
	// loads js files into the head
	let $HEADSCRIPT: (src:string) => HTMLElement
[/typescript]

##### $INCLUDE
[typescript]
	// includes files into the head calling $HEADSCRIPT and stores them in $INCLUDED\_FILES
	// Uniquement utilisé en mode developpement :
	let $INCLUDE: (fname, external) => void
[/typescript]

##### $LOADMAIN
[typescript]
	// loads a file called Main.js
	let $LOADMAIN: () => void
[/typescript]

##### $LOADLANGUAGE
[typescript]
	/**
	 * A convoluted way of determining the language automagically...
	 * Determine the language through the script tag's' data-lang attribute
	 * Default: the UA determines the language...
	 * I probably should let the user define it, not the agent
	 */
	let $LOADLANGUAGE: () => void
[/typescript]

##### $LOADPICKER
[typescript]
	/**
	 * Loads the library FilePicker and sets the key
	 * I still need to understand filepicker
	 */
	let $LOADPICKER: () => void
[/typescript]

##### $MAIN\_INIT
makes use of an unidentified global $U
[typescript]
	/**
	 * Initializes all canvas in the document that have an ID that starts with 'DGPad'
	 */
	let $MAIN_INIT: () => void
[/typescript]

##### $ECHOSRC
[typescript]
	/**
	 * Loads the library FilePicker and sets the key
	 * I still need to understand filepicker
	 */
	let $ECHOSRC: () => void
[/typescript]


##### $GETCSS
[typescript]
	/**
	 * Either fetches a cssRule or attempts to delete one
	 * (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
	 * deleteFlag should be an optional bool
	 */
	let $GETCSS: (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
[/typescript]

##### $SCALECSS
[typescript]
	/**
	 * Scales the ruleName to the global scale size
	 */
	let $SCALECSS: (rule: string, propertiesCSV: string) => void
[/typescript]

##### $U
Undocumented. **Found**
Uninitialized `./Utils.js`

A thousand lines of utilities, I'm considering moving the file to the new `Utils` directory.

> `$MAIN_INIT` makes use of an -unidentified- global `$U`
[typescript]
	let $U:  {initCanvas:(id:string)=>void}
[/typescript]

##### $P
Undocumented. **Found**
Uninitialized `./Docs/Preferencees.js`

##### $L
Undocumented. **Found**
Uninitialized `./NotPacked/lang/LocalStrings.js`

## Completed files

- GUIElement
  * Label
  * SimpleDialog
  * DlogContainer
  * InputText
  * ImageGroup
  * ImageBox
  * Iframe
  * CloseBox
  * Checkbox
  * Button
  * BtnGroup
  * iPadDOMElt _may be considered an extension of GUIElement_ too much duplicated functionality
  * iPadList _idem_
  * ColorPicker **moved** to libs. It's self contained
- DeleteAll
- Panel
  * VerticalBorderPanel
  * HorizontalBorderPanel
  * CentralPanel
  * viewportListPanel
  * progressBar
  * BubblePanel _circular reference #1_
  * BubbleListPanel _circular reference #1_
- Macro
  * MacroPropertiesPanel
  * MacrosManager
  * MacrosPanel
- Properties
  * most but `PropertiesPanel` and `props_colorPanel`
- History
  * HistoryPanel
  * HistoryPanel_Elt

### currently

ExpresionObject, ListObject, CurvusOject

## ClusterFucks

### CoordsSystem.js

There is a problem within the class. Some methods have the same name, most likely, some of the methods were privately defined and others are public methods.

The file is most likely broken now!

### Canvas.js

The combination of global, private and public members is daunting to say the least. The file is useless until I can make sense of what is going on.

### Construction.js

I am not touching that monstrosity yet.

### Utils.js

There are basic utilities mixed with initializers and monster-expando dom manipulators. This file is unmanageable, I'll have to split it.

### GUI/Elements/slider.js

this is a function that I haven't looked into

### Calc/MainCalcPanel

what a crazy piece of shite. Encapsulated and forgotten
