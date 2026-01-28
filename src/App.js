import { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  /* ---------- LOCAL STORAGE ---------- */
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  /* ---------- ADD / UPDATE USER ---------- */
  const submitHandler = (e) => {
    e.preventDefault();

    if (!name || !age || !email) {
      setError('All fields are required');
      return;
    }

    if (+age <= 0) {
      setError('Age must be greater than 0');
      return;
    }

    if (!email.includes('@')) {
      setError('Enter a valid email');
      return;
    }

    if (isEditing) {
      setUsers((prev) =>
        prev.map((u) => (u.id === editUserId ? { ...u, name, age, email } : u)),
      );
      setIsEditing(false);
      setEditUserId(null);
    } else {
      setUsers((prev) => [
        ...prev,
        { id: crypto.randomUUID(), name, age, email },
      ]);
    }

    setName('');
    setAge('');
    setEmail('');
    setError('');
  };

  /* ---------- EDIT ---------- */
  const editUserHandler = (user) => {
    setName(user.name);
    setAge(user.age);
    setEmail(user.email);
    setIsEditing(true);
    setEditUserId(user.id);
  };

  /* ---------- DELETE ---------- */
  const openDeleteModal = (id) => {
    setSelectedUserId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setUsers((prev) => prev.filter((u) => u.id !== selectedUserId));
    setShowModal(false);
    setSelectedUserId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  /* ---------- SEARCH ---------- */
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm),
  );

  return (
    <div className="app">
      <h1>👤 User Management</h1>

      <form className="form" onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <button>{isEditing ? 'Update User' : 'Add User'}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />
      </div>

      <ul className="user-list">
        {filteredUsers.length === 0 && <p>No user found</p>}

        {filteredUsers.map((user) => (
          <li key={user.id}>
            <span>
              {user.name} ({user.age}) — {user.email}
            </span>

            <div className="actions">
              <button className="edit" onClick={() => editUserHandler(user)}>
                Edit
              </button>
              <button
                className="delete"
                onClick={() => openDeleteModal(user.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {/* DELETE MODAL */}
      {showModal && (
        <>
          <div className="backdrop" onClick={cancelDelete}></div>
          <div className="modal">
            <h2>Delete User</h2>
            <p>Are you sure?</p>

            <div className="modal-actions">
              <button className="cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
