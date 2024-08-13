import { useEffect, useState } from 'react';
import { UserInterface } from '../../interfaces/UserInterface';
import Api from '../../services/api';

type TableRowProps = {
  user: UserInterface;
  onRemoveUser: (idNumber: number) => void;
};

export const TableRow = ({ user, onRemoveUser }: TableRowProps) => {
  const { name, email, phone, idNumber, ip, city, country } = user;

  const handleRemoveUser = async () => {
    try {
      await Api.deleteUser({ id: idNumber });
      onRemoveUser(idNumber);
      alert('The user was successfully deleted');
    } catch (error: any) {
      if (error.response) {
        alert(error?.response?.data.error);
      }
    }
  };

  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{idNumber}</td>
      <td>{phone}</td>
      <td>{ip}</td>
      <td>{country}</td>
      <td>{city}</td>
      <td align='center' className='cursor-p' onClick={handleRemoveUser}>
        x
      </td>
    </tr>
  );
};
