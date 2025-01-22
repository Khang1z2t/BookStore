import Home from '~/pages/Home';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import Profile from "~/pages/Profile";
import EditProfile from "~/pages/EditProfile";

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/login', component: SignIn},
    {path: '/register', component: SignUp},
    {path: '/profile', component: Profile},
    {path: '/edit-profile', component: EditProfile},
]

const privateRoutes = []

export {publicRoutes, privateRoutes};