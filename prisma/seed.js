import 'dotenv/config';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando seed...');

    await prisma.food.createMany({
        data: [
            {
                name: 'Bruschetta',
                description: 'Pão italiano com tomate, manjericão e azeite',
                price: 18.9,
                category: 'entrada',
                available: true,
            },
            {
                name: 'Picanha Grelhada',
                description: 'Picanha ao ponto com arroz, feijão e batata frita',
                price: 65.0,
                category: 'prato principal',
                available: true,
            },
            {
                name: 'Tiramisu',
                description: 'Sobremesa italiana com café e mascarpone',
                price: 22.5,
                category: 'sobremesa',
                available: true,
            },
            {
                name: 'Suco de Laranja',
                description: 'Suco natural de laranja 500ml',
                price: 12.0,
                category: 'bebida',
                available: true,
            },
            {
                name: 'Risoto de Camarão',
                description: 'Risoto cremoso com camarões frescos',
                price: 58.0,
                category: 'prato principal',
                available: false,
            },
        ],
    });

    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
