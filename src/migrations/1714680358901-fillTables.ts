import { MigrationInterface, QueryRunner } from 'typeorm';

export class FillTables1714680358901 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const usersData = Array.from({ length: 50 }, (_, i) => ({
            firstName: `User${i + 1}`,
            lastName: `Last${i + 1}`,
            email: `user${i + 1}@example.com`,
            password: `password${i + 1}`,
            birthdate: new Date(1990, i % 12, i + 1),
            avatar: `https://example.com/avatar${i + 1}.jpg`,
            role: 'USER',
        }));

        for (const user of usersData) {
            await queryRunner.query(
                `INSERT INTO "users" ("firstName", "lastName", "email", "password", "birthdate", "avatar", "role") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                Object.values(user)
            );
        }

        const vinylsData = Array.from({ length: 50 }, (_, i) => ({
            name: `Vinyl${i + 1}`,
            description: `Description for Vinyl${i + 1}`,
            authorName: `Author${i + 1}`,
            price: 1000 + i * 20,
            image: `https://example.com/vinyl${i + 1}.jpg`,
        }));

        for (const vinyl of vinylsData) {
            await queryRunner.query(
                `INSERT INTO "vinyls" ("name", "description", "authorName", "price", "image") VALUES ($1, $2, $3, $4, $5)`,
                Object.values(vinyl)
            );
        }

        const purchasesData = Array.from({ length: 50 }, (_, i) => ({
            userId: (i % 50) + 1,
            vinylId: (i % 50) + 1,
            creationDate: new Date(),
            paymentId: `PAY${i + 1}`,
            totalPrice: 1000 + i * 20,
            paymentDate: new Date(),
            status: 'CREATED',
        }));

        for (const purchase of purchasesData) {
            await queryRunner.query(
                `INSERT INTO "purchases" ("userId", "vinylId", "creationDate", "paymentId", "totalPrice", "paymentDate", "status") VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                Object.values(purchase)
            );
        }

        const reviewsData = Array.from({ length: 50 }, (_, i) => ({
            comment: `Review for Vinyl${i + 1}`,
            score: Math.floor(Math.random() * 5) + 1,
            authorId: (i % 50) + 1,
            vinylId: (i % 50) + 1,
            creationDate: new Date(),
        }));

        for (const review of reviewsData) {
            await queryRunner.query(
                `INSERT INTO "reviews" ("comment", "score", "authorId", "vinylId", "creationDate") VALUES ($1, $2, $3, $4, $5)`,
                Object.values(review)
            );
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "purchases"`);
        await queryRunner.query(`DELETE FROM "vinyls"`);
        await queryRunner.query(`DELETE FROM "reviews"`);
        await queryRunner.query(`DELETE FROM "users"`);
    }
}
