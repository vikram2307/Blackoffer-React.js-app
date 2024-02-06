import logo from './logo.svg';
import './App.css';
import Sidebar from './Components/AppSidebar/Sidebar';
import Content from './Components/AppContent/Content';
import Header from './Components/AppHeader/Header';
import Footer from './Components/AppFooter/Footer';
import ChartComponent from './Components/AppContent/ChartComponent';

  function App() {
    return (
      <div className="App">
      <Header />
      <div className="ContentWrapper">
        <Sidebar />
        <Content />
      </div>
      <Footer />
    </div>
    );
  }

export default App;
