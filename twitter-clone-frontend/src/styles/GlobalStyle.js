import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
    background-color: #071426;
    color: #e0e0e0;
  }
`;

export const theme = {
  colors: {
    primary: '#1e272e',
    secondary: '#2f3640',
    accent: '#8c7ae6',
    accentDark: '#7f6bca',
    text: '#f5f6fa',
    border: '#dcdde1',
  },
};