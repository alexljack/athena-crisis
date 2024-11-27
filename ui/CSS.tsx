import { injectGlobal } from '@emotion/css';
import Background from './assets/Background.png';
import Breakpoints from './Breakpoints.tsx';
import { applyVar, initializeCSSVariables } from './cssVar.tsx';
import getColor from './getColor.tsx';
import pixelBorder from './pixelBorder.tsx';

const koreanOrChinese = [
  'AthenaLatin',
  'ui-sans-serif',
  'system-ui',
  'sans-serif',
];
const russianOrUkrainian = [
  'Athena',
  'PressStart2P',
  'ui-sans-serif',
  'system-ui',
  'sans-serif',
];

export const Fonts = {
  ja_JP: [
    'Athena',
    'MadouFutoMaru',
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
  ],
  ko_KR: koreanOrChinese,
  ru_RU: russianOrUkrainian,
  uk_UA: russianOrUkrainian,
  zh_CN: koreanOrChinese,
};

const scope = `
svg {
  vertical-align: middle;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
  vertical-align: middle;
}

table th,
table td {
  font-weight: normal;
  text-align: left;
  vertical-align: middle;
}

a img {
  border: none;
}

a {
  color: ${applyVar('highlight-color')};
  cursor: pointer;
  outline: 0;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font-family: Athena, ui-sans-serif, system-ui, sans-serif;
  user-select: auto;
  vertical-align: baseline;
}

textarea {
  overflow: auto;
  padding: 0;
  resize: none;
  vertical-align: top;
  width: 100%;
}


input,
textarea,
select,
button,
.fake-input {
  ${pixelBorder(applyVar('border-color'), 2)};

  -webkit-appearance: none;
  background: ${applyVar('background-color-light')};
  border-radius: 0;
  border: none;
  color: ${applyVar('text-color')};
  font-size: 1em;
  font-weight: normal;
  margin: 4px 0;
  outline: none;
  padding: 6px 8px;
}

input.validate:invalid,
textarea.validate:invalid,
input.invalid,
textarea.invalid {
  ${pixelBorder('#e06068')};
}

input[type="checkbox"] {
  color: ${applyVar('text-color')};
  cursor: pointer;
  height: 24px;
  line-height: initial;
  margin: 0;
  min-width: 24px;
  padding: 0;
  position: relative;
  transform: scale(1);
  transition: transform 150ms ease;
  vertical-align: middle;
  width: 24px;

  &:not(.disabled):active {
    transform: scale(0.9);
  }
  
  &:before {
    color: rgba(0, 0, 0, 0);
    content: 'X';
    font-size: 28px;
    left: 2.1px;
    position: absolute;
    top: -6.1px;
    transition: color 350ms ease;
  }

  &.checkmark:before {
    content: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none'%3E%3Cpath fill='currentColor' fill-rule='evenodd' d='M18 6h2v2h-2V6Zm-2 4V8h2v2h-2Zm-2 2v-2h2v2h-2Zm-2 2h2v-2h-2v2Zm-2 2h2v-2h-2v2Zm-2 0v2h2v-2H8Zm-2-2h2v2H6v-2Zm0 0H4v-2h2v2Z' clip-rule='evenodd'/%3E%3C/svg%3E");
    left: 0;
    top: -3px;
  }

  &:checked:before {
    color: ${applyVar('text-color')};
  }
}

@media (hover: hover) {
  input[type="checkbox"] {
    &:not(.disabled):hover {
      transform: scale(1.1);
    }

    &:not(.disabled):active {
      transform: scale(0.9);
    }

    &:hover:not(:checked):not(.disabled):before {
      color: ${applyVar('text-color-light')};
    }
  }
}

input::-webkit-input-placeholder {
  color: #a2a2a2;
}

input:focus, textarea:focus, button:focus, input.focus, textarea.focus, button.focus {
  ${pixelBorder(getColor('pink'), 2)}
}

label.focus {
  & input, & textarea, & button {
    ${pixelBorder(getColor('pink'), 2)}
  }
}

button {
  cursor: pointer;
  width: fit-content;
  
  &:hover, &:focus, &:active {
    color: ${getColor('pink')};
  }
  
  &:active {
    margin-top: 6px;
    margin-bottom: 2px;
  }
}

ul {
  font-size: 1em;
  line-height: 1.2em;
  margin: 0;
  padding: 0;
}

ul li {
  display: block;
  list-style-type: none;
  margin: 0;
}

h1, h2 {
  font-size: 1.2em;
  font-weight: normal;
  letter-spacing: 1px;
  line-height: 1.1em;
  margin: 0;
  text-transform: uppercase;

  ${Breakpoints.xs} {
    font-size: 1.5em;
    letter-spacing: 1.5px;
  }

  ${Breakpoints.sm} {
    font-size: 1.75em;
    letter-spacing: 1.8px;
  }
}

h2 {
  font-size: 1em;
  letter-spacing: 1px;

  ${Breakpoints.xs} {
    font-size: 1em;
    letter-spacing: 1px;
  }

  ${Breakpoints.sm} {
    font-size: 1em;
    letter-spacing: 1px;
  }
}

p, .paragraph {
  line-height: 1.4em;
  margin: 0;
  user-select: text;
}
`;

const global = `
* {
  box-sizing: border-box;
}

html.dark div.background {
  filter: invert(1);
}

html.dark input[type="checkbox"].checkmark:before {
  filter: invert(1);
}

html {
  -webkit-text-size-adjust: 100%;
  height: 100vh;
  height: -webkit-fill-available;
  height: fill-available;
}

body {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  background: ${applyVar('background-color')};
  color: ${applyVar('text-color')};
  font-family: Athena, ui-sans-serif, system-ui, sans-serif;
  font-size: 20px;
  font-weight: normal;
  line-height: 1em;
  margin: 0;
  overscroll-behavior: none;
  touch-action: pan-x pan-y;
  user-select: none;
}

::-webkit-scrollbar {
  display: none;
}

html[lang="ja_JP"] body, .locale-ja_JP {
  font-family: ${Fonts.ja_JP.join(', ')};

  & button,
  & input,
  & select,
  & textarea {
    font-family: ${Fonts.ja_JP.join(', ')};
  }
}

html[lang="uk_UA"] body, html[lang="ru_RU"] body, .locale-uk_UA, .locale-ru_RU {
  font-family: ${Fonts.ru_RU.join(', ')};

  & button,
  & input,
  & select,
  & textarea {
    font-family: ${Fonts.ru_RU.join(', ')};
  }
}

html[lang="ko_KR"] body, .locale-ko_KR, html[lang="zh_CN"] body, .locale-zh_CN {
  font-family: ${Fonts.ko_KR.join(', ')};

  & button,
  & input,
  & select,
  & textarea {
    font-family: ${Fonts.ko_KR.join(', ')};
  }
}

body .all-fonts {
  font-family: Athena, PressStart2P, MadouFutoMaru, ui-sans-serif, system-ui, sans-serif;
}

@media (orientation: portrait) {
  body {
    margin-top: env(safe-area-inset-top);
  }
}

div.background, div.background-absolute {
  background-image: url('${Background}');
  bottom: 0;
  image-rendering: pixelated;
  left: -144px;
  overflow: hidden;
  pointer-events: none;
  position: fixed;
  right: -144px;
  top: -144px;
  transform: ${applyVar('perspective-transform')};
  zoom: ${applyVar('scale')};
}

div.background-absolute {
  position: absolute;
}

@media (prefers-color-scheme: dark) {
  div.background {
    filter: invert(1);
  }

  input[type="checkbox"].checkmark:before {
    filter: invert(1);
  }
}

${scope}
`;

let initialized = false;
export default function initializeCSS() {
  if (initialized) {
    return;
  }

  initialized = true;
  initializeCSSVariables();
  injectGlobal(global);
}

export function getScopedCSSDefinitions() {
  return scope;
}
