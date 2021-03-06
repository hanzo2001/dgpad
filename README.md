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
- [x] transcribe as many files as possible
  - [x] `Constructors` directory
  - [x] `Objects` directory
  - [ ] transcribe `Interpreter.ts`
- [ ] split `Utils.ts` into _utilities_ and _bootloading_
- [ ] understand `Interpreter.ts`
- [ ] change **browser/platform** detection to **feature** detection
- [ ] create as many `*.d.ts` files as possible
  - [ ] make typings for external libraries
  - [ ] make typings for objects
  - [ ] make typings for constructors
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

## Understanding `Interpreter`

- The interpreter is created in `Canvas->constructor` marked at `createSandbox`.
- The interpreter lives inside a dynamically created, invisible `iframe` called the _sandbox_.
- When the _sandbox_ loads, it is language-gnostic and knows what to load.
- The _sandbox_ loads only the base language file, an optional secondary language file and the **Interpreter** itself.
- Once the iframe has been loaded, the **Interpreter** is instantiated and initialized.
- An AJAX request is sent to fetch `NotPacked/plug-ins.js`.
- The contents of the file are **EVAL**ed and the defined macros are supposed to populate `Interpreter.$macros`.
- **Interpreter** adds the macros to the `Canvas.MacrosManager` which generates a `Macro` for each one.

Currently, the interpreter is completely broken. I'm trying to grasp a full understanding of the inner workings of this monstruous string evaluator. The most likely route will be to leave the original interpreter alone and start a V2 model for further implementation.

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
```typescript
	// loads js files into the head
	let $HEADSCRIPT: (src:string) => HTMLElement
```

##### $INCLUDE
```typescript
	// includes files into the head calling $HEADSCRIPT and stores them in $INCLUDED\_FILES
	// Uniquement utilisé en mode developpement :
	let $INCLUDE: (fname, external) => void
```

##### $LOADMAIN
```typescript
	// loads a file called Main.js
	let $LOADMAIN: () => void
```

##### $LOADLANGUAGE
```typescript
	/**
	 * A convoluted way of determining the language automagically...
	 * Determine the language through the script tag's' data-lang attribute
	 * Default: the UA determines the language...
	 * I probably should let the user define it, not the agent
	 */
	let $LOADLANGUAGE: () => void
```

##### $LOADPICKER
```typescript
	/**
	 * Loads the library FilePicker and sets the key
	 * I still need to understand filepicker
	 */
	let $LOADPICKER: () => void
```

##### $MAIN\_INIT
makes use of an unidentified global $U
```typescript
	/**
	 * Initializes all canvas in the document that have an ID that starts with 'DGPad'
	 */
	let $MAIN_INIT: () => void
```

##### $ECHOSRC
```typescript
	/**
	 * Loads the library FilePicker and sets the key
	 * I still need to understand filepicker
	 */
	let $ECHOSRC: () => void
```


##### $GETCSS
```typescript
	/**
	 * Either fetches a cssRule or attempts to delete one
	 * (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
	 * deleteFlag should be an optional bool
	 */
	let $GETCSS: (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
```

##### $SCALECSS
```typescript
	/**
	 * Scales the ruleName to the global scale size
	 */
	let $SCALECSS: (rule: string, propertiesCSV: string) => void
```

##### $U
Undocumented. **Found**
Uninitialized `./Utils.js`

A thousand lines of utilities, I'm considering moving the file to the new `Utils` directory.

> `$MAIN_INIT` makes use of an -unidentified- global `$U`
```typescript
	let $U:  {initCanvas:(id:string)=>void}
```

##### $P
Undocumented. **Found**
Uninitialized `./Docs/Preferencees.js`

##### $L
Undocumented. **Found**
Uninitialized `./NotPacked/lang/LocalStrings.js`

## Understand the Canvas Events

During application bootstrap, many events are attached to the **canvas** element. All of them are methods of `Canvas`

Event|Callback
-----|--------
`'wheelevent'` |`mouseWheel`
`'touchmove'`  |`touchMoved`
`'touchstart'` |`touchStart`
`'touchend'`   |`touchEnd`
`'touchcancel'`|`touchEnd`
`'mousemove'`  |`mouseMoved`
`'mousedown'`  |`mousePressed`
`'mouseup'`    |`mouseReleased`
`'click'`      |`mouseClicked`
`'dragover'`   |`dragOver`
`'drop'`       |`drop`

### `Canvas.mousedown`: Understand the initiation of a click or drag
Internally documented but still lacking parts

### `Canvas.mouseup`: Understand the culmination of a click or drag
Internally documented but still lacking parts

### `Canvas.wheelevent`: Understand Zoom procedure

1. `Application.initCanvas` adds event listener `Canvas.mousewheel`
2. `Canvas.mousewheel` extracts **height** info through `Utils.extractDelta`
4. `Canvas` finds `(x,y)` event page offset from bounds
3. `Canvas` calls `Construction.zoom` and passes the info
4. `Construction` updates the **changed** state for the `window`
5. `Construction` calls `CoordsSystem.zoom`
  1. clear the canvas
  2. determine the center
  3. verify height does not exceed the maximum allowed (confirm that the new **unit** value will not exceed the max)
  4. **Iterate** over `Construction.elements`. Use `setXY` on free points, `setZoom` on `circle1` instances
  5. fix new center
  6. fix new **unit** value (this is going to be a source of precision problems)
6. `Construction` attempts to  **Validate** all points... I do not understand this
  1. what is `Construction.V: any[]`? closest guess: `instanceof ConstructionObject`
  2. attempt to reset the **Indicated** objects. What does it mean to be _indicated_? **IMPORTANT:** the loop logic inside `applyValidateFilters`
7. `Construction` attempts to **Compute All**
8. Paint the `Construction`

### `Canvas.touchMoved`: not understood

1. prepare a `mouseMoved` callback
2. pass the **Event** and the **callback** to `touchToMouse`
3. ... WIP

## ClusterFucks

------

outdated info

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
