

export interface UserRow {
  id?: number;
  username: string;
  password_hash: string;
  role?: 'organizer' | 'attendee' | 'admin';
  created_at?: string;
}

const users: any[] = [];
let nextId = 1;

export interface UserRow {
  id?: number;
  username: string;
  password_hash: string;
  role?: 'organizer' | 'attendee' | 'admin';
  created_at?: string;
}

export const createUser = async (username: string, password_hash: string, role: 'organizer' | 'attendee' | 'admin' = 'attendee') => {
  const newUser = {
    id: nextId++,
    username,
    password_hash,
    role,
    created_at: new Date().toISOString()
  };
  users.push(newUser);
  return newUser;
};

export const getUserById = async (id: number) => {
  return users.find(u => u.id === id);
};

export const findUserByUsername = async (username: string) => {
  return users.find(u => u.username === username);
};
