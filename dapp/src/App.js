import React from 'react'
import { Container } from 'react-bootstrap';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Footer';
import Header from './components/Header';
import AboutScreen from './screens/AboutScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import TokenDetailScreen from './screens/TokenDetail';
import TokenMintScreen from './screens/mint/TokenMintScreen';
import MyTokenScreen from './screens/MyTokenScreen';
import HistoryScreen from './screens/HistoryScreen';
import SaleTokenScreen from './screens/SaleTokenScreen';

const App = () => {
  return (
    <Router>
      <Header/>
        <main className="py-3">
          <Container>
            <Route path='/' component={HomeScreen} exact/>
            <Route path='/about' component={AboutScreen} exact/>
            <Route path='/me' component={ProfileScreen}/>
            <Route path='/mint' component={TokenMintScreen}/>
            <Route path='/token/:id' component={TokenDetailScreen}/>
            <Route path='/myToken' component={MyTokenScreen}/>
            <Route path='/history' component={HistoryScreen}/>
            <Route path='/saleToken/:id' component={SaleTokenScreen}/>
          </Container>
        </main>
      <Footer/>
    </Router>
  );
}

export default App;
