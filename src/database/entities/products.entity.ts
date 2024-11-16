import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
  } from "typeorm";
  import { Users } from "./users.entity"; // Importa a entidade Users
  
  @Entity('products') // Nome da tabela
  export class Products {
    @PrimaryGeneratedColumn('uuid') // Define como chave primária com UUID
    uniqueId: string;
  
    @Column({ type: 'varchar', length: 64 }) // Nome do produto
    name: string;
  
    @Column({ type: 'float' }) // Preço do produto
    price: number;
  
    @Column({ type: 'enum', enum: ['electronics', 'clothing', 'perishable'] }) // Categoria do produto
    category: string;
  
    @Column({ type: 'boolean', default: true }) // Disponibilidade
    available: boolean;
  
    @ManyToMany(() => Users, (user) => user.products) // Relacionamento bidirecional com Users
    users: Users[];
  
    @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de criação
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de atualização
    updatedAt: Date;
  }
  