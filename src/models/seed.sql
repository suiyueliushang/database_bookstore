---
--- Seed Data
---
BEGIN TRANSACTION;

INSERT INTO users(id, name, password)
VALUES (1, 'admin', 'admin234');

INSERT INTO BOOKINFOS(id, isbn, title, author, description, price) VALUES
(1, 9780321776402, "C++ Primer Plus (Developer's Library)", "Stephen Prata", "C++ Primer Plus is a carefully crafted, complete tutorial on one of the most significant and widely used programming languages today. An accessible and easy-to-use self-study guide, this book is appropriate for both serious students of programming as well as developers already proficient in other languages.", 62.69),
(2, 9780131872486, "Thinking in Java", "Bruce Eckel", " Thinking in Java has earned raves from programmers worldwide for its extraordinary clarity, careful organization, and small, direct programming examples. From the fundamentals of Java syntax to its most advanced features, Thinking in Java is designed to teach, one simple step at a time.", 84.14),
(3, 9781491905012, "Modern PHP: New Features and Good Practices", "Josh Lockhart", "PHP is experiencing a renaissance, though it may be difficult to tell with all of the outdated PHP tutorials online. With this practical guide, you’ll learn how PHP has become a full-featured, mature language with object-orientation, namespaces, and a growing collection of reusable component libraries.", 26.59),
(4, 9781491946008, "Fluent Python: Clear, Concise, and Effective Programming", "Luciano Ramalho", "Python’s simplicity lets you become productive quickly, but this often means you aren’t using everything it has to offer. With this hands-on guide, you’ll learn how to write effective, idiomatic Python code by leveraging its best—and possibly most neglected—features. Author Luciano Ramalho takes you through Python’s core language features and libraries, and shows you how to make your code shorter, faster, and more readable at the same time.", 49.69),
(5, 9781449327682, "Maintainable JavaScript: Writing Readable Code", "Nicholas C. Zakas", "You may have definite ideas about writing code when working alone, but team development requires that everyone use the same approach. With the JavaScript practices in this book—including code style, programming tips, and automation—you will learn how to write maintainable code that other team members can easily understand, adapt, and extend.", 37.84),
(6, 9781728836638, "C#: 2 Books In 1; Beginners And Intermediate Guide In C# Programming", "Zach Webber", "There are a lot of different types of programming languages out there that you can use. But one of the best options for you to try, whether you want to create applications for a smartphone or your own website, is C#. This is one of the oldest coding languages ever made but it’s still useful even today, and once you learn some of the basics, you can use these to help you to do better with some other languages down the line.", 37.04),
(7, 9780135182796, "SQL in 10 Minutes a Day, Sams Teach Yourself (5th Edition)", "Ben Forta", " Sams Teach Yourself SQL in 10 Minutes offers straightforward, practical answers when you need fast results. By working through the book’s 22 lessons of 10 minutes or less, you’ll learn what you need to know to take advantage of the SQL language. Lessons cover IBM DB2, Microsoft SQL Server and SQL Server Express, MariaDB, MySQL, Oracle and Oracle express, PostgreSQL, and SQLite.", 28.49),
(8, 9780262035613, "Deep Learning (Adaptive Computation and Machine Learning series)", "Ian Goodfellow", "An introduction to a broad range of topics in deep learning, covering mathematical and conceptual background, deep learning techniques used in industry, and research perspectives.", 95.55),
(9, 9781118093757, "Operating System Concepts", "Abraham Silberschatz", "The ninth edition of Operating System Concepts continues to evolve to provide a solid theoretical foundation for understanding operating systems. This edition has been updated with more extensive coverage of the most current topics and applications, improved conceptual coverage and additional content to bridge the gap between concepts and actual implementations. A new design allows for easier navigation and enhances reader motivation. Additional end-of-chapter, exercises, review questions, and programming exercises help to further reinforce important concepts. WileyPLUS, including a test bank, self-check exercises, and a student solutions manual, is also part of the comprehensive support package.", 161.18);

INSERT INTO tickets(id, userid, usermessage, totalprice)
VALUES (1, 1, "Init book store", 0);

INSERT INTO ticketitems(id, ticketid, bookinfoid, count) VALUES
(1, 1, 1, 2),
(2, 1, 2, 9),
(3, 1, 3, 0),
(4, 1, 4, 34),
(5, 1, 5, 2),
(6, 1, 6, 20),
(7, 1, 7, 28),
(8, 1, 8, 3),
(9, 1, 9, 1);

COMMIT TRANSACTION;