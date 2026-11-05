using { cuid, managed } from '@sap/cds/common';

namespace brownbag_db;

entity Books : cuid, managed {
    title       : String(32);
    description : String(100);
    author      : Association to Authors;
};

entity Authors : cuid, managed {
    firstName     : String(100);
    lastName      : String(100);
    books         : Association to many Books on books.author = $self;
};