import React, { useState } from 'react';
import { IUser } from '../data/interfaces/user';

const { createContext, useContext } = React;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<IUser[]>([]);

}



