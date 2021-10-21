// import Header from '../components/Header'
import Main from './Main'

import { AppBar } from '../components/AppBar';
import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const App = () => (
  <>
    <Layout>
      <Header className="App-Bar">
        <AppBar />
      </Header>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
        }}
      >
        <Main></Main>
      </Content>
    </Layout>
  </>
)

export default App;
