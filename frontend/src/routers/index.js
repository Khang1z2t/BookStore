import Home from '~/pages/Home';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/login', component: SignIn},
    {path: '/register', component: SignUp},
]

const privateRoutes = []

export {publicRoutes, privateRoutes};