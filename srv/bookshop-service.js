import cds from '@sap/cds';

class BookshopService extends cds.ApplicationService {
    init() {
        const { Books, Authors } = this.entities;

        this.before('*', (req) => {
            console.log('Event:', req.event);
            console.log('Target:', req.target?.name);
            console.log('Data:', req.data);
            console.log('User:', req.user?.id);
            console.log('Query:', req.query);
        });

        this.before('CREATE', Books, async (req) => {
            const { title, author_ID } = req.data;
            if (!title) {
                req.error(400, "Title is required.", "title");
            }

            if (!author_ID) {
                req.error(400, "Author is required.", "author");
            }

            const existingBook = await cds.run(SELECT.one
                .from(Books)
                .where({
                    title,
                    author_ID
                }));

            if (existingBook) {
                req.reject(
                    409,
                    'This author already has a book with this title.'
                );
            }

            req.data.title = req.data.title.trim();
        })

        this.before('DELETE', Authors, async (req) => {
            const { ID } = req.data;
            // logic to check Books table for books written by the author being deleted
            const query = SELECT.one
                .from(Books)
                .where({
                    author_ID: ID
                });
            const existingBook = await cds.run(query);
            if (existingBook) {
                req.error(409, "Author cannot be deleted because of existing books");
            }
        })

        // this.before('READ', Books, (req) => {
        //     console.log('Books READ')
        // })

        return super.init()
    }
};

export default BookshopService;