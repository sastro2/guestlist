/** @jsxImportSource @emotion/react */
import './App.css';
import { css } from '@emotion/react';
import { useEffect, useRef, useState } from 'react';

const baseURL = `http://guestlist-server.herokuapp.com`;

const baseStyle = css`
  display: flex;
  flex-direction: column;
  margin-top: 5%;
  margin-bottom: 5%;
  margin-left: 20%;
  margin-right: 20%;
  border: 2px solid black;
  border-radius: 25px;
  box-shadow: 3px 2px 2px 1px rgba(0, 0, 0, 0.2);
  padding-right: 50px;
`;

const topSectionStyle = css`
  display: flex;
  margin-right: -50px;
  margin-bottom: 2%;
  p {
    display: flex;
    align-items: center;
    margin-top: 6%;
    font-size: 60px;
    margin-left: 10%;
    margin-right: 10%;
  }
`;

const inputFieldStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5%;
  margin-bottom: 3%;
`;

const guestlistStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
  height: 47vh;
  overflow: hidden;
  overflow-y: scroll;
`;

const guestlistItemsStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 2%;
  border-bottom: 1px solid gray;
`;

const guestlistNamesStyle = css`
  display: flex;
  font-size: 20px;
  justify-content: flex-end;
  height: 100%;
`;

const guestlistOptionsStyle = css`
  display: flex;
  justify-content: space-between;
  width: 28%;
`;

const guestlistDeleteButtonStyle = css`
  margin-left: 12%;
`;

const removeAllAttendingGuestsStyle = css`
  display: flex;
  width: 100%;
  height: 100%;
  margin-left: 4.6%;
  width: 95.5%;
  border-top: 1.5px solid gray;
  button {
    margin-top: 2%;
    margin-left: 75%;
  }
`;

const removeAllAttendingGuestsDisabledStyle = css`
  display: flex;
  width: 100%;
  height: 100%;
  margin-left: 4.6%;
  width: 95.5%;
  border-top: 1.5px solid gray;
  button {
    margin-top: 2%;
    margin-left: 75%;
  }
`;

const filtersStyle = css`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 40%;
  margin-left: 5%;
  margin-top: -2%;
  margin-bottom: 1%;
`;

const filterCheckboxesStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5%;
`;

const showAttendingGuestsBoxStyle = css`
  margin-bottom: 1%;
  margin-left: 15.5%;
`;

const showNonAttendingGuestsBoxStyle = css``;

const resetAllFiltersStyle = css`
  margin-bottom: 5%;
`;

const resetAllFiltersDisabledStyle = css`
  margin-bottom: 5%;
`;

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

  const createGuest = async (event) => {
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
      <div css={baseStyle}>
        <section css={topSectionStyle}>
          <p>GUESTS</p>
          <div css={inputFieldStyle}>
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" type="text" ref={firstNameInput}></input>
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              onKeyDown={createGuest}
              ref={lastNameInput}
            ></input>
          </div>
        </section>
        <ul css={guestlistStyles}>
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
                <div
                  key={guest.id}
                  data-test-id="guest"
                  css={guestlistItemsStyle}
                >
                  <div css={guestlistNamesStyle}>
                    {guest.firstName}-{guest.lastName}
                  </div>
                  <div css={guestlistOptionsStyle}>
                    <label htmlFor="attendingBox">Attending</label>
                    <input
                      id="attendingBox"
                      type="checkbox"
                      onChange={() => changeIsAttendingStatus(guest)}
                      defaultChecked={guest.attending}
                    ></input>
                    <button
                      onClick={() => removeGuestOnClick(guest)}
                      css={guestlistDeleteButtonStyle}
                    >
                      Delete guest
                    </button>
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
        </ul>
        {guestlist.some((g) => g.attending) ? (
          <div css={removeAllAttendingGuestsStyle}>
            <button onClick={removeAllAttendingGuests}>
              Remove all attending guests
            </button>
          </div>
        ) : (
          <div css={removeAllAttendingGuestsDisabledStyle}>
            <button disabled>Remove all attending guests</button>
          </div>
        )}
        <section css={filtersStyle}>
          <div css={filterCheckboxesStyle}>
            <div css={showAttendingGuestsBoxStyle}>
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
            </div>
            <div css={showNonAttendingGuestsBoxStyle}>
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
            </div>
          </div>
          {!attendingCheckboxChecked || !nonAttendingCheckboxChecked ? (
            <button onClick={resetAllFilters} css={resetAllFiltersStyle}>
              Reset filters
            </button>
          ) : (
            <button disabled css={resetAllFiltersDisabledStyle}>
              Reset filters
            </button>
          )}
        </section>
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
