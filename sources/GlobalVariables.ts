let w = <any>window;

// holds the last script loaded. How does it work? this isn't set when the window is loaded
w.$BODY_SCRIPT = null;

w.$MOBILE_PHONE = false;// defaults to desktop
// Détermination sans autre globale du chemin 
// de ce script (dans quel dossier il se trouve) :
w.$APP_PATH = null;
// Si le script est le premier script DGPad trouvé dans la page :
w.$ECHO_SOURCE = false;
// Désactive toutes les alertes sur cette fenêtre pour éviter que l'uiwebview
// soit polluée par une alerte "popup" de filepicker :
w.$ALERT = window.alert;
// Indique si DGPad s'ouvre dans l'application iOS/Android ou bien dans le navigateur :
w.$APPLICATION = false;
w.$iOS_APPLICATION = false;
// Only for standard android keyboard :
w.$STANDARD_KBD = null;
// Seulement pour la plateforme Android, true dans ce cas :
w.$STOP_MOUSE_EVENTS = false;

w.$SCALE = 1;
w.$FPICKERFRAME = null;

w.$INCLUDED_FILES = [];

// (src:string) => HTMLElement
w.$HEADSCRIPT = null;

// Uniquement utilisé en mode developpement :
// (fname, external) => void
w.$INCLUDE = null;
// () => void
w.$LOADMAIN = null;

// Le ou les fichiers de langues doivent être chargées en premier
// le reste (Main.js) doit donc attendre que ces fichiers soient
// interprétés. _proc est la fonction appelée lorsque ces scripts
// sont chargés (onload) :
// () => void
w.$LOADLANGUAGE = null;

// () => void
w.$LOADPICKER = null;

// () => void
w.$MAIN_INIT = null;

// () => void
w.$ECHOSRC = null;

// (ruleName: string, deleteFlag?: string) => boolean | CSSStyleRule
w.$GETCSS = null;

// (rule: string, propertiesCSV: string) => void
w.$SCALECSS = null;

// Global utils object "$U" accessible from everywhere : {initCanvas:(id:string)=>void}
w.$U = {};
w.$L = {};
w.$P = {};

// ?? not understood
// Object.touchpad: boolean