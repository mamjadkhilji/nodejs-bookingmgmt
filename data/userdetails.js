db.users.insertMany([
    {
        "userid": "admin",
        "username": "Administrator",
        "passkey": "123",
        "email": "booking@admin.com",
        "usertype": "admin",
        "active": true
    },
    {
        "userid": "jane",
        "username": "Jane Doe",
        "passkey": "123",
        "email": "jane@user.com",
        "usertype": "user",
        "active": true
    },
    {
        "userid": "bob",
        "username": "Bob Johnson",
        "passkey": "123",
        "email": "bob@user.com",
        "usertype": "user",
        "active": false
    },
    {
        "userid": "alice",
        "username": "Alice Brown",
        "passkey": "123",
        "email": "alice@user.com",
        "usertype": "user",
        "active": true
    },
    {
        "userid": "charlie",
        "username": "Charlie Davis",
        "passkey": "123",
        "email": "charlie@user.com",
        "usertype": "user",
        "active": true
    }
])