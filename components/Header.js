// components/Header.js
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
    const { setUserState } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(clearUser());
        setUserState(null);
        router.push('/login');
    };

    return (
        <header>
            <Navbar handleLogout={handleLogout} />
        </header>
    );
};

export default Header;
