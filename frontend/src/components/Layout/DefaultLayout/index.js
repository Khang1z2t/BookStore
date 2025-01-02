import Header from '~/components/Layout/components/Header';


function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <main className={"mainContent"}>{children}</main>
            {/* <Footer /> */}
        </div>
    );
}

export default DefaultLayout;