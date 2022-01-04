import React from 'react';
import {firebaseApp} from './app/utils/firebase';
import Navigation from './app/navigations/Navigation';
import { YellowBox } from 'react-native-web';

YellowBox.ignoreWarnings(['Setting a timer']);

export default function App() {
  return (
    <Navigation />
  );
}
