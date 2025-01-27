import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import React from 'react'
import App from './main'

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#19996f',
    accent: '',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}