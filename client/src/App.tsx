import { AddClientForm, Table } from './components';
import './App.css';
import { useCallback, useEffect, useState } from 'react';
import Api from './services/api';
import { UserInterface, UserResponse } from './interfaces/UserInterface';
import { useDebounce } from './hooks/useDebaunce';

const App = () => {
  const [filteredValue, setFilteredValue] = useState('');
  const debouncedFilteredValue = useDebounce(filteredValue, 500);
  const [isFormOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserResponse>({
    users: [],
    totalUsers: 0,
  });
  const [isLoading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await Api.getUsers({
      page,
      limit: 10,
      name: debouncedFilteredValue,
    });
    setLoading(false);
    if (!!data) {
      setUsers(data);
    }
  }, [debouncedFilteredValue, page]);

  useEffect(() => {
    fetchUsers();
  }, [debouncedFilteredValue, fetchUsers, page]);

  const handleRemoveUser = (idNumber: number) => {
    setUsers((prev) => ({
      ...prev,
      users: prev.users.filter((user) => user.idNumber !== idNumber) ?? [],
    }));
  };

  const handleAddUser = (user: UserInterface) => {
    setUsers((prev) => ({
      ...prev,
      users: [...prev.users, user],
    }));
  };

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  return (
    <div className='App'>
      <h1>Users</h1>
      <div onClick={() => setFormOpen(!isFormOpen)} className='cursor-p'>
        Add User {isFormOpen ? '↑' : '↓'}
      </div>
      {isFormOpen && (
        <AddClientForm
          handleAddUser={(user) => {
            handleAddUser(user);
            setFormOpen(false);
          }}
        />
      )}
      <div className='inputWrapper'>
        <input
          type='text'
          value={filteredValue}
          placeholder='Search'
          onChange={(e) => setFilteredValue(e.target.value)}
        />
      </div>
      {isLoading || !users ? (
        <div>Loading...</div>
      ) : (
        <Table
          userData={users}
          onRemoveUser={handleRemoveUser}
          handleChangePage={handleChangePage}
          page={page}
        />
      )}
    </div>
  );
};

export default App;
