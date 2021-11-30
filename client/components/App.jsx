import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import Search from './Search';
import Header from './Header';
import Footer from './Footer';
import '../css/style.css';

const theme = extendTheme({});

const App = () => (
  <div>
  <Header />
  <ChakraProvider theme={theme}>
    <Router>
      <Switch>
        <Route path="/">
          <Search />
        </Route>
      </Switch>
    </Router>
  </ChakraProvider>
  <Footer />
  </div>
);

export default App;
