import Home from '~/pages/Home';
import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import Profile from "~/pages/Profile";
import EditProfile from "~/pages/EditProfile";
import AdminPage from "~/pages/AdminPage";
import NoLayout from "~/components/Layout/NoLayout";
import CartPage from "~/pages/CartPage";
import NotFoundPage from "~/pages/NotFoundPage";

const publicRoutes = [
    {path: '/', component: Home},
    {path: '/login', component: SignIn},
    {path: '/register', component: SignUp},
    {path: '/profile', component: Profile},
    {path: '/edit-profile', component: EditProfile},
    {path: '/cart', component: CartPage},
    {path: '/not-found', component: NotFoundPage}
]

const privateRoutes = [
    {path: '/admin', component: AdminPage, layout: NoLayout},
]

export {publicRoutes, privateRoutes};