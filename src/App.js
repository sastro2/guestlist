import './App.css';
import { element } from 'prop-types';
import { useEffect, useRef, useState } from 'react';

//defaultGuestlists will later be filled with guests recieved from the API

const baseURL = `http://localhost:4000/guests`;

function NameInputComponent() {
  const [guestlist, setGuestlist] = useState([]);
  const [changeState, setChangeState] = useState(true);
  const [loading, setLoading] = useState(true);
  const [attendingCheckboxChecked, setAttendingCheckboxChecked] =
    useState(true);
  const [nonAttendingCheckboxChecked, setNonAttendingCheckboxChecked] =
    useState(true);

  const firstNameInput = useRef();
  const lastNameInput = useRef();
  const handleFilters = useRef([]);

  useEffect(() => {
    async function getAllGuests() {
      const response = await fetch(baseURL);
      const allGuests = await response.json();
      setGuestlist(allGuests);
      setLoading(false);
      console.log(allGuests);
    }
    getAllGuests().catch(() => {
      console.log('fetch fails');
    });
  }, [changeState]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const removeGuestOnClick = async (guest) => {
    console.log(guest);
    const guestID = guest.id;
    const response = await fetch(`${baseURL}/${guestID}`, { method: 'DELETE' });
    await response.json();
    setChangeState(!changeState);
  };

  const removeAllAttendingGuests = async () => {
    const attendingGuests = guestlist.filter((x) => x.attending === true);
    for (let i = 0; i < attendingGuests.length; i++) {
      const response = await fetch(`${baseURL}/${attendingGuests[i].id}`, {
        method: 'DELETE',
      });
      await response.json();
    }
    setChangeState(!changeState);
  };

  const changeIsAttendingStatus = async (guest) => {
    const guestID = guest.id;
    const response = await fetch(`${baseURL}/${guestID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: !guest.attending }),
    });
    await response.json();
    setChangeState(!changeState);
  };

  const handleAttendingCheckbox = () => {
    setAttendingCheckboxChecked(!attendingCheckboxChecked);
  };

  const handleNonAttendingCheckbox = () => {
    setNonAttendingCheckboxChecked(!nonAttendingCheckboxChecked);
  };

  const resetAllFilters = () => {
    setAttendingCheckboxChecked(true);
    setNonAttendingCheckboxChecked(true);
    if (!handleFilters.current[0].checked) {
      handleFilters.current[0].checked = true;
    }
    if (!handleFilters.current[1].checked) {
      handleFilters.current[1].checked = true;
    }
  };

  //Create a new guest
  const createGuest = async (event) => {
    //check if the enter key is pressed
    if (event.key === 'Enter') {
      if (
        firstNameInput.current.value === '' &&
        lastNameInput.current.value === ''
      ) {
        console.log('Please enter a name');
        return;
      } else if (firstNameInput.current.value === '') {
        console.log('First name field can not be empty');
        return;
      } else if (lastNameInput.current.value === '') {
        console.log('Last name field can not be empty');
        return;
      } else {
        const response = await fetch(baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName: firstNameInput.current.value,
            lastName: lastNameInput.current.value,
          }),
        });
        await response.json();
        firstNameInput.current.value = '';
        lastNameInput.current.value = '';
        setChangeState(!changeState);
      }
    }
  };

  if (!loading) {
    return (
      <div>
        <label htmlFor="firstName">First Name</label>
        <input id="firstName" type="text" ref={firstNameInput}></input>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          onKeyDown={createGuest}
          ref={lastNameInput}
        ></input>
        <ul>
          {guestlist.map((guest) => {
            console.log(
              attendingCheckboxChecked,
              nonAttendingCheckboxChecked,
              guest.attending,
            );
            if (
              (attendingCheckboxChecked && guest.attending) ||
              (nonAttendingCheckboxChecked && !guest.attending)
            ) {
              return (
                <div key={guest.id} data-test-id="guest">
                  {guest.firstName}-{guest.lastName}-{guest.id}
                  <button onClick={() => removeGuestOnClick(guest)}>
                    Delete guest
                  </button>
                  <input
                    type="checkbox"
                    onChange={() => changeIsAttendingStatus(guest)}
                    defaultChecked={guest.attending}
                  ></input>
                </div>
              );
            } else {
              return null;
            }
          })}
        </ul>
        {guestlist.some((g) => g.attending) ? (
          <div>
            <button onClick={removeAllAttendingGuests}>
              Remove all attending guests
            </button>
          </div>
        ) : (
          <div>
            <button disabled>Remove all attending guests</button>
          </div>
        )}
        <div>
          <label htmlFor="checkbox_1">show attending guests</label>
          <input
            id="checkbox_1"
            type="checkbox"
            defaultChecked={true}
            onChange={handleAttendingCheckbox}
            ref={(element) => {
              handleFilters.current[0] = element;
            }}
          ></input>
          <label htmlFor="checkbox_2">show non-attending guests</label>
          <input
            id="checkbox_2"
            type="checkbox"
            defaultChecked={true}
            onChange={handleNonAttendingCheckbox}
            ref={(element) => {
              handleFilters.current[1] = element;
            }}
          ></input>
          {!attendingCheckboxChecked || !nonAttendingCheckboxChecked ? (
            <button onClick={resetAllFilters}>Reset filters</button>
          ) : (
            <button disabled>Reset filters</button>
          )}
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div>
      <NameInputComponent />
    </div>
  );
}

export default App;
