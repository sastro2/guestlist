import './App.css';
import PropTypes from 'prop-types';
import { useState } from 'react';

const defaultGuestlist = [
  {
    firstName: '1',
    lastName: '1',
  },

  {
    firstName: '2',
    lastName: '2',
  },

  {
    firstName: '3',
    lastName: '3',
  },

  {
    firstName: '4',
    lastName: '4',
  },
];

defaultGuestlist.PropTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

function NameInputComponent() {
  const [guestlist, setGuestlist] = useState(defaultGuestlist);

  let newFirstName = '';

  const handleFirstNameChange = (event) => {
    newFirstName = event.target.value;
  };

  const createGuest = (event) => {
    if (event.key === 'Enter') {
      console.log(newFirstName, event.target.value);
      const tempArray = guestlist.map((guest) => {
        return <li key={guest}>{guest}</li>;
      });
      tempArray.push({
        firstName: newFirstName,
        lastName: event.target.value,
      });
      console.log(guestlist);
      setGuestlist(tempArray);
      console.log(guestlist);
    }
    return;
  };

  return (
    <div>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        type="text"
        onChange={handleFirstNameChange}
      ></input>
      <label htmlFor="lastName">Last Name</label>
      <input id="lastName" type="text" onKeyDown={createGuest}></input>
      <ul>
        {guestlist.map((guest) => {
          return (
            <li key={guest}>
              {guest.firstName}-{guest.lastName}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function App() {
  return (
    <div>
      <NameInputComponent />
    </div>
  );
}

export default App;
