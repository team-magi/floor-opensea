import { Switch, Route } from 'react-router-dom'
import Home from './Home'
import Roster from './Roster'
import PageNotFound from '../components/PageNotFound'
import Floor from './Floor'

const Main = () => (
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/roster' component={Roster} />
        <Route path='/floor' component={Floor} />
        <Route path='*' component={PageNotFound} />
    </Switch>
)

export default Main
