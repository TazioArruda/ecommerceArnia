import { 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn, 
    Column, 
    CreateDateColumn 
} from "typeorm";
import { Users } from "./users.entity"; // Importa a entidade Users
import { Products } from "./products.entity"; // Importa a entidade Products

@Entity('user_products') // Nome da tabela intermediária
export class UserProducts {
    @PrimaryGeneratedColumn('uuid') // Chave primária UUID
    uniqueId: string;

    @ManyToOne(() => Users, (user) => user.products, { onDelete: 'CASCADE' }) // Relacionamento Many-to-One com Users
    @JoinColumn({ name: 'user_id' }) // Define o nome da coluna de referência para Users
    user: Users;

    @ManyToOne(() => Products, (product) => product.users, { onDelete: 'CASCADE' }) // Relacionamento Many-to-One com Products
    @JoinColumn({ name: 'product_id' }) // Define o nome da coluna de referência para Products
    product: Products;

    @Column({ type: 'int' }) // Quantidade comprada do produto
    quantity: number;

    @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de compra
    purchaseDate: Date;
}
