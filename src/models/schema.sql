--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT
                     UNIQUE
                     NOT NULL,
    name     TEXT    UNIQUE
                     NOT NULL,
    password TEXT    NOT NULL
);
-- Index: INDEX_USERS_NAME
CREATE UNIQUE INDEX IF NOT EXISTS INDEX_USERS_NAME ON users (
    name
);


-- Table: bookinfos
CREATE TABLE IF NOT EXISTS bookinfos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT
                        UNIQUE
                        NOT NULL,
    isbn        INTEGER UNIQUE
                        NOT NULL,
    title       TEXT    NOT NULL,
    author      TEXT    NOT NULL,
    description TEXT,
    price       REAL    NOT NULL
);
-- Index: INDEX_BOOKINFOS_ISBN
CREATE UNIQUE INDEX IF NOT EXISTS INDEX_BOOKINFOS_ISBN ON bookinfos (
    isbn
);
-- Index: INDEX_BOOKINFOS_TITLE
CREATE INDEX IF NOT EXISTS INDEX_BOOKINFOS_TITLE ON bookinfos (
    title
);
-- Index: INDEX_BOOKINFOS_AUTHOR
CREATE INDEX IF NOT EXISTS INDEX_BOOKINFOS_AUTHOR ON bookinfos (
    author
);


-- Table: tickets
CREATE TABLE IF NOT EXISTS tickets (
    id          INTEGER  PRIMARY KEY AUTOINCREMENT
                         NOT NULL
                         UNIQUE,
    userid      INTEGER  NOT NULL
                         REFERENCES users (id),
    datetime    DATETIME DEFAULT (datetime('now') ) 
                         NOT NULL,
    usermessage TEXT,
    creditcard  TEXT,
    address     TEXT,
    totalprice  REAL     NOT NULL,
    status      INTEGER  NOT NULL
                         DEFAULT (0) 
);
-- Index: INDEX_TICKETS_USERID
CREATE INDEX IF NOT EXISTS INDEX_TICKETS_USERID ON tickets (
    userid
);


-- Table: ticketitems
CREATE TABLE IF NOT EXISTS ticketitems (
    id         INTEGER PRIMARY KEY AUTOINCREMENT
                       UNIQUE
                       NOT NULL,
    ticketid   INTEGER REFERENCES tickets (id) ON DELETE CASCADE
                                               ON UPDATE CASCADE,
    bookinfoid INTEGER NOT NULL
                       REFERENCES bookinfos (id) ON DELETE CASCADE
                                                 ON UPDATE CASCADE,
    count      INTEGER NOT NULL
);
-- Index: INDEX_TICKETITEMS_TICKETID
CREATE INDEX IF NOT EXISTS INDEX_TICKETITEMS_TICKETID ON ticketitems (
    ticketid
);
-- Index: INDEX_TICKETITEMS_BOOKINFOIDID
CREATE INDEX IF NOT EXISTS INDEX_TICKETITEMS_BOOKINFOIDID ON ticketitems (
    bookinfoid
);

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
