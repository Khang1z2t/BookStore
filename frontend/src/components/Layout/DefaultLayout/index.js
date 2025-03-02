import Header from '~/components/Layout/components/Header';
import AppFooter from "~/components/Layout/components/Footer";


function DefaultLayout({children}) {
    return (
        <div className={"min-h-screen flex flex-col"}>
            <Header/>
            <main className={"flex-grow"}>{children}</main>
            <AppFooter/>
        </div>
    );
}

export default DefaultLayout;