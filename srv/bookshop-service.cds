using brownbag_db as db from '../db/schema';

service BookshopService {
    entity Books as projection on db.Books;
    entity Authors as projection on db.Authors;
}