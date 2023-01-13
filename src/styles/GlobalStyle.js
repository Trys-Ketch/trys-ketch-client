import reset from 'styled-reset';
import { createGlobalStyle } from 'styled-components';
import Pretendard from '../assets/fonts/PretendardVariable.woff2';
import TTTogether from '../assets/fonts/TTTogether.otf';

const Globalstyle = createGlobalStyle`
${reset}

@font-face {
  font-family: 'Pretendard';
  src: url(${Pretendard});
}

@font-face {
  font-family: 'TTTogether';
  src: url(${TTTogether});
}

* {
    box-sizing: border-box;
    font-family: 'Pretendard', sans-serif;
}

ol, ul {
    list-style: none;
}

a {
    color: inherit;
    text-decoration: inherit;
}

img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
    user-drag: none;
}

button {
    margin: 0;
    padding: 0;
    border: 0;
    background: none;
}
`;

export default Globalstyle;
