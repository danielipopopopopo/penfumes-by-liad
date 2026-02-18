import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Shop from './components/Shop'
import About from './components/About'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import AuthModal from './components/AuthModal'
import DemoInitializer from './components/DemoInitializer'

export default function App() {
    return (
        <>
            <Navbar />
            <main>
                <Hero />
                <Shop />
                <About />
            </main>
            <Footer />
            <CartSidebar />
            <AuthModal />
            <DemoInitializer />
        </>
    )
}
