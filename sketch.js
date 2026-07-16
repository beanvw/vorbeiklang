
//Definitionen
let zoomLevel = 1; 
let offsetX = 0; // Standard-Offset für Drag
let offsetY = 0;
let zoomEnabled = true; // Steuerung für Zoom und Drag

let titelX;
let titelSpeed = 2.5;
let titelOffset = 0;


let zeileVersatz1 = 0;
let zeileVersatz2 = 180;
let zeileVersatz3 = -80;

let dragMittelpunktX = 0;
let dragMittelpunktY = 0;
let maximalerDragRadius = 0;
let startViewX;
let startViewY;
let maxDragX;
let maxDragY;


//Definitionen für Eintippen Sketch------
const TYPING_SKETCH = ["1","2","8","13","20","23","25","26","27","28","34","35","36","39","42","43","48", "53", "59", "60"]; //2 personen 
let popupScrollY = 0;

let currentAbsatz = 0;
let typedCharacters = 0;
let pauseFrames = 0;


let typingInterval = 20; // Millisekunden pro Buchstabe
let lastTypedTime = 0;
let pauseDuration = 12;
//Ende Definitionen  Eintippen Sketch------


//Definitionen Worte Einblenden Sketch
const FLOATING_SKETCH = ["4","5","9","10","11","12","17","31","32","49","50", "39", "52", "65"]; //kurze Sätze 

let floatingCurrentWord = 0;
let floatingWordInterval = 450;
let floatingLastWordTime = 0;
let floatingPhase = "fadeIn";
let floatingCurrentFadeOutWord = 0;
let floatingFadeOutInterval = 180;
let floatingLastFadeOutTime = 0;

//Ende Definitionen Worte Einblenden Sketch

//Definitionen Paragraph Sketch
const PARAGRAPH_SKETCH = ["7","14","16","19","21","29","30","37","38","45","72"]; // Monologe 

let floatingWords = [];
let paragraphSketchState = {
  paragraphs: [],
  visibleParagraphs: 0,
  revealTimer: 0,
  revealInterval: 90,
  lastText: ""
};

// Definitionen Quote Sketch
const QUOTE_TYPING_SKETCH = ["6","24","3","18","62","63","64","66", "67", "68", "69", "70","73"]; // Monologe

let quoteTypingText = "";
let quoteTypingLength = 0;
let quoteTypingSpeed = 0.75;

let quoteTypingMarginX = 56;
let quoteTypingMarginY = 72;
let quoteTypingLineHeight = 42;
let quoteTypingBaseSize = 27;
//Ende Defintionen Quote Sketch

//Defintionen Grow Sketch
const GROWING_TEXT_SKETCH = ["22", "55", "61","57","71"]; 

let growingTextText = "";
let growingTextTypedCount = 0;
let growingTextTypeSpeed = 0.9;

let growingTextMaxFontSize = 0;
let growingTextMinFontSize = 0;
let growingTextCurrentFontSize = 0;
let growingTextLineHeight = 60;
let growingTextMarginX = 54;
let growingTextMarginY = 92;
let growingTextParagraphWidth = 0;
//Ende Definitionen Grow Sketch

//Defintionen Ticker sketch 
const TICKER_SKETCH = ["51" ,"47", "40", "41", "44", "46", "54","56","58", "15", "33"]; //2 Personen, kurz 

// Globale Variablen
let tickerAbschnitte = [];
let tickerPositionen = [];

let tickerSpeed = 2.5;
let tickerAbstand = 40;
//Ende Defintionen Ticker Sketch


let canvas;
const controls = {
  view: {x: 0, y: 0, zoom: 1}, // Standard-Zoom-Level, Wenn Seite geöffnet wird!
  viewPos: { prevX: null,  prevY: null,  isDragging: false },
}

let selectedKonversationName = null;
let konversationSounds = {};
let openMenu = true;
let closeButtonX = 0;

let sprechblaseGrauImg;
let sprechblaseWeissImg;
let menuBackgroundColor;
let lastInteractionTime = 0;

const TITLE_IDLE_DELAY = 10000;
const TITLE_IDLE_FADE_PERIOD = 9000;
const TITLE_ACTIVE_BOB = 1.15;
const TITLE_IDLE_BOB = 1.8;

function generateMenuBackgroundColor() {
  colorMode(HSB, 360, 100, 100, 100);
  const generatedColor = color(random(360), 99.45, 70.98);
  colorMode(RGB, 255);
  return generatedColor;
}

/*function getReadableMenuTextGray(backgroundColor) {
  const backgroundLuma =
    red(backgroundColor) * 0.2126 +
    green(backgroundColor) * 0.7152 +
    blue(backgroundColor) * 0.0722;

  if (backgroundLuma < 128) {
    return constrain(map(backgroundLuma, 0, 128, 190, 130), 130, 190);
  }

  return constrain(map(backgroundLuma, 128, 255, 110, 75), 75, 110);}
  */

function registerInteraction() {
  lastInteractionTime = millis();
}

//sprechblasen button
function isMenuButtonClicked(x, y) {
  return x >= 14 && x <= 59 && y >= 17 && y <= 47;
}

function isMenuButtonHovered() {
  return isMenuButtonClicked(mouseX, mouseY);
}

function drawMenuButton() {
  const buttonImg = openMenu ? sprechblaseWeissImg : sprechblaseGrauImg;

  if (isMenuButtonHovered()) {
    push();
    translate(36, 32);
    rotate(sin(frameCount * 0.35) * 0.1);
    imageMode(CENTER);
    image(buttonImg, 0, 0, 45, 30);
    pop();
    imageMode(CORNER);
    return;
  }

  image(buttonImg, 14, 17, 45, 30);
}


// Audio Dateien, falls wir die noch einfügen wollen
const KONVERSATION_SOUND_FILES = {

};

// Stadtteile von Essen - Postionen und Radius 
const Stadtteile = {

  //Bezirk 1 Innenstadt
  "Nordviertel":      { x: 0.47, y: 0.29, r: 0.03 },
  "Westviertel":     { x: 0.46, y: 0.32, r: 0.03 },
  "Südviertel":       { x: 0.465, y: 0.35, r: 0.03 },
  "Stadtkern":        { x: 0.475, y: 0.32, r: 0.02 },
  "Südostviertel":     { x: 0.48, y: 0.34, r: 0.03 },
  "Ostviertel":        { x: 0.48, y: 0.3, r: 0.03 },
  "Frillendorf":        { x: 0.51, y: 0.29, r: 0.03 },
  "Huttrop":            { x: 0.5, y: 0.35, r: 0.03 },

 //Bezirk 2 Mitte
  "Rüttenscheid":     { x: 0.44, y: 0.49, r: 0.04 },
  "Stadtwald":       { x: 0.46, y: 0.56, r: 0.036 },
  "Rellinghausen":     { x: 0.505, y: 0.54, r: 0.028 },
  "Bergerhausen":     { x: 0.51, y: 0.48, r: 0.04 },


  //Bezirk 3 Westen
  "Altendorf":      { x: 0.43, y: 0.36, r: 0.032 },
  "Frohnhausen":    { x: 0.41, y: 0.42, r: 0.038 },
  "Holsterhausen":  { x: 0.45, y: 0.43, r: 0.03 },
  "Fulerum":        { x: 0.395, y: 0.5, r: 0.023 },
  "Margarethenhöhe": { x: 0.42, y: 0.5, r: 0.023 },
  "Haarzopf":        { x: 0.39, y: 0.57, r: 0.038 },

   //Bezirk 4 Nordwesten
  "Bergeborbeck":   { x: 0.41, y: 0.2, r: 0.035 },
  "Bocholt":        { x: 0.43, y: 0.28, r: 0.03 },
  "Dellwig":        { x: 0.35, y: 0.22, r: 0.04 },
  "Gerschede":      { x: 0.38, y: 0.22, r: 0.025 },
  "Frintrop":       { x: 0.305, y: 0.27, r: 0.028 },
  "Borbeck":        { x: 0.38, y: 0.3, r: 0.035 },
  "Bedingrade":     { x: 0.33, y: 0.31, r: 0.03 },
  "Schönebeck":     { x: 0.365, y: 0.37, r: 0.032 },

   //Bezirk 5 Norden
  "Karnap":       { x: 0.465, y: 0.1, r: 0.03 },
  "Altenessen":   { x: 0.49, y: 0.2, r: 0.055 },
  "Vogelheim":    { x: 0.445, y: 0.18, r: 0.03 },

  //Bezirk 6 Nordosten
  "Stoppenberg":       { x: 0.52, y: 0.23, r: 0.031 },
  "Schonnebeck":       { x: 0.54, y: 0.25, r: 0.025 },
  "Katernberg":         { x: 0.53, y: 0.2, r: 0.03 },
  
  //Bezirk 7 Osten
  "Horst":             { x: 0.59, y: 0.48, r: 0.03 },
  "Freisenbruch":       { x: 0.585, y: 0.42, r: 0.03 },
  "Steele":             { x: 0.54, y: 0.405, r: 0.03 },
  "Kray":               { x: 0.53, y: 0.32, r: 0.032 },
  "Leithe":             { x: 0.57, y: 0.33, r: 0.03 },

  //Bezirk 8 Südosten
  "Kupferdreh":     { x: 0.55, y: 0.75, r: 0.05 },
  "Heisingen":       { x: 0.53, y: 0.65, r: 0.04 },
  "Byfang":         { x: 0.58, y: 0.68, r: 0.03 },
  "Überruhr":       { x: 0.56, y: 0.52, r: 0.042 },
  "Burgaltendorf":   { x: 0.6, y: 0.58, r: 0.038 },


  //Bezirk 9 Süden
  "Schuir":        { x: 0.39, y: 0.67, r: 0.04 },
  "Kettwig":       { x: 0.35, y: 0.8, r: 0.05 },
  "Heidhausen":     { x: 0.44, y: 0.79, r: 0.05 },
  "Bredeney":       { x: 0.43, y: 0.65, r: 0.04 },
  "Werden":         { x: 0.42, y: 0.71, r: 0.035 },
  "Fischlaken":     { x: 0.49, y: 0.69, r: 0.04 },

};

// Zusammengesetzte Bezirke aus bestehenden Stadtteilen
const Bezirke = {
  bezirk_1: ["Nordviertel", "Westviertel", "Südviertel", "Stadtkern", "Südostviertel", "Ostviertel", "Frillendorf", "Huttrop"],
  bezirk_2: ["Rüttenscheid", "Stadtwald", "Rellinghausen", "Bergerhausen"],
  bezirk_3: ["Altendorf", "Frohnhausen", "Holsterhausen", "Fulerum", "Margarethenhöhe", "Haarzopf"],
  bezirk_4: ["Bergeborbeck", "Bocholt", "Dellwig", "Gerschede", "Frintrop", "Borbeck", "Bedingrade", "Schönebeck"],
  bezirk_5: ["Karnap", "Altenessen", "Vogelheim"],
  bezirk_6: ["Stoppenberg", "Schonnebeck", "Katernberg"],
  bezirk_7: ["Horst", "Freisenbruch", "Steele", "Kray", "Leithe"],
  bezirk_8: ["Kupferdreh", "Heisingen", "Byfang", "Überruhr", "Burgaltendorf"],
  bezirk_9: ["Schuir", "Kettwig", "Heidhausen", "Bredeney", "Werden", "Fischlaken"]
};




//Konversationen Namen nach Nummerierung und Angabe des Stadtteils - Statdteile immer groß schreiben, wie angegeben
//Angabe der Bezirke!
const Konversationen = [
  { name: "1", stadtteil: "bezirk_7" },
  { name: "2", stadtteil: "bezirk_4" },
  { name: "3", stadtteil: "bezirk_4" },
  { name: "4", stadtteil: "bezirk_4" },
  { name: "5", stadtteil: "bezirk_1" },
  { name: "6", stadtteil: "bezirk_1" },
  { name: "7", stadtteil: "bezirk_2" },
  { name: "8", stadtteil: "bezirk_4" },
  { name: "9", stadtteil: "bezirk_1" },
  { name: "10", stadtteil: "bezirk_5" },
  { name: "11", stadtteil: "bezirk_5" },
  { name: "12", stadtteil: "bezirk_1" },
  { name: "13", stadtteil: "bezirk_7" },
  { name: "15", stadtteil: "bezirk_1" },
  { name: "16", stadtteil: "bezirk_1" },
  { name: "17", stadtteil: "bezirk_1" },
  { name: "18", stadtteil: "bezirk_7" },
  { name: "19", stadtteil: "bezirk_5" },
  { name: "20", stadtteil: "bezirk_7" },
  { name: "21", stadtteil: "bezirk_1" },
  { name: "22", stadtteil: "bezirk_4" },
  //{ name: "23", stadtteil: "" }, weiß den stadtteil nicht
  { name: "24", stadtteil: "bezirk_9" },
  { name: "25", stadtteil: "bezirk_9" },
  { name: "26", stadtteil: "bezirk_9" },
  { name: "27", stadtteil: "bezirk_9" },
  { name: "28", stadtteil: "bezirk_4" },
  { name: "29", stadtteil: "bezirk_4" },
  { name: "30", stadtteil: "bezirk_7" },
  { name: "31", stadtteil: "bezirk_4" },
  { name: "32", stadtteil: "bezirk_7" },
  { name: "33", stadtteil: "bezirk_9" },
  { name: "34", stadtteil: "bezirk_8" },
  { name: "35", stadtteil: "bezirk_6" },
  { name: "36", stadtteil: "bezirk_6" },
  { name: "37", stadtteil: "bezirk_3" },
  { name: "38", stadtteil: "bezirk_3" },
  { name: "39", stadtteil: "bezirk_5" },
  { name: "40", stadtteil: "bezirk_5" },
  { name: "41", stadtteil: "bezirk_5" },
  { name: "42", stadtteil: "bezirk_5" },
  { name: "43", stadtteil: "bezirk_2" },
  { name: "44", stadtteil: "bezirk_2" },
  { name: "45", stadtteil: "bezirk_2" },
  { name: "46", stadtteil: "bezirk_2" },
  { name: "47", stadtteil: "bezirk_8" },
  { name: "48", stadtteil: "bezirk_8" },
  { name: "49", stadtteil: "bezirk_8" },
  { name: "50", stadtteil: "bezirk_8" },
  { name: "51", stadtteil: "bezirk_3" },
  { name: "52", stadtteil: "bezirk_6" },
  { name: "53", stadtteil: "bezirk_6" },
  { name: "54", stadtteil: "bezirk_6" },
  { name: "55", stadtteil: "bezirk_6" },  
  { name: "56", stadtteil: "bezirk_3" },
  { name: "57", stadtteil: "bezirk_3" },
  { name: "58", stadtteil: "bezirk_3" },
  { name: "59", stadtteil: "bezirk_8" },
  { name: "60", stadtteil: "bezirk_8" },
  { name: "61", stadtteil: "bezirk_8" },  
  { name: "62", stadtteil: "bezirk_6" },
  { name: "63", stadtteil: "bezirk_6" },
  { name: "64", stadtteil: "bezirk_9" },
  { name: "65", stadtteil: "bezirk_8" },
  { name: "66", stadtteil: "bezirk_2" },
  { name: "67", stadtteil: "bezirk_2" },
  { name: "68", stadtteil: "bezirk_3" },
  { name: "69", stadtteil: "bezirk_7" },
  { name: "70", stadtteil: "bezirk_7" },
  { name: "71", stadtteil: "bezirk_2" },
  { name: "72", stadtteil: "bezirk_7" },
  { name: "73", stadtteil: "bezirk_2" },


];

let punkte = [];

const KONVERSATION_TEXTE = {
  // Typing sketch 
  1: "L:Was ändert das heutzutage an Hochzeiten? Gerade in der heutigen Zeit?\nR: Ne, Dankesehr. \nL:Du möchtest doch bestimmt heiraten irgendwann oder?\nR:Also es ist mein größter Wunsch eigentlich.\nL:Eigentlich? Wie alt bist du?\nR:Fünfzehn, ich werde in zwei Wochen sechszehn.\nL:Mein Sohn ist dreizehn und der große sechsundzwanzig.\nL:Weißt du, weißt du was das eigentlich heißt?\nR:Ich möchte das Hochzeitskleid tragen.\nL:Na, aber eigentlich.\nL:Aber heiraten willst du nicht?\nR:Ne. Dann sage ich, ich will das nicht. \nL:Eigentlich aber, eigentlich muss ich immer, da ist doch ein Problem. Genau, eigentlich willst du nicht heiraten.\nL:Eigentlich geht es dir nur ums Kleid und um die Atmosphäre, so weißt du?\nR:So Verloben wäre noch für mich schön, so verlobungsmäßig mit Verlobungsantrag.\nL:Ja, dann so, mach das.\nL:Aber verlobt bist du noch nicht?\nR:Nein entweder man hat sich lieb oder man hat sich nicht lieb.\nR:Waren Sie mit ihrem Ex-Mann verheiratet?\nL:Nein, verheiratet nicht. Wir sind mittlerweile beide sechsundvierzig. Beziehungen klappen solange man nicht heiratet.\nR:Meine Eltern waren so schlimm, so schlimm.\nL:Tschüss, pass auf dich auf.\nR:Mach ich, tschüss.",

  //typing sketch
  2: "L:Oma!\nR:Ja?\nL:Anna entscheidet immer den Weg! \nR:Ehrlich?\nL:Ja. \nR:Was?\nL:Anna, du entscheidest immer den Weg!\nR:Was denn? Hanjo, Alles Gut.\nL:Ja warum denn wohl, überleg mal.",
  
  //wellen sketch
  3: "Und dann sie so “kommt her zusammen“ weil sie dachte er rennt weg vor der Kontrolle. Und ich bin durch so einen Abteil und auf einmal kam da Luft und alles vom Boden. Das war richtig komisch",

  // floating sketch 
  4: "Pass mal, pass mal! Ich hab, ich hab. Ich weiß. Oh, scheiße. Sorry! Bin gar nicht auf die Fresse gefallen. Zu mir! Hier! Leon! Hallo, Junge. Gib, gib, Malte.",

  //floating sketch
  5: "Voll schön. Aber braucht man das?",

  //wellen sketch
  6: "Er meinte so  “ne heute nicht, aber wenn du morgen vorbei kommst, dann sollte das gehen“ voll komisch, so warum denn nicht \nheute, das geht doch schnell?",
  
  //paragraph sketch
  7: "Willst du das denn? Sei bitte ehrlich. So für dich vor allem, weil das bringt ja sonst nichts, weißt du?",
  
  //8: TypingSketch
  8: "L:Ist das ein Junge oder Mädchen?\nR:Das ist ein Mädchen.\nL:Oh je, dann lieber nicht. Die mag keine Mädchen.\nR:Okay.\nL:Hannah, nein! Bleib hier!\nL:Das ist das erste mal, wo sie kein Theater bei einem Mädchen gemacht hat.\nL:Was ist denn jetzt los?",

  //9: FLoating Sketch
  9: "Entschuldigung, dann braucht sie nicht mehr so alleine sein",

  //floating sketch
  10: "Ah für uns? Das sind vier Euro oder so",

  //floating sketch 
  11: "Kasse? Kasse? Okay, dann kann ich raus",

  //floating sketch 
  12: "Haben Sie die Rechnung? Muss weiter vorne sein. Das hier.",

  //13: Typing Sketch
  13: "L:Ja, ja.\nL:Das sind ja auch mehrere.\nR:Qualität ist toll. \nL:Also ich mag die Sachen unheimlich gerne, ich könnte den Leuten das auch nicht verkaufen. Weil ich selber das gelernt habe. Ich weiß, wie Kuchen schmecken sollte und nh. \nR:Ja ich mach auch noch, aber meistens nur wenn ich frei habe, Urlaub, dann mach ich viel.\nL: Ja, da kaufe ich auch.\nR: Bienenstich.\nL: Ja, haben wir jetzt auch, ich glaub den kriegen wir jetzt zum Wochende.\nR: Oh der ist Spitze.\nL:Der ist so groß immer, aber bei uns nur 5,75. Die kosten 7,85 bei Malzer, die sind teuer.\nR:Meine Oma hat auch alles selber gemacht, die hat damals Frankfurter Kränze, alles dafür selber gemacht.\nR: Damals hat die Oma, soll man ja nicht mehr sagen, Zigeuner bei sich im Haus, befreundet mit meiner Oma, die haben alles für meine Oma getan. ",

  //paragraph
  14: "Erstens das und zweitens, er hat bis hier hin dickes Haar und zum Ende hin hat er voll das dünne Haar und das sieht komplett anders aus. Also man könnte das auch sonst verdünnen, keine Ahnung",

  // typing sketch 
  15: "Das piekst voll.\nDu bist so sensibel.\nAua, man.",

  //paragraph sketch
  16: "Da kann man auch glücklich sein im Leben, ich gebe jedem etwas mit. Und dann fängt das echte Leben an. Ich weiß viele junge Leute sagen immer, was bringt uns die Zukunft, wenn man sieht wie so Regierung, alles was auf einen zukommt. Beten sie das, und ich mein, wenn sie das Beten. Ich hatte jetzt so eine Freude, wenn wir Gott unser Leben, Vergebung der Sünden hat und dann haben sie auch den Nebensinn. Wenn sie das tun, dann gibt es für uns kein sterben mehr und ist ein Übergang zum Paradies. Jesus hat alles für uns getan am Kreuz. Wenn wir es bekennen, ja, was passiert, Gott kommt in unser Leben, der Teufel jetzt ein Brecht. Guck mal, ohne das Gebet, das heißt der Böse hat Recht, er quält Menschen und wenn wir das beten, Entscheidung, dann kommen wir in das Reich Gottes, vergebene Sünden, kommt der heilige Geist und was passiert, bin glücklich. Wir haben gefunden warum wir leben, der Lebenssinn und für immer und ewig. Wir sehen uns wieder okay?",

  //floating sketch
  17: "Uhm Gesichtspuder? Von Balea? Gab's nicht?",

  //wellen sketch
  18: "Also meine Schwiegertochter, da hab ich die Hochzeitstorte gemacht, da hab ich alles aus Marzipan gemacht. Die sagt “ekelhaft, was soll ich das essen, das ist für den Müll, da bezahlst du auch Geld für. Sieht schön aus, aber schmeckt nicht.“ Ja so sieht's aus.",

  //paragraph sketch
  19: "Den Vetrag hat er nämlich jetzt unterschrieben, weil nh. Er geht jetzt noch zum Knappverband und dann kommt er bald zurück.",

  //typing sketch
  20: "L:Aber das Problem ist Stiftung Warentest 5.\nR:Ja, stimmt. Die steht drauf. Die andere können sie doch auch nicht nehmen.\nL:Aber die lässt sich ganz toll verarbeiten.\nR:Ja wenn die im Angebot ist.",

  //paragraph sketch
  21: "Das sind emotionslose vierzigjährige. Ne, ich geh da jetzt hin. Das ist ein Kind, kein Tier! Das ist respektlos, schämt euch! Komm wir gehen! ",

  //wellen sketch 
  22: "Und dann hat man nur noch Staub gesehen. So einzelne Stellen waren das. Aber wenn du es fest hältst, dann kann es dich auch vorbei lassen. Ne, so heißt das. Aber man hat dann hier ein Trick gesehen, dass vor dem Lichtschwert. Dann geht hier sowas auf dududu und dann wird da so Licht. Aber die machen das so. Und dann so puff. Ich vermisse den Kindergarten. Kennt ihr, wenn etwas ganz schlimm ist. Und deswegen ist das Laserschwert auch so heiß. Diggah das Ding dreht sich gegen den Gegnern von denen und geht so bruh und geht er boom boom boom. Einfach so. Und dann denkt er sich so: wo sind denn Laserschwerter? Dann geht er sich hierhin verstecken und dann macht er aber oder er macht halt. ",

  // typing sketch
  23: "L:Marc Eggers, der war bei Inselfieber.\nR:Was ist das jetzt für ein random Fakt? \nR:Letztes Jahr war der auf dem Poster, dieses Jahr nicht. \nL:Dieses Jahr war der auch da.\nR:Ja, der war da, aber nicht auf dem Poster, deshalb dachte ich, der ist nicht da.\nL:Lügner",

// wellen sketch
  24: "Girl haha, da hatten wir schonmal drüber geredet und da war ich so “aber bist du alleine also ziehst du so alleine eh woanders hin also ziehst du alleine weg? So weißt du so oder machst du ne WG oder so?“ Und dann war er so “nene ich mach noch eine Gruppe also ich wollte euch alle dann so..” und ich meinte dann so mäßig ob er alleine umzieht? ob er dann guckt, ob er alleine umziehen will?",
// typing sketch
  25: "L:Wenn der Darm Ballaststoffe braucht, dann erstmal nicht.\nR:Aber dann, man kann auch Überballastoffisieren.\nL:Und was machst du dann? \nR:Dann verbrenne ich die Ballaststoffe ganz schnell.\nL:Aber man kann es auch übertreiben. Lieber zum Arzt!",

  // typing sketch
  26: "L:Trinkt ihr eigentlich Alkohol?\nR:Me? Of course! You? How much in a week?\nL:Not that much. For now I drink a lot of alcohol free beer.\nR:Ah. Yes.\nL:It's so tasty.\nR:Wie bitte?\nL:Gib den Tabak.\nR:Gelegentlich.\nL:Gelegentlich.\nR:Einmal in der Woche.\nL:Wirklich? Gelegentlich? Einmal in der Woche? So richitg?\nR:Nein aber halt I drink, like I do it like sometimes a glass. Also when I’m sick I dont drink.\nL:Also das, was du bisher erwähnt hast, ist irgendwie ein bisschen sus.\nR:I would say on the weekends. Holy fuck! I dont know what gelegentlich ist.\nL:Maybe, maybe gelegentlich it is, I think.\nR:Ja aber regelmäßig, aber jedes Wochenende ist schon regelmäßig. ",

  // typing sketch
  27: "L:One time I drank so much I threw up so many times. Like five times. And I couldnt eat for like two to three days.\nR:Ja, normal.\nL:Normal. \nR:Normalerweise ist man dann ein bisschen tipsy.\nL:It was different, checkst du? \nR:So angetrunken oder?\nL:Nur von Shots. It was sweeter and it was disgusting.\nR:Aber natürlich. Die Zeiten sind vorbei.\nL:It’s not healthy. And I can drink two beers, I dont understand.\nR:Doch ich check schon.\nL:I drink like two beers and basically like.\nR:Ja ist gut.\nL:When I drink, let me feel it. Feel the alcohol. Feel the dizziness. Then you feel all red. You want to feel like this when you drink? No. \nR:Jain.\nL:When I just started like years ago the dizziness goes on and on.\nR:Ja.\nL:And then I drink less.", 

  //typing sketch
  28: "L:Guck mal Luka liked auch direkt. Ey der ist einfach an die Cousine.\nR:Was laberst du da? Haben die sich getrennt? Wann?\nL:Zwei Jahre oder so waren die. Hä was das für eine Frau? Oha junge das ist meine Lehrerin Bruder. Das ist krank alter, was los man. \nR:Bruder ist die Borbeck? Einfach geknallt.\nL:Nein die ist korrekt cool. Du kennst safe. \nR:Seine Ex nh? Ich hatte sie gestern bei Borbeck gesehen bei Gott Bruder so ein Fettsack ich schwöre.\nL:Was?\nR:So ein Golem Bruder ich schwör auf alles. Wie lang wart ihr zusammen?\nL:Ich glaube ein Jahr.\nR:Wie alt war sie?\nL:Wie alt?\nR:Wurde sie geknallt? Habt ihr nicht geknallt?\nL:Doch ja aber nur 4 Minuten.\nR:War geil?\nL:Ich würde nicht nochmal.\nR:Boah Junge. Egal Bruder. Ich habe auch nichts gegen sie, die ist korrekt, aber Bruder. Bruder, aber ich sage dir ehrlich, so ein Golem, Bruder. Kann ich mir gar nicht vorstellen. So eine wie du.\nL:Bruder, er geht auf Ex Diggah wirklich. Bruder es kracht wirklich gerade.\nR:Jaja hat die uns erzählt. Als ihr nicht zusammen wart, waren wir im Bus und da waren Leute die mega am pullen und dann meinte die.\nR:Wer?\nL:Diese eine. Bruder deine Ex. Eine richtig geile Bruder ich schwöre.",

  //paragraph sketch
  29: "Wir waren bei den Schafen. Die durften ins Bett. Wir haben die Schafe ins Bett gebracht! Die ganzen Schafe waren richtig süß. Ich will auch ein Schaf.",

  // pragraph sketch
  30: "Ich bekomme ja nicht mal Geld von denen. Ich bekomme ja nicht mal Geld. Yalla Habibi Jungs ich habe dreißig Euro nur noch. Ich bekomme nicht mal hundert. Du musst doch. Bruder, ich bin immer so da. ",

  // floating sketch
  31: "Ja okay! Dann halt nicht. Muss du selber wissen. Tschüss",

  //32: floating Sketch
  32: "Die sitzen da auf dem Rollator, alter!",

  //typing sketch
  33: "Sag mal, wie lange ist deine Mama jetzt schon tot?\nNeun Jahre.\nDie Zeit rennt. ",

  // typing sketch
  34: "L:Können wir bitte noch einmal dahin fahren?\nR:Aber ich habe nur noch zwei Balken.\nL:Wie du hast nur noch zwei Balken?",

  //35: typing Sketch
  35: "L:Anna ist gegangen mit ihrer ganzen Familie.\nR:Woher weißt du das?\nL:Hat Tim erzählt.\nR:Warum nimmst du uns nicht mit?\nL:Ich wurde selber mitgenommen von meiner Mutter. \nR:Ich wollte auch gehen.\nL:Ja dann kannst du nächstes Mal einfach mitkommen.\nR:Ja sicher, na klar. ",

  // typing sketch
  36: "L:Da ist die Klinik. Meine Klinik.\nR:Ach da gehst du immer hin? Zum Spritzen?\nL:Ja für Mama. Ich geh immer Uniklinik Essen. Um 7 Uhr ist der Kinderorthopäde da. ",

  //paragraph sketch
  37: "Also das gibt es ja nicht. Die braucht doch nicht elf Jahre . Lass mal elf Jahre Fleisch oder Gemüse reifen. Das geht doch nicht. Das will ich jetzt wissen. Schatz das gibt es nicht. ",

  //paragraph sketch
  38: "Die sind wirklich am robustesten. Die können alles ab. Die können Regen ab. Die können Sonne ab. Meine ist doch auch kaputt. Mach doch auch irgendwie so ein Efeu rein. Guck mal das ist doch echt Schön. Kannst du ja dann umstellen. Ich wohne ja sowie so in einer alten Bude.",

  39: "L:Haben Sie Payback?\nR:Ach stimmt... Moment.",
  40: "Nee, hier links\nBist du sicher?\nJa, da vorne ist die Rolltreppe.",
  41: "Mach mal ein Foto\nNee, warte, meine Haare.",
  42: "L:Ich hab dir doch gesagt, wir hätten früher losfahren sollen.\nR:Ja, aber wir sind doch da.\nL:Mit Glück.\nR:Jetzt reg dich nicht auf.\nL:Ich reg mich gar nicht auf.\nR:Doch.\nL:Nein.\nR:Doch.\nL:Ach komm.",
  43: "L:Wo müssen wir jetzt hin?\nR:Dritte Etage.\nL:Ist das nicht die zweite?\nR:Nee, guck doch.\nL:Ach stimmt.\nR:Sag ich doch.\nL:Ich hör dir einfach nie zu.\nR:Das ist das Problem.",
  44: "Bruder, heute Beine.\nBoah nee.\nMuss.\nIch kann morgen nicht laufen.",
  45: "Nein, hör mir doch einmal zu. Ich hab nicht gesagt, dass ich das nicht mache. Ich hab gesagt, heute schaff ich das nicht. Das ist doch ein Unterschied. Ja. Ja. Nein, ich werd jetzt auch nicht diskutieren. Wir reden später. Tschüss.",
  46: "Deswegen hab ich den Kühlschrank auch nicht mehr aufgemacht.\nWarum?\nWeil ich Angst hatte.",
  47: "Ich dachte, das wäre dein Opa.\nNein.\nAch.",
  48: "L:Die Ente war schon wieder da.\nR:Welche Ente?\nL:Die mit dem kaputten Fuß.",
  49: "Nee, den Pullover hatte ich nur an, weil der andere nass war.",
  50: "Ich hab kurz gedacht, das wäre Schnee.",
  51: "Der sollte vor 10 Minuten da gewesen sein. Was ist denn schon wieder los?\nNie kommt ein Bus pünktlich.\nWenigstens kommt in 5 Minuten der nächste.\nWenn er denn kommt.",
  52: "Gibst du der Mama einen Kussi?",
  53: "L:Hast du Hunger?\nR:Ja.\nL:Auf was?\nR:Weiß ich nicht.\nL:Dann kann ich dir auch nicht helfen.\nR:Aber ich habe Hunger!",
  54: "Bleibt ihr im Bus?\nIch bleibe im Bus.\nDu bleibst im Bus.\nIch gehe.\nWir gehen auch.",
  55: "Entschuldigung, ist hier noch frei?",
  56: "Bitte einmal bis nach hinten durchgehen.\nWohin denn noch? Hier ist kein Platz mehr!",
  57: "Das gibt's doch nicht. Mit Medikamenten genauso. Alles teurer geworden.",
  58: "Welches Gleis ist das jetzt?\n Eben stand da noch Gleis sechs.\n Jetzt ist die Anzeige weg.\n Warum steht das nirgendwo?",
  59: "L:Entschuldigung, kann ich kurz vor? Ich hab nur zwei Sachen. \nR:Klar, gehen Sie junger Mann.\nL:Danke.\nHeute ist wirklich viel los.\nR:Ja, so ist das.",
  60: "L:Hast du die Aufgabe verstanden?\nR:Nicht wirklich.\nIch weiß nicht mal, was wir überhaupt machen sollen.\nL:Ich dachte, wir müssen nur das Arbeitsblatt ausfüllen.\nAber die hat noch irgendwas anderes gessagt.\nR:Oh manno.\nL:Aber gar keine Ahnung mehr was.\nFrag mal Tim.\nR:Warum muss ich den fragen?\n Frag du doch!\nL:Hä, du bist doch mit dem Befreundet.\nR:Stimmt",
  61: "Ich wollte eigentlich nur Milch holen. Jetzt steh ich hier mit einem halben Einkaufswagen.",
  62: "Der Arzt meinte zu mir “Das ist wahrscheinlich Stress. Sie müssen sich mehr entspannen und ich soll mir mehr Zeit für mich selbst nehmen“. Da dachte ich mir auch nur “Arzt hätte ich auch werden können, wenn ich das den Leuten sage“",
  63: "Tut mit leid für die Verspätung. Mein Chef meinte zu mir “Kannst du das noch machen? Dauert nur fünf Minuten“. Und aufeinmal war ich eine Stunde länger im Büro. Jeden Tagt sagt er: “Kannst du dies, kannst du das?“",
  64: "Mein Paket wurde bei der Nachbarin abgegeben, aber ich konnte es erst heute abholen. Weißt du, was sie zu mir gesagt hat? „Das ist wirklich unverschämt. Das Paket steht hier schon seit Tagen, das setzt ja schon Staub an. Ich bin keine Packstation. Wenn man etwas bestellt, sollte man auch zu Hause sein. Das nächste Mal nehme ich nichts mehr für Sie an.“ Ich wusste gar nicht, was ich darauf antworten sollte",
  65: "Sahne! Papa, ich will Sahne! Sahne! Bitte, Papa! Ich will Sahne!",
  66: "Ich hab dem Friseur gesagt „Nur ein bisschen kürzer.“ Aber er hat so viel abgeschnitten und meinte dann „Die wachsen ja wieder.“",
  67: "Du glaubst nicht, was dieser Typ letzens zu mir gesagt hat. So hat wirklich noch niemand mit mir geredet. Ich hab zu ihm gesagt „Ich bin laut. Ich hab viel Energie. Und wenn ich dir zu viel bin, dann geh einfach. Meine Ex-Freunde konnten damit auch nicht umgehen“ Und weißt du, was er darauf antwortet? „Dann waren die Ex-Freunde einfach zu wenig. Du bist nicht das Problem“ Period. ",
  68: "Es kam die Durchsage „wegen der Unwetterwarnung soll niemand die Halle verlassen.“ Aber ich konnte trotzdem einfach gehen ",
  69: "Er meinte nur: „Ich finde es sehr mutig von dir, dass du dich traust deine Meinung zu äußern. Bei einem Thema, wo sich andere Menschen erstmal Informieren würden“",
  70: "Frau Bart meinte „Bis morgen muss das fertig sein. Wer nichts abgibt, bekommt eine 6. Das ist dann unser Problem.“ Aber die kann uns doch keine 6 geben!",
  71: "Dann haben wir noch das hier, cotton. Kann ich das noch zurückschicken? Ah, die hast du doch auch, dann sind wir matching.",
  72: "Hätte ich das gewusst, dann hätte ich das nicht unterschrieben. Samstag muss ich nochmal wiederkommen.",
  73: "Es ist halt noch was zu tun. Dann sagt der „Wir essen wie es bequem ist“ und ich muss noch gucken, wie ich das änder mit dem Urlaub und wie das nach zwei Monaten mit der Küche ist."

}


const KONVERSATION_UEBERSCHRIFTEN = {
  1: ["Heiraten"],
  2: ["Oma"], // 2: ["Oma", "Hanjo, Alles Gut", "Ja"], 
  3: ["Kontrolle"],
  4: ["Pass mal"],
  5: ["Braucht man das?"],
  6: ["Heute nicht"],
  7: ["Willst du das denn?"],
  8: ["Junge oder Mädchen?"],
  9: ["Entschuldigung"],
  10: ["Ah für uns?"],
  11: ["Kasse?"],
  12: ["Haben Sie die Rechnung?"],
  13: ["Qualität ist toll"],
  15: ["Aua"],
  16: ["Dann fängt das Leben an"], //["dann fängt das Leben an", "zum Paradies"],
  17: ["Gesichtspuder"],  
  18: ["Hochzeitstorte"], // 18: ["Hochzeitstorte", "Schwiegertochter"],
  19: ["Vetrag"],
  20: ["Stiftung Warentest fünf"],
  21: ["Ein Kind, kein Tier"],
  22: ["Boom, Boom, Boom" ],
  24: ["Also ziehst du weg?"], //24: ["bist du alleine", "also ziehst du weg"],
  25: ["Ballaststoffe"],
  26: ["Alkohol"],
  27: ["I drank so much"],
  28: ["Golem"],
  29: ["Schafe ins Bett gebracht"],
  30: ["Dreißig Euro nur noch"],
  31: ["Selber wissen"],
  32: ["Die sitzen auf dem Rollator"],
  33: ["Wie lange ist deine Mama jetzt schon tot?"],
  34: ["Nur zwei Balken?"],
  35: ["Warum nimmst du uns nicht mit?"],
  36: ["Da ist die Klinik"], //  36: ["Da ist die Klinik", "Meine Klinik"],
  37: ["Elf Jahre Fleisch oder Gemüse reifen"],
  38: ["Die können alles ab"],
  39: ["Payback?"],
  40: ["Hier links"],
  41: ["Mach mal ein Foto"],
  42: ["Früher losfahren"],
  43: ["Wo müssen wir jetzt hin?"],
  44: ["Bruder, heute Beine"],
  45: ["Hör mir doch einmal zu"],
  46: ["Kühlschrank auch nicht mehr"],
  47: ["Dein Opa"],
  48: ["Die Ente war schon wieder da"],
  49: ["Pullover war nass"],
  50: ["Schnee"],
  51: ["Nie kommt ein Bus pünktlich"],
  52: ["Kussi?"],
  53: ["Hast du Hunger?"],
  54: ["Bleibt ihr im Bus?"],
  55: ["Ist hier noch frei?"],
  56: ["Hier ist kein Platz mehr!"],
  57: ["Das gibt's doch nicht"],
  58: ["Warum steht das nirgendwo?"],
  59: ["Entschuldigung, kann ich kurz vor?"],
  60: ["Hast du die Aufgabe verstanden?"],
  61: ["Milch"],
  62: ["Das ist nur Stress"],
  63: ["Nur fünf Minuten"],
  64: ["Packstation"],
  65: ["Papa, ich will Sahne!"],
  66: ["Die wachsen ja wieder"],
  67: ["Ich habe viel Energie"],
  68: ["Unwetterwarnung"],
  69: ["Meinung äußern"],
  70: ["Sechs"],
  71: ["Zurückschicken"],
  72: ["Nicht unterschrieben"],
  73: ["Essen wie es bequem ist"],

};

//Bilder - Funktion für Bilder muss geänder werden (hier Bilder z Konversationen einfügen)
//const KONVERSATION_BILDER = {
 // "16": ["media/bild_1.png", "media/bild_2.png"],
//};

let konversationBilder = {};


//Mausposition berechnen
function getWorldMousePosition() {
  return {
    x: (mouseX - controls.view.x) / controls.view.zoom,
    y: (mouseY - controls.view.y) / controls.view.zoom,
  };
}

//Name noch bei Punkten, kann geändert werden, aber kann sein, dass der code kaputt geht?
function getClickedKonversationName(worldX, worldY) {
  for (const punkt of punkte) {
    let title = punkt.ueberschrift;

    if (!title) continue;

    let textString = title.join(" ");

    //angpasst damit man genau auf den text klicken muss 
    textSize(24);
    let w = textWidth(textString) * 0.7;
    let h = 24;

    let left = punkt.x - w / 2;
    let right = punkt.x + w / 2;
    let top = punkt.y - h / 2;
    let bottom = punkt.y + h / 2;

    if (
      worldX >= left &&
      worldX <= right &&
      worldY >= top &&
      worldY <= bottom
    ) {
      return punkt.Konver.name;
    }
  }

  return null;
}

//Hover beinhaltet auch noch Sachen vom alten Sketch
function getHoveredPoint(worldX, worldY) {
  for (const punkt of punkte) {
    let title = punkt.ueberschrift;
    if (!title) continue;

    let textString = title.join(" ");

    textSize(24);
    let w = textWidth(textString) * 0.7;
    let h = 24;

    let left = punkt.x - w / 2;
    let right = punkt.x + w / 2;
    let top = punkt.y - h / 2;
    let bottom = punkt.y + h / 2;

    if (
      worldX >= left &&
      worldX <= right &&
      worldY >= top &&
      worldY <= bottom
    ) {
      return punkt;
    }
  }

  return null;
}

//Beim Popup kann nicht auf anderen Text geklickt werden -> Klick erneut schließt Pop-Up
function mousePressed() {
  registerInteraction();

  // Menübutton darf immer geklickt werden
  if (isMenuButtonClicked(mouseX, mouseY)) {
    return;
  }

  // Solange das Menü offen ist, keine Konversationen anklicken
  if (openMenu) {
    return;
  }

  if (selectedKonversationName) {
    selectedKonversationName = null;

    currentAbsatz = 0;
    typedCharacters = 0;
    pauseFrames = 0;
    popupScrollY = 0;

    resetFloatingSketch();
    resetParagraphSketch();

    return;
  }

  Controls.move(controls).mousePressed({
    clientX: mouseX,
    clientY: mouseY
  });

  if (mouseButton !== LEFT) return;

  const worldMouse = getWorldMousePosition();

  selectedKonversationName = getClickedKonversationName(
    worldMouse.x,
    worldMouse.y
  );

  if (selectedKonversationName) {
    currentAbsatz = 0;
    typedCharacters = 0;
    pauseFrames = 0;
    popupScrollY = 0;

    resetFloatingSketch();
    resetParagraphSketch();

    if (FLOATING_SKETCH.includes(selectedKonversationName)) {
      startFloatingSketch(
        KONVERSATION_TEXTE[selectedKonversationName]
      );
    }

    if (QUOTE_TYPING_SKETCH.includes(selectedKonversationName)) {
      startQuoteTypingSketch(
        KONVERSATION_TEXTE[selectedKonversationName]
      );
    }

    if (GROWING_TEXT_SKETCH.includes(selectedKonversationName)) {
      startGrowingTextSketch(
        KONVERSATION_TEXTE[selectedKonversationName]
      );
    }

     if (TICKER_SKETCH.includes(selectedKonversationName)) {
    startTickerSketch(
      KONVERSATION_TEXTE[selectedKonversationName]
    );
  }
}
}

playConversationSound(selectedKonversationName);

//Setup, Audios und Bilder laden
function preload() {
  soundFormats('mp3');
  sprechblaseGrauImg = loadImage('media/sprechblase_grau.png');
  sprechblaseWeissImg = loadImage('media/sprechblase_weiss.png');


  for (const [konversationName, fileName] of Object.entries(KONVERSATION_SOUND_FILES)) {
    konversationSounds[konversationName] = loadSound(fileName);
  }

  for (const [konversationName, paths] of Object.entries(KONVERSATION_BILDER)) {
    konversationBilder[konversationName] = [];

    for (const path of paths) {
      konversationBilder[konversationName].push(loadImage(path));
    }
  }
}

// mehr setup
function setup() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  textFont('Times New Roman');
  menuBackgroundColor = generateMenuBackgroundColor();
  lastInteractionTime = millis();

  //Seite mittig im Canvas laden
  controls.view.zoom = 5; 
  controls.view.x = width / 2 - (width / 2) * controls.view.zoom;
  controls.view.y = height / 2 - (height / 2) * controls.view.zoom;

  generierePunkte();

  // Aktuelle Startposition als Mittelpunkt speichern

  dragMittelpunktX = controls.view.x;

  dragMittelpunktY = controls.view.y;

  // Größe des erlaubten Drag-Bereichs

  maximalerDragRadius = min(width, height) * 0.45;
  startViewX = controls.view.x;
startViewY = controls.view.y;

maxDragX = width * 0.8;
maxDragY = height * 2.2;
}

function mouseWheel(event) {
  registerInteraction();

  return false;
}

//sounds (falls wir noch audios im nachhinein hinzufügen wollen)
function playConversationSound(konversationName) {
  for (const sound of Object.values(konversationSounds)) {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
  }

  const sound = konversationSounds[konversationName];
  if (sound && sound.isLoaded()) {
    sound.play();
  }
}

//DRAW -------------------------____
function draw() {

  background(255);
  textAlign(LEFT, TOP);

  // menu button
  drawMenuButton();

  //zoom
  const worldMouse = getWorldMousePosition();

  
  push();
  translate(controls.view.x, controls.view.y);
  scale(controls.view.zoom);


  noStroke();
  fill(255);

  for (let p of punkte) {
    drawConversationTitle(p);
  }

  pop();

   if (openMenu) {
    drawMenu();
    drawTitelAnimation();
  }

  

  // maus zu zeiger bei over über text
  const hoveredPoint = getHoveredPoint(worldMouse.x, worldMouse.y);
  const hoverMenuButton = isMenuButtonClicked(mouseX, mouseY);
  
  if (hoverMenuButton) {
    cursor(HAND);
  } else if (openMenu) {
    // Menü offen: Konversationen im Hintergrund ignorieren
    cursor(ARROW);
  } else if (hoveredPoint) {
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

if (selectedKonversationName) {

  push();
  zeichnePopup();
  pop();
}

}

//menu
function drawMenu() {

//menu box
fill(menuBackgroundColor);
noStroke();
rectMode(CORNER);
//rect(10, 10, windowWidth/2, windowHeight/1.2, 20);
rect(0,0, windowWidth, windowHeight);


//inhalt
//fill(getReadableMenuTextGray(menuBackgroundColor));
fill(230);
textSize(19);
textStyle(NORMAL);
text("Vorbeiklang fokussiert sich auf die flüchtigen Momente und kurzen Einblicke in die Welten anderer Menschen, in die man im Vorbeigehen eintaucht. Diese zufälligen Begegnungen wurden gesammelt und in dieser Website archiviert. \n\nZusammen bilden sie eine Karte aus Momenten, durch die man sich durch bewegen kann. Aufgrund der Anordnung des Archives treffen unterschiedlichste Konversationen aufeinander und werden somit aus ihren Kontexten gerissen, was den Betrachter dazu einlädt, diese zu erkunden und tiefer in die Webseite einzutauchen. \nJe weiter man scrollt, desto mehr Konversationen kommen einem entgegen. Dabei kann es sich nur um einzelne Sprachfetzen oder um längere Konversationen von verschiedenen Lebensrealitäten handeln, die selber zur Interpretation und Einordnung einladen. \nZunächst wird nur ein Bruchteil der Unterhaltung auf der Webseite dargestellt, die oft nur aus Schlagwörtern oder einzelnen Sätzen bestehen, doch wenn man auf sie klickt, erweitern sie sich und werden individuell durch verschiedene p5 Sketches gestaltet. Essen wird so von den Menschen selber und ihren individuellen Umständen repräsentiert.", 150, 180, windowWidth/2- 250, windowHeight/1.5);

//menu button
drawMenuButton();


}

//aniamtion titel


function drawTitelAnimation() {
  push();

  
  textAlign(LEFT, TOP);
  noStroke();
  fill(240, 230, 240, 70);

  // Fluid Schriftgröße für kleine und große Displays
  let titelSize = constrain(
    min(width, height) * 0.6,
    220,
    700
  );

  textSize(titelSize);

  let titelText = "Vorbeiklang";

  // Fluid Abstand zwischen den wiederholten Wörtern
  let luecke = width * 0.08;
  let loopWidth = textWidth(titelText) + luecke;

  // Alle Zeilen bewegen sich gemeinsam nach links
  titelOffset -= titelSpeed;

  // Nahtloser Loop
  if (titelOffset <= -loopWidth) {
    titelOffset += loopWidth;
  }

  // Fluid horizontale Versätze der drei Zeilen
  let zeileVersatz1 = width * 0.1;
  let zeileVersatz2 = width * 0.04;
  let zeileVersatz3 = -width * 0.75;

  // Fluid vertikale Anordnung
  let zeilenAbstand = titelSize * 0.82;

// mittlere Zeile immer in der Bildschirmmitte
let mitteY = height / 2 - titelSize * 0.5;

// obere und untere Zeile relativ dazu
let obenY = mitteY - zeilenAbstand;
let untenY = mitteY + zeilenAbstand;

  // Genug Wiederholungen für jede Bildschirmbreite
  let anzahlKopien = ceil(width / loopWidth) + 3;

  for (let i = -1; i < anzahlKopien; i++) {
    let basisX = titelOffset + i * loopWidth;

    text(
      titelText,
      basisX + zeileVersatz1,
      obenY
    );
    
    text(
      titelText,
      basisX + zeileVersatz2,
      mitteY
    );
    
    text(
      titelText,
      basisX + zeileVersatz3,
      untenY
    );
  }

  pop();
}

// sprechblase
function mouseClicked() {
  if (isMenuButtonClicked(mouseX, mouseY)) {
    menuBackgroundColor = generateMenuBackgroundColor();
    openMenu = !openMenu;
    return false;
  }

  if (openMenu) {
    if (mouseX > closeButtonX && mouseX < closeButtonX + textWidth("close") && mouseY > 20 && mouseY < 50) {
      openMenu = false;
    }
  }
}




//pop up gezeichnet, konversation wenn man auf fragment klickt
function zeichnePopup() {
  const infoText = KONVERSATION_TEXTE[selectedKonversationName];

  background(255);

  

  noFill();
  
  rectMode(CENTER);
  
  rect(width / 2, height / 2, width * 0.8, height * 0.8, 15);

  // Nur diese Konversationen bekommen den Typing-Sketch 
  if (TYPING_SKETCH.includes(selectedKonversationName)) {
    
    rectMode(CORNER);
  
    let dialogWidth = min(width * 0.55, 700);
    let startX = (width - dialogWidth) / 2;
      let startY = height * 0.12;
      let textW = dialogWidth;
  
    push();
    translate(0, -popupScrollY);
    zeichneTypingKonversation(infoText, startX, startY, textW);
    pop();
    
  //Worte Eintippen Sketch 
  } else if (FLOATING_SKETCH.includes(selectedKonversationName)) {
    zeichneFloatingSketch();
    rectMode(CORNER);
  
  } else if (PARAGRAPH_SKETCH.includes(selectedKonversationName)) {
    zeichneParagraphSketch(infoText);


  } else if (QUOTE_TYPING_SKETCH.includes(selectedKonversationName)) {
    zeichneQuoteTypingSketch();

  }  else if (GROWING_TEXT_SKETCH.includes(selectedKonversationName)) {
      zeichneGrowingTextSketch();

  } else if (TICKER_SKETCH.includes(selectedKonversationName)) {
  zeichneTickerSketch();    
    

  } else { //für alle Konversationen ohne sketch
    noStroke();
    fill(0);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(infoText, width / 2, height / 2, width * 0.7, height * 0.32);
  }
}

//---------ZOOM UND DRAG FUNKTIONEN---------------------------------------

window.mouseDragged = e => {
  registerInteraction();

  //Drag wird deaktiviert bei popup
  if (selectedKonversationName) return;
  Controls.move(controls).mouseDragged(e);
};

window.mouseReleased = e => {
  registerInteraction();

  Controls.move(controls).mouseReleased(e);
};
window.mouseReleased = e => Controls.move(controls).mouseReleased(e)

function mouseWheel(event) {
  registerInteraction();

  if (selectedKonversationName) {
    popupScrollY += event.delta;
    popupScrollY = max(0, popupScrollY);
    return false;
  }

  return false;
}

class Controls {
  static move(controls) {
    function mousePressed(e) {
      controls.viewPos.isDragging = true;
      controls.viewPos.prevX = e.clientX;
      controls.viewPos.prevY = e.clientY;
    }

    function mouseDragged(e) {
      const { prevX, prevY, isDragging } = controls.viewPos;
      if (!isDragging) return;
    
      const pos = {
        x: e.clientX,
        y: e.clientY
      };
    
      const dx = pos.x - prevX;
      const dy = pos.y - prevY;
    
      if (prevX !== null && prevY !== null) {
        controls.view.x += dx;
        controls.view.y += dy;
    
        begrenzeDrag();
    
        controls.viewPos.prevX = pos.x;
        controls.viewPos.prevY = pos.y;
      }

     
      
    }

    function mouseReleased(e) {
      controls.viewPos.isDragging = false;
      controls.viewPos.prevX = null;
      controls.viewPos.prevY = null;
    }
 
    return {
      mousePressed, 
      mouseDragged, 
      mouseReleased
    }
  }

  static zoom(controls) {
     function calcPos(x, y, zoom) {
       const newX = width - (width * zoom - x);
       const newY = height - (height * zoom - y);
       return {x: newX, y: newY}
     }

    function worldZoom(e) {
      const {x, y, deltaY} = e;
      const direction = deltaY > 0 ? -1 : 1;
      const factor = 0.2;  //Wie stark soll gezoomt werden?
      const zoomDelta = direction * factor;
      const nextZoom = controls.view.zoom + zoomDelta;

      const minZoom = 0.5; //min zoom
      const maxZoom = 10; //max zoom, wie nah wollen wir ran zoomen?
      const clampedZoom = constrain(nextZoom, minZoom, maxZoom);
      const effectiveDelta = clampedZoom - controls.view.zoom;
      if (effectiveDelta === 0) return false;

      const oldZoom = controls.view.zoom;
      const scale = clampedZoom / oldZoom;

      controls.view.x = x - (x - controls.view.x) * scale;
      controls.view.y = y - (y - controls.view.y) * scale;
      controls.view.zoom = clampedZoom;
      return false;
    }

    return {worldZoom};
  }
}

//Begrenzung Weißraum 

function mouseDragged(e) {
  const { prevX, prevY, isDragging } = controls.viewPos;
  if (!isDragging) return;

  const pos = {
    x: e.clientX,
    y: e.clientY
  };

  const dx = pos.x - prevX;
  const dy = pos.y - prevY;

  if (prevX !== null && prevY !== null) {
    controls.view.x += dx;
    controls.view.y += dy;

    // Bewegung auf einen großen Kreis begrenzen
    begrenzeDrag();

    controls.viewPos.prevX = pos.x;
    controls.viewPos.prevY = pos.y;
  }
}

//-------------------------------------------------------------------------------

function begrenzeDrag() {
  controls.view.x = constrain(
    controls.view.x,
    startViewX - maxDragX,
    startViewX + maxDragX
  );

  controls.view.y = constrain(
    controls.view.y,
    startViewY - maxDragY,
    startViewY + maxDragY
  );
}


//Rechnen :(
function getStadtteilDefinition(name) {
  if (Stadtteile[name]) {
    return Stadtteile[name];
  }

  const bezirk = Bezirke[name];
  if (!bezirk) return null;

  const teile = bezirk
    .map(stadtteilName => Stadtteile[stadtteilName])
    .filter(Boolean);

  if (teile.length === 0) return null;

  const centerX = teile.reduce((sum, teil) => sum + teil.x, 0) / teile.length;
  const centerY = teile.reduce((sum, teil) => sum + teil.y, 0) / teile.length;
  const radius = Math.max(...teile.map(teil => teil.r)) + 0.02;

  return { x: centerX, y: centerY, r: radius };
}

//Punkte setzen -> geändert zu Überschriften zeichnen lassen
function generierePunkte() {
  punkte = [];

  for (let obj of Konversationen) {
    let stadtteil = getStadtteilDefinition(obj.stadtteil);

    if (stadtteil) {
      let centerX = stadtteil.x * width;
      let centerY = stadtteil.y * height;
      let radius = stadtteil.r * min(width, height);

      let title = KONVERSATION_UEBERSCHRIFTEN[obj.name];
let size = getStableSize(obj.name);

let pos = findeFreiePosition(centerX, centerY, radius + 100, title, size);

if (pos) {
  punkte.push({
    x: pos.x,
    y: pos.y,
    Konver: obj,
    ueberschrift: title,
    size: size,
    rotation: random(-5, 5),
    idleFadeOffset: random(0, 45000),
    idleFadePhase: random(TWO_PI),
    textW: pos.textW,
    textH: pos.textH
  });
}
    }
  }
}

//Textgrößen, nicht random, damit diese nicht immer aktualisiert werden
function getStableSize(id) {
  const groessen = [6, 6, 7, 8, 8, 10, 12, 16, 20];
  let index = Number(id) % groessen.length;
  return groessen[index];
}


//Titel (Überschriften) malen
function drawConversationTitle(p) {
  if (!p.ueberschrift) return;

  noStroke();

  const titleSeed = Number(p.name) || 0;
  const idleTime = millis() - lastInteractionTime;
  const idleProgress = max(0, idleTime - TITLE_IDLE_DELAY - (p.idleFadeOffset || 0));
  const idleStrength = constrain(idleProgress / 45000, 0, 1);
  const idlePhase = (idleProgress / TITLE_IDLE_FADE_PERIOD) * TWO_PI + (p.idleFadePhase || 0);
  const pulse = 0.5 + 0.5 * sin(idlePhase);
  const alpha = idleProgress > 0 ? lerp(255, 70, pulse) : 255;
  const bobAmount = lerp(TITLE_ACTIVE_BOB, TITLE_IDLE_BOB, idleStrength);
  const bobPhase = frameCount * 0.02 + titleSeed * 0.6;
  const offsetX = sin(bobPhase) * bobAmount * 0.35;
  const offsetY = cos(bobPhase * 0.9) * bobAmount;
  const rotationOffset = sin(bobPhase * 0.7) * lerp(0.02, 0.06, idleStrength);

  // Hover-Effekt
  if (getHoveredPoint(getWorldMousePosition().x, getWorldMousePosition().y) === p) {
    fill(190, 13, 19, alpha);
    textStyle(BOLD);
  } else {
    fill(248, 75, 83, alpha);
    textStyle(NORMAL);
  }

  textSize(p.size);
  textAlign(CENTER, CENTER);
  push();
  translate(p.x + offsetX, p.y + offsetY);
  rotate(radians(p.rotation || 0) + rotationOffset);
  text(Array.isArray(p.ueberschrift) ? p.ueberschrift.join(" ") : p.ueberschrift, 0, 0);
  pop();
}

//Text soll sich nicht überlappen, muss angepasst werden
function findeFreiePosition(centerX, centerY, radius, title, size) {
  textSize(size);
  textAlign(CENTER, CENTER);

  const titleText = Array.isArray(title) ? title.join(" ") : String(title || "");
  let textW = textWidth(titleText) + 12;
  let textH = size + 8;
  let bestePosition = null;
  let geringsteUeberlappung = Infinity;

  for (let i = 0; i < 1000; i++) {
    let angle = random(TWO_PI);
    let distanceFromCenter = random(radius);

    let x = centerX + cos(angle) * distanceFromCenter;
    let y = centerY + sin(angle) * distanceFromCenter;

    let frei = true;
    let ueberlappung = 0;

    for (let p of punkte) {
      let dx = abs(x - p.x);
      let dy = abs(y - p.y);

      let minX = textW / 2 + p.textW / 2;
      let minY = textH / 2 + p.textH / 2;

      if (dx < minX && dy < minY) {
        frei = false;
        ueberlappung += (minX - dx) * (minY - dy);
      }
    }

    if (frei) {
      return { x, y, textW, textH };
    }

    if (ueberlappung < geringsteUeberlappung) {
      geringsteUeberlappung = ueberlappung;
      bestePosition = { x, y, textW, textH };
    }
  }

  // Fallback: Bei dichten Bezirken trotzdem eine Position vergeben.
  if (bestePosition) {
    return bestePosition;
  }

  return { x: centerX, y: centerY, textW, textH };
}




//SKETCH EINTIPPEN ---------------------------------------
function berechneTextHoehe(txt, boxW) {
  let words = txt.split(" ");
  let lines = 1;
  let currentLine = "";

  for (let word of words) {
    let testLine = currentLine + word + " ";

    if (textWidth(testLine) > boxW && currentLine.length > 0) {
      lines++;
      currentLine = word + " ";
    } else {
      currentLine = testLine;
    }
  }

  return lines * 26;
}

function zeichneTypingKonversation(textInhalt, startX, startY, textW) {

  textStyle(NORMAL);
  textSize(18);
  textLeading(26);
  noStroke();

  let abschnitte = textInhalt.split("\n").map(line => {
    let seite = line.startsWith("R:") ? "rechts" : "links";
    let text = line.replace(/^L:\s*/, "").replace(/^R:\s*/, "");
  
    return { seite, text };
  });

  if (pauseFrames > 0) {
    pauseFrames--;
  } else {
    if (millis() - lastTypedTime > typingInterval) {
      typedCharacters++;
      lastTypedTime = millis();
    }
  }

  let y = startY;
  

  textSize(18);
  noStroke();

  for (let i = 0; i <= currentAbsatz; i++) {
    if (!abschnitte[i]) continue;

    let kompletterAbsatz = abschnitte[i].text;
    let seite = abschnitte[i].seite;
    let sichtbarerAbsatz = kompletterAbsatz;

    if (i === currentAbsatz) {
      sichtbarerAbsatz = kompletterAbsatz.substring(0, typedCharacters);

      let cursorVisible = frameCount % 40 < 20;
      if (cursorVisible) {
        sichtbarerAbsatz += "|";
      }
    }

    let boxW = textW * 0.5;
    if (seite === "links") {
      textAlign(LEFT, TOP);
      fill(0);
      text(sichtbarerAbsatz, startX, y, textW * 0.5);
    } else {
    
      let rechteKante = startX + textW;      // feste rechte Kante
      let rechteMaxW = textW * 0.55;         // maximale Breite
      let textBreite = textWidth(kompletterAbsatz);
      let padding = textBreite < 220 ? 10 : 40;
    
      let rechteTextW = min(textBreite + padding, rechteMaxW);
      let rechteBoxX = rechteKante - rechteTextW;
    
      textAlign(LEFT, TOP);
      fill(0);
      text(sichtbarerAbsatz, rechteBoxX, y, rechteTextW);
      
    
    }

    

    
let textHoehe = berechneTextHoehe(sichtbarerAbsatz, boxW);

let naechsterAbsatz = abschnitte[i + 1];
let gleicheSeite = naechsterAbsatz && naechsterAbsatz.seite === seite;

if (gleicheSeite) {
  y += textHoehe + 18; // enger, wenn gleiche Person weiterredet
} else {
  y += textHoehe + 45; // mehr Abstand bei Sprecherwechsel
}
  }

 let aktuellerText = abschnitte[currentAbsatz];

 if (
  aktuellerText &&
  typedCharacters >= aktuellerText.text.length &&
  pauseFrames === 0
) {
  currentAbsatz++;
  typedCharacters = 0;
  pauseFrames = pauseDuration;
  lastTypedTime = millis(); // neu
}

  if (currentAbsatz >= abschnitte.length) {
    currentAbsatz = abschnitte.length - 1;
    typedCharacters = abschnitte[currentAbsatz].text.length;
  }

  let contentBottom = y;
  let visibleBottom = startY + height * 0.8 - 120;
  let typingFinished = currentAbsatz >= abschnitte.length - 1 &&
  typedCharacters >= abschnitte[abschnitte.length - 1].text.length;
  if (!typingFinished && contentBottom - popupScrollY > visibleBottom) {
    popupScrollY += 2;
  }
}
/// ENDE SKETCH EINTIPPEN-----------------------

// SKETCH ABSÄTZE EINBLENDEN-------------------------
function erzeugtParagraphs(textInhalt) {
  const words = textInhalt.trim().split(/\s+/);
  const paragraphs = [];
  let current = "";

  for (const word of words) {
    const next = current ? current + " " + word : word;

    if (next.length <= 50) {
      current = next;
    } else {
      if (current) {
        paragraphs.push(current);
      }
      current = word;
    }
  }

  if (current) {
    paragraphs.push(current);
  }

  return paragraphs;
}

function resetParagraphSketch() {
  paragraphSketchState.paragraphs = [];
  paragraphSketchState.visibleParagraphs = 0;
  paragraphSketchState.revealTimer = 0;
  paragraphSketchState.lastText = "";
}

function zeichneParagraphSketch(textInhalt) {
  if (paragraphSketchState.lastText !== textInhalt) {
    paragraphSketchState.paragraphs = erzeugtParagraphs(textInhalt);
    paragraphSketchState.visibleParagraphs = 0;
    paragraphSketchState.revealTimer = 0;
    paragraphSketchState.lastText = textInhalt;
  }

  if (paragraphSketchState.visibleParagraphs < paragraphSketchState.paragraphs.length) {
    paragraphSketchState.revealTimer++;
    if (paragraphSketchState.revealTimer >= paragraphSketchState.revealInterval) {
      paragraphSketchState.visibleParagraphs = min(
        paragraphSketchState.visibleParagraphs + 1,
        paragraphSketchState.paragraphs.length
      );
      paragraphSketchState.revealTimer = 0;
    }
  }


  textStyle(NORMAL);
  textSize(18);
  textLeading(24);
  textWrap(WORD);
  noStroke();

  const boxWidth = min(windowWidth * 0.7, 700);
  const startX = (windowWidth - boxWidth) / 2 + 200;
  const startY = windowHeight / 2 - ((paragraphSketchState.visibleParagraphs - 1) * 24) / 2;

  for (let i = 0; i < paragraphSketchState.visibleParagraphs; i++) {
    let alpha = 255;
    if (
      i === paragraphSketchState.visibleParagraphs - 1 &&
      paragraphSketchState.visibleParagraphs < paragraphSketchState.paragraphs.length
    ) {
      alpha = map(
        paragraphSketchState.revealTimer,
        0,
        paragraphSketchState.revealInterval,
        0,
        255
      );
    }

    fill(0, alpha);
    textAlign(LEFT, TOP);
    text(paragraphSketchState.paragraphs[i], startX, startY + i * 24, boxWidth, 70);
  }
}
// ENDE SKETCH ABSÄTZE EINBLENDEN-------------------------


// SKETCH WORTE EINBLENDEN-------------------------

function zeichneFloatingSketch() {
  if (floatingPhase === "fadeIn") {

    if (
      millis() - floatingLastWordTime > floatingWordInterval &&
      floatingCurrentWord < floatingWords.length
    ) {
      floatingWords[floatingCurrentWord].visible = true;
      floatingWords[floatingCurrentWord].alpha = 255;

      floatingLastWordTime = millis();
      floatingCurrentWord++;
    }

    if (floatingCurrentWord >= floatingWords.length) {
      floatingPhase = "fadeOut";
      floatingCurrentFadeOutWord = 0;
      floatingLastFadeOutTime = millis();
    }
  }

  if (floatingPhase === "fadeOut") {

    if (
      millis() - floatingLastFadeOutTime > floatingFadeOutInterval &&
      floatingCurrentFadeOutWord < floatingWords.length
    ) {
      floatingWords[floatingCurrentFadeOutWord].fadingOut = true;

      floatingLastFadeOutTime = millis();
      floatingCurrentFadeOutWord++;
    }
  }

  for (let w of floatingWords) {

    if (!w.visible) continue;

    if (w.fadingOut) {
      w.alpha -= 4;
    }

    w.x += w.vx;
    w.y += w.vy;

    push();
    translate(w.x, w.y);
    rotate(radians(w.rotation));

    fill(0, w.alpha);
    noStroke();
    textSize(w.size);
    text(w.text, 0, 0);

    pop();
  }

  let allesWeg = floatingWords.every(w => w.alpha <= 0);

  if (floatingPhase === "fadeOut" && allesWeg) {
    startFloatingSketch(KONVERSATION_TEXTE[selectedKonversationName]);
  }
}

function startFloatingSketch(textInhalt) {
  let satz = textInhalt;
  let splitWords = satz.split(" ");

  floatingWords = [];





  for (let i = 0; i < splitWords.length; i++) {

    let size = random([24, 32, 68, 84]);

    textSize(size);

    let textW = textWidth(splitWords[i]) + 30;
    let textH = size + 20;

    let x, y;

    for (let tries = 0; tries < 100; tries++) {

      x = random(width * 0.18, width * 0.82);
      y = random(height * 0.18, height * 0.82);

      let overlap = false;

      for (let other of floatingWords) {

        if (
          abs(x - other.x) < textW / 2 + other.textW / 2 &&
          abs(y - other.y) < textH / 2 + other.textH / 2
        ) {
          overlap = true;
          break;
        }
      }

      if (!overlap) break;
    }

    floatingWords.push({

      text: splitWords[i],

      x: x,
      y: y,

      textW: textW,
      textH: textH,

      vx: random(-0.08, 0.08),
      vy: random(-0.08, 0.08),

      size: size,

      rotation: random() < 0.35
        ? random(-6, 6)
        : 0,

      alpha: 255,
      visible: false,
      fadingOut: false

    });

  }

  floatingPhase = "fadeIn";

  floatingCurrentWord = 0;
  floatingCurrentFadeOutWord = 0;

  floatingLastWordTime = millis();
  floatingLastFadeOutTime = millis();
}

function resetFloatingSketch() {
  floatingWords = [];
  floatingCurrentWord = 0;
  floatingPhase = "fadeIn";
  floatingCurrentFadeOutWord = 0;
  floatingLastWordTime = millis();
  floatingLastFadeOutTime = millis();
}


// ENDE SKETCH WORTE EINBLENDEN--------------

// ---------- Quote Typing Sketch ----------



function startQuoteTypingSketch(textInhalt) {
  quoteTypingText = textInhalt;
  quoteTypingLength = 0;
  updateQuoteTypingLayout();
}

function resetQuoteTypingSketch() {
  quoteTypingText = "";
  quoteTypingLength = 0;
}

function zeichneQuoteTypingSketch() {
  updateQuoteTypingLayout();

  quoteTypingLength = min(
    quoteTypingText.length,
    quoteTypingLength + quoteTypingSpeed
  );

  drawQuoteTypedText(floor(quoteTypingLength));

  if (quoteTypingLength >= quoteTypingText.length) {
    drawQuoteCaret(true);
  } else {
    drawQuoteCaret(false);
  }
}

function drawQuoteTypedText(limit) {
  let x = quoteTypingMarginX;
  let y = quoteTypingMarginY;
  let quoteDepth = 0;

  
  textAlign(LEFT, TOP);
  textLeading(quoteTypingLineHeight);
  noStroke();

  for (let i = 0; i < limit; i++) {
    const ch = quoteTypingText[i];

    if (ch === "\n") {
      x = quoteTypingMarginX;
      y += quoteTypingLineHeight;
      continue;
    }

    textSize(
      quoteDepth > 0 || isQuoteMark(ch)
        ? quoteTypingBaseSize * 1.04
        : quoteTypingBaseSize
    );

    const charWidth = textWidth(ch);

    if (x + charWidth > width - quoteTypingMarginX && ch !== " ") {
      x = quoteTypingMarginX;
      y += quoteTypingLineHeight;
    }

    if (isQuoteMark(ch)) {
      drawFloatingQuoteChar(ch, x, y, i);
      quoteDepth = quoteDepth === 0 ? 1 : 0;
    } else if (quoteDepth > 0) {
      drawFloatingQuoteChar(ch, x, y, i);
    } else {
      fill(0);
      textSize(quoteTypingBaseSize);
      text(ch, x, y);
    }

    x += charWidth;
  }
}

function drawFloatingQuoteChar(ch, x, y, index) {
  const wobbleX = sin(frameCount * 0.025 + index * 0.28) * 1.8;
  const wobbleY = cos(frameCount * 0.02 + index * 0.33) * 3.2;
  const alpha = 132 + sin(frameCount * 0.018 + index * 0.24) * 28;

  push();
  drawingContext.shadowColor = "rgba(80, 92, 140, 0.18)";
  drawingContext.shadowBlur = 16;

  fill(74, 82, 114, alpha);
  textSize(quoteTypingBaseSize * 1.04);
  text(ch, x + wobbleX, y + wobbleY);

  pop();
}

function drawQuoteCaret(done) {
  if (!done && frameCount % 60 > 40) return;

  const caretX = getQuoteCaretX();
  const caretY = getQuoteCaretY();

  fill(0, 180);
  noStroke();
  rectMode(CORNER);
  rect(caretX, caretY + 4, 2, quoteTypingBaseSize + 2, 1);
}

function getQuoteCaretX() {
  let pos = getQuoteCaretPosition();
  return pos.x;
}

function getQuoteCaretY() {
  let pos = getQuoteCaretPosition();
  return pos.y;
}

function getQuoteCaretPosition() {
  let x = quoteTypingMarginX;
  let y = quoteTypingMarginY;
  let quoteDepth = 0;

  textSize(quoteTypingBaseSize);

  for (let i = 0; i < quoteTypingLength && i < quoteTypingText.length; i++) {
    const ch = quoteTypingText[i];

    if (ch === "\n") {
      x = quoteTypingMarginX;
      y += quoteTypingLineHeight;
      continue;
    }

    textSize(
      quoteDepth > 0 || isQuoteMark(ch)
        ? quoteTypingBaseSize * 1.04
        : quoteTypingBaseSize
    );

    const charWidth = textWidth(ch);

    if (x + charWidth > width - quoteTypingMarginX && ch !== " ") {
      x = quoteTypingMarginX;
      y += quoteTypingLineHeight;
    }

    x += charWidth;

    if (isQuoteMark(ch)) {
      quoteDepth = quoteDepth === 0 ? 1 : 0;
    }
  }

  return { x, y };
}

function isQuoteMark(ch) {
  return (
    ch === '"' ||
    ch === "“" ||
    ch === "”" ||
    ch === "„" ||
    ch === "«" ||
    ch === "»"
  );
}

function updateQuoteTypingLayout() {
  quoteTypingMarginX = max(28, width * 0.08);
  quoteTypingMarginY = max(42, height * 0.12);
  quoteTypingBaseSize = constrain(min(width, height) * 0.026, 20, 30);
  quoteTypingLineHeight = quoteTypingBaseSize * 1.54;
}

//ENDE QUOTE SKETCH------


//GROW SKETCH
// ---------- Growing Text Sketch ----------



function startGrowingTextSketch(textInhalt) {
  growingTextText = textInhalt;
  growingTextTypedCount = 0;
  updateGrowingTextLayout();
}

function resetGrowingTextSketch() {
  growingTextText = "";
  growingTextTypedCount = 0;
}

function zeichneGrowingTextSketch() {
  updateGrowingTextLayout();

  growingTextTypedCount = min(
    growingTextText.length,
    growingTextTypedCount + growingTextTypeSpeed
  );

  const typedText = growingTextText.slice(0, floor(growingTextTypedCount));
  drawGrowingTypewriterText(typedText);
}

function drawGrowingTypewriterText(typedText) {
  const progress = typedText.length / max(1, growingTextText.length);

  growingTextCurrentFontSize = lerp(
    growingTextMaxFontSize,
    growingTextMinFontSize,
    pow(progress, 0.72)
  );

  
  textSize(growingTextCurrentFontSize);
  textStyle(NORMAL);
  textAlign(LEFT, TOP);
  noStroke();

  growingTextLineHeight = growingTextCurrentFontSize * 1.05;

  const lines = wrapGrowingText(typedText, growingTextParagraphWidth);
  const lineArray = lines.split("\n");

  const startY = growingTextMarginY + sin(frameCount * 0.006) * 2;
  const dynamicLineHeight = growingTextLineHeight * 1.04;

  const blockHeight = lineArray.length * dynamicLineHeight;
  const availableHeight = height - growingTextMarginY - 24;

  const overflowAmount = max(0, blockHeight - availableHeight);
  const fadeActivation = constrain(
    map(overflowAmount, 0, growingTextLineHeight * 4, 0, 1),
    0,
    1
  );

  const fadeZone = growingTextLineHeight * 5;

  for (let i = 0; i < lineArray.length; i++) {
    const lineY = startY + i * dynamicLineHeight;

    const lineFade = constrain(
      map(lineY, growingTextMarginY - fadeZone, growingTextMarginY, 0, 1),
      0,
      1
    );

    const fadeFactor = lerp(1, lineFade, fadeActivation);

    const drift = sin(frameCount * 0.012 + i * 0.42) *
      map(progress, 0, 1, 2.8, 0.7);

    fill(0, 255 * fadeFactor);
    text(lineArray[i], growingTextMarginX + drift, lineY);
  }
}

function wrapGrowingText(textValue, maxWidthValue) {
  const words = textValue.split(/\s+/).filter(Boolean);

  let lines = [];
  let currentLine = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine
      ? `${currentLine} ${words[i]}`
      : words[i];

    if (textWidth(testLine) > maxWidthValue && currentLine !== "") {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines.join("\n");
}

function updateGrowingTextLayout() {
  growingTextMarginX = max(26, width * 0.06);
  growingTextMarginY = max(24, height * 0.05);

  growingTextMaxFontSize = constrain(min(width, height) * 0.14, 86, 160);
  growingTextMinFontSize = constrain(min(width, height) * 0.032, 30, 56);

  growingTextCurrentFontSize = growingTextMaxFontSize;
  growingTextLineHeight = growingTextCurrentFontSize * 1.05;

  growingTextParagraphWidth = min(width * 0.95, 1320);

  textSize(growingTextCurrentFontSize);
}
//ENDE GROW SKETCH--------------------

//reinfiegen sketch
function startTickerSketch(textInhalt) {
  tickerAbschnitte = textInhalt
    .split("\n")
    .map(abschnitt => abschnitt.trim())
    .filter(abschnitt => abschnitt.length > 0);

  tickerPositionen = [];

  textFont("Times New Roman");

  const tickerSize = constrain(
    min(width, height) * 0.065,
    30,
    76
  );

  textSize(tickerSize);

  // Der erste Absatz beginnt rechts außerhalb des Bildschirms
  let aktuelleX = width;

  for (let i = 0; i < tickerAbschnitte.length; i++) {
    tickerPositionen.push(aktuelleX);

    const breite = textWidth(tickerAbschnitte[i]);

    // Der nächste Absatz folgt direkt dahinter
    aktuelleX += breite + tickerAbstand;
  }
}

function zeichneTickerSketch() {
  if (tickerAbschnitte.length === 0) return;

  push();

  textFont("Times New Roman");
  textStyle(NORMAL);
  textAlign(LEFT, CENTER);
  noStroke();
  fill(0);

  const tickerSize = constrain(
    min(width, height) * 0.065,
    30,
    76
  );

  textSize(tickerSize);

  // Die Absätze wechseln immer zwischen zwei Höhen
  const yPositionen = [
    height * 0.38,
    height * 0.62
  ];

  for (let i = 0; i < tickerAbschnitte.length; i++) {
    tickerPositionen[i] -= tickerSpeed;

    const y = yPositionen[i % 2];

    text(
      tickerAbschnitte[i],
      tickerPositionen[i],
      y
    );
  }

  // Wenn der letzte Absatz komplett verschwunden ist,
  // beginnt die gesamte Konversation wieder von vorne
  const letzterIndex = tickerAbschnitte.length - 1;
  const letzteBreite = textWidth(
    tickerAbschnitte[letzterIndex]
  );

  if (
    tickerPositionen[letzterIndex] + letzteBreite < 0
  ) {
    startTickerSketch(
      KONVERSATION_TEXTE[selectedKonversationName]
    );
  }

  pop();
}

function resetTickerSketch() {
  tickerAbschnitte = [];
  tickerPositionen = [];
}

//Ende reinfiegen sketch

//Anpassung an den Bildschirm
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  maximalerDragRadius = min(width, height) * 0.45;
}
